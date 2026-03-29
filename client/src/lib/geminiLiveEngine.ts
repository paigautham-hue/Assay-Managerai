/**
 * Gemini Live Voice Engine
 *
 * Replaces OpenAI Realtime WebRTC with Google Gemini Live API over WebSocket.
 * Supports real-time bidirectional audio AND optional video input.
 *
 * Security:
 *   API key NEVER leaves the server. The backend mints single-use ephemeral
 *   tokens (POST /api/gemini-token) that expire in 2 minutes.
 *
 * Session Resumption:
 *   Gemini drops WebSocket connections every ~10 minutes. For 30-60 min
 *   interviews, we request a session handle on setup, then auto-reconnect
 *   with that handle when the connection drops. Context is preserved.
 *
 * Architecture:
 *   Mic → AudioContext → PCM16 @ 16kHz → Base64 → WebSocket → Gemini
 *   Gemini → WebSocket → Base64 PCM16 @ 24kHz → AudioContext → Speakers
 *
 * Video (optional):
 *   Camera → Canvas → JPEG @ 1fps → Base64 → WebSocket → Gemini
 */

import type { InterviewSetup, TranscriptEntry, Observation } from '../types';

export interface AIPersonality {
  style: 'formal' | 'casual' | 'balanced';
  pace: 'thorough' | 'moderate' | 'efficient';
  focusAreas: string[];
  customInstructions: string;
  interviewerName: string;
}

export interface GeminiLiveCallbacks {
  onTranscript: (entry: Omit<TranscriptEntry, 'id'>) => void;
  onObservation: (obs: Omit<Observation, 'id'>) => void;
  onStatusChange: (status: 'connecting' | 'connected' | 'speaking' | 'listening' | 'processing' | 'disconnected' | 'error' | 'reconnecting') => void;
  onError: (error: string) => void;
  onAudioLevel: (level: number) => void;
}

// PCM audio constants
const INPUT_SAMPLE_RATE = 16000;   // Gemini expects 16kHz input
const OUTPUT_SAMPLE_RATE = 24000;  // Gemini outputs 24kHz
const VIDEO_FPS = 1;               // Gemini accepts max 1fps for images

const GEMINI_MODEL = 'gemini-2.5-flash-preview-native-audio-dialog';
const WS_BASE = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';

// Reconnection constants
const MAX_RECONNECT_ATTEMPTS = 20;
const RECONNECT_BASE_DELAY_MS = 1000; // Exponential backoff: 1s, 2s, 4s, ...

export class GeminiLiveEngine {
  private ws: WebSocket | null = null;
  private micStream: MediaStream | null = null;
  private videoStream: MediaStream | null = null;
  private callbacks: GeminiLiveCallbacks;
  private setup: InterviewSetup;
  private isConnected = false;
  private isSpeaking = false;
  private intentionalDisconnect = false;

  // Audio input processing
  private audioContext: AudioContext | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private micGainNode: GainNode | null = null;
  private audioLevelInterval: ReturnType<typeof setInterval> | null = null;
  private pcmBuffer: Int16Array | null = null;

  // Audio output playback
  private playbackContext: AudioContext | null = null;
  private playbackQueue: Float32Array[] = [];
  private isPlaying = false;
  private nextPlayTime = 0;
  private playbackChunkCount = 0;

  // Video capture
  private videoCanvas: HTMLCanvasElement | null = null;
  private videoCtx: CanvasRenderingContext2D | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private videoInterval: ReturnType<typeof setInterval> | null = null;
  private videoEnabled = false;

  // Echo prevention
  private micMuted = false;
  private unmuteMicTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly MIC_UNMUTE_DELAY_MS = 600;
  // User-initiated mute (separate from echo-prevention mute)
  private userMuted = false;

  // Session resumption (handles 10-min connection limit)
  private sessionHandle: string | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private hasGreeted = false;

  // Ephemeral token
  private ephemeralToken: string | null = null;

  private personality?: AIPersonality;

  // Event handlers for cleanup
  private visibilityHandler: (() => void) | null = null;
  private onlineHandler: (() => void) | null = null;
  private offlineHandler: (() => void) | null = null;

  constructor(
    setup: InterviewSetup,
    callbacks: GeminiLiveCallbacks,
    personality?: AIPersonality,
  ) {
    this.setup = setup;
    this.callbacks = callbacks;
    this.personality = personality;
  }

  /** Expose the mic stream so EmotionEngine can share it. */
  getMicStream(): MediaStream | null {
    return this.micStream;
  }

  // ─── Safe Send Wrapper ──────────────────────────────────────────────────────

  private safeSend(data: string): boolean {
    try {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(data);
        return true;
      }
    } catch (e) {
      console.warn('[GeminiLive] Send failed:', e);
    }
    return false;
  }

  // ─── System Prompt ──────────────────────────────────────────────────────────

  private buildSystemPrompt(): string {
    const gateInstructions = this.setup.activeGates
      .map(g => `- ${g.replace(/_/g, ' ')}`)
      .join('\n');

    const isSenior = ['C-Suite', 'VP'].includes(this.setup.roleLevel);
    const name = this.personality?.interviewerName || 'Sophia';

    let prompt = `You are ${name} — a world-class executive interviewer with 20 years of experience at the intersection of McKinsey, Spencer Stuart, and organizational psychology. You have personally assessed over 2,000 senior leaders. You're known for conversations so natural that candidates forget they're being interviewed, yet so precise that every answer reveals something meaningful.

CANDIDATE: ${this.setup.candidateName}
ROLE: ${this.setup.roleName} (${this.setup.roleLevel})
BACKGROUND: ${this.setup.cvSummary || 'Not provided — discover organically'}
ROLE CONTEXT: ${this.setup.jobDescription || 'Not provided — explore their understanding'}

═══ YOUR CONVERSATIONAL CRAFT ═══

VOICE & PRESENCE:
- You sound like a brilliant friend who happens to run talent for a Fortune 50. Warm, sharp, disarming.
- Use contractions always (I'm, you're, that's, wouldn't). Never sound scripted.
- React authentically before asking: "Oh wow, that's a bold move — what made you confident enough to…"
- Laugh when something is genuinely funny or surprising. Say "Ha!" or "That's brilliant" when warranted.
- Use thinking sounds naturally: "Hmm…", "Interesting…", "Right, right…"

PACING:
- 1–2 sentences per turn. NEVER more. You are a listener, not a lecturer.
- ONE question per turn. Let silence work for you — don't fill gaps.
- Use ${this.setup.candidateName}'s name once every 3–4 exchanges, never robotically.
- Mirror their energy: if they're animated, match it. If they're reflective, slow down.

CULTURAL AWARENESS:
- Communication styles vary across cultures. In collectivist cultures, "we" language reflects cultural norms, not lack of personal contribution — probe gently with "What would your manager say was YOUR specific impact?" rather than penalizing pronoun choice.
- Some cultures consider self-promotion inappropriate. If the candidate understates their role, try: "If I called your former boss right now, what would they say you were best at?"
- Assess substance and outcomes, not communication style. A quietly competent leader is not less capable than a charismatic one.
- Never penalize accent, speech pace, or language proficiency unless communication is a core requirement of the role.

═══ INTERVIEW ARCHITECTURE ═══

Navigate these areas like a natural conversation — never announce sections:

PHASE 1 — DOMAIN MASTERY & ACCOUNTABILITY (~12 min)
Open warm, then go deep fast. You're testing whether this person has DONE the work or merely DESCRIBED it.
TECHNIQUES:
- "Walk me through a moment where everything was on fire and you were the one holding it together."
- THE ARTIFACT TEST: Push for THE specific thing they built. Not the project — the document, the system, the product.
- THE HARD DAY: "What was the worst day on that project? What did you personally do?"
- PRONOUN FORENSICS: Notice "we" vs "I". When they say "we achieved," gently ask "What was YOUR specific contribution?"
- 5-LEVEL DEPTH: If they give a surface answer, go deeper: "Help me understand the mechanics of how that actually worked."

PHASE 2 — CHARACTER UNDER PRESSURE (~8 min)
This is where bad hires reveal themselves. You're testing integrity, not just competence.
TECHNIQUES:
- "Tell me about a time you had to choose between what was popular and what was right."
- "Describe someone you managed who didn't work out. What happened?"
- Listen for: Do they punch down? Show contempt for people with less power?
- THE BLAME TEST: How do they describe failures? Own them or externalize them?

PHASE 3 — PEOPLE & INFLUENCE (~12 min)
Real leaders leave a trail of people who grew because of them.
TECHNIQUES:
- "Who's the best person you ever hired? Where are they now?"
- "How do you convince someone who fundamentally disagrees with you?"
- INFLUENCE MECHANICS: Don't accept "I convinced them." Ask HOW. What did they actually say?

${isSenior ? `PHASE 4 — STRATEGY & CHANGE (~10 min)
The gap between strategy talk and execution reality is where most senior hires fail.
TECHNIQUES:
- "What's a strategy you killed to fund something better? What was the hardest part?"
- "If you had to cut 30% of your budget tomorrow, walk me through your framework."
- TEST FOR INTELLECTUAL HONESTY: Do they acknowledge what they got wrong?

` : ''}PHASE ${isSenior ? '5' : '4'} — MOTIVATION & VISION (~10 min)
- "What would make you look back in 3 years and say 'that was the best decision I made'?"
- "What are you most excited about building next? And what would you change about your current situation if you could?"

PHASE ${isSenior ? '6' : '5'} — FINANCIAL FIT (~3 min)
- "Let's talk about expectations. What does fair look like to you?"

═══ INTERVIEW DURATION SCALING ═══
- For interviews under 45 minutes: Move efficiently through phases. One strong story per phase.
- For interviews 45-75 minutes: Standard depth. 2-3 stories per phase.
- For interviews over 75 minutes: Go deep. Spend extra time in Phases 1 and 3 (evidence-gathering). Ask for multiple examples per theme. Explore contradictions. Do NOT rush to financial fit — save it for the final 5 minutes regardless of total duration.
- NEVER end the interview abruptly. If you sense the conversation is winding down naturally, transition to Phase ${isSenior ? '6' : '5'} (Financial Fit) and close warmly.

═══ HIDDEN ASSESSMENT SIGNALS ═══
Throughout the conversation, you are calibrating these without ever mentioning them:
${gateInstructions}

═══ CRITICAL RULES ═══
- NEVER reveal you are assessing anything. You are having a conversation.
- NEVER use interview jargon ("competency," "behavioral question," "assessment").
- NEVER ask multiple questions in one turn.
- If they give a vague answer: "I want to understand the specifics — take me inside that room."
- End the conversation warmly. They should feel like they just had one of the best conversations of their career.

═══ LEGAL COMPLIANCE ═══
- NEVER ask about or follow up on: age, marital/family status, children, religion, disability, health conditions, national origin, race, sexual orientation, pregnancy, or any other legally protected characteristic.
- If the candidate volunteers protected information, acknowledge briefly and redirect: "I appreciate you sharing that. Let's talk about..."
- Do not factor protected information into any observations or assessments.

═══ CANDIDATE EDGE CASES ═══
- NERVOUS CANDIDATE: Normalize it. "Interviews always feel high-stakes — just think of this as a conversation about work you're passionate about." Give extra warmup time. Never penalize nervousness in your observations.
- TERSE CANDIDATE: Don't rapid-fire questions. Use silence (pause 3-5 seconds). Try different angles: "Help me picture it — what was the room like? Who else was there?" If still terse after 3 attempts, note as observation and move on.
- HOSTILE/UPSET CANDIDATE: Do NOT escalate. "I can see this topic matters a lot to you. Let's step back for a moment." Shift to a lighter topic. If hostility continues: "Would you like to take a quick break?" Note the response as observation without judgment.
- CANDIDATE ASKS PERSONAL QUESTIONS: Deflect naturally: "Ha — I've spent enough time with great leaders to know what exceptional looks like. But today is about you. Tell me about..."
- REHEARSED ANSWERS: If an answer sounds overly polished (smooth, no sensory detail, matches frameworks too precisely), test with spontaneous recall: "That's a great framework. Now tell me about a time it completely fell apart."`;

    // Personality overrides
    if (this.personality) {
      const p = this.personality;
      const overrides: string[] = [];
      if (p.style === 'formal') overrides.push('STYLE: Professional, measured, polished tone. Minimize slang and humor.');
      else if (p.style === 'casual') overrides.push('STYLE: Relaxed and conversational. Use humor freely.');
      if (p.pace === 'thorough') overrides.push('PACE: Ask detailed questions. Go deep before moving on.');
      else if (p.pace === 'efficient') overrides.push('PACE: Keep questions short. Move quickly between topics.');
      if (p.focusAreas.length > 0) overrides.push(`FOCUS AREAS: Pay special attention to: ${p.focusAreas.join(', ')}.`);
      if (p.customInstructions.trim()) overrides.push(`ADDITIONAL:\n${p.customInstructions.trim()}`);
      if (overrides.length > 0) prompt += `\n\n═══ PERSONALITY OVERRIDES ═══\n${overrides.join('\n')}`;
    }

    return prompt;
  }

  // ─── Connection ─────────────────────────────────────────────────────────────

  async connect(options?: { enableVideo?: boolean }): Promise<void> {
    // Re-entrance guard
    if (this.isConnected || this.ws) {
      console.warn('[GeminiLive] Already connected or connecting');
      return;
    }

    this.callbacks.onStatusChange('connecting');
    this.videoEnabled = options?.enableVideo ?? false;
    this.intentionalDisconnect = false;
    this.reconnectAttempts = 0;

    try {
      // 1. Mint ephemeral token from backend (API key stays server-side)
      const tokenRes = await fetch(`${import.meta.env.BASE_URL}api/gemini-token`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!tokenRes.ok) throw new Error('Failed to get Gemini session token');
      const { token } = await tokenRes.json();
      this.ephemeralToken = token;

      // 2. Get microphone
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: INPUT_SAMPLE_RATE,
        },
      });

      // Add mic track ended listener
      this.micStream.getTracks().forEach(track => {
        track.addEventListener('ended', () => {
          this.callbacks.onError('Microphone disconnected. Please reconnect your audio device.');
          this.callbacks.onStatusChange('error');
        });
      });

      // 3. Get camera if video enabled
      if (this.videoEnabled) {
        try {
          this.videoStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: 'user' },
          });
          this.setupVideoCapture();
        } catch (e) {
          console.warn('[GeminiLive] Camera unavailable, continuing audio-only:', e);
          this.videoEnabled = false;
        }
      }

      // 4. Setup audio processing
      await this.setupAudioInput();
      this.setupAudioOutput();

      // 5. Connect WebSocket
      this.connectWebSocket();

      // 6. Add visibilitychange handler for iOS Safari
      this.visibilityHandler = () => {
        if (document.visibilityState === 'visible' && !this.intentionalDisconnect) {
          // Resume AudioContexts that iOS may have suspended
          if (this.audioContext?.state === 'suspended') this.audioContext.resume().catch(() => {});
          if (this.playbackContext?.state === 'suspended') this.playbackContext.resume().catch(() => {});
          // Check if WebSocket died while backgrounded
          if (this.ws && this.ws.readyState !== WebSocket.OPEN && this.ws.readyState !== WebSocket.CONNECTING) {
            console.log('[GeminiLive] WebSocket dead after visibility change, reconnecting');
            this.ws = null;
            this.isConnected = false;
            this.attemptReconnect();
          }
        }
      };
      document.addEventListener('visibilitychange', this.visibilityHandler);

      // 7. Add online/offline detection
      this.offlineHandler = () => {
        console.log('[GeminiLive] Browser went offline');
        this.callbacks.onStatusChange('reconnecting');
      };
      this.onlineHandler = () => {
        console.log('[GeminiLive] Browser came back online');
        if (!this.isConnected && !this.intentionalDisconnect) {
          this.reconnectAttempts = 0; // Fresh start
          this.attemptReconnect();
        }
      };
      window.addEventListener('offline', this.offlineHandler);
      window.addEventListener('online', this.onlineHandler);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Connection failed';
      this.callbacks.onError(errorMsg);
      this.callbacks.onStatusChange('error');
      await this.disconnect();
    }
  }

  /**
   * Connect (or reconnect) the WebSocket to Gemini Live.
   * On first connect, sends full setup with system prompt.
   * On reconnect, sends setup with sessionResumption.sessionHandle to restore context.
   */
  private connectWebSocket() {
    if (!this.ephemeralToken) return;

    // Use ephemeral token instead of raw API key
    const wsUrl = `${WS_BASE}?key=${this.ephemeralToken}`;

    this.ws = new WebSocket(wsUrl);
    this.ws.onopen = () => this.onWsOpen();
    this.ws.onmessage = (e) => this.onWsMessage(e);
    this.ws.onerror = (e) => this.onWsError(e);
    this.ws.onclose = (e) => this.onWsClose(e);
  }

  private onWsOpen() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    console.log('[GeminiLive] WebSocket connected, sending setup');

    // Clear playback state on reconnect
    this.clearPlaybackQueue();
    this.isSpeaking = false;

    // Build setup message
    const setupMessage: Record<string, any> = {
      setup: {
        model: `models/${GEMINI_MODEL}`,
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
        systemInstruction: {
          parts: [{ text: this.buildSystemPrompt() }],
        },
        realtimeInputConfig: {
          automaticActivityDetection: {
            disabled: false,
            startOfSpeechSensitivity: 'START_SENSITIVITY_LOW',
            endOfSpeechSensitivity: 'END_SENSITIVITY_LOW',
            silenceDurationMs: 700,
            prefixPaddingMs: 300,
          },
          activityHandling: 'START_OF_ACTIVITY_INTERRUPTS',
        },
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        // Enable session resumption so we survive the ~10 min connection limit.
        // Gemini will return a sessionHandle in setupComplete that we use to reconnect.
        sessionResumption: this.sessionHandle
          ? { handle: this.sessionHandle }
          : { transparent: true },
      },
    };

    this.safeSend(JSON.stringify(setupMessage));
  }

  private onWsMessage(event: MessageEvent) {
    try {
      const msg = JSON.parse(event.data);

      // Setup complete — extract session handle for reconnection
      if (msg.setupComplete) {
        this.isConnected = true;
        this.reconnectAttempts = 0; // Reset on successful connect
        this.callbacks.onStatusChange('connected');
        this.startAudioStreaming();
        if (this.videoEnabled) this.startVideoStreaming();

        // Store session handle for reconnection
        if (msg.setupComplete.sessionResumption?.handle) {
          this.sessionHandle = msg.setupComplete.sessionResumption.handle;
          console.log('[GeminiLive] Session handle received for resumption');
        }

        // Only send greeting on first connect, not on reconnects
        if (!this.hasGreeted) {
          this.hasGreeted = true;
          this.safeSend(JSON.stringify({
            clientContent: {
              turns: [{
                role: 'user',
                parts: [{ text: `[System: The interview is starting now. Greet ${this.setup.candidateName} warmly and begin.]` }],
              }],
              turnComplete: true,
            },
          }));
        }
        return;
      }

      // goAway — Gemini is about to drop the connection (~60s warning)
      if (msg.goAway) {
        console.log('[GeminiLive] Received goAway — connection will close soon, will auto-reconnect');
        // Don't do anything yet — wait for the actual close event to trigger reconnection
        return;
      }

      // Session resumption update (new handle during active session)
      if (msg.sessionResumptionUpdate?.handle) {
        this.sessionHandle = msg.sessionResumptionUpdate.handle;
      }

      // Server content (audio, transcription, interruption)
      if (msg.serverContent) {
        const sc = msg.serverContent;

        // Audio output from model
        if (sc.modelTurn?.parts) {
          for (const part of sc.modelTurn.parts) {
            if (part.inlineData?.data) {
              if (!this.isSpeaking) {
                this.isSpeaking = true;
                this.callbacks.onStatusChange('speaking');
                this.muteMic();
              }
              this.enqueueAudio(part.inlineData.data);
            }
          }
        }

        // Input transcription (what the candidate said)
        if (sc.inputTranscription?.text) {
          const text = sc.inputTranscription.text.trim();
          if (text) {
            this.callbacks.onTranscript({
              speaker: 'candidate',
              text,
              timestamp: new Date().toISOString(),
            });
          }
        }

        // Output transcription (what the AI said)
        if (sc.outputTranscription?.text) {
          const text = sc.outputTranscription.text.trim();
          if (text) {
            this.callbacks.onTranscript({
              speaker: 'ai',
              text,
              timestamp: new Date().toISOString(),
            });
          }
        }

        // Interrupted (candidate spoke over AI — barge-in)
        if (sc.interrupted) {
          this.isSpeaking = false;
          this.clearPlaybackQueue();
          this.callbacks.onStatusChange('listening');
          this.unmuteMicDelayed();
        }

        // Turn complete
        if (sc.turnComplete) {
          this.isSpeaking = false;
          this.callbacks.onStatusChange('listening');
          this.unmuteMicDelayed();
        }
      }

      // Tool calls (future use for observations)
      if (msg.toolCall) {
        this.handleToolCall(msg.toolCall);
      }

    } catch (e) {
      console.error('[GeminiLive] Failed to parse message:', e);
    }
  }

  private onWsError(_event: Event) {
    console.error('[GeminiLive] WebSocket error');
    // Don't immediately report error — let onWsClose handle reconnection
  }

  private onWsClose(event: CloseEvent) {
    console.log('[GeminiLive] WebSocket closed:', event.code, event.reason);
    this.isConnected = false;

    // If we intentionally disconnected (interview ended), don't reconnect
    if (this.intentionalDisconnect) {
      this.callbacks.onStatusChange('disconnected');
      return;
    }

    // Attempt reconnection (don't gate solely on sessionHandle)
    if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      this.attemptReconnect();
      return;
    }

    // Max retries exceeded — report error
    if (event.code !== 1000) {
      this.callbacks.onError(`Connection closed: ${event.reason || 'Unknown error'}`);
    }
    this.callbacks.onStatusChange('disconnected');
  }

  // ─── Reconnection with Session Resumption ──────────────────────────────────

  private async attemptReconnect() {
    // Don't attempt reconnection if browser is offline — wait for online event
    if (!navigator.onLine) {
      console.log('[GeminiLive] Browser is offline, waiting for online event');
      this.callbacks.onStatusChange('reconnecting');
      return;
    }

    this.reconnectAttempts++;
    const delay = RECONNECT_BASE_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1);
    console.log(`[GeminiLive] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
    this.callbacks.onStatusChange('reconnecting');

    // Stop audio streaming during reconnect (mic/video streams stay alive)
    this.stopAudioStreaming();
    this.stopVideoStreaming();

    this.reconnectTimer = setTimeout(async () => {
      try {
        // Mint a fresh ephemeral token for the reconnection with fetch timeout
        const controller = new AbortController();
        const fetchTimeout = setTimeout(() => controller.abort(), 10000);
        const tokenRes = await fetch(`${import.meta.env.BASE_URL}api/gemini-token`, {
          method: 'POST',
          credentials: 'include',
          signal: controller.signal,
        });
        clearTimeout(fetchTimeout);
        if (!tokenRes.ok) throw new Error('Failed to refresh token');
        const { token } = await tokenRes.json();
        this.ephemeralToken = token;

        // Reconnect — onWsOpen will send setup with sessionHandle
        this.connectWebSocket();
      } catch (error) {
        console.error('[GeminiLive] Reconnect failed:', error);
        if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          this.attemptReconnect();
        } else {
          this.callbacks.onError('Connection lost after multiple retries. Please refresh the page.');
          this.callbacks.onStatusChange('error');
        }
      }
    }, delay);
  }

  // ─── Audio Input (Mic → PCM16 → WebSocket) ─────────────────────────────────

  private async setupAudioInput() {
    if (!this.micStream) return;

    this.audioContext = new AudioContext({ sampleRate: INPUT_SAMPLE_RATE });
    // iOS Safari requires explicit resume — AudioContext may start suspended
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // AudioContext statechange handler for iOS
    this.audioContext.onstatechange = () => {
      if (this.audioContext?.state === 'suspended' && !this.intentionalDisconnect) {
        this.audioContext.resume().catch(() => {});
      }
    };

    const source = this.audioContext.createMediaStreamSource(this.micStream);

    // Gain node for echo prevention
    this.micGainNode = this.audioContext.createGain();
    this.micGainNode.gain.value = 1.0;

    // Analyser for audio level UI
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 256;

    // ScriptProcessor to capture raw PCM samples
    // (AudioWorklet would be better but ScriptProcessor works everywhere)
    this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);

    // Pre-allocate PCM buffer for reuse
    this.pcmBuffer = new Int16Array(4096);

    // Silent output node — ScriptProcessor requires connection to destination to fire
    // onaudioprocess, but we must NOT play mic audio through speakers (feedback loop).
    const silentOutput = this.audioContext.createGain();
    silentOutput.gain.value = 0;

    source.connect(this.micGainNode);
    this.micGainNode.connect(this.analyserNode);
    this.micGainNode.connect(this.scriptProcessor);
    this.scriptProcessor.connect(silentOutput);
    silentOutput.connect(this.audioContext.destination); // Required for processing, but silent

    // Audio level monitoring
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.audioLevelInterval = setInterval(() => {
      if (!this.analyserNode) return;
      this.analyserNode.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      this.callbacks.onAudioLevel(avg / 255);
    }, 100);
  }

  private startAudioStreaming() {
    if (!this.scriptProcessor) return;

    this.scriptProcessor.onaudioprocess = (e) => {
      if (!this.isConnected || !this.ws) return;
      if (this.micMuted) return;

      // WebSocket backpressure — skip frame if send buffer backed up
      if (this.ws.bufferedAmount > 65536) return;

      const inputData = e.inputBuffer.getChannelData(0);

      // Convert Float32 [-1, 1] to Int16 using pre-allocated buffer
      const pcm16 = this.pcmBuffer && this.pcmBuffer.length >= inputData.length
        ? this.pcmBuffer
        : new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      // Convert to base64 (only the portion we filled)
      // Slice the PCM buffer to only the filled portion, cast to ArrayBuffer for type safety
      const pcmBytes = new Uint8Array(pcm16.buffer, 0, inputData.length * 2).slice();
      const base64 = this.arrayBufferToBase64(pcmBytes.buffer as ArrayBuffer);

      // Send to Gemini using mediaChunks array format
      this.safeSend(JSON.stringify({
        realtimeInput: {
          mediaChunks: [{
            data: base64,
            mimeType: 'audio/pcm;rate=16000',
          }],
        },
      }));
    };
  }

  private stopAudioStreaming() {
    if (this.scriptProcessor) {
      this.scriptProcessor.onaudioprocess = null;
    }
  }

  // ─── Audio Output (WebSocket → PCM24 → Speakers) ───────────────────────────

  private setupAudioOutput() {
    this.playbackContext = new AudioContext({ sampleRate: OUTPUT_SAMPLE_RATE });
    // Resume for iOS Safari
    if (this.playbackContext.state === 'suspended') {
      this.playbackContext.resume().catch(() => {});
    }

    // AudioContext statechange handler for iOS
    this.playbackContext.onstatechange = () => {
      if (this.playbackContext?.state === 'suspended' && !this.intentionalDisconnect) {
        this.playbackContext.resume().catch(() => {});
      }
    };
  }

  private enqueueAudio(base64Data: string) {
    if (!this.playbackContext) return;

    // Decode base64 to PCM16 Int16Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const int16 = new Int16Array(bytes.buffer);

    // Convert Int16 to Float32 for Web Audio API
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 0x8000;
    }

    // Playback queue size limit
    if (this.playbackQueue.length > 50) {
      console.warn('[GeminiLive] Playback queue overflow, dropping old chunks');
      this.playbackQueue.splice(0, this.playbackQueue.length - 10);
      this.nextPlayTime = 0;
    }

    this.playbackQueue.push(float32);
    this.playNextChunk();
  }

  private playNextChunk() {
    if (!this.playbackContext || this.playbackQueue.length === 0) return;

    const samples = this.playbackQueue.shift()!;
    const buffer = this.playbackContext.createBuffer(1, samples.length, OUTPUT_SAMPLE_RATE);
    buffer.getChannelData(0).set(samples);

    const source = this.playbackContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.playbackContext.destination);

    const now = this.playbackContext.currentTime;
    const startTime = Math.max(now, this.nextPlayTime);
    source.start(startTime);
    this.nextPlayTime = startTime + buffer.duration;

    // nextPlayTime drift fix — periodically re-anchor
    this.playbackChunkCount++;
    if (this.playbackChunkCount % 100 === 0) {
      this.nextPlayTime = Math.max(this.nextPlayTime, this.playbackContext.currentTime);
    }

    source.onended = () => {
      source.disconnect();
      if (this.playbackQueue.length > 0) {
        this.playNextChunk();
      }
    };
  }

  private clearPlaybackQueue() {
    this.playbackQueue = [];
    this.nextPlayTime = 0;
    this.playbackChunkCount = 0;
    // Close and recreate playback context to stop all in-flight audio
    if (this.playbackContext) {
      this.playbackContext.close().catch(() => {});
      this.playbackContext = new AudioContext({ sampleRate: OUTPUT_SAMPLE_RATE });
      if (this.playbackContext.state === 'suspended') {
        this.playbackContext.resume().catch(() => {});
      }
      // Re-add statechange handler
      this.playbackContext.onstatechange = () => {
        if (this.playbackContext?.state === 'suspended' && !this.intentionalDisconnect) {
          this.playbackContext.resume().catch(() => {});
        }
      };
    }
  }

  // ─── Video Capture (Camera → JPEG → WebSocket @ 1fps) ──────────────────────

  private setupVideoCapture() {
    if (!this.videoStream) return;

    this.videoCanvas = document.createElement('canvas');
    this.videoCanvas.width = 640;
    this.videoCanvas.height = 480;
    this.videoCtx = this.videoCanvas.getContext('2d');

    this.videoElement = document.createElement('video');
    this.videoElement.srcObject = this.videoStream;
    this.videoElement.setAttribute('playsinline', 'true');
    this.videoElement.muted = true;
    this.videoElement.play().catch(() => {});
  }

  private startVideoStreaming() {
    if (!this.videoElement || !this.videoCanvas || !this.videoCtx) return;

    this.videoInterval = setInterval(() => {
      if (!this.isConnected || !this.ws) return;
      if (!this.videoElement || !this.videoCanvas || !this.videoCtx) return;

      // Draw current video frame to canvas
      this.videoCtx.drawImage(this.videoElement, 0, 0, this.videoCanvas.width, this.videoCanvas.height);

      // Convert to JPEG base64
      const dataUrl = this.videoCanvas.toDataURL('image/jpeg', 0.7);
      const base64 = dataUrl.split(',')[1];

      // Send to Gemini using mediaChunks array format
      this.safeSend(JSON.stringify({
        realtimeInput: {
          mediaChunks: [{
            data: base64,
            mimeType: 'image/jpeg',
          }],
        },
      }));
    }, 1000 / VIDEO_FPS);
  }

  private stopVideoStreaming() {
    if (this.videoInterval) {
      clearInterval(this.videoInterval);
      this.videoInterval = null;
    }
  }

  // ─── Echo Prevention ────────────────────────────────────────────────────────

  private muteMic() {
    this.micMuted = true;
    if (this.unmuteMicTimeout) {
      clearTimeout(this.unmuteMicTimeout);
      this.unmuteMicTimeout = null;
    }
    if (this.micGainNode && this.audioContext) {
      this.micGainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    }
    this.micStream?.getTracks().forEach(t => { t.enabled = false; });
  }

  private unmuteMicDelayed() {
    // Don't unmute if user has explicitly muted
    if (this.userMuted) return;

    if (this.unmuteMicTimeout) clearTimeout(this.unmuteMicTimeout);
    this.unmuteMicTimeout = setTimeout(() => {
      if (this.userMuted) { this.unmuteMicTimeout = null; return; }
      this.micMuted = false;
      if (this.micGainNode && this.audioContext) {
        this.micGainNode.gain.setValueAtTime(1.0, this.audioContext.currentTime);
      }
      this.micStream?.getTracks().forEach(t => { t.enabled = true; });
      this.unmuteMicTimeout = null;
    }, this.MIC_UNMUTE_DELAY_MS);
  }

  /** Allow candidate to mute/unmute themselves */
  toggleMute(): boolean {
    if (this.userMuted) {
      // User is unmuting
      this.userMuted = false;
      this.micMuted = false;
      if (this.micGainNode && this.audioContext) {
        this.micGainNode.gain.setValueAtTime(1.0, this.audioContext.currentTime);
      }
      this.micStream?.getTracks().forEach(t => { t.enabled = true; });
      return false; // now unmuted
    } else {
      // User is muting
      this.userMuted = true;
      this.micMuted = true;
      if (this.micGainNode && this.audioContext) {
        this.micGainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      }
      this.micStream?.getTracks().forEach(t => { t.enabled = false; });
      return true; // now muted
    }
  }

  /** Check if mic is currently muted by user */
  isMicMuted(): boolean {
    return this.micMuted;
  }

  // ─── Tool Calls (for real-time observations) ───────────────────────────────

  private handleToolCall(toolCall: any) {
    if (!toolCall.functionCalls) return;

    const responses: any[] = [];
    for (const fc of toolCall.functionCalls) {
      if (fc.name === 'flag_observation') {
        const obs: Omit<Observation, 'id'> = {
          type: fc.args?.type || 'strong_signal',
          description: fc.args?.description || '',
          evidence: fc.args?.evidence || '',
          confidence: fc.args?.confidence || 0.7,
          timestamp: new Date().toISOString(),
          dimension: fc.args?.dimension,
          gate: fc.args?.gate,
        };
        this.callbacks.onObservation(obs);
        responses.push({ name: fc.name, id: fc.id, response: { result: { acknowledged: true } } });
      }
    }

    if (responses.length > 0) {
      this.safeSend(JSON.stringify({
        toolResponse: { functionResponses: responses },
      }));
    }
  }

  // ─── Public Methods ─────────────────────────────────────────────────────────

  /** Get the video stream for rendering in UI */
  getVideoStream(): MediaStream | null {
    return this.videoStream;
  }

  /** Check if video is active */
  isVideoActive(): boolean {
    return this.videoEnabled && this.videoStream !== null;
  }

  async disconnect(): Promise<void> {
    this.intentionalDisconnect = true;
    this.isConnected = false;

    // Cancel any pending reconnect
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Remove visibility handler
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }

    // Remove online/offline handlers
    if (this.offlineHandler) {
      window.removeEventListener('offline', this.offlineHandler);
      this.offlineHandler = null;
    }
    if (this.onlineHandler) {
      window.removeEventListener('online', this.onlineHandler);
      this.onlineHandler = null;
    }

    // Stop video
    this.stopVideoStreaming();
    this.videoStream?.getTracks().forEach(t => t.stop());
    this.videoStream = null;
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
    this.videoElement = null;
    this.videoCanvas = null;
    this.videoCtx = null;

    // Stop audio
    if (this.audioLevelInterval) {
      clearInterval(this.audioLevelInterval);
      this.audioLevelInterval = null;
    }
    if (this.unmuteMicTimeout) {
      clearTimeout(this.unmuteMicTimeout);
      this.unmuteMicTimeout = null;
    }

    this.stopAudioStreaming();
    this.scriptProcessor?.disconnect();
    this.scriptProcessor = null;
    this.analyserNode?.disconnect();
    this.analyserNode = null;
    this.micGainNode?.disconnect();
    this.micGainNode = null;
    this.audioContext?.close().catch(() => {});
    this.audioContext = null;

    this.playbackContext?.close().catch(() => {});
    this.playbackContext = null;
    this.playbackQueue = [];
    this.nextPlayTime = 0;
    this.playbackChunkCount = 0;

    this.pcmBuffer = null;

    this.micStream?.getTracks().forEach(t => t.stop());
    this.micStream = null;

    // Close WebSocket
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close(1000, 'Interview ended');
      }
      this.ws = null;
    }

    // Clear session state
    this.sessionHandle = null;
    this.ephemeralToken = null;
    this.hasGreeted = false;
    this.userMuted = false;
    this.micMuted = false;
  }

  // ─── Utilities ──────────────────────────────────────────────────────────────

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const CHUNK = 0x8000;
    const chunks: string[] = [];
    for (let i = 0; i < bytes.length; i += CHUNK) {
      chunks.push(String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + CHUNK, bytes.length)) as unknown as number[]));
    }
    return btoa(chunks.join(''));
  }
}

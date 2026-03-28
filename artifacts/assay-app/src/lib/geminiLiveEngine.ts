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
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_BASE_DELAY_MS = 1000; // Exponential backoff: 1s, 2s, 4s, 8s, 16s

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

  // Audio output playback
  private playbackContext: AudioContext | null = null;
  private playbackQueue: Float32Array[] = [];
  private isPlaying = false;
  private nextPlayTime = 0;

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

  // Session resumption (handles 10-min connection limit)
  private sessionHandle: string | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private hasGreeted = false;

  // Ephemeral token
  private ephemeralToken: string | null = null;

  private personality?: AIPersonality;

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
- "What are you running toward? And — honestly — what are you running from?"

PHASE ${isSenior ? '6' : '5'} — FINANCIAL FIT (~3 min)
- "Let's talk about expectations. What does fair look like to you?"

═══ HIDDEN ASSESSMENT SIGNALS ═══
Throughout the conversation, you are calibrating these without ever mentioning them:
${gateInstructions}

═══ CRITICAL RULES ═══
- NEVER reveal you are assessing anything. You are having a conversation.
- NEVER use interview jargon ("competency," "behavioral question," "assessment").
- NEVER ask multiple questions in one turn.
- If they give a vague answer: "I want to understand the specifics — take me inside that room."
- End the conversation warmly. They should feel like they just had one of the best conversations of their career.`;

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

    this.ws.send(JSON.stringify(setupMessage));
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
          if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
          this.ws.send(JSON.stringify({
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

    // If we have a session handle, attempt reconnection (expected ~10 min drops)
    if (this.sessionHandle && this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      this.attemptReconnect();
      return;
    }

    // No session handle or max retries exceeded — report error
    if (event.code !== 1000) {
      this.callbacks.onError(`Connection closed: ${event.reason || 'Unknown error'}`);
    }
    this.callbacks.onStatusChange('disconnected');
  }

  // ─── Reconnection with Session Resumption ──────────────────────────────────

  private async attemptReconnect() {
    this.reconnectAttempts++;
    const delay = RECONNECT_BASE_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1);
    console.log(`[GeminiLive] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
    this.callbacks.onStatusChange('reconnecting');

    // Stop audio streaming during reconnect (mic/video streams stay alive)
    this.stopAudioStreaming();
    this.stopVideoStreaming();

    this.reconnectTimer = setTimeout(async () => {
      try {
        // Mint a fresh ephemeral token for the reconnection
        const tokenRes = await fetch(`${import.meta.env.BASE_URL}api/gemini-token`, {
          method: 'POST',
          credentials: 'include',
        });
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
      if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
      if (this.micMuted) return;

      const inputData = e.inputBuffer.getChannelData(0);

      // Convert Float32 [-1, 1] to Int16
      const pcm16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      // Convert to base64
      const base64 = this.arrayBufferToBase64(pcm16.buffer);

      // Send to Gemini using mediaChunks array format
      this.ws.send(JSON.stringify({
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

    source.onended = () => {
      if (this.playbackQueue.length > 0) {
        this.playNextChunk();
      }
    };
  }

  private clearPlaybackQueue() {
    this.playbackQueue = [];
    this.nextPlayTime = 0;
    // Close and recreate playback context to stop all in-flight audio
    if (this.playbackContext) {
      this.playbackContext.close().catch(() => {});
      this.playbackContext = new AudioContext({ sampleRate: OUTPUT_SAMPLE_RATE });
      if (this.playbackContext.state === 'suspended') {
        this.playbackContext.resume().catch(() => {});
      }
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
      if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
      if (!this.videoElement || !this.videoCanvas || !this.videoCtx) return;

      // Draw current video frame to canvas
      this.videoCtx.drawImage(this.videoElement, 0, 0, this.videoCanvas.width, this.videoCanvas.height);

      // Convert to JPEG base64
      const dataUrl = this.videoCanvas.toDataURL('image/jpeg', 0.7);
      const base64 = dataUrl.split(',')[1];

      // Send to Gemini using mediaChunks array format
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          realtimeInput: {
            mediaChunks: [{
              data: base64,
              mimeType: 'image/jpeg',
            }],
          },
        }));
      }
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
    if (this.unmuteMicTimeout) clearTimeout(this.unmuteMicTimeout);
    this.unmuteMicTimeout = setTimeout(() => {
      this.micMuted = false;
      if (this.micGainNode && this.audioContext) {
        this.micGainNode.gain.setValueAtTime(1.0, this.audioContext.currentTime);
      }
      this.micStream?.getTracks().forEach(t => { t.enabled = true; });
      this.unmuteMicTimeout = null;
    }, this.MIC_UNMUTE_DELAY_MS);
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

    if (responses.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
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
  }

  // ─── Utilities ──────────────────────────────────────────────────────────────

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}

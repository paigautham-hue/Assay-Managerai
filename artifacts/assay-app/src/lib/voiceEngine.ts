import type { InterviewSetup, TranscriptEntry, Observation } from '../types';

export interface VoiceEngineCallbacks {
  onTranscript: (entry: Omit<TranscriptEntry, 'id'>) => void;
  onObservation: (obs: Omit<Observation, 'id'>) => void;
  onStatusChange: (status: 'connecting' | 'connected' | 'speaking' | 'listening' | 'processing' | 'disconnected' | 'error') => void;
  onError: (error: string) => void;
  onAudioLevel: (level: number) => void;
}

export class VoiceEngine {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private micStream: MediaStream | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private callbacks: VoiceEngineCallbacks;
  private setup: InterviewSetup;
  private isConnected = false;
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private audioLevelInterval: ReturnType<typeof setInterval> | null = null;
  private externalAudioEl: HTMLAudioElement | null = null;

  // --- Echo-prevention state ---
  private isSpeaking = false;           // True while AI audio is playing
  private micGainNode: GainNode | null = null;  // Controls mic volume (0 = muted)
  private unmuteMicTimeout: ReturnType<typeof setTimeout> | null = null;

  private readonly SILENCE_PATIENCE_MS = 800;
  // Delay before re-enabling mic after AI finishes speaking.
  // Gives the speaker time to fully drain buffered audio so the mic
  // doesn't pick up the tail end of the AI's voice.
  private readonly MIC_UNMUTE_DELAY_MS = 600;

  constructor(
    setup: InterviewSetup,
    callbacks: VoiceEngineCallbacks,
    preCreatedAudioEl?: HTMLAudioElement,
  ) {
    this.setup = setup;
    this.callbacks = callbacks;
    this.externalAudioEl = preCreatedAudioEl ?? null;
  }

  /** Expose the mic stream so EmotionEngine can share it. */
  getMicStream(): MediaStream | null {
    return this.micStream;
  }

  private buildSystemPrompt(): string {
    const gateInstructions = this.setup.activeGates
      .map(g => `- ${g.replace(/_/g, ' ')}`)
      .join('\n');

    const isSenior = ['C-Suite', 'VP'].includes(this.setup.roleLevel);

    return `You are Sophia — a world-class executive interviewer with 20 years of experience at the intersection of McKinsey, Spencer Stuart, and organizational psychology. You have personally assessed over 2,000 senior leaders. You're known for conversations so natural that candidates forget they're being interviewed, yet so precise that every answer reveals something meaningful.

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
- Occasionally share a brief, relevant observation to build rapport: "You know, I've seen that pattern in really strong operators…"

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
- "What's a value you held even when it cost you something personally?"
- THE BLAME TEST: How do they describe failures? Own them or externalize them?

PHASE 3 — PEOPLE & INFLUENCE (~12 min)
Real leaders leave a trail of people who grew because of them.
TECHNIQUES:
- "Who's the best person you ever hired? Where are they now?"
- "How do you convince someone who fundamentally disagrees with you?"
- "Tell me about someone on your team who surprised you — in a good way or a bad way."
- INFLUENCE MECHANICS: Don't accept "I convinced them." Ask HOW. What did they actually say?
- DEVELOPMENT ARC: Can they name specific people they developed who went on to lead?

${isSenior ? `PHASE 4 — STRATEGY & CHANGE (~10 min)
The gap between strategy talk and execution reality is where most senior hires fail.
TECHNIQUES:
- "What's a strategy you killed to fund something better? What was the hardest part?"
- "Walk me through a major organizational change you led. What did you underestimate?"
- RESOURCE ALLOCATION: "If you had to cut 30% of your budget tomorrow, walk me through your framework."
- TEST FOR INTELLECTUAL HONESTY: Do they acknowledge what they got wrong?

` : ''}PHASE ${isSenior ? '5' : '4'} — MOTIVATION & VISION (~10 min)
Why THIS role, THIS company, THIS moment in their career?
TECHNIQUES:
- "What would make you look back in 3 years and say 'that was the best decision I made'?"
- "What are you running toward? And — honestly — what are you running from?"
- Listen for: genuine mission resonance vs title/comp optimization
- "What's the thing you most want to build that you haven't been able to yet?"

PHASE ${isSenior ? '6' : '5'} — FINANCIAL FIT (~3 min)
Brief, direct, respectful. No games.
- "Let's talk about expectations. What does fair look like to you?"
- Listen for: abundance thinking vs zero-sum negotiation, flexibility vs rigidity

═══ HIDDEN ASSESSMENT SIGNALS ═══

Throughout the conversation, you are calibrating these without ever mentioning them:
${gateInstructions}

DECEPTION DETECTION (running in background):
- Cross-story consistency: Do different stories align or contradict?
- Specificity gradient: Genuine stories have sensory detail. Fabricated ones are suspiciously smooth.
- Emotional congruence: Does their tone match the content? Describing a "devastating failure" with zero emotion = flag.
- Rehearsal patterns: Over-polished answers with identical phrasing across topics.

═══ CRITICAL RULES ═══

- NEVER reveal you are assessing anything. You are having a conversation.
- NEVER use interview jargon ("competency," "behavioral question," "assessment").
- NEVER ask multiple questions in one turn.
- NEVER summarize what they just said back to them robotically.
- If they give a vague answer, don't accept it: "I want to understand the specifics — take me inside that room."
- If they claim credit for a team effort, probe gently: "That sounds like it took a village. What was your unique contribution?"
- If something smells rehearsed, break the pattern: "That's interesting — now tell me the version you'd share over drinks with a trusted friend."
- End the conversation warmly. They should feel like they just had one of the best conversations of their career.`;
  }

  async connect(): Promise<void> {
    this.callbacks.onStatusChange('connecting');

    try {
      const sessionResponse = await fetch(`${import.meta.env.BASE_URL}api/session`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: this.buildSystemPrompt(),
          voice: 'coral',
        }),
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create voice session');
      }

      const { clientSecret } = await sessionResponse.json();

      // Get microphone access with strong echo cancellation
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          // Chrome-specific: force hardware echo cancellation
          ...({ googEchoCancellation: true } as any),
          ...({ googAutoGainControl: true } as any),
          ...({ googNoiseSuppression: true } as any),
          ...({ googHighpassFilter: true } as any),
        }
      });

      // Setup audio processing chain: mic -> gain (for muting) -> destination
      this.setupAudioProcessing();

      // Create WebRTC peer connection
      this.pc = new RTCPeerConnection();

      // Setup audio output element
      if (this.externalAudioEl) {
        this.audioElement = this.externalAudioEl;
      } else {
        this.audioElement = document.createElement('audio');
        this.audioElement.autoplay = true;
        this.audioElement.setAttribute('playsinline', 'true');
        document.body.appendChild(this.audioElement);
      }

      this.pc.ontrack = (event) => {
        if (this.audioElement) {
          this.audioElement.srcObject = event.streams[0];
          this.audioElement.play().catch(e => console.warn('[VoiceEngine] audio.play() failed:', e));
        }
      };

      // Add mic track to peer connection
      this.micStream.getTracks().forEach(track => {
        this.pc!.addTrack(track, this.micStream!);
      });

      // Create data channel
      this.dc = this.pc.createDataChannel('oai-events');
      this.dc.onopen = () => {
        this.isConnected = true;
        this.callbacks.onStatusChange('connected');
        this.sendSessionUpdate();
      };
      this.dc.onmessage = (e) => this.handleServerEvent(JSON.parse(e.data));

      this.pc.onconnectionstatechange = () => {
        const state = this.pc?.connectionState;
        console.log('[VoiceEngine] connection state:', state);
        if (state === 'failed' || state === 'closed') {
          this.callbacks.onError(`WebRTC connection ${state}`);
          this.callbacks.onStatusChange('error');
        }
      };

      // Create SDP offer
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // Wait for ICE gathering to complete
      await new Promise<void>((resolve, reject) => {
        const gatherTimeout = setTimeout(
          () => reject(new Error('ICE gathering timed out after 10 s')),
          10_000,
        );
        if (this.pc!.iceGatheringState === 'complete') {
          clearTimeout(gatherTimeout);
          resolve();
        } else {
          this.pc!.onicegatheringstatechange = () => {
            if (this.pc!.iceGatheringState === 'complete') {
              clearTimeout(gatherTimeout);
              resolve();
            }
          };
        }
      });

      // Send SDP to OpenAI
      const sdpResponse = await fetch('https://api.openai.com/v1/realtime?model=gpt-realtime', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${clientSecret}`,
          'Content-Type': 'application/sdp',
        },
        body: this.pc.localDescription!.sdp,
      });

      if (!sdpResponse.ok) {
        const errText = await sdpResponse.text().catch(() => sdpResponse.statusText);
        throw new Error(`OpenAI Realtime API rejected the offer (${sdpResponse.status}): ${errText}`);
      }

      const sdpAnswer = await sdpResponse.text();
      await this.pc.setRemoteDescription({ type: 'answer', sdp: sdpAnswer });

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Connection failed';
      this.callbacks.onError(errorMsg);
      this.callbacks.onStatusChange('error');
      await this.disconnect();
    }
  }

  private sendSessionUpdate() {
    if (!this.dc || this.dc.readyState !== 'open') return;

    this.dc.send(JSON.stringify({
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: this.buildSystemPrompt(),
        voice: 'coral',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: { model: 'whisper-1' },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 500,
          silence_duration_ms: 800,
          eagerness: 'medium',
        },
      },
    }));

    // Trigger AI greeting
    this.dc.send(JSON.stringify({
      type: 'response.create',
      response: {
        modalities: ['text', 'audio'],
      },
    }));
  }

  /** Setup audio processing chain for echo prevention. */
  private setupAudioProcessing() {
    if (!this.micStream) return;

    try {
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.micStream);

      // Gain node for software mic muting (more reliable than track.enabled)
      this.micGainNode = this.audioContext.createGain();
      this.micGainNode.gain.value = 1.0;

      // Analyser for audio level monitoring
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;

      source.connect(this.micGainNode);
      this.micGainNode.connect(this.analyserNode);
      // Don't connect to destination — we don't want to play mic audio locally

      const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
      this.audioLevelInterval = setInterval(() => {
        if (!this.analyserNode) return;
        this.analyserNode.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        this.callbacks.onAudioLevel(average / 255);
      }, 100);
    } catch (e) {
      console.warn('Could not setup audio processing:', e);
    }
  }

  /** Mute mic to prevent echo. Uses both gain node AND track.enabled for maximum effect. */
  private muteMic() {
    // Cancel any pending unmute
    if (this.unmuteMicTimeout) {
      clearTimeout(this.unmuteMicTimeout);
      this.unmuteMicTimeout = null;
    }
    // Software mute via gain
    if (this.micGainNode) {
      this.micGainNode.gain.setValueAtTime(0, this.audioContext?.currentTime ?? 0);
    }
    // Hardware mute via track
    this.micStream?.getTracks().forEach(t => { t.enabled = false; });
  }

  /** Unmute mic after a delay to let speaker audio fully drain. */
  private unmuteMicDelayed() {
    if (this.unmuteMicTimeout) clearTimeout(this.unmuteMicTimeout);
    this.unmuteMicTimeout = setTimeout(() => {
      // Re-enable gain
      if (this.micGainNode) {
        this.micGainNode.gain.setValueAtTime(1.0, this.audioContext?.currentTime ?? 0);
      }
      // Re-enable track
      this.micStream?.getTracks().forEach(t => { t.enabled = true; });
      this.unmuteMicTimeout = null;
    }, this.MIC_UNMUTE_DELAY_MS);
  }

  private handleServerEvent(event: any) {
    switch (event.type) {
      case 'response.audio_transcript.done':
        this.callbacks.onTranscript({
          speaker: 'ai',
          text: event.transcript,
          timestamp: new Date().toISOString(),
        });
        break;

      case 'conversation.item.input_audio_transcription.completed':
        this.callbacks.onTranscript({
          speaker: 'candidate',
          text: event.transcript,
          timestamp: new Date().toISOString(),
        });
        break;

      case 'response.audio.delta':
        if (!this.isSpeaking) {
          this.isSpeaking = true;
          this.callbacks.onStatusChange('speaking');
          // Mute mic IMMEDIATELY when AI starts speaking
          this.muteMic();
        }
        break;

      case 'response.audio.done':
        this.isSpeaking = false;
        this.callbacks.onStatusChange('listening');
        // Delay unmute to let speaker audio fully drain
        this.unmuteMicDelayed();
        break;

      case 'input_audio_buffer.speech_started':
        // User started speaking — if AI is still talking, cancel it (interruption)
        if (this.isSpeaking) {
          this.dc?.send(JSON.stringify({ type: 'response.cancel' }));
          this.isSpeaking = false;
        }
        this.callbacks.onStatusChange('listening');
        break;

      case 'input_audio_buffer.speech_stopped':
        this.callbacks.onStatusChange('processing');
        break;

      case 'response.created':
        this.callbacks.onStatusChange('processing');
        break;

      case 'error':
        console.error('Realtime API error:', event.error);
        this.callbacks.onError(event.error?.message || 'Unknown error');
        break;
    }
  }

  async disconnect(): Promise<void> {
    if (this.unmuteMicTimeout) {
      clearTimeout(this.unmuteMicTimeout);
      this.unmuteMicTimeout = null;
    }
    if (this.audioLevelInterval) {
      clearInterval(this.audioLevelInterval);
      this.audioLevelInterval = null;
    }
    if (this.audioContext) {
      await this.audioContext.close().catch(() => {});
      this.audioContext = null;
      this.micGainNode = null;
    }
    if (this.dc) {
      this.dc.close();
      this.dc = null;
    }
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach(t => t.stop());
      this.micStream = null;
    }
    if (this.audioElement) {
      this.audioElement.srcObject = null;
      // Only remove if we created it (don't remove external element)
      if (!this.externalAudioEl) {
        this.audioElement.remove();
      }
      this.audioElement = null;
    }
    this.isConnected = false;
    this.isSpeaking = false;
    this.callbacks.onStatusChange('disconnected');
  }
}

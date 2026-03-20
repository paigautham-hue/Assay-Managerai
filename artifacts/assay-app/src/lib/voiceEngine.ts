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

  private readonly SILENCE_PATIENCE_MS = 800;

  constructor(
    setup: InterviewSetup,
    callbacks: VoiceEngineCallbacks,
    /** Pre-created, gesture-unlocked <audio> element. Pass this from iOS so
     *  Safari allows remote WebRTC audio to play without an autoplay block. */
    preCreatedAudioEl?: HTMLAudioElement,
  ) {
    this.setup = setup;
    this.callbacks = callbacks;
    this.externalAudioEl = preCreatedAudioEl ?? null;
  }

  private buildSystemPrompt(): string {
    const gateInstructions = this.setup.activeGates
      .map(g => `- Probe for ${g.replace(/_/g, ' ')} signals`)
      .join('\n');

    const isSenior = ['C-Suite', 'VP'].includes(this.setup.roleLevel);

    return `You are a world-class interviewer conducting an executive interview assessment for ${this.setup.candidateName} applying for ${this.setup.roleName} (${this.setup.roleLevel}).

NORTH STAR: Avoid future problems. Be warm, curious, and genuinely interested. Think Oprah meets a wise CEO mentor.

Background: ${this.setup.cvSummary || 'Not provided — discover it organically'}
Role: ${this.setup.jobDescription || 'Not provided — explore their understanding of it'}

Cover these areas in order:
1. Domain Expertise & Accountability (12 min combined)
2. Character: Good Person (8 min)
3. People & Influence (12 min)
${isSenior ? '4. Strategy & Change (10 min)\n' : ''}${isSenior ? '5' : '4'}. Motivation: Why Joining? (10 min)
${isSenior ? '6' : '5'}. Financial Fit (3 min)

Keep responses under 50 words. Ask ONE question at a time. Use their name naturally. React authentically.

Non-negotiable gate probes to weave in naturally:
${gateInstructions}

NEVER reveal that you are scoring or evaluating. Be a conversation, not an interrogation.`;
  }

  async connect(): Promise<void> {
    this.callbacks.onStatusChange('connecting');

    try {
      // Get ephemeral token from our API.
      // credentials:'include' is required so the auth cookie is sent with the request.
      const sessionResponse = await fetch(`${import.meta.env.BASE_URL}api/session`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: this.buildSystemPrompt(),
          voice: 'alloy',
        }),
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create voice session');
      }

      const { clientSecret } = await sessionResponse.json();

      // Get microphone access
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      // Setup audio level monitoring
      this.setupAudioLevelMonitor();

      // Create WebRTC peer connection
      this.pc = new RTCPeerConnection();

      // Use a pre-created, gesture-unlocked audio element if one was provided by the
      // caller (required for iOS Safari — play() only works when triggered inside a
      // user-gesture call stack, which connect() is not).  Fall back to creating one
      // here for desktop browsers that don't impose the same restriction.
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
          // Resume the element — it may be paused if no srcObject was set before.
          this.audioElement.play().catch(e => console.warn('[VoiceEngine] audio.play() failed:', e));
        }
      };

      // Add mic track
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

      // Monitor RTCPeerConnection state so failures surface as errors immediately.
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

      // Wait for ICE gathering to complete BEFORE sending the offer to OpenAI.
      // OpenAI's Realtime endpoint expects a complete SDP with all ICE candidates
      // in one shot — sending an incomplete offer causes the data channel to never open.
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

      // Send the COMPLETE SDP (with all gathered ICE candidates) to OpenAI.
      const sdpResponse = await fetch('https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17', {
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

    // Configure the session (instructions, VAD, transcription, etc.)
    this.dc.send(JSON.stringify({
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: this.buildSystemPrompt(),
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: { model: 'whisper-1' },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.3,
          prefix_padding_ms: 300,
          silence_duration_ms: this.SILENCE_PATIENCE_MS,
        },
      },
    }));

    // Trigger the AI's opening greeting.
    // Without this, the AI sits silently in VAD mode waiting for the candidate
    // to speak first — the session never "starts" from the user's perspective.
    this.dc.send(JSON.stringify({
      type: 'response.create',
      response: {
        modalities: ['text', 'audio'],
      },
    }));
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
        this.callbacks.onStatusChange('speaking');
        break;

      case 'response.audio.done':
        this.callbacks.onStatusChange('listening');
        break;

      case 'input_audio_buffer.speech_started':
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

  private setupAudioLevelMonitor() {
    if (!this.micStream) return;

    try {
      this.audioContext = new AudioContext();
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;

      const source = this.audioContext.createMediaStreamSource(this.micStream);
      source.connect(this.analyserNode);

      const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);

      this.audioLevelInterval = setInterval(() => {
        if (!this.analyserNode) return;
        this.analyserNode.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        this.callbacks.onAudioLevel(average / 255);
      }, 100);
    } catch (e) {
      console.warn('Could not setup audio level monitor:', e);
    }
  }

  async disconnect(): Promise<void> {
    if (this.audioLevelInterval) {
      clearInterval(this.audioLevelInterval);
      this.audioLevelInterval = null;
    }
    if (this.audioContext) {
      await this.audioContext.close().catch(() => {});
      this.audioContext = null;
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
      this.audioElement.remove();
      this.audioElement = null;
    }
    this.isConnected = false;
    this.callbacks.onStatusChange('disconnected');
  }
}

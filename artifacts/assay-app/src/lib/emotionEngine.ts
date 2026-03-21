import type { TranscriptEntry } from '../types';

// ─── Emotion data types ────────────────────────────────────────────────────

export interface EmotionScore {
  name: string;
  score: number;
}

export interface EmotionDataPoint {
  timestamp: number;
  emotions: EmotionScore[];
  dominantEmotion: string;
  valence: number;
}

export interface SentimentSegment {
  text: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  confidence: number;
  start?: number;
  end?: number;
}

export interface ProsodyMetrics {
  dominantEmotion: string;
  emotionDistribution: Record<string, number>;
  averageValence: number;
  stressIndicators: string[];
  authenticityScore: number;
  confidenceScore: number;
}

export interface ProsodyData {
  humeTimeline: EmotionDataPoint[];
  sentimentSegments: SentimentSegment[];
  overallSentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  metrics: ProsodyMetrics;
}

// ─── Internal helpers ──────────────────────────────────────────────────────

const POSITIVE_EMOTIONS = new Set([
  'Joy', 'Excitement', 'Contentment', 'Pride', 'Amusement',
  'Enthusiasm', 'Admiration', 'Adoration', 'Aesthetic Appreciation',
  'Calmness', 'Ecstasy', 'Elation', 'Entrancement', 'Euphoria',
  'Interest', 'Love', 'Nostalgia', 'Relief', 'Romance', 'Satisfaction',
  'Surprise (positive)', 'Triumph',
]);

const NEGATIVE_EMOTIONS = new Set([
  'Anxiety', 'Fear', 'Sadness', 'Anger', 'Disgust', 'Distress',
  'Awkwardness', 'Boredom', 'Confusion', 'Contempt', 'Disappointment',
  'Disapproval', 'Doubt', 'Embarrassment', 'Guilt', 'Horror',
  'Pain', 'Realization', 'Shame', 'Stress', 'Surprise (negative)',
  'Tiredness',
]);

function computeValence(emotions: EmotionScore[]): number {
  let v = 0;
  for (const e of emotions) {
    if (POSITIVE_EMOTIONS.has(e.name)) v += e.score;
    if (NEGATIVE_EMOTIONS.has(e.name)) v -= e.score;
  }
  return Math.max(-1, Math.min(1, v));
}

function float32ToPCM16(float32: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// ─── EmotionEngine ─────────────────────────────────────────────────────────

export class EmotionEngine {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private ownsMicStream = false;
  private processor: ScriptProcessorNode | null = null;
  private timeline: EmotionDataPoint[] = [];
  private onEmotionCallback?: (data: EmotionDataPoint) => void;
  private connected = false;

  constructor(
    private humeApiKey: string | null,
    private readonly baseUrl: string = '/',
  ) {}

  /** Fetch Hume API key from backend if not already provided. */
  private async resolveHumeKey(): Promise<string | null> {
    if (this.humeApiKey) return this.humeApiKey;
    try {
      const res = await fetch(`${this.baseUrl}api/hume-token`, { credentials: 'include' });
      if (!res.ok) return null;
      const data = await res.json();
      this.humeApiKey = data.apiKey || null;
      return this.humeApiKey;
    } catch { return null; }
  }

  /**
   * Connect to Hume Streaming Expression Measurement API.
   * Captures microphone audio and streams to Hume for real-time prosody analysis.
   * No-op if HUME_API_KEY is not set.
   */
  async connect(onEmotion?: (data: EmotionDataPoint) => void, existingStream?: MediaStream): Promise<void> {
    const apiKey = await this.resolveHumeKey();
    if (!apiKey) return;

    this.onEmotionCallback = onEmotion;

    try {
      // Use shared stream from VoiceEngine if available, else capture our own
      if (existingStream) {
        this.micStream = existingStream;
        this.ownsMicStream = false;
      } else {
        this.micStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: false, sampleRate: 16000 },
        });
        this.ownsMicStream = true;
      }

      // Connect to Hume Streaming API
      const wsUrl = `wss://api.hume.ai/v0/stream/models?api_key=${apiKey}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.addEventListener('open', () => {
        this.connected = true;
        this._startAudioCapture();
      });

      this.ws.addEventListener('message', (event) => {
        try {
          const msg = JSON.parse(event.data as string);
          this._handleHumeMessage(msg);
        } catch {
          // ignore parse errors
        }
      });

      this.ws.addEventListener('error', () => {
        this.connected = false;
      });

      this.ws.addEventListener('close', () => {
        this.connected = false;
      });
    } catch {
      // getUserMedia denied or WebSocket error — degrade silently
    }
  }

  /**
   * Manually send a pre-captured audio chunk to Hume.
   * Use this if you want to supply audio from an external source.
   */
  sendAudioChunk(chunk: ArrayBuffer): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    try {
      this.ws.send(JSON.stringify({
        data: arrayBufferToBase64(chunk),
        models: { prosody: {} },
      }));
    } catch {
      // ignore send errors
    }
  }

  /**
   * Post-interview: call backend which uses AssemblyAI to analyze sentiment
   * of the candidate's transcript. Returns null if ASSEMBLYAI_API_KEY not set.
   */
  async analyzeTranscriptSentiment(
    transcript: Omit<TranscriptEntry, 'id'>[],
  ): Promise<ProsodyData | null> {
    const candidateLines = transcript
      .filter(e => e.speaker === 'candidate')
      .map(e => e.text)
      .filter(Boolean);

    if (candidateLines.length === 0) return this._buildProsodyData([]);

    try {
      const res = await fetch(`${this.baseUrl}api/sentiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          text: candidateLines.join('\n\n'),
          transcript,
        }),
      });

      if (!res.ok) return this._buildProsodyData([]);

      const data = await res.json();
      return this._buildProsodyData(data.sentimentSegments ?? []);
    } catch {
      return this._buildProsodyData([]);
    }
  }

  /**
   * Returns prosody data collected so far from Hume.
   * Returns null if no timeline data has been captured.
   */
  getProsodyData(): ProsodyData | null {
    if (this.timeline.length === 0) return null;
    return this._buildProsodyData([]);
  }

  /** Disconnect Hume WebSocket and stop microphone capture. */
  disconnect(): void {
    this._stopAudioCapture();

    if (this.ws) {
      try { this.ws.close(); } catch { /* ignore */ }
      this.ws = null;
    }

    // Only stop mic tracks if we own the stream (not shared from VoiceEngine)
    if (this.micStream && !this.ownsMicStream) {
      this.micStream.getTracks().forEach(t => t.stop());
    }
    this.micStream = null;

    this.connected = false;
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  private _startAudioCapture(): void {
    if (!this.micStream || !this.ws) return;
    try {
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      const source = this.audioContext.createMediaStreamSource(this.micStream);

      // ScriptProcessorNode: fires every ~256ms at 16kHz
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      this.processor.onaudioprocess = (e) => {
        if (!this.connected || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        const float32 = e.inputBuffer.getChannelData(0);
        const pcm16 = float32ToPCM16(float32);
        this.sendAudioChunk(pcm16);
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch {
      // AudioContext unavailable — degrade silently
    }
  }

  private _stopAudioCapture(): void {
    if (this.processor) {
      try { this.processor.disconnect(); } catch { /* ignore */ }
      this.processor = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }

  private _handleHumeMessage(msg: any): void {
    // Hume Streaming API response format
    const predictions =
      msg?.prosody?.predictions ??
      msg?.models?.prosody?.grouped_predictions?.[0]?.predictions ??
      [];

    for (const pred of predictions) {
      const emotions: EmotionScore[] = (pred.emotions ?? [])
        .map((e: any) => ({ name: e.name as string, score: e.score as number }))
        .sort((a: EmotionScore, b: EmotionScore) => b.score - a.score);

      if (emotions.length === 0) continue;

      const dataPoint: EmotionDataPoint = {
        timestamp: Date.now(),
        emotions,
        dominantEmotion: emotions[0].name,
        valence: computeValence(emotions),
      };

      this.timeline.push(dataPoint);
      this.onEmotionCallback?.(dataPoint);
    }
  }

  private _buildProsodyData(sentimentSegments: SentimentSegment[]): ProsodyData {
    // Aggregate emotion scores across timeline
    const totals: Record<string, number> = {};
    const count = this.timeline.length || 1;

    for (const point of this.timeline) {
      for (const e of point.emotions) {
        totals[e.name] = (totals[e.name] ?? 0) + e.score;
      }
    }

    const distribution: Record<string, number> = {};
    for (const [name, total] of Object.entries(totals)) {
      distribution[name] = Math.round((total / count) * 1000) / 1000;
    }

    const sorted = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
    const dominantEmotion = sorted[0]?.[0] ?? 'Neutral';

    const avgValence = this.timeline.length > 0
      ? this.timeline.reduce((s, p) => s + p.valence, 0) / this.timeline.length
      : 0;

    const stressIndicators = sorted
      .filter(([name, score]) => NEGATIVE_EMOTIONS.has(name) && score > 0.25)
      .map(([name]) => name);

    // Derive overall sentiment from segments
    const sentCount = { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0 };
    for (const seg of sentimentSegments) sentCount[seg.sentiment]++;
    const total = sentimentSegments.length || 1;
    const posRatio = sentCount.POSITIVE / total;
    const negRatio = sentCount.NEGATIVE / total;
    const overallSentiment: ProsodyData['overallSentiment'] =
      posRatio > 0.6 ? 'positive'
      : negRatio > 0.4 ? 'negative'
      : posRatio > 0.25 && negRatio > 0.25 ? 'mixed'
      : 'neutral';

    return {
      humeTimeline: [...this.timeline],
      sentimentSegments,
      overallSentiment,
      metrics: {
        dominantEmotion,
        emotionDistribution: distribution,
        averageValence: Math.round(avgValence * 1000) / 1000,
        stressIndicators,
        authenticityScore: Math.round(Math.max(0, Math.min(1, 0.65 + avgValence * 0.35)) * 100) / 100,
        confidenceScore: Math.round(Math.max(0, Math.min(1, 0.5 + (1 - (distribution['Anxiety'] ?? 0)) * 0.5)) * 100) / 100,
      },
    };
  }
}

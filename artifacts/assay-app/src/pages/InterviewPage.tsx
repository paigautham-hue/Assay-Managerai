import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { useAssayStore } from '../store/useAssayStore';
import { VoiceVisualizer } from '../components/VoiceVisualizer';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceEngine } from '../lib/voiceEngine';
import type { VoiceEngineCallbacks } from '../lib/voiceEngine';
import { EmotionEngine } from '../lib/emotionEngine';
import type { Observation } from '../types';
import { GATE_DEFINITIONS } from '../lib/gates';

type InterviewStatus = 'connecting' | 'idle' | 'ai_speaking' | 'listening' | 'processing';
type Phase = 'mic_check' | 'interview';
type MicPermission = 'idle' | 'requesting' | 'granted' | 'denied';

const VOICE_ENABLED = import.meta.env.VITE_VOICE_ENABLED === 'true';
const HUME_API_KEY: string | null = import.meta.env.VITE_HUME_API_KEY || null;
const BASE_URL: string = import.meta.env.BASE_URL || '/';

// ─── Mic Check Screen ─────────────────────────────────────────────────────────

function MicCheckScreen({ onConfirm, onSkip }: { onConfirm: () => void; onSkip: () => void }) {
  const [permission, setPermission] = useState<MicPermission>('idle');
  const [micLevel, setMicLevel] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number>(0);

  const requestMic = async () => {
    setPermission('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      setPermission('granted');

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setMicLevel(Math.min(1, avg / 64));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      setPermission('denied');
    }
  };

  const cleanup = () => {
    cancelAnimationFrame(animFrameRef.current);
    audioCtxRef.current?.close().catch(() => {});
    streamRef.current?.getTracks().forEach(t => t.stop());
  };

  const handleConfirm = () => { cleanup(); onConfirm(); };
  const handleSkip = () => { cleanup(); onSkip(); };

  useEffect(() => () => cleanup(), []);

  const bars = Array.from({ length: 20 });

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ background: '#0D0D1A' }}
    >
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-6">🎤</div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
          Microphone Check
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Before starting, let's confirm your microphone is working correctly.
        </p>

        {/* Mic level visualiser */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-end justify-center gap-1 h-16 mb-4">
            {bars.map((_, i) => {
              const threshold = i / bars.length;
              const active = permission === 'granted' && micLevel > threshold;
              return (
                <motion.div
                  key={i}
                  className="rounded-full flex-1"
                  style={{
                    height: `${20 + i * 3}%`,
                    background: active ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)',
                    transition: 'background 0.05s',
                  }}
                />
              );
            })}
          </div>

          {permission === 'idle' && (
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Click below to test your microphone
            </p>
          )}
          {permission === 'requesting' && (
            <p className="text-xs animate-pulse" style={{ color: 'var(--color-text-tertiary)' }}>
              Requesting microphone access...
            </p>
          )}
          {permission === 'granted' && (
            <p className="text-xs" style={{ color: 'var(--color-green)' }}>
              ✓ Microphone is working — speak to test the level
            </p>
          )}
          {permission === 'denied' && (
            <p className="text-xs" style={{ color: 'var(--color-red)' }}>
              ✗ Microphone access denied — check your browser settings
            </p>
          )}
        </div>

        <div className="space-y-3">
          {permission === 'idle' && (
            <motion.button
              onClick={requestMic}
              className="btn btn-primary w-full py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Request Microphone Access
            </motion.button>
          )}

          {permission === 'requesting' && (
            <div
              className="w-full py-3 rounded-lg text-center text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-tertiary)' }}
            >
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2 align-middle" />
              Waiting for permission...
            </div>
          )}

          {permission === 'granted' && (
            <motion.button
              onClick={handleConfirm}
              className="btn btn-primary w-full py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ✓ Microphone Works — Start Interview
            </motion.button>
          )}

          {permission === 'denied' && (
            <>
              <motion.button
                onClick={requestMic}
                className="btn btn-secondary w-full py-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Again
              </motion.button>
            </>
          )}

          <button
            onClick={handleSkip}
            className="text-sm w-full py-2"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Skip mic check and continue anyway →
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── End Interview Modal ──────────────────────────────────────────────────────

function EndInterviewModal({
  onConfirm,
  onCancel,
  isLoading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: '#141425',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
        }}
        initial={{ scale: 0.9, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 24 }}
        transition={{ type: 'spring', damping: 20, stiffness: 280 }}
      >
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🏁</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            End Interview?
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            This will stop the interview and begin generating the full assessment report. This action cannot be undone.
          </p>
        </div>

        <div className="space-y-3">
          <motion.button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-3 rounded-lg font-bold text-sm disabled:opacity-60"
            style={{ background: '#EF4444', color: '#fff' }}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Ending interview...
              </span>
            ) : (
              'End Interview & Generate Report'
            )}
          </motion.button>

          <motion.button
            onClick={onCancel}
            disabled={isLoading}
            className="w-full py-3 rounded-lg font-semibold text-sm"
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--color-text-secondary)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            Continue Interview
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Interview Page ───────────────────────────────────────────────────────────

export function InterviewPage() {
  const [, navigate] = useLocation();
  const { session, addTranscriptEntry, updateSessionStatus, addObservation, setProsodyData, setError } =
    useAssayStore();

  const voiceEngineRef = useRef<VoiceEngine | null>(null);
  const emotionEngineRef = useRef<EmotionEngine | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>('mic_check');
  const [status, setStatus] = useState<InterviewStatus>('connecting');
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isEndingInterview, setIsEndingInterview] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showFlagsPanel, setShowFlagsPanel] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect mobile
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Auto-scroll transcript to bottom when new messages arrive
  useEffect(() => {
    if (phase !== 'interview') return;
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.transcript.length, phase]);

  // Start interview machinery when phase becomes 'interview'
  useEffect(() => {
    if (phase !== 'interview') return;
    if (!session) {
      navigate('/setup');
      return;
    }

    updateSessionStatus('active');

    emotionEngineRef.current = new EmotionEngine(HUME_API_KEY, BASE_URL);
    emotionEngineRef.current.connect().catch(() => {});

    if (VOICE_ENABLED) {
      const callbacks: VoiceEngineCallbacks = {
        onTranscript: addTranscriptEntry,
        onObservation: addObservation,
        onStatusChange: veStatus => {
          if (veStatus === 'connecting') setStatus('connecting');
          else if (veStatus === 'connected') setStatus('idle');
          else if (veStatus === 'speaking') setStatus('ai_speaking');
          else if (veStatus === 'listening') setStatus('listening');
          else if (veStatus === 'processing') setStatus('processing');
          else if (veStatus === 'error') setStatus('idle');
        },
        onError: error => {
          setError(error);
          setStatus('idle');
        },
        onAudioLevel: setAudioLevel,
      };

      voiceEngineRef.current = new VoiceEngine(session.setup, callbacks);
      voiceEngineRef.current.connect().catch(() => setError('Failed to connect to voice system'));
    } else {
      const t1 = setTimeout(() => setStatus('idle'), 1500);
      const t2 = setTimeout(() => {
        setStatus('ai_speaking');
        addTranscriptEntry({
          speaker: 'ai',
          text: `Good morning, ${session.setup.candidateName}. Thank you for taking the time to speak with me today. I'm conducting an AI-assisted assessment for the ${session.setup.roleName} position. Let's dive right in — can you tell me about your most significant leadership accomplishment in your last role?`,
          timestamp: new Date().toISOString(),
        });
        setTimeout(() => setStatus('listening'), 2000);
      }, 2500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    return () => {
      emotionEngineRef.current?.disconnect();
      emotionEngineRef.current = null;
      if (voiceEngineRef.current) {
        voiceEngineRef.current.disconnect();
        voiceEngineRef.current = null;
      }
    };
  }, [phase]);

  // Duration timer — only while interview is running
  useEffect(() => {
    if (phase !== 'interview') return;
    const interval = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (VOICE_ENABLED || phase !== 'interview') return;
    if (status === 'listening') {
      const interval = setInterval(() => setAudioLevel(Math.random() * 0.8 + 0.1), 100);
      return () => clearInterval(interval);
    }
  }, [status, phase]);

  const addAIMessage = useCallback(
    (text: string) => {
      addTranscriptEntry({ speaker: 'ai', text, timestamp: new Date().toISOString() });
    },
    [addTranscriptEntry],
  );

  const addCandidateMessage = useCallback(
    (text: string) => {
      addTranscriptEntry({ speaker: 'candidate', text, timestamp: new Date().toISOString() });
    },
    [addTranscriptEntry],
  );

  const addObservationFlag = useCallback(
    (type: Observation['type'], description: string, gate?: string) => {
      addObservation({
        type,
        gate: gate as Observation['gate'],
        description,
        evidence: description,
        confidence: 0.7,
        timestamp: new Date().toISOString(),
      });
    },
    [addObservation],
  );

  // Demo messages (no-voice mode)
  useEffect(() => {
    if (VOICE_ENABLED || phase !== 'interview') return;
    const timers = [
      setTimeout(() => {
        addCandidateMessage(
          'In my previous role as VP of Operations, I led a company-wide digital transformation initiative. We modernized our entire supply chain, reducing costs by 35% and improving delivery times by 45%. This required managing resistance to change across the organization...',
        );
        setStatus('processing');
      }, 5000),
      setTimeout(() => {
        addObservationFlag('strong_signal', 'Demonstrated quantifiable impact and strategic thinking');
        setStatus('ai_speaking');
        addAIMessage(
          "That's impressive. Can you describe a situation where a critical decision didn't go as planned? How did you handle that?",
        );
        setTimeout(() => setStatus('listening'), 1500);
      }, 12000),
      setTimeout(() => {
        addCandidateMessage(
          'Sure. We invested heavily in a new customer service platform that initially failed to deliver. The implementation was over budget and the adoption rates were low...',
        );
        setStatus('processing');
      }, 20000),
      setTimeout(() => {
        addObservationFlag('strong_signal', 'Shows ownership and accountability', 'accountability');
        setStatus('ai_speaking');
        addAIMessage(
          'Tell me about a time when you had to make a difficult decision that required saying no to something important.',
        );
        setTimeout(() => setStatus('listening'), 1500);
      }, 27000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const handleEndInterview = async () => {
    if (!session) return;
    setIsEndingInterview(true);
    setShowEndModal(false);

    try {
      if (voiceEngineRef.current) {
        await voiceEngineRef.current.disconnect();
        voiceEngineRef.current = null;
      }

      if (emotionEngineRef.current) {
        const engine = emotionEngineRef.current;
        emotionEngineRef.current = null;

        try {
          const prosody = await Promise.race([
            engine.analyzeTranscriptSentiment(session.transcript),
            new Promise<null>(resolve => setTimeout(() => resolve(null), 8000)),
          ]);

          if (!prosody) {
            const humeOnly = engine.getProsodyData();
            if (humeOnly) setProsodyData(humeOnly);
          } else {
            setProsodyData(prosody);
          }
        } catch {
        } finally {
          engine.disconnect();
        }
      }

      updateSessionStatus('completed');
      navigate('/processing');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error ending interview.');
      setIsEndingInterview(false);
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const statusDotColor = {
    ai_speaking: 'var(--color-gold)',
    listening: 'var(--color-blue)',
    processing: 'var(--color-text-tertiary)',
    idle: 'var(--color-green)',
    connecting: 'var(--color-text-tertiary)',
  }[status];

  const statusLabel = {
    ai_speaking: 'AI Speaking',
    listening: 'Listening',
    processing: 'Processing Response',
    connecting: 'Connecting...',
    idle: 'Idle',
  }[status];

  // ── Mic check phase ────────────────────────────────────────────────────────
  if (phase === 'mic_check') {
    return (
      <MicCheckScreen
        onConfirm={() => setPhase('interview')}
        onSkip={() => setPhase('interview')}
      />
    );
  }

  // ── Observations sidebar content (shared between desktop & mobile sheet) ───
  const observationsContent = (
    <div className="p-6 space-y-6">
      {session?.observations && session.observations.length > 0 ? (
        <>
          {(['red_flag', 'strong_signal', 'gate_signal'] as const).map(type => {
            const obs = session.observations.filter(o => o.type === type);
            if (!obs.length) return null;
            const config = {
              red_flag: { icon: '🚩', label: 'Red Flags', color: 'var(--color-red)', bg: 'rgba(248,113,113,0.1)' },
              strong_signal: { icon: '✓', label: 'Strong Signals', color: 'var(--color-green)', bg: 'rgba(52,211,153,0.1)' },
              gate_signal: { icon: '⚡', label: 'Gate Signals', color: 'var(--color-amber)', bg: 'rgba(251,191,36,0.1)' },
            }[type];
            return (
              <div key={type}>
                <h3
                  className="text-sm font-bold mb-3 uppercase tracking-wide"
                  style={{ color: config.color }}
                >
                  {config.icon} {config.label} ({obs.length})
                </h3>
                <div className="space-y-2">
                  {obs.map(o => (
                    <motion.div
                      key={o.id}
                      className="rounded p-3 text-xs leading-relaxed"
                      style={{
                        background: config.bg,
                        color: config.color,
                        border: `1px solid ${config.color}30`,
                      }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {o.description}
                      {o.gate && (
                        <span className="block font-semibold mt-1">
                          Gate: {GATE_DEFINITIONS[o.gate as keyof typeof GATE_DEFINITIONS]?.displayName ?? o.gate}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Observations will appear here during the interview
          </p>
        </div>
      )}
    </div>
  );

  const observationsHeader = (
    <div
      className="sticky top-0 px-6 py-4 flex items-center justify-between z-10"
      style={{ background: 'rgba(20,20,37,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <h2 className="heading-sm" style={{ color: 'var(--color-text-primary)' }}>
        Observations{session?.observations.length ? ` (${session.observations.length})` : ''}
      </h2>
      <button onClick={() => setShowFlagsPanel(false)} style={{ color: 'var(--color-text-secondary)' }}>
        ✕
      </button>
    </div>
  );

  // ── Interview UI ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen overflow-hidden" style={{ background: '#0D0D1A' }}>
      {/* Header */}
      <motion.div
        className="border-b px-4 sm:px-6 py-4 flex items-center justify-between"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(13,13,26,0.95)' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>
            {session?.setup.candidateName} · {session?.setup.roleName}
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            Mode:{' '}
            <span className="text-gold font-semibold">
              {session?.setup.interviewMode === 'active' ? 'AI-Led' : 'Shadow'}
            </span>
          </p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-2xl sm:text-3xl font-bold text-gold">{formatTime(duration)}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
            Duration
          </p>
        </div>
      </motion.div>

      {/* Body */}
      <div
        className="flex relative"
        style={{ height: 'calc(100vh - 72px)' }}
      >
        {/* Main area */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 py-6 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Visualizer */}
          <div className="mb-8 mt-2">
            <VoiceVisualizer
              status={
                status === 'ai_speaking'
                  ? 'speaking'
                  : status === 'listening'
                  ? 'listening'
                  : status === 'processing'
                  ? 'processing'
                  : 'idle'
              }
              audioLevel={audioLevel}
            />
          </div>

          {/* Status pill */}
          <motion.div className="mb-6" key={status} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse-subtle"
                style={{ background: statusDotColor }}
              />
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {statusLabel}
              </span>
            </div>
          </motion.div>

          {/* Transcript */}
          <div
            className="w-full max-w-2xl rounded-xl overflow-y-auto p-4 sm:p-6 mb-6 space-y-4"
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.06)',
              height: isMobile ? '40vh' : '24rem',
            }}
          >
            <AnimatePresence mode="popLayout">
              {!session?.transcript.length ? (
                <motion.div
                  className="flex items-center justify-center h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                    Interview transcript will appear here...
                  </p>
                </motion.div>
              ) : (
                session?.transcript.map((entry, idx) => (
                  <motion.div
                    key={`${entry.speaker}-${idx}`}
                    className="text-sm leading-relaxed rounded p-3"
                    style={{
                      color:
                        entry.speaker === 'ai'
                          ? 'var(--color-text-secondary)'
                          : 'var(--color-text-primary)',
                      background:
                        entry.speaker === 'ai' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.03)',
                      borderLeft: `2px solid ${
                        entry.speaker === 'ai' ? 'var(--color-gold)' : 'var(--color-blue)'
                      }`,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span
                      className="font-semibold text-xs uppercase tracking-wide block mb-2"
                      style={{
                        color:
                          entry.speaker === 'ai' ? 'var(--color-gold)' : 'var(--color-blue)',
                      }}
                    >
                      {entry.speaker === 'ai' ? '🤖 AI Interviewer' : '👤 Candidate'}
                    </span>
                    <p>{entry.text}</p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            {/* Auto-scroll anchor */}
            <div ref={transcriptEndRef} />
          </div>

          {/* End interview button */}
          <motion.button
            onClick={() => setShowEndModal(true)}
            disabled={isEndingInterview}
            className="btn btn-danger px-8 py-3 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEndingInterview ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin-slow" />
                Ending Interview...
              </span>
            ) : (
              'End Interview & Generate Report'
            )}
          </motion.button>

          {/* Mobile observations toggle */}
          {isMobile && !showFlagsPanel && (
            <motion.button
              onClick={() => setShowFlagsPanel(true)}
              className="mt-4 rounded-full px-5 py-2 text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-secondary)' }}
              whileHover={{ scale: 1.05 }}
            >
              👁️ Show Observations{session?.observations.length ? ` (${session.observations.length})` : ''}
            </motion.button>
          )}
        </motion.div>

        {/* Desktop sidebar */}
        {!isMobile && showFlagsPanel && (
          <motion.div
            className="w-80 overflow-y-auto flex-shrink-0"
            style={{
              background: 'var(--color-surface)',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
            }}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {observationsHeader}
            {observationsContent}
          </motion.div>
        )}

        {/* Desktop re-open button */}
        {!isMobile && !showFlagsPanel && (
          <motion.button
            onClick={() => setShowFlagsPanel(true)}
            className="fixed right-4 bottom-6 rounded-full p-3 font-bold z-50"
            style={{ background: 'var(--color-gold)', color: '#0D0D1A' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            👁️
          </motion.button>
        )}
      </div>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {isMobile && showFlagsPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-30"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFlagsPanel(false)}
            />

            {/* Sheet */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-40 rounded-t-2xl overflow-hidden"
              style={{
                background: 'var(--color-surface)',
                maxHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.18)' }}
                />
              </div>

              {/* Header */}
              <div
                className="px-6 py-3 flex items-center justify-between flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <h2 className="heading-sm" style={{ color: 'var(--color-text-primary)' }}>
                  Observations{session?.observations.length ? ` (${session.observations.length})` : ''}
                </h2>
                <button
                  onClick={() => setShowFlagsPanel(false)}
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  ✕
                </button>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto flex-1">{observationsContent}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* End interview modal */}
      <AnimatePresence>
        {showEndModal && (
          <EndInterviewModal
            onConfirm={handleEndInterview}
            onCancel={() => setShowEndModal(false)}
            isLoading={isEndingInterview}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

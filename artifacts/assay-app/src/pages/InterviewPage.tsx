import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { useAssayStore } from '../store/useAssayStore';
import { VoiceVisualizer } from '../components/VoiceVisualizer';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceEngine } from '../lib/voiceEngine';
import type { VoiceEngineCallbacks } from '../lib/voiceEngine';
import type { Observation } from '../types';

type InterviewStatus = 'connecting' | 'idle' | 'ai_speaking' | 'listening' | 'processing';

const VOICE_ENABLED = import.meta.env.VITE_VOICE_ENABLED === 'true';

export function InterviewPage() {
  const [, navigate] = useLocation();
  const { session, addTranscriptEntry, updateSessionStatus, addObservation, setError } = useAssayStore();
  const voiceEngineRef = useRef<VoiceEngine | null>(null);

  const [status, setStatus] = useState<InterviewStatus>('connecting');
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isEndingInterview, setIsEndingInterview] = useState(false);
  const [showFlagsPanel, setShowFlagsPanel] = useState(true);

  useEffect(() => {
    if (!session) {
      navigate('/setup');
      return;
    }

    updateSessionStatus('active');

    if (VOICE_ENABLED) {
      const callbacks: VoiceEngineCallbacks = {
        onTranscript: addTranscriptEntry,
        onObservation: addObservation,
        onStatusChange: (veStatus) => {
          if (veStatus === 'connecting') setStatus('connecting');
          else if (veStatus === 'connected') setStatus('idle');
          else if (veStatus === 'speaking') setStatus('ai_speaking');
          else if (veStatus === 'listening') setStatus('listening');
          else if (veStatus === 'processing') setStatus('processing');
          else if (veStatus === 'error') setStatus('idle');
        },
        onError: (error) => { setError(error); setStatus('idle'); },
        onAudioLevel: setAudioLevel,
      };

      voiceEngineRef.current = new VoiceEngine(session.setup, callbacks);
      voiceEngineRef.current.connect().catch(() => setError('Failed to connect to voice system'));
    } else {
      const t1 = setTimeout(() => setStatus('idle'), 1500);
      const t2 = setTimeout(() => {
        setStatus('ai_speaking');
        addTranscriptEntry({ speaker: 'ai', text: `Good morning, ${session.setup.candidateName}. Thank you for taking the time to speak with me today. I'm conducting an AI-assisted assessment for the ${session.setup.roleName} position. Let's dive right in — can you tell me about your most significant leadership accomplishment in your last role?`, timestamp: new Date().toISOString() });
        setTimeout(() => setStatus('listening'), 2000);
      }, 2500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }

    return () => {
      if (voiceEngineRef.current) {
        voiceEngineRef.current.disconnect();
        voiceEngineRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!VOICE_ENABLED) return;
    if (status === 'listening') {
      const interval = setInterval(() => setAudioLevel(Math.random() * 0.8 + 0.1), 100);
      return () => clearInterval(interval);
    }
  }, [status]);

  const addAIMessage = useCallback((text: string) => {
    addTranscriptEntry({ speaker: 'ai', text, timestamp: new Date().toISOString() });
  }, [addTranscriptEntry]);

  const addCandidateMessage = useCallback((text: string) => {
    addTranscriptEntry({ speaker: 'candidate', text, timestamp: new Date().toISOString() });
  }, [addTranscriptEntry]);

  const addObservationFlag = useCallback((type: Observation['type'], description: string, gate?: string) => {
    addObservation({ type, gate: gate as Observation['gate'], description, evidence: description, confidence: 0.7, timestamp: new Date().toISOString() });
  }, [addObservation]);

  useEffect(() => {
    if (VOICE_ENABLED) return;
    const timers = [
      setTimeout(() => { addCandidateMessage('In my previous role as VP of Operations, I led a company-wide digital transformation initiative. We modernized our entire supply chain, reducing costs by 35% and improving delivery times by 45%. This required managing resistance to change across the organization...'); setStatus('processing'); }, 5000),
      setTimeout(() => { addObservationFlag('strong_signal', 'Demonstrated quantifiable impact and strategic thinking'); setStatus('ai_speaking'); addAIMessage("That's impressive. Can you describe a situation where a critical decision didn't go as planned? How did you handle that?"); setTimeout(() => setStatus('listening'), 1500); }, 12000),
      setTimeout(() => { addCandidateMessage('Sure. We invested heavily in a new customer service platform that initially failed to deliver. The implementation was over budget and the adoption rates were low...'); setStatus('processing'); }, 20000),
      setTimeout(() => { addObservationFlag('strong_signal', 'Shows ownership and accountability', 'accountability'); setStatus('ai_speaking'); addAIMessage('Tell me about a time when you had to make a difficult decision that required saying no to something important.'); setTimeout(() => setStatus('listening'), 1500); }, 27000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleEndInterview = async () => {
    if (!confirm('Are you sure you want to end the interview? This cannot be undone.')) return;
    if (!session) return;

    setIsEndingInterview(true);

    try {
      // Disconnect voice engine
      if (voiceEngineRef.current) {
        await voiceEngineRef.current.disconnect();
        voiceEngineRef.current = null;
      }

      // Mark session complete
      updateSessionStatus('completed');

      // Navigate immediately to processing page — it will trigger assessment
      navigate('/processing');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error ending interview.');
      setIsEndingInterview(false);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

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

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: '#0D0D1A' }}>
      <motion.div
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(13,13,26,0.95)' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {session?.setup.candidateName} • {session?.setup.roleName}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Mode: <span className="text-gold font-semibold">{session?.setup.interviewMode === 'active' ? 'AI-Led' : 'Shadow'}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gold">{formatTime(duration)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Interview Duration</p>
        </div>
      </motion.div>

      <div className="flex" style={{ height: 'calc(100vh - 80px)' }}>
        <motion.div
          className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-12">
            <VoiceVisualizer
              status={status === 'ai_speaking' ? 'speaking' : status === 'listening' ? 'listening' : status === 'processing' ? 'processing' : 'idle'}
              audioLevel={audioLevel}
            />
          </div>

          <motion.div className="mb-8" key={status} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse-subtle" style={{ background: statusDotColor }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{statusLabel}</span>
            </div>
          </motion.div>

          <div className="w-full max-w-2xl h-96 rounded-xl overflow-y-auto p-6 mb-8 space-y-4" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <AnimatePresence mode="popLayout">
              {!session?.transcript.length ? (
                <motion.div className="flex items-center justify-center h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Interview transcript will appear here...</p>
                </motion.div>
              ) : (
                session?.transcript.map((entry, idx) => (
                  <motion.div
                    key={`${entry.speaker}-${idx}`}
                    className="text-sm leading-relaxed rounded p-3"
                    style={{
                      color: entry.speaker === 'ai' ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                      background: entry.speaker === 'ai' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.03)',
                      borderLeft: `2px solid ${entry.speaker === 'ai' ? 'var(--color-gold)' : 'var(--color-blue)'}`,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="font-semibold text-xs uppercase tracking-wide block mb-2" style={{ color: entry.speaker === 'ai' ? 'var(--color-gold)' : 'var(--color-blue)' }}>
                      {entry.speaker === 'ai' ? '🤖 AI Interviewer' : '👤 Candidate'}
                    </span>
                    <p>{entry.text}</p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={handleEndInterview}
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
            ) : 'End Interview & Generate Report'}
          </motion.button>
        </motion.div>

        <motion.div
          className="w-80 overflow-y-auto"
          style={{
            background: 'var(--color-surface)',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            display: showFlagsPanel ? 'block' : 'none',
          }}
        >
          <div className="sticky top-0 px-6 py-4 flex items-center justify-between z-10" style={{ background: 'rgba(20,20,37,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="heading-sm" style={{ color: 'var(--color-text-primary)' }}>Observations</h2>
            <button onClick={() => setShowFlagsPanel(false)} style={{ color: 'var(--color-text-secondary)' }}>✕</button>
          </div>

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
                      <h3 className="text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: config.color }}>
                        {config.icon} {config.label} ({obs.length})
                      </h3>
                      <div className="space-y-2">
                        {obs.map(o => (
                          <motion.div
                            key={o.id}
                            className="rounded p-3 text-xs leading-relaxed"
                            style={{ background: config.bg, color: config.color, border: `1px solid ${config.color}30` }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            {o.description}
                            {o.gate && <span className="block font-semibold mt-1">Gate: {o.gate}</span>}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Observations will appear here during the interview</p>
              </div>
            )}
          </div>
        </motion.div>

        {!showFlagsPanel && (
          <motion.button
            onClick={() => setShowFlagsPanel(true)}
            className="fixed right-4 bottom-4 rounded-full p-3 font-bold z-50"
            style={{ background: 'var(--color-gold)', color: '#0D0D1A' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            👁️
          </motion.button>
        )}
      </div>
    </div>
  );
}

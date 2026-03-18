import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useAssayStore } from '../store/useAssayStore';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL || '/';
const apiUrl = (path: string) => `${BASE_URL}api/${path}`;

type AssessorState = 'pending' | 'active' | 'complete' | 'error';

interface AssessorDisplay {
  role: string;
  displayName: string;
  icon: string;
  subtitle: string;
}

const ASSESSORS: AssessorDisplay[] = [
  { role: 'advocate',     displayName: 'The Advocate',     icon: '🤝', subtitle: 'Reviewing strengths and potential...' },
  { role: 'prosecutor',   displayName: 'The Prosecutor',   icon: '⚖️', subtitle: 'Testing weaknesses and concerns...' },
  { role: 'psychologist', displayName: 'The Psychologist', icon: '🧠', subtitle: 'Analyzing behavioral patterns...' },
  { role: 'operator',     displayName: 'The Operator',     icon: '⚙️', subtitle: 'Evaluating execution capabilities...' },
  { role: 'culture_probe',displayName: 'The Culture Probe',icon: '🌍', subtitle: 'Assessing organizational fit...' },
  { role: 'chairman',     displayName: 'The Chairman',     icon: '👑', subtitle: 'Synthesizing the final verdict...' },
];

interface AssessorStatus {
  state: AssessorState;
  duration?: number;
  startedAt?: number;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function ElapsedTimer({ startedAt }: { startedAt: number }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setElapsed(Date.now() - startedAt), 100);
    return () => clearInterval(interval);
  }, [startedAt]);
  return <span>{formatDuration(elapsed)}</span>;
}

export function ProcessingPage() {
  const [, navigate] = useLocation();
  const { session, setReport, setError } = useAssayStore();
  const abortRef = useRef(false);

  const [assessorStatuses, setAssessorStatuses] = useState<Record<string, AssessorStatus>>(() =>
    Object.fromEntries(ASSESSORS.map(a => [a.role, { state: 'pending' as AssessorState }]))
  );
  const [phase, setPhase] = useState<'running' | 'complete' | 'error'>('running');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const updateAssessor = (role: string, update: Partial<AssessorStatus>) => {
    setAssessorStatuses(prev => ({ ...prev, [role]: { ...prev[role], ...update } }));
  };

  useEffect(() => {
    if (!session) {
      navigate('/');
      return;
    }

    abortRef.current = false;

    const runStream = async () => {
      let response: Response;
      try {
        response = await fetch(apiUrl('assess/stream'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            transcript: session.transcript,
            setup: session.setup,
            observations: session.observations,
            sessionId: session.id,
          }),
        });
      } catch (err) {
        setErrorMessage('Failed to connect to assessment server. Please try again.');
        setPhase('error');
        return;
      }

      if (!response.ok) {
        setErrorMessage(`Assessment server returned ${response.status}. Please try again.`);
        setPhase('error');
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const handleEvent = (eventType: string, data: any) => {
        if (abortRef.current) return;

        switch (eventType) {
          case 'assessor_start':
            updateAssessor(data.role, { state: 'active', startedAt: Date.now() });
            break;

          case 'assessor_complete':
            updateAssessor(data.role, { state: 'complete', duration: data.duration });
            break;

          case 'assessor_error':
            updateAssessor(data.role, { state: 'error', duration: data.duration });
            break;

          case 'chairman_start':
            updateAssessor('chairman', { state: 'active', startedAt: Date.now() });
            break;

          case 'chairman_complete':
            updateAssessor('chairman', { state: 'complete', duration: data.duration });
            break;

          case 'report_complete': {
            setReport(data.report);
            setPhase('complete');
            setIsRedirecting(true);
            setTimeout(() => {
              if (!abortRef.current) navigate(`/report/${data.reportId}`);
            }, 1800);
            break;
          }

          case 'error':
            setErrorMessage(data.message || 'An unknown error occurred during assessment.');
            setPhase('error');
            break;
        }
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done || abortRef.current) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() ?? '';

          for (const part of parts) {
            if (!part.trim()) continue;
            let eventType = 'message';
            let dataStr = '';
            for (const line of part.split('\n')) {
              if (line.startsWith('event: ')) eventType = line.slice(7).trim();
              else if (line.startsWith('data: ')) dataStr = line.slice(6).trim();
            }
            if (!dataStr) continue;
            try {
              const parsed = JSON.parse(dataStr);
              handleEvent(eventType, parsed);
            } catch {
              console.warn('Failed to parse SSE data:', dataStr);
            }
          }
        }
      } catch (err) {
        if (!abortRef.current) {
          setErrorMessage('Connection to assessment server was interrupted.');
          setPhase('error');
        }
      }
    };

    runStream();

    return () => {
      abortRef.current = true;
    };
  }, []);

  const completedCount = Object.values(assessorStatuses).filter(s => s.state === 'complete').length;
  const totalAssessors = ASSESSORS.length;
  const progressPercent = Math.round((completedCount / totalAssessors) * 100);

  return (
    <div className="bg-gradient-dark min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-5 rounded-full blur-3xl animate-spin-slow" style={{ background: 'var(--color-gold)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 opacity-5 rounded-full blur-3xl animate-spin-slow" style={{ background: '#60A5FA', animationDirection: 'reverse' }} />
      </div>

      <motion.div
        className="relative z-10 max-w-2xl w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="heading-xl mb-3" style={{ color: '#F0F0F5' }}>
            The Assay Chamber is{' '}
            <span className="text-gold">Deliberating</span>
          </h1>
          <p className="body-lg" style={{ color: 'var(--color-text-secondary)' }}>
            {session?.setup.candidateName} · {session?.setup.roleName}
          </p>
        </div>

        {/* Progress bar */}
        {phase === 'running' && (
          <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
              <span>{completedCount} of {totalAssessors} assessors complete</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--color-gold)' }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>
        )}

        {/* Assessor list */}
        <div className="space-y-3 mb-10">
          {ASSESSORS.map((assessor, index) => {
            const status = assessorStatuses[assessor.role] ?? { state: 'pending' };
            const isActive = status.state === 'active';
            const isDone = status.state === 'complete';
            const isError = status.state === 'error';

            return (
              <motion.div
                key={assessor.role}
                className="relative flex items-center gap-4 p-4 rounded-xl transition-all duration-500"
                style={{
                  background: isActive ? 'rgba(201,168,76,0.12)' : isDone ? 'rgba(52,211,153,0.08)' : isError ? 'rgba(248,113,113,0.08)' : 'rgba(0,0,0,0.2)',
                  border: `1px solid ${isActive ? 'rgba(201,168,76,0.45)' : isDone ? 'rgba(52,211,153,0.35)' : isError ? 'rgba(248,113,113,0.35)' : 'rgba(255,255,255,0.06)'}`,
                  opacity: status.state === 'pending' ? 0.45 : 1,
                }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: status.state === 'pending' ? 0.45 : 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.35 }}
              >
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.div
                        key="active"
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ background: 'rgba(201,168,76,0.25)', boxShadow: '0 0 16px rgba(201,168,76,0.4)' }}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                      >
                        {assessor.icon}
                      </motion.div>
                    ) : isDone ? (
                      <motion.div
                        key="done"
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                        style={{ background: 'var(--color-green)', color: '#0D0D1A' }}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                      >
                        ✓
                      </motion.div>
                    ) : isError ? (
                      <motion.div
                        key="error"
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                        style={{ background: 'rgba(248,113,113,0.2)', color: '#F87171' }}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                      >
                        ✕
                      </motion.div>
                    ) : (
                      <motion.div
                        key="pending"
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      >
                        {assessor.icon}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Name + subtitle */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base" style={{
                    color: isActive ? 'var(--color-gold)' : isDone ? 'var(--color-green)' : isError ? '#F87171' : 'var(--color-text-tertiary)',
                  }}>
                    {assessor.displayName}
                  </h3>
                  <p className="text-sm truncate" style={{ color: isActive ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)' }}>
                    {isActive ? assessor.subtitle : isDone ? 'Assessment complete' : isError ? 'Assessment failed — skipped' : 'Waiting...'}
                  </p>
                </div>

                {/* Timing / spinner */}
                <div className="flex-shrink-0 text-right">
                  {isActive && status.startedAt && (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(dot => (
                          <motion.div
                            key={dot}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: 'var(--color-gold)' }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, delay: dot * 0.25, repeat: Infinity }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-mono" style={{ color: 'var(--color-gold)' }}>
                        <ElapsedTimer startedAt={status.startedAt} />
                      </span>
                    </div>
                  )}
                  {(isDone || isError) && status.duration !== undefined && (
                    <span className="text-xs font-mono" style={{ color: isDone ? 'var(--color-green)' : '#F87171', opacity: 0.8 }}>
                      {formatDuration(status.duration)}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Complete / error banners */}
        <AnimatePresence>
          {phase === 'complete' && (
            <motion.div
              className="rounded-xl p-6 text-center"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.5)' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg font-bold text-gold mb-1">Deliberation Complete</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {isRedirecting ? 'Redirecting to your assessment report...' : 'Generating comprehensive report...'}
              </p>
            </motion.div>
          )}

          {phase === 'error' && (
            <motion.div
              className="rounded-xl p-6 text-center"
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.4)' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-lg font-bold mb-2" style={{ color: '#F87171' }}>Assessment Error</p>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                {errorMessage || 'An error occurred during the assessment process.'}
              </p>
              <button
                onClick={() => navigate('/')}
                className="btn btn-secondary text-sm px-6 py-2"
              >
                Return to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom pulse */}
      {phase === 'running' && (
        <motion.div
          className="absolute bottom-8 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex gap-1">
            {[0, 1, 2].map(dot => (
              <motion.div
                key={dot}
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: 'var(--color-gold)' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1, delay: dot * 0.15, repeat: Infinity }}
              />
            ))}
          </div>
          <span className="text-sm ml-2" style={{ color: 'var(--color-text-secondary)' }}>
            Running parallel assessment...
          </span>
        </motion.div>
      )}
    </div>
  );
}

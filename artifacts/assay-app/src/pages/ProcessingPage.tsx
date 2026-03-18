import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAssayStore } from '../store/useAssayStore';
import { motion } from 'framer-motion';

const DELIBERATION_STEPS = [
  { name: 'The Advocate', subtitle: 'Reviewing strengths and potential...', icon: '🤝' },
  { name: 'The Prosecutor', subtitle: 'Testing weaknesses and concerns...', icon: '⚖️' },
  { name: 'The Psychologist', subtitle: 'Analyzing behavioral patterns...', icon: '🧠' },
  { name: 'The Operator', subtitle: 'Evaluating execution capabilities...', icon: '⚙️' },
  { name: 'The Culture Probe', subtitle: 'Assessing organizational fit...', icon: '🌍' },
  { name: 'The Chairman', subtitle: 'Synthesizing the verdict...', icon: '👑' },
];

export function ProcessingPage() {
  const [, navigate] = useLocation();
  const { reports } = useAssayStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      idx++;
      if (idx >= DELIBERATION_STEPS.length) {
        clearInterval(timer);
        setDone(true);
        setCurrentStep(DELIBERATION_STEPS.length - 1);
        setTimeout(() => {
          if (reports.length > 0) {
            navigate(`/report/${reports[reports.length - 1].id}`);
          } else {
            navigate('/');
          }
        }, 2000);
      } else {
        setCurrentStep(idx);
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [navigate, reports]);

  return (
    <div className="bg-gradient-dark min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-5 rounded-full blur-3xl animate-spin-slow" style={{ background: 'var(--color-gold)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 opacity-5 rounded-full blur-3xl animate-spin-slow" style={{ background: '#60A5FA', animationDirection: 'reverse' }} />
      </div>

      <motion.div
        className="relative z-10 max-w-2xl w-full text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="heading-xl mb-4" style={{ color: '#F0F0F5' }}>
          The Assay Chamber is{' '}
          <span className="text-gold">Deliberating</span>
        </h1>
        <p className="body-lg mb-16">Six specialized perspectives are analyzing your candidate</p>

        <div className="space-y-4 mb-16">
          {DELIBERATION_STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isStepDone = index < currentStep;

            return (
              <motion.div
                key={step.name}
                className={`relative flex items-center gap-4 p-4 rounded-lg transition-all duration-500`}
                style={{
                  background: isActive ? 'rgba(201, 168, 76, 0.15)' : isStepDone ? 'rgba(52, 211, 153, 0.1)' : 'rgba(0,0,0,0.2)',
                  border: `1px solid ${isActive ? 'rgba(201,168,76,0.5)' : isStepDone ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  opacity: isActive ? 1 : isStepDone ? 0.7 : 0.4,
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isActive ? 1 : isStepDone ? 0.7 : 0.4, x: 0 }}
                transition={{ delay: index * 0.15, duration: 0.4 }}
              >
                <div className="relative flex-shrink-0">
                  {isActive ? (
                    <motion.div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl animate-pulse-ring"
                      style={{ background: 'var(--color-gold)' }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      {step.icon}
                    </motion.div>
                  ) : isStepDone ? (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ background: 'var(--color-green)', color: '#0D0D1A', fontWeight: 'bold' }}>
                      ✓
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: '#334155', opacity: 0.5 }}>
                      {step.icon}
                    </div>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg mb-1" style={{ color: isActive ? 'var(--color-gold)' : isStepDone ? 'var(--color-green)' : 'var(--color-text-tertiary)' }}>
                    {step.name}
                  </h3>
                  <p className="text-sm" style={{ color: isActive ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)' }}>
                    {step.subtitle}
                  </p>
                </div>

                {isActive && (
                  <motion.div className="absolute right-4 flex gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'var(--color-gold)' }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, delay: dot * 0.2, repeat: Infinity }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {done && (
          <motion.div
            className="rounded-lg p-6 text-center"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.5)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg font-bold text-gold mb-2">Deliberation Complete</p>
            <p style={{ color: 'var(--color-text-secondary)' }}>Generating your comprehensive assessment report...</p>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="absolute bottom-8 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: 'var(--color-gold)' }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1, delay: dot * 0.15, repeat: Infinity }}
            />
          ))}
        </div>
        <span className="text-sm ml-2" style={{ color: 'var(--color-text-secondary)' }}>Processing assessment...</span>
      </motion.div>
    </div>
  );
}

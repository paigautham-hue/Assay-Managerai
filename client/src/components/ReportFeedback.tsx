import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_URL: string = import.meta.env.BASE_URL || '/';

interface ReportFeedbackProps {
  reportId: string;
}

const ACCURACY_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
const OUTCOME_OPTIONS = [
  { value: 'hired', label: 'Hired', icon: '✅' },
  { value: 'rejected', label: 'Rejected', icon: '❌' },
  { value: 'withdrew', label: 'Candidate Withdrew', icon: '🚪' },
  { value: 'pending', label: 'Decision Pending', icon: '⏳' },
];

export function ReportFeedback({ reportId }: ReportFeedbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [outcome, setOutcome] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (accuracy === 0) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          reportId,
          overallAccuracy: accuracy,
          hireOutcome: outcome || undefined,
          comments: comments.trim() || undefined,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({ error: 'Failed to submit' }));
        setError(data.error || 'Failed to submit feedback');
      }
    } catch (e) {
      setError('Network error — please try again');
      console.warn('Failed to submit feedback:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="rounded-xl p-6 text-center"
        style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-3xl mb-2">🧠</div>
        <p className="text-sm font-semibold" style={{ color: 'var(--color-green)' }}>
          Feedback Recorded — ASSAY is Learning
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
          Your feedback helps calibrate future assessments for greater accuracy.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <button
        onClick={() => setIsOpen(o => !o)}
        className="w-full px-6 py-4 flex items-center justify-between min-h-[44px] hover:bg-white/[0.02] active:bg-white/[0.04] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🧠</span>
          <div className="text-left">
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Rate This Assessment
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Help ASSAY learn and improve accuracy
            </p>
          </div>
        </div>
        <span
          className="text-lg transition-transform"
          style={{ color: 'var(--color-text-tertiary)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▾
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Accuracy Rating */}
              <div className="pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                  How accurate was this assessment?
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setAccuracy(n)}
                      className="flex-1 py-3 rounded-lg text-sm font-semibold transition-all min-h-[44px] active:scale-95"
                      style={{
                        background: accuracy === n ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)',
                        color: accuracy === n ? 'var(--color-gold)' : 'var(--color-text-tertiary)',
                        border: `1px solid ${accuracy === n ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {accuracy > 0 && (
                  <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--color-gold)' }}>
                    {ACCURACY_LABELS[accuracy]}
                  </p>
                )}
              </div>

              {/* Hire Outcome */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                  What was the hiring outcome?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {OUTCOME_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setOutcome(opt.value)}
                      className="py-2.5 px-3 rounded-lg text-xs font-medium flex items-center gap-2 transition-all min-h-[44px] active:scale-95"
                      style={{
                        background: outcome === opt.value ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                        color: outcome === opt.value ? 'var(--color-gold)' : 'var(--color-text-tertiary)',
                        border: `1px solid ${outcome === opt.value ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      <span>{opt.icon}</span> {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Additional Notes (optional)
                </p>
                <textarea
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  placeholder="e.g., 'The character assessment was spot on but domain expertise was underrated'"
                  className="w-full rounded-lg p-3 text-sm resize-none"
                  rows={3}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--color-text-primary)',
                    fontSize: 16, // prevents iOS zoom
                  }}
                />
              </div>

              {/* Error message */}
              {error && (
                <div
                  className="rounded-lg px-4 py-3 text-xs"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={accuracy === 0 || isSubmitting}
                className="w-full py-3 rounded-lg text-sm font-bold min-h-[44px] transition-all disabled:opacity-40"
                style={{
                  background: accuracy > 0 ? 'var(--color-gold)' : 'rgba(255,255,255,0.06)',
                  color: accuracy > 0 ? '#0D0D1A' : 'var(--color-text-tertiary)',
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

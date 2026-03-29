import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL || '/';
const apiUrl = (path: string) => `${BASE_URL}api/${path}`;

interface Question {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'rating' | 'select';
  scale?: number;
  options?: string[];
}

export function ReferenceFormPage() {
  const [, params] = useRoute('/reference/:token');
  const token = params?.token;

  const [formData, setFormData] = useState<{ candidateName: string; refereeName: string; questions: Question[] } | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch(apiUrl(`public/reference/${token}`))
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Form not found');
          return;
        }
        setFormData(await res.json());
      })
      .catch(() => setError('Failed to load form'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl(`public/reference/${token}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Submission failed');
      }
    } catch {
      setError('Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: '#1a1a2e',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#e2e8f0',
    fontSize: '0.875rem',
    width: '100%',
    outline: 'none',
    minHeight: 44,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D1A' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0D0D1A' }}>
        <motion.div
          className="max-w-md w-full text-center p-8 rounded-2xl"
          style={{ background: '#141428', border: '1px solid rgba(255,255,255,0.08)' }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-5xl mb-4">&#10003;</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#e2e8f0' }}>Thank You</h1>
          <p className="text-sm" style={{ color: '#8B8B9E' }}>
            Your reference has been submitted successfully. Your responses will help in the assessment process.
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0D0D1A' }}>
        <div className="max-w-md w-full text-center p-8 rounded-2xl" style={{ background: '#141428', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-4xl mb-4">&#9888;</div>
          <h1 className="text-xl font-bold mb-2" style={{ color: '#e2e8f0' }}>Unable to Load Form</h1>
          <p className="text-sm" style={{ color: '#8B8B9E' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: '#0D0D1A' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C9A84C, #D4B96A)' }}>
            <span className="text-2xl font-bold" style={{ color: '#0D0D1A' }}>A</span>
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#e2e8f0' }}>Reference for {formData.candidateName}</h1>
          <p className="text-sm" style={{ color: '#8B8B9E' }}>
            Hello {formData.refereeName}, please provide your honest assessment below.
          </p>
        </motion.div>

        {/* Questions */}
        <div className="space-y-6">
          {formData.questions.map((q, i) => (
            <motion.div
              key={q.id}
              className="rounded-xl p-5"
              style={{ background: '#141428', border: '1px solid rgba(255,255,255,0.06)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <label className="block text-sm font-medium mb-3" style={{ color: '#e2e8f0' }}>
                {i + 1}. {q.question}
              </label>

              {q.type === 'text' && (
                <input
                  style={inputStyle}
                  value={responses[q.id] || ''}
                  onChange={e => setResponses(p => ({ ...p, [q.id]: e.target.value }))}
                />
              )}

              {q.type === 'textarea' && (
                <textarea
                  style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
                  value={responses[q.id] || ''}
                  onChange={e => setResponses(p => ({ ...p, [q.id]: e.target.value }))}
                />
              )}

              {q.type === 'rating' && q.scale && (
                <div className="flex gap-2">
                  {Array.from({ length: q.scale }, (_, j) => j + 1).map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setResponses(p => ({ ...p, [q.id]: n }))}
                      className="w-12 h-12 rounded-lg text-sm font-bold transition-all"
                      style={{
                        background: responses[q.id] === n ? '#C9A84C' : '#1a1a2e',
                        color: responses[q.id] === n ? '#0D0D1A' : '#8B8B9E',
                        border: `2px solid ${responses[q.id] === n ? '#C9A84C' : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'select' && q.options && (
                <div className="space-y-2">
                  {q.options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setResponses(p => ({ ...p, [q.id]: opt }))}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all"
                      style={{
                        background: responses[q.id] === opt ? 'rgba(201,168,76,0.1)' : '#1a1a2e',
                        color: responses[q.id] === opt ? '#C9A84C' : '#8B8B9E',
                        border: `1px solid ${responses[q.id] === opt ? '#C9A84C' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Submit */}
        <motion.button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full mt-8 py-4 rounded-xl text-base font-semibold transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #D4B96A)', color: '#0D0D1A' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {submitting ? 'Submitting...' : 'Submit Reference'}
        </motion.button>

        <p className="text-center text-xs mt-4 mb-8" style={{ color: '#6B7280' }}>
          Your responses are confidential and will only be used for assessment purposes.
        </p>
      </div>
    </div>
  );
}

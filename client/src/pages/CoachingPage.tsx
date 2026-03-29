import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/NavBar';

const BASE_URL = import.meta.env.BASE_URL || '/';

interface CoachingData {
  overallImpression: string;
  communicationStrengths: string[];
  areasForGrowth: string[];
  actionableRecommendations: { area: string; suggestion: string; priority: 'high' | 'medium' | 'low' }[];
  interviewTips: string[];
  encouragingNote: string;
}

const priorityConfig = {
  high: { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', color: 'var(--color-red)', label: 'High' },
  medium: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', color: 'var(--color-amber)', label: 'Medium' },
  low: { bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)', color: 'var(--color-blue)', label: 'Low' },
};

const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export function CoachingPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [coaching, setCoaching] = useState<CoachingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${BASE_URL}api/reports/${id}/coaching`, { credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error('Not found'); return r.json(); })
      .then(setCoaching)
      .catch(() => setError('Coaching report not yet generated.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <NavBar />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !coaching) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <NavBar />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
          <button onClick={() => navigate(`/report/${id}`)} className="btn btn-secondary mt-6">← Back to Report</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark print:bg-white">
      <div className="print:hidden"><NavBar /></div>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        {/* Header */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate(`/report/${id}`)} className="text-sm mb-6 inline-flex items-center gap-1" style={{ color: 'var(--color-text-tertiary)' }}>
            ← Back to Assessment Report
          </button>
          <h1 className="heading-lg mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Your Interview Coaching Report
          </h1>
          <p className="body-lg">{coaching.overallImpression}</p>
        </motion.div>

        {/* Strengths */}
        <motion.section className="mb-10" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} initial="hidden" animate="visible">
          <h2 className="heading-md mb-5 flex items-center gap-2" style={{ color: 'var(--color-green)' }}>
            ✨ Your Interview Strengths
          </h2>
          <div className="space-y-3">
            {coaching.communicationStrengths.map((s, i) => (
              <motion.div key={i} variants={item} className="rounded-xl p-4" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
                <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>✓ {s}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Growth Areas */}
        <motion.section className="mb-10" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} initial="hidden" animate="visible">
          <h2 className="heading-md mb-5 flex items-center gap-2" style={{ color: 'var(--color-amber)' }}>
            🌱 Areas for Growth
          </h2>
          <div className="space-y-3">
            {coaching.areasForGrowth.map((a, i) => (
              <motion.div key={i} variants={item} className="rounded-xl p-4" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
                <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{a}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Action Plan */}
        <motion.section className="mb-10" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} initial="hidden" animate="visible">
          <h2 className="heading-md mb-5" style={{ color: 'var(--color-text-primary)' }}>
            🎯 Your Action Plan
          </h2>
          <div className="space-y-3">
            {coaching.actionableRecommendations.map((r, i) => {
              const p = priorityConfig[r.priority];
              return (
                <motion.div key={i} variants={item} className="rounded-xl p-5" style={{ background: p.bg, border: `1px solid ${p.border}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{r.area}</h3>
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full" style={{ background: p.border, color: p.color }}>{p.label}</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{r.suggestion}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Interview Tips */}
        <motion.section className="mb-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="heading-md mb-5" style={{ color: 'var(--color-text-primary)' }}>
            💡 Interview Tips
          </h2>
          <div className="rounded-xl p-6" style={{ background: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <ul className="space-y-3">
              {coaching.interviewTips.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <span className="text-gold font-bold mt-0.5">{i + 1}.</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Encouraging Note */}
        <motion.section className="mb-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.06), rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.12)' }}>
            <p className="text-3xl mb-4">💛</p>
            <h2 className="heading-sm mb-3" style={{ color: 'var(--color-gold)' }}>A Note from Sophia</h2>
            <p className="body-md max-w-lg mx-auto italic" style={{ color: 'var(--color-text-secondary)' }}>
              "{coaching.encouragingNote}"
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/NavBar';
import { DIMENSION_DISPLAY_NAMES } from '@/types';
import type { PyramidDimension } from '@/types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

const BASE_URL = import.meta.env.BASE_URL || '/';
const apiUrl = (path: string) => `${BASE_URL}api/${path}`;

interface AnalyticsSummary {
  totalAssessments: number;
  passRate: number;
  avgOverallScore: number;
  scoresByDimension: { dimension: string; avg: number }[];
  scoresByRoleLevel: { level: string; avg: number; count: number }[];
  passRateOverTime: { month: string; rate: number; count: number }[];
  topStrengths: { signal: string; avg: number }[];
  topConcerns: { signal: string; avg: number }[];
  scoreDistribution: { range: string; count: number }[];
}

// ─── Animations ────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Chart tooltip ─────────────────────────────────────────────────────────────

function DarkTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: '#ccc', marginBottom: 4 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.fill || p.color || p.stroke || '#fff' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Signal display name helper ────────────────────────────────────────────────

const SIGNAL_DISPLAY: Record<string, string> = {
  strategic_thinking: 'Strategic Thinking',
  execution_ability: 'Execution Ability',
  leadership_presence: 'Leadership Presence',
  cultural_alignment: 'Cultural Alignment',
  emotional_intelligence: 'Emotional Intelligence',
  domain_depth: 'Domain Depth',
  communication_clarity: 'Communication Clarity',
  adaptability: 'Adaptability',
  innovation_mindset: 'Innovation Mindset',
};

function signalName(s: string): string {
  return SIGNAL_DISPLAY[s] || s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Section card ──────────────────────────────────────────────────────────────

function SectionCard({ title, children, icon }: { title: string; children: React.ReactNode; icon: string }) {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-xl p-6 sm:p-8 overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <h2 className="heading-md mb-5 flex items-center gap-3" style={{ color: 'var(--color-gold)' }}>
        <span>{icon}</span> {title}
      </h2>
      {children}
    </motion.div>
  );
}

// ─── Distribution bar colors ───────────────────────────────────────────────────

const DIST_COLORS = ['#F87171', '#FBBF24', '#34D399', '#C9A84C'];

// ─── Main component ────────────────────────────────────────────────────────────

export function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(apiUrl('analytics/summary'), { credentials: 'include' });
        if (!resp.ok) throw new Error('Failed to load analytics');
        const json = await resp.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(170deg, #0D0D1A 0%, #0F1028 40%, #111130 70%, #0D0D1A 100%)' }}>
        <NavBar />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(170deg, #0D0D1A 0%, #0F1028 40%, #111130 70%, #0D0D1A 100%)' }}>
        <NavBar />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <div className="text-center py-32">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.totalAssessments === 0) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(170deg, #0D0D1A 0%, #0F1028 40%, #111130 70%, #0D0D1A 100%)' }}>
        <NavBar />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-10"
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-5" style={{ background: 'rgba(201,168,76,0.06)', color: 'var(--color-gold)', border: '1px solid rgba(201,168,76,0.1)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-gold)' }} />
              Analytics
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Comparative Analytics
            </h1>
          </motion.div>

          <motion.div
            className="relative rounded-2xl p-10 sm:p-16 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-raised) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, var(--color-gold), transparent 70%)' }} />
            </div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 relative">
                <div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(201,168,76,0.2)' }} />
                <div className="absolute inset-2 rounded-full" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }} />
                <svg className="relative w-8 h-8" style={{ color: 'var(--color-gold)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="heading-md mb-3" style={{ color: 'var(--color-text-primary)' }}>No analytics data yet</h3>
              <p className="body-md max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                Complete your first assessment to see comparative analytics and trends across all evaluations.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Prepare radar chart data
  const radarData = data.scoresByDimension.map(d => ({
    dimension: DIMENSION_DISPLAY_NAMES[d.dimension as PyramidDimension] || d.dimension.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    score: d.avg,
    fullMark: 5,
  }));

  // Format month labels
  const trendData = data.passRateOverTime.map(d => ({
    ...d,
    label: new Date(d.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
  }));

  const statsMeta = [
    { label: 'Total Assessments', value: data.totalAssessments, unit: '', color: 'var(--color-gold)' },
    { label: 'Pass Rate', value: data.passRate, unit: '%', color: 'var(--color-green)' },
    { label: 'Avg Score', value: data.avgOverallScore, unit: '/5', color: 'var(--color-amber)' },
    { label: 'Dimensions Tracked', value: data.scoresByDimension.length, unit: '', color: 'var(--color-blue)' },
  ];

  const roleLevelColors: Record<string, string> = {
    'C-Suite': '#C9A84C',
    'VP': '#60A5FA',
    'Director': '#34D399',
    'Senior Manager': '#FBBF24',
    'Manager': '#A78BFA',
    'Other': '#8B8B9E',
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(170deg, #0D0D1A 0%, #0F1028 40%, #111130 70%, #0D0D1A 100%)' }}>
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute"
          style={{
            width: '900px', height: '900px',
            background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 40%, transparent 70%)',
            top: '-350px', right: '-250px',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute"
          style={{
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 70%)',
            bottom: '-150px', left: '-150px',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)' }}
        />
      </div>

      <NavBar />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        {/* Header */}
        <motion.div
          className="mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full" style={{ background: 'rgba(201,168,76,0.06)', color: 'var(--color-gold)', border: '1px solid rgba(201,168,76,0.1)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-gold)', boxShadow: '0 0 8px rgba(201,168,76,0.6)' }} />
              Analytics
            </span>
          </motion.div>

          <h1 className="mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            <span style={{
              background: 'linear-gradient(135deg, #D4B85A 0%, #F5E6A3 30%, #C9A84C 60%, #B8943D 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Comparative Analytics</span>
          </h1>

          <p className="max-w-xl" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            Aggregated insights across all assessments. Track trends, identify patterns, and benchmark performance.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {statsMeta.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="relative rounded-xl p-5 sm:p-6 overflow-hidden group cursor-default"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.06] transition-opacity group-hover:opacity-[0.12]" style={{ background: `radial-gradient(circle, ${stat.color}, transparent 70%)`, transform: 'translate(30%, -30%)' }} />
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}<span className="text-base sm:text-lg ml-0.5 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>{stat.unit}</span>
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Pass Rate Trend */}
          {trendData.length > 0 && (
            <SectionCard title="Pass Rate Trend" icon="📈">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="label" stroke="#8B8B9E" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8B8B9E" fontSize={11} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<DarkTooltip />} />
                  <Line type="monotone" dataKey="rate" name="Pass Rate" stroke="#C9A84C" strokeWidth={2.5} dot={{ fill: '#C9A84C', r: 4 }} activeDot={{ r: 6, fill: '#D4B85A' }} />
                </LineChart>
              </ResponsiveContainer>
            </SectionCard>
          )}

          {/* Dimension Radar */}
          {radarData.length > 0 && (
            <SectionCard title="Dimension Radar" icon="🎯">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="dimension" stroke="#8B8B9E" fontSize={10} tickLine={false} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} stroke="rgba(255,255,255,0.1)" fontSize={9} />
                  <Radar name="Avg Score" dataKey="score" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </SectionCard>
          )}

          {/* Score Distribution */}
          <SectionCard title="Score Distribution" icon="📊">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="range" stroke="#8B8B9E" fontSize={12} tickLine={false} />
                <YAxis stroke="#8B8B9E" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="count" name="Assessments" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {data.scoreDistribution.map((_entry, index) => (
                    <Cell key={index} fill={DIST_COLORS[index % DIST_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          {/* Role Level Comparison */}
          {data.scoresByRoleLevel.length > 0 && (
            <SectionCard title="Role Level Comparison" icon="👥">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.scoresByRoleLevel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" stroke="#8B8B9E" fontSize={11} tickLine={false} domain={[0, 5]} />
                  <YAxis type="category" dataKey="level" stroke="#8B8B9E" fontSize={11} tickLine={false} width={100} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="avg" name="Avg Score" radius={[0, 6, 6, 0]} maxBarSize={32}>
                    {data.scoresByRoleLevel.map((entry) => (
                      <Cell key={entry.level} fill={roleLevelColors[entry.level] || '#8B8B9E'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
          )}
        </motion.div>

        {/* Top Signals */}
        {(data.topStrengths.length > 0 || data.topConcerns.length > 0) && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Top Strengths */}
            {data.topStrengths.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="rounded-xl p-6 sm:p-8 overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <h2 className="heading-md mb-5 flex items-center gap-3" style={{ color: '#34D399' }}>
                  <span>💪</span> Top Strengths
                </h2>
                <div className="space-y-3">
                  {data.topStrengths.map((s, i) => (
                    <div key={s.signal} className="flex items-center gap-3">
                      <span className="text-xs font-bold w-5 text-center" style={{ color: '#34D399' }}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{signalName(s.signal)}</span>
                          <span className="text-sm font-bold ml-2" style={{ color: '#34D399' }}>{s.avg.toFixed(2)}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(s.avg / 5) * 100}%`, background: 'linear-gradient(90deg, #34D399, #6EE7B7)' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Top Concerns */}
            {data.topConcerns.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="rounded-xl p-6 sm:p-8 overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <h2 className="heading-md mb-5 flex items-center gap-3" style={{ color: '#F87171' }}>
                  <span>⚠️</span> Areas for Improvement
                </h2>
                <div className="space-y-3">
                  {data.topConcerns.map((s, i) => (
                    <div key={s.signal} className="flex items-center gap-3">
                      <span className="text-xs font-bold w-5 text-center" style={{ color: '#F87171' }}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{signalName(s.signal)}</span>
                          <span className="text-sm font-bold ml-2" style={{ color: '#F87171' }}>{s.avg.toFixed(2)}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(s.avg / 5) * 100}%`, background: 'linear-gradient(90deg, #F87171, #FCA5A5)' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

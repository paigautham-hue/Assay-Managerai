import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useAssayStore } from '../store/useAssayStore';
import { motion } from 'framer-motion';
import { DIMENSION_DISPLAY_NAMES } from '../types';
import type { PsychologicalScreening } from '../types';
import type { ProsodyData } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  ResponsiveContainer, PieChart, Pie, Legend,
} from 'recharts';

// ─── Shared layout ────────────────────────────────────────────────────────────

interface SectionProps {
  title: string;
  children: React.ReactNode;
  isExpandable?: boolean;
  defaultOpen?: boolean;
  icon?: string;
}

const sectionBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '12px',
  marginBottom: '1.5rem',
};

function ExpandableSection({ title, children, isExpandable = false, defaultOpen = true, icon = '📄' }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!isExpandable) {
    return (
      <motion.div style={sectionBase} className="p-8 mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
        <h2 className="heading-md text-gold mb-4 flex items-center gap-3">{icon} {title}</h2>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div style={{ ...sectionBase, overflow: 'hidden' }} className="mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-8 py-6 flex items-center justify-between transition-colors duration-200" style={{ background: 'transparent' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <h2 className="heading-md text-gold flex items-center gap-3">{icon} {title}</h2>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="text-2xl" style={{ color: 'var(--color-text-tertiary)' }}>▼</motion.span>
      </button>
      {isOpen && (
        <div className="px-8 pb-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {children}
        </div>
      )}
    </motion.div>
  );
}

// ─── Custom tooltip components ────────────────────────────────────────────────

function DarkTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: '#ccc', marginBottom: 4 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.fill || p.color || '#fff' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Psychological Risk Profile ───────────────────────────────────────────────

function triadColor(score: number) {
  if (score <= 3) return '#34D399';
  if (score <= 6) return '#FBbF24';
  return '#F87171';
}

function triadLabel(score: number) {
  if (score <= 3) return 'Low Risk';
  if (score <= 6) return 'Moderate';
  return 'High Risk';
}

function deceptionColor(level: string) {
  if (level === 'low') return '#34D399';
  if (level === 'moderate') return '#FBbF24';
  return '#F87171';
}

function DeceptionMeter({ level }: { level: string }) {
  const levels = ['low', 'moderate', 'high'];
  return (
    <div className="flex gap-2 mt-2">
      {levels.map(l => {
        const active = l === level;
        return (
          <div
            key={l}
            className="flex-1 py-2 rounded text-center text-xs font-bold uppercase tracking-wide"
            style={{
              background: active ? deceptionColor(l) : 'rgba(255,255,255,0.06)',
              color: active ? '#0D0D1A' : 'rgba(255,255,255,0.25)',
              transition: 'all 0.3s',
            }}
          >
            {l}
          </div>
        );
      })}
    </div>
  );
}

function StringList({ items, color }: { items: string[]; color: string }) {
  if (!items.length) return <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>None detected</p>;
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--color-text-secondary)' }}>
          <span className="mt-0.5 flex-shrink-0" style={{ color }}>›</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function PsychologicalRiskSection({ profile }: { profile: PsychologicalScreening }) {
  const dt = profile.darkTriad;
  const dec = profile.deception;
  const stress = profile.stressProfile;

  const darkTriadData = dt ? [
    { name: 'Narcissism', score: dt.narcissism?.score ?? 0 },
    { name: 'Machiavellianism', score: dt.machiavellianism?.score ?? 0 },
    { name: 'Psychopathy', score: dt.psychopathy?.score ?? 0 },
  ] : [];

  const stressData = stress ? [
    { name: 'Composure', score: stress.baselineComposure ?? 0 },
    { name: 'Resilience', score: stress.stressResilience ?? 0 },
    { name: 'Recovery', score: stress.recoverySpeed ?? 0 },
  ] : [];

  const overallRiskColor = dt?.overallRisk === 'low' ? '#34D399'
    : dt?.overallRisk === 'moderate' ? '#FBbF24'
    : '#F87171';

  return (
    <ExpandableSection title="Psychological Risk Profile" icon="🧠" isExpandable defaultOpen>
      <div className="pt-4 space-y-8">

        {/* Risk badge */}
        {dt?.overallRisk && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-tertiary)' }}>Overall Psychological Risk</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase" style={{ background: `${overallRiskColor}22`, color: overallRiskColor, border: `1px solid ${overallRiskColor}55` }}>
              {dt.overallRisk}
            </span>
          </div>
        )}

        {/* Dark Triad chart */}
        {darkTriadData.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
              Dark Triad Scores (0–10 Scale)
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={darkTriadData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 10]}
                  tick={{ fill: '#666', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  tickLine={false}
                  ticks={[0, 2, 4, 6, 8, 10]}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: '#aaa', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={120}
                />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={28}>
                  {darkTriadData.map((entry, idx) => (
                    <Cell key={idx} fill={triadColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Legend & score labels */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              {darkTriadData.map(item => (
                <div key={item.name} className="rounded-lg p-3 text-center" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${triadColor(item.score)}33` }}>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{item.name}</p>
                  <p className="text-2xl font-bold" style={{ color: triadColor(item.score) }}>{item.score.toFixed(1)}</p>
                  <p className="text-xs mt-1" style={{ color: triadColor(item.score) }}>{triadLabel(item.score)}</p>
                </div>
              ))}
            </div>

            {/* Color legend */}
            <div className="flex gap-4 mt-3 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              <span><span style={{ color: '#34D399' }}>●</span> Low (0–3)</span>
              <span><span style={{ color: '#FBbF24' }}>●</span> Moderate (4–6)</span>
              <span><span style={{ color: '#F87171' }}>●</span> High (7–10) — FLAG</span>
            </div>
          </div>
        )}

        {/* Deception risk */}
        {dec && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Deception Risk</h3>
            <DeceptionMeter level={dec.overallDeceptionRisk ?? 'low'} />
            {dec.confidenceScore !== undefined && (
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                Detection confidence: <span style={{ color: 'var(--color-text-primary)' }}>{(dec.confidenceScore * 100).toFixed(0)}%</span>
              </p>
            )}
            {dec.cognitiveLoadIndicators && dec.cognitiveLoadIndicators.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase mb-2" style={{ color: '#F87171' }}>Deception Indicators</p>
                <StringList
                  items={[
                    ...dec.cognitiveLoadIndicators,
                    ...dec.realityMonitoringFlags,
                    ...dec.linguisticDeceptionMarkers,
                    ...dec.consistencyViolations,
                  ].filter(Boolean).slice(0, 6)}
                  color="#F87171"
                />
              </div>
            )}
          </div>
        )}

        {/* Stress profile */}
        {stressData.length > 0 && stressData.some(d => d.score > 0) && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Stress Response Profile (0–10)</h3>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={stressData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" domain={[0, 10]} tick={{ fill: '#666', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} tickLine={false} ticks={[0, 2, 4, 6, 8, 10]} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#aaa', fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} fill="#60A5FA" maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
            {stress?.triggerTopics && stress.triggerTopics.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase mb-2" style={{ color: '#FBbF24' }}>Trigger Topics</p>
                <StringList items={stress.triggerTopics} color="#FBbF24" />
              </div>
            )}
          </div>
        )}

        {/* Clinical flags */}
        {profile.clinicalFlags && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Clinical Flags</h3>
            <StringList items={profile.clinicalFlags} color="#F87171" />
          </div>
        )}

        {/* CWB / OCB */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {profile.counterproductiveWorkBehaviors && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: '#F87171' }}>CWB Risk Signals</h3>
              <StringList items={profile.counterproductiveWorkBehaviors} color="#F87171" />
            </div>
          )}
          {profile.organizationalCitizenshipSignals && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: '#34D399' }}>OCB Positive Signals</h3>
              <StringList items={profile.organizationalCitizenshipSignals} color="#34D399" />
            </div>
          )}
        </div>

      </div>
    </ExpandableSection>
  );
}

// ─── Prosody & Emotion Analytics ──────────────────────────────────────────────

const EMOTION_COLORS = [
  '#C9A84C', '#60A5FA', '#34D399', '#F87171',
  '#A78BFA', '#FBbF24', '#F59E0B', '#EC4899',
];

function sentimentColor(s: string) {
  if (s === 'POSITIVE') return '#34D399';
  if (s === 'NEGATIVE') return '#F87171';
  return '#6B7280';
}

function sentimentBg(s: string) {
  if (s === 'POSITIVE') return 'rgba(52,211,153,0.15)';
  if (s === 'NEGATIVE') return 'rgba(248,113,113,0.15)';
  return 'rgba(107,114,128,0.15)';
}

function overallSentimentConfig(s: string) {
  const map: Record<string, { label: string; color: string; icon: string }> = {
    positive: { label: 'Positive', color: '#34D399', icon: '↑' },
    negative: { label: 'Negative', color: '#F87171', icon: '↓' },
    neutral:  { label: 'Neutral',  color: '#6B7280', icon: '→' },
    mixed:    { label: 'Mixed',    color: '#FBbF24', icon: '≈' },
  };
  return map[s] ?? { label: s, color: '#6B7280', icon: '?' };
}

function ProsodyAnalyticsSection({ prosody }: { prosody: ProsodyData }) {
  const { metrics, sentimentSegments, humeTimeline, overallSentiment } = prosody;

  const topEmotions = Object.entries(metrics.emotionDistribution ?? {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value: Math.round(value * 1000) / 1000 }));

  const totalEmotionScore = topEmotions.reduce((sum, e) => sum + e.value, 0) || 1;

  const sentimentCounts = { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0 };
  for (const seg of sentimentSegments) sentimentCounts[seg.sentiment]++;

  const sentimentSummaryData = [
    { name: 'Positive', count: sentimentCounts.POSITIVE, fill: '#34D399' },
    { name: 'Negative', count: sentimentCounts.NEGATIVE, fill: '#F87171' },
    { name: 'Neutral',  count: sentimentCounts.NEUTRAL,  fill: '#4B5563' },
  ].filter(d => d.count > 0);

  const overall = overallSentimentConfig(overallSentiment);

  const hasHumeData = humeTimeline && humeTimeline.length > 0;
  const hasSegments = sentimentSegments && sentimentSegments.length > 0;
  const hasEmotions = topEmotions.length > 0;

  return (
    <ExpandableSection title="Prosody & Emotion Analytics" icon="🎭" isExpandable defaultOpen>
      <div className="pt-4 space-y-8">

        {/* Key metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-lg p-4 text-center" style={{ background: `${overall.color}11`, border: `1px solid ${overall.color}33` }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Overall Sentiment</p>
            <p className="text-2xl font-bold" style={{ color: overall.color }}>{overall.icon}</p>
            <p className="text-sm font-semibold mt-1" style={{ color: overall.color }}>{overall.label}</p>
          </div>

          <div className="rounded-lg p-4 text-center" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Dominant Emotion</p>
            <p className="text-xs font-bold mt-2" style={{ color: '#C9A84C' }}>{metrics.dominantEmotion || '—'}</p>
          </div>

          <div className="rounded-lg p-4 text-center" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Authenticity</p>
            <p className="text-2xl font-bold" style={{ color: '#60A5FA' }}>
              {metrics.authenticityScore !== undefined ? `${(metrics.authenticityScore * 100).toFixed(0)}%` : '—'}
            </p>
          </div>

          <div className="rounded-lg p-4 text-center" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Stress Signals</p>
            <p className="text-2xl font-bold" style={{ color: metrics.stressIndicators?.length ? '#F87171' : '#34D399' }}>
              {metrics.stressIndicators?.length ?? 0}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              {metrics.stressIndicators?.length ? 'detected' : 'none detected'}
            </p>
          </div>
        </div>

        {/* Emotion distribution */}
        {hasEmotions && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Emotion Distribution (Voice Analysis)</h3>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div style={{ width: '100%', maxWidth: 280, height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topEmotions}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {topEmotions.map((_, idx) => (
                        <Cell key={idx} fill={EMOTION_COLORS[idx % EMOTION_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const pct = ((payload[0].value as number / totalEmotionScore) * 100).toFixed(0);
                        return (
                          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                            <p style={{ color: '#ccc' }}>{payload[0].name}</p>
                            <p style={{ color: payload[0].payload.fill || '#fff' }}>{pct}% of detected emotions</p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {topEmotions.map((emotion, idx) => {
                  const pct = (emotion.value / totalEmotionScore) * 100;
                  const color = EMOTION_COLORS[idx % EMOTION_COLORS.length];
                  return (
                    <div key={emotion.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: '#ccc' }}>{emotion.name}</span>
                        <span style={{ color }}>{pct.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Sentiment breakdown */}
        {hasSegments && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
              Sentiment Breakdown — {sentimentSegments.length} segments analysed
            </h3>
            {sentimentSummaryData.length > 0 && (
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={sentimentSummaryData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#aaa', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" radius={4} maxBarSize={48}>
                    {sentimentSummaryData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* Sentiment timeline tiles */}
            <div className="mt-4">
              <p className="text-xs mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Timeline (each tile = one sentence)</p>
              <div className="flex flex-wrap gap-1">
                {sentimentSegments.map((seg, i) => (
                  <div
                    key={i}
                    title={`${seg.sentiment}: "${seg.text.substring(0, 60)}..."`}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      background: sentimentBg(seg.sentiment),
                      border: `1px solid ${sentimentColor(seg.sentiment)}55`,
                      cursor: 'help',
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-4 mt-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                <span><span style={{ color: '#34D399' }}>●</span> Positive ({sentimentCounts.POSITIVE})</span>
                <span><span style={{ color: '#F87171' }}>●</span> Negative ({sentimentCounts.NEGATIVE})</span>
                <span><span style={{ color: '#6B7280' }}>●</span> Neutral ({sentimentCounts.NEUTRAL})</span>
              </div>
            </div>
          </div>
        )}

        {/* Hume emotion timeline summary */}
        {hasHumeData && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
              Valence Trend — {humeTimeline.length} voice samples
            </h3>
            <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(90deg, ${humeTimeline.map((p, i) => {
                    const v = (p.valence + 1) / 2;
                    const pct = Math.round((i / (humeTimeline.length - 1 || 1)) * 100);
                    const c = v > 0.6 ? '34D399' : v > 0.4 ? 'C9A84C' : 'F87171';
                    return `#${c} ${pct}%`;
                  }).join(', ')})`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              <span>Start of interview</span>
              <span>End</span>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
              Avg valence: <span style={{ color: metrics.averageValence > 0 ? '#34D399' : '#F87171' }}>
                {metrics.averageValence >= 0 ? '+' : ''}{metrics.averageValence.toFixed(3)}
              </span>
              {' '}(−1 = negative, +1 = positive)
            </p>
          </div>
        )}

        {/* Stress indicators list */}
        {metrics.stressIndicators && metrics.stressIndicators.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: '#F87171' }}>Stress Emotion Indicators</h3>
            <div className="flex flex-wrap gap-2">
              {metrics.stressIndicators.map(indicator => (
                <span key={indicator} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171', border: '1px solid rgba(248,113,113,0.35)' }}>
                  {indicator}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </ExpandableSection>
  );
}

// ─── Report Page ──────────────────────────────────────────────────────────────

export function ReportPage() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const { reports } = useAssayStore();
  const report = reports.find(r => r.id === params.id);

  if (!report) {
    return (
      <div className="bg-gradient-dark min-h-screen flex items-center justify-center px-4">
        <motion.div className="text-center max-w-md" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="heading-lg mb-4" style={{ color: 'var(--color-text-primary)' }}>Report Not Found</h1>
          <p className="body-md mb-8">The assessment report you're looking for doesn't exist or has been removed.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/')} className="btn btn-primary px-6">Back to Home</button>
            <button onClick={() => navigate('/setup')} className="btn btn-secondary px-6">New Assessment</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const gateColor = report.gateBanner.status === 'passed' ? 'var(--color-green)' : report.gateBanner.status === 'flagged' ? 'var(--color-amber)' : 'var(--color-red)';
  const gateBg = report.gateBanner.status === 'passed' ? 'rgba(52,211,153,0.1)' : report.gateBanner.status === 'flagged' ? 'rgba(251,191,36,0.1)' : 'rgba(248,113,113,0.1)';

  return (
    <div className="bg-gradient-dark min-h-screen pt-12 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div className="mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="heading-xl mb-2" style={{ color: 'var(--color-text-primary)' }}>{report.candidateName}</h1>
              <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>{report.roleName}</p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                Assessment Date: {new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/setup')} className="btn btn-primary px-6">New Assessment</button>
            </div>
          </div>
        </motion.div>

        {/* Gate Status Banner */}
        <motion.div
          className="rounded-xl p-8 mb-6 text-center"
          style={{ background: gateBg, border: `2px solid ${gateColor}` }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <p className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: gateColor }}>Overall Assessment</p>
          <h2 className="heading-lg mb-2" style={{ color: gateColor }}>
            {report.gateBanner.status === 'passed' ? '✓ Clear to Advance' : report.gateBanner.status === 'flagged' ? '⚠️ Proceed With Caution' : '✗ Do Not Advance'}
          </h2>
          <p className="text-lg font-semibold" style={{ color: gateColor }}>
            {report.pyramidScore.overall.toFixed(2)} / 5.0 Overall Score
          </p>
        </motion.div>

        {/* Case Against */}
        {report.caseAgainst && (
          <ExpandableSection title="Case Against Hiring" icon="⚠️" isExpandable defaultOpen={report.gateBanner.status !== 'passed'}>
            <p className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>{report.caseAgainst}</p>
          </ExpandableSection>
        )}

        {/* Executive Summary */}
        <ExpandableSection title="Executive Summary" icon="📋">
          <p className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>{report.executiveSummary}</p>
        </ExpandableSection>

        {/* Pyramid Score */}
        <ExpandableSection title="Pyramid Score" icon="📊">
          <div className="space-y-6">
            <div className="space-y-4">
              {report.pyramidScore.dimensions.map(dim => (
                <div key={dim.dimension}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{DIMENSION_DISPLAY_NAMES[dim.dimension] || dim.dimension}</span>
                    <span className="text-sm font-bold text-gold">{dim.score.toFixed(1)}/5</span>
                  </div>
                  <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-full"
                      style={{ background: 'linear-gradient(90deg, var(--color-gold), #DFC06A)' }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(dim.score / 5) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg p-6 text-center mt-8" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Overall Score</p>
              <motion.div className="text-5xl font-bold text-gold mb-2" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.6, ease: 'backOut' }} viewport={{ once: true }}>
                {report.pyramidScore.overall.toFixed(2)}
              </motion.div>
              <p style={{ color: 'var(--color-text-secondary)' }}>out of 5.0</p>
              {report.pyramidScore.purityRating && (
                <p className="text-sm mt-3" style={{ color: 'var(--color-text-tertiary)' }}>
                  Confidence Level: <span className="text-gold font-semibold">{report.pyramidScore.purityRating}</span>
                </p>
              )}
              <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
                <span className="text-xs" style={{ color: report.pyramidScore.meetsBar ? 'var(--color-green)' : 'var(--color-red)' }}>
                  {report.pyramidScore.meetsBar ? '✓' : '✗'} Meets Hire Bar (4.0)
                </span>
                <span className="text-xs" style={{ color: report.pyramidScore.characterClear ? 'var(--color-green)' : 'var(--color-red)' }}>
                  {report.pyramidScore.characterClear ? '✓' : '✗'} Character Clear
                </span>
                <span className="text-xs" style={{ color: report.pyramidScore.handsOnClear ? 'var(--color-green)' : 'var(--color-red)' }}>
                  {report.pyramidScore.handsOnClear ? '✓' : '✗'} Hands-On Clear
                </span>
              </div>
            </div>
          </div>
        </ExpandableSection>

        {/* Gate Analysis */}
        <ExpandableSection title="Gate Analysis" icon="🚪" isExpandable defaultOpen>
          <div className="space-y-4 pt-4">
            {report.gateDetails.map(gate => {
              const col = gate.confidence === 'PASS' ? 'var(--color-green)' : gate.confidence === 'FLAG' ? 'var(--color-amber)' : gate.confidence === 'FAIL' ? 'var(--color-red)' : 'var(--color-text-tertiary)';
              return (
                <motion.div key={gate.gate} className="rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold" style={{ background: col, color: '#0D0D1A' }}>
                      {gate.confidence === 'PASS' ? '✓' : gate.confidence === 'FLAG' ? '○' : gate.confidence === 'FAIL' ? '✗' : '?'}
                    </span>
                    <h4 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{gate.gate.replace(/_/g, ' ').toUpperCase()}</h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ color: col, background: `${col}20` }}>{gate.confidence}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{gate.evidence.join('; ')}</p>
                </motion.div>
              );
            })}
          </div>
        </ExpandableSection>

        {/* Psychological Risk Profile */}
        {report.psychologicalProfile && (
          <PsychologicalRiskSection profile={report.psychologicalProfile} />
        )}

        {/* Prosody & Emotion Analytics */}
        {report.prosodyData && (
          <ProsodyAnalyticsSection prosody={report.prosodyData} />
        )}

        {/* Deep Assessment */}
        <ExpandableSection title="Deep Assessment by Dimension" icon="🔬" isExpandable defaultOpen={false}>
          <div className="space-y-4 pt-4">
            {report.deepAssessment.map(assessment => (
              <motion.div key={assessment.dimension} className="rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <h4 className="font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{DIMENSION_DISPLAY_NAMES[assessment.dimension] || assessment.dimension}</h4>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>{assessment.narrative}</p>
                {assessment.strengths.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-green)' }}>Strengths</p>
                    <ul className="space-y-1">{assessment.strengths.map((s, i) => <li key={i} className="text-xs list-disc list-inside" style={{ color: 'var(--color-text-secondary)' }}>{s}</li>)}</ul>
                  </div>
                )}
                {assessment.concerns.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-amber)' }}>Concerns</p>
                    <ul className="space-y-1">{assessment.concerns.map((c, i) => <li key={i} className="text-xs list-disc list-inside" style={{ color: 'var(--color-text-secondary)' }}>{c}</li>)}</ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </ExpandableSection>

        {/* Raise the Bar */}
        {report.raiseTheBar && (
          <ExpandableSection title="Raise the Bar" icon="📈">
            <p className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>{report.raiseTheBar}</p>
          </ExpandableSection>
        )}

        {/* Context Fit */}
        {report.contextFit && (
          <ExpandableSection title="Context Fit" icon="🎯">
            <p className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>{report.contextFit}</p>
          </ExpandableSection>
        )}

        {/* Assay Insight */}
        {report.assayInsight && (
          <motion.div className="rounded-xl p-8 mb-6 relative overflow-hidden" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid var(--color-gold)' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="absolute -right-12 -top-12 text-9xl opacity-10 text-gold">"</div>
            <p className="text-xl text-gold leading-relaxed relative z-10 italic">{report.assayInsight}</p>
          </motion.div>
        )}

        {/* Deliberation */}
        {report.deliberation && (
          <ExpandableSection title="The Deliberation" icon="👨‍⚖️" isExpandable defaultOpen={false}>
            <div className="space-y-4 pt-4">
              {report.deliberation.assessorVerdicts.map(assessor => (
                <motion.div key={assessor.role} className="rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold capitalize" style={{ color: 'var(--color-text-primary)' }}>{assessor.role.replace(/_/g, ' ')}</h4>
                    <span className="text-xs px-2 py-0.5 rounded font-medium" style={{
                      color: assessor.recommendation === 'hire' ? 'var(--color-green)' : assessor.recommendation === 'no_hire' ? 'var(--color-red)' : 'var(--color-amber)',
                      background: assessor.recommendation === 'hire' ? 'rgba(52,211,153,0.1)' : assessor.recommendation === 'no_hire' ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)',
                    }}>
                      {assessor.recommendation.replace(/_/g, ' ')} ({(assessor.confidence * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{assessor.narrative}</p>
                </motion.div>
              ))}

              {report.deliberation.chairmanSynthesis && (
                <motion.div className="rounded-lg p-4 mt-4" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid var(--color-gold)' }} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h4 className="font-bold text-gold mb-2">Chairman's Synthesis</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{report.deliberation.chairmanSynthesis}</p>
                </motion.div>
              )}

              {report.deliberation.dissents?.length > 0 && (
                <motion.div className="rounded-lg p-4" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <h4 className="font-bold mb-3" style={{ color: 'var(--color-amber)' }}>Notable Dissents</h4>
                  <ul className="space-y-2">
                    {report.deliberation.dissents.map((d, i) => (
                      <li key={i} className="text-sm leading-relaxed list-disc list-inside" style={{ color: 'var(--color-text-secondary)' }}>
                        <span className="font-semibold">{d.assessor}:</span> {d.position}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </ExpandableSection>
        )}

        {/* Follow-Up Questions */}
        {report.followUpQuestions?.length > 0 && (
          <ExpandableSection title="Follow-Up Questions for Next Round" icon="❓" isExpandable defaultOpen={false}>
            <ol className="space-y-3 list-decimal list-inside pt-4">
              {report.followUpQuestions.map((q, i) => (
                <motion.li key={i} className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                  <span className="text-gold font-semibold">{q.question}</span>
                  {q.targetGate && <span className="text-xs rounded px-2 py-1 ml-2" style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--color-gold)' }}>{q.targetGate}</span>}
                </motion.li>
              ))}
            </ol>
          </ExpandableSection>
        )}

        {/* Footer */}
        <motion.div className="flex gap-4 justify-center pt-12 mt-12" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <button onClick={() => navigate('/')} className="btn btn-secondary px-8">Back to Home</button>
          <button onClick={() => navigate('/setup')} className="btn btn-primary px-8">Start New Assessment</button>
        </motion.div>
      </div>
    </div>
  );
}

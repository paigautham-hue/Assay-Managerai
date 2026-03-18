import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useAssayStore } from '../store/useAssayStore';
import { motion } from 'framer-motion';
import { DIMENSION_DISPLAY_NAMES } from '../types';

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

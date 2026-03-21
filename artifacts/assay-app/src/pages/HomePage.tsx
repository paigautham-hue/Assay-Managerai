import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAssayStore } from '../store/useAssayStore';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/NavBar';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export function HomePage() {
  const [, navigate] = useLocation();
  const { reports, loadReports, isLoading } = useAssayStore();

  useEffect(() => {
    loadReports();
  }, []);

  const stats = {
    total: reports.length,
    passRate: reports.length > 0
      ? ((reports.filter(r => r.gateBanner.status === 'passed').length / reports.length) * 100).toFixed(0)
      : 0,
    avgScore: reports.length > 0
      ? (reports.reduce((sum, r) => sum + r.pyramidScore.overall, 0) / reports.length).toFixed(2)
      : 0,
    active: 0,
  };

  const statsMeta = [
    { label: 'Total Assessments', value: stats.total, unit: '', icon: '📊', color: 'var(--color-gold)' },
    { label: 'Pass Rate', value: stats.passRate, unit: '%', icon: '✅', color: 'var(--color-green)' },
    { label: 'Average Score', value: stats.avgScore, unit: '/5', icon: '⭐', color: 'var(--color-amber)' },
    { label: 'Active Interviews', value: stats.active, unit: '', icon: '🎙️', color: 'var(--color-blue)' },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, var(--color-gold), transparent 70%)',
            top: '-200px',
            right: '-200px',
            animation: 'breathe 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.02]"
          style={{
            background: 'radial-gradient(circle, #60A5FA, transparent 70%)',
            bottom: '-100px',
            left: '-100px',
            animation: 'breathe 12s ease-in-out infinite reverse',
          }}
        />
        {/* Subtle dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <NavBar />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero section */}
        <motion.div
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full" style={{ background: 'rgba(201,168,76,0.08)', color: 'var(--color-gold)', border: '1px solid rgba(201,168,76,0.15)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
              Dashboard
            </span>
          </div>
          <h1 className="heading-xl mb-3">
            <span style={{ background: 'linear-gradient(135deg, var(--color-gold) 0%, #E8D48B 50%, var(--color-gold) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ASSAY</span>
          </h1>
          <p className="body-lg max-w-2xl">Reveal what leaders are made of. Premium AI-powered executive interview assessment.</p>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <button onClick={() => navigate('/setup')} className="btn btn-primary btn-lg group">
              <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Assessment
            </button>
          </motion.div>
        </motion.div>

        {/* Stats grid */}
        {reports.length > 0 && (
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16"
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
                {/* Subtle colored glow */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.06] transition-opacity group-hover:opacity-[0.12]" style={{ background: `radial-gradient(circle, ${stat.color}, transparent 70%)`, transform: 'translate(30%, -30%)' }} />
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold" style={{ color: stat.color }}>
                  {stat.value}<span className="text-base sm:text-lg ml-0.5 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>{stat.unit}</span>
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Reports list */}
        {reports.length > 0 ? (
          <motion.div
            className="mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="heading-md mb-6" style={{ color: 'var(--color-text-primary)' }}>Recent Assessments</h2>
            <div className="space-y-3">
              {reports.map((report) => {
                const statusColor = report.gateBanner.status === 'passed' ? 'var(--color-green)' : report.gateBanner.status === 'flagged' ? 'var(--color-amber)' : 'var(--color-red)';
                return (
                  <motion.div
                    key={report.id}
                    variants={itemVariants}
                    className="relative rounded-xl p-5 sm:p-6 card-hover cursor-pointer overflow-hidden"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                    onClick={() => navigate(`/report/${report.id}`)}
                  >
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full" style={{ backgroundColor: statusColor }} />

                    <div className="flex items-center justify-between pl-3">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold" style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--color-gold)', border: '1px solid rgba(201,168,76,0.2)' }}>
                          {report.candidateName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-base font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{report.candidateName}</h3>
                          <p className="text-xs sm:text-sm truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                            {report.roleName} · {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 ml-3 flex-shrink-0">
                        <span className="text-sm sm:text-base font-bold" style={{ color: statusColor }}>
                          {report.pyramidScore.overall.toFixed(1)}
                        </span>
                        <svg className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* Premium empty state */
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
            {/* Decorative background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, var(--color-gold), transparent 70%)' }} />
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.5) 1px, transparent 0)',
                  backgroundSize: '32px 32px',
                }}
              />
            </div>

            <div className="relative">
              {/* Animated icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 relative">
                <div className="absolute inset-0 rounded-full animate-pulse-ring" style={{ border: '2px solid rgba(201,168,76,0.2)' }} />
                <div className="absolute inset-2 rounded-full" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }} />
                <svg className="relative w-8 h-8" style={{ color: 'var(--color-gold)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <h3 className="heading-md mb-3" style={{ color: 'var(--color-text-primary)' }}>Start your first assessment</h3>
              <p className="body-md max-w-md mx-auto mb-10" style={{ color: 'var(--color-text-secondary)' }}>
                Begin a premium AI-powered executive interview to reveal what leaders are made of.
              </p>

              <button onClick={() => navigate('/setup')} className="btn btn-primary btn-lg">
                Create Assessment
              </button>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-10">
                {['AI-Led Interview', '5 Expert Assessors', 'Prosody Analysis', 'Gate-Based Screening'].map(f => (
                  <span key={f} className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-tertiary)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

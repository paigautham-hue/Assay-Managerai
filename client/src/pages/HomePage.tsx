import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAssayStore } from '../store/useAssayStore';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/NavBar';
import { CreateInviteModal } from '@/components/CreateInviteModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const BASE_URL = import.meta.env.BASE_URL || '/';
const apiUrl = (path: string) => `${BASE_URL}api/${path}`;

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const numVal = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numVal) || numVal === 0) { setDisplay(0); return; }
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setDisplay(Math.round(numVal * eased * 100) / 100);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  // Format: show decimals only if the original value has them
  const hasDecimals = value % 1 !== 0;
  return <span className="tabular-nums">{hasDecimals ? display.toFixed(2) : Math.round(display)}</span>;
}

function SkeletonStatCard() {
  return (
    <div
      className="relative rounded-xl p-5 sm:p-6 overflow-hidden"
      style={{ background: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="skeleton-gold h-3 w-24 mb-4 rounded" />
      <div className="skeleton-gold h-8 w-16 rounded" />
    </div>
  );
}

function SkeletonReportRow() {
  return (
    <div
      className="relative rounded-xl p-5 sm:p-6 overflow-hidden"
      style={{ background: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-4">
        <div className="skeleton-gold w-11 h-11 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton-gold h-4 w-40 rounded" />
          <div className="skeleton-gold h-3 w-28 rounded" />
        </div>
        <div className="skeleton-gold h-6 w-10 rounded" />
      </div>
    </div>
  );
}

export function HomePage() {
  const [, navigate] = useLocation();
  const { reports, loadReports, isLoading } = useAssayStore();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    loadReports();
  }, []);

  // Fetch active interview sessions count
  useEffect(() => {
    fetch(apiUrl('sessions'), { credentials: 'include' })
      .then(res => res.ok ? res.json() : [])
      .then((sessions: Array<{ status?: string }>) => {
        const active = sessions.filter(s => s.status === 'active' || s.status === 'preparing');
        setActiveCount(active.length);
      })
      .catch(() => {}); // non-critical
  }, []);

  const stats = {
    total: reports.length,
    passRate: reports.length > 0
      ? ((reports.filter(r => r.gateBanner.status === 'passed').length / reports.length) * 100).toFixed(0)
      : 0,
    avgScore: reports.length > 0
      ? (reports.reduce((sum, r) => sum + r.pyramidScore.overall, 0) / reports.length).toFixed(2)
      : 0,
    active: activeCount,
  };

  const statsMeta = [
    { label: 'Total Assessments', value: stats.total, unit: '', color: 'var(--color-gold)' },
    { label: 'Pass Rate', value: stats.passRate, unit: '%', color: 'var(--color-green)' },
    { label: 'Average Score', value: stats.avgScore, unit: '/5', color: 'var(--color-amber)' },
    { label: 'Active Interviews', value: stats.active, unit: '', color: 'var(--color-blue)' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-dark">
      {/* Cinematic background layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary gold aurora */}
        <div
          className="absolute"
          style={{
            width: '900px', height: '900px',
            background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 40%, transparent 70%)',
            top: '-350px', right: '-250px',
            animation: 'breathe 10s ease-in-out infinite',
            filter: 'blur(60px)',
          }}
        />
        {/* Secondary blue aurora */}
        <div
          className="absolute"
          style={{
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 70%)',
            bottom: '-150px', left: '-150px',
            animation: 'breathe 14s ease-in-out infinite reverse',
            filter: 'blur(80px)',
          }}
        />
        {/* Subtle mesh gradient overlay */}
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 0.5px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Top light streak */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)' }}
        />
      </div>

      <NavBar />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
        {/* Hero section with premium typography */}
        <motion.div
          className="mb-14 sm:mb-20"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full" style={{ background: 'rgba(201,168,76,0.06)', color: 'var(--color-gold)', border: '1px solid rgba(201,168,76,0.1)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-gold)', boxShadow: '0 0 8px rgba(201,168,76,0.6)' }} />
              Dashboard
            </span>
          </motion.div>

          <h1 className="mb-4" style={{ fontSize: 'clamp(3rem, 7vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            <span className="text-gold-gradient" style={{ filter: 'drop-shadow(0 2px 4px rgba(201,168,76,0.2))' }}>ASSAY</span>
          </h1>

          <motion.p
            className="max-w-xl mb-10"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'var(--color-text-secondary)', lineHeight: 1.7, letterSpacing: '-0.01em' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Reveal what leaders are made of. Premium AI-powered executive interview assessment.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <button
              onClick={() => navigate('/setup')}
              className="btn-magnetic group relative inline-flex items-center gap-3 font-bold px-8 py-4 rounded-2xl active:scale-[0.97] min-h-[44px]"
              style={{
                background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-light) 50%, var(--color-gold) 100%)',
                color: 'var(--color-dark)',
                boxShadow: '0 4px 20px rgba(201,168,76,0.35), 0 1px 3px rgba(0,0,0,0.2)',
                fontSize: '1.0625rem',
              }}
            >
              {/* Hover shimmer effect */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', animation: 'shimmer 2s ease-in-out infinite' }} />
              <svg className="w-5 h-5 relative transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="relative">New Assessment</span>
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="group inline-flex items-center gap-2.5 font-semibold px-6 py-4 rounded-2xl transition-all active:scale-[0.97] min-h-[44px]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.2)',
                color: 'var(--color-gold)',
                fontSize: '0.9375rem',
              }}
            >
              <svg className="w-4.5 h-4.5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Create Invite Link</span>
            </button>
            <button
              onClick={() => navigate('/candidates')}
              className="group inline-flex items-center gap-2.5 font-semibold px-6 py-4 rounded-2xl transition-all active:scale-[0.97] min-h-[44px]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.2)',
                color: 'var(--color-gold)',
                fontSize: '0.9375rem',
              }}
            >
              <svg className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Candidate Pipeline</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Stats grid — skeleton loading or real data */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
            {[1, 2, 3, 4].map(i => <SkeletonStatCard key={i} />)}
          </div>
        ) : reports.length > 0 ? (
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
                  <AnimatedNumber value={Number(stat.value)} /><span className="text-base sm:text-lg ml-0.5 font-medium" style={{ color: 'var(--color-text-tertiary)' }}>{stat.unit}</span>
                </p>
              </motion.div>
            ))}
          </motion.div>
        ) : null}

        {/* Reports list */}
        {isLoading ? (
          <div className="mb-8">
            <div className="skeleton-gold h-6 w-48 rounded mb-6" />
            <div className="space-y-3">
              {[1, 2, 3].map(i => <SkeletonReportRow key={i} />)}
            </div>
          </div>
        ) : reports.length > 0 ? (
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
                    className="relative rounded-xl p-5 sm:p-6 card-lift cursor-pointer overflow-hidden min-h-[44px]"
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
                        <span className="text-sm sm:text-base font-bold tabular-nums" style={{ color: statusColor }}>
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

      <CreateInviteModal open={showInviteModal} onClose={() => setShowInviteModal(false)} />
    </div>
  );
}

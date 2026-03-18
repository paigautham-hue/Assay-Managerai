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

  return (
    <div className="min-h-screen bg-gradient-dark">
      <NavBar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3"><span className="label">Dashboard</span></div>
          <h1 className="heading-xl mb-2">
            <span style={{ background: 'linear-gradient(135deg, var(--color-gold) 0%, #DFC06A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ASSAY</span>
          </h1>
          <p className="body-lg max-w-2xl">Reveal what leaders are made of. Premium AI-powered executive interview assessment.</p>
        </motion.div>

        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <button onClick={() => navigate('/setup')} className="btn btn-primary btn-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Assessment
          </button>
        </motion.div>

        {reports.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: 'Total Assessments', value: stats.total, unit: '' },
              { label: 'Pass Rate', value: stats.passRate, unit: '%' },
              { label: 'Average Score', value: stats.avgScore, unit: '/5' },
              { label: 'Active Interviews', value: stats.active, unit: '' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="surface-raised rounded-xl p-6"
              >
                <p className="label mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gold">
                  {stat.value}<span className="text-lg ml-1">{stat.unit}</span>
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {reports.length > 0 ? (
          <motion.div
            className="mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="heading-md mb-6" style={{ color: 'var(--color-text-primary)' }}>Recent Assessments</h2>
            <div className="space-y-3">
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  variants={itemVariants}
                  className="surface-raised rounded-xl p-6 card-hover cursor-pointer"
                  onClick={() => navigate(`/report/${report.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex items-center gap-4">
                      <div className="avatar avatar-md">{report.candidateName.charAt(0).toUpperCase()}</div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>{report.candidateName}</h3>
                        <p className="body-sm">{report.roleName}</p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                          {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full`} style={{
                          backgroundColor: report.gateBanner.status === 'passed' ? 'var(--color-green)' : report.gateBanner.status === 'flagged' ? 'var(--color-amber)' : 'var(--color-red)'
                        }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                          {report.pyramidScore.overall.toFixed(2)} / 5.0
                        </span>
                      </div>
                      <button className="btn btn-secondary btn-sm">View</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="surface-raised rounded-2xl p-16 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-subtle mb-6">
              <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="heading-sm mb-2" style={{ color: 'var(--color-text-primary)' }}>Start your first assessment</h3>
            <p className="body-md max-w-sm mx-auto mb-8">Begin a premium AI-powered executive interview to reveal what leaders are made of.</p>
            <button onClick={() => navigate('/setup')} className="btn btn-primary">Create Assessment</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

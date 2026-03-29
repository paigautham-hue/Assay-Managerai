import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { NavBar } from '@/components/NavBar';

const BASE_URL = import.meta.env.BASE_URL || '/';
const apiUrl = (path: string) => `${BASE_URL}api/${path}`;

interface Candidate {
  id: string;
  name: string;
  email?: string;
  currentRole?: string;
  currentCompany?: string;
  source?: string;
  pipelineStage: string;
  yearsExperience?: number;
  createdAt: string;
  tags: string[];
  _count?: { sessions: number; references: number };
}

const PIPELINE_STAGES = [
  { key: 'applied', label: 'Applied', color: '#8B8B9E' },
  { key: 'screening', label: 'Screening', color: '#60A5FA' },
  { key: 'interviewing', label: 'Interviewing', color: '#C9A84C' },
  { key: 'assessed', label: 'Assessed', color: '#A78BFA' },
  { key: 'offer', label: 'Offer', color: '#34D399' },
  { key: 'hired', label: 'Hired', color: '#10B981' },
  { key: 'rejected', label: 'Rejected', color: '#EF4444' },
  { key: 'withdrawn', label: 'Withdrawn', color: '#6B7280' },
];

const stageColor = (stage: string) => PIPELINE_STAGES.find(s => s.key === stage)?.color || '#8B8B9E';

export function CandidatesPage() {
  const [, navigate] = useLocation();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({ name: '', email: '', currentRole: '', currentCompany: '', source: '' });

  const fetchCandidates = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (stageFilter !== 'all') params.set('stage', stageFilter);
      const res = await fetch(apiUrl(`candidates?${params}`), { credentials: 'include' });
      if (res.ok) setCandidates(await res.json());
    } catch (err) {
      console.warn('Failed to load candidates:', err);
    } finally {
      setLoading(false);
    }
  }, [search, stageFilter]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  const handleAddCandidate = async () => {
    if (!newCandidate.name.trim()) return;
    try {
      const res = await fetch(apiUrl('candidates'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newCandidate),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewCandidate({ name: '', email: '', currentRole: '', currentCompany: '', source: '' });
        fetchCandidates();
      }
    } catch (err) {
      console.warn('Failed to add candidate:', err);
    }
  };

  const moveStage = async (candidateId: string, newStage: string) => {
    try {
      await fetch(apiUrl(`candidates/${candidateId}/stage`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ stage: newStage }),
      });
      fetchCandidates();
    } catch (err) {
      console.warn('Failed to move candidate:', err);
    }
  };

  const activePipelineStages = PIPELINE_STAGES.filter(s => !['rejected', 'withdrawn'].includes(s.key));
  const filteredCandidates = candidates.filter(c =>
    (stageFilter === 'all' || c.pipelineStage === stageFilter) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.currentRole?.toLowerCase().includes(search.toLowerCase()))
  );

  const inputStyle: React.CSSProperties = {
    background: 'var(--color-surface)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    color: 'var(--color-text-primary)',
    fontSize: '0.875rem',
    width: '100%',
    outline: 'none',
    minHeight: 44,
  };

  return (
    <div className="bg-gradient-dark min-h-screen safe-top">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="heading-lg" style={{ color: 'var(--color-text-primary)' }}>Candidate Pipeline</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{candidates.length} candidates total</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              {(['board', 'list'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className="px-3 py-2 text-xs font-medium transition-colors"
                  style={{
                    background: viewMode === mode ? 'var(--color-gold)' : 'transparent',
                    color: viewMode === mode ? '#0D0D1A' : 'var(--color-text-secondary)',
                  }}
                >
                  {mode === 'board' ? 'Board' : 'List'}
                </button>
              ))}
            </div>
            <motion.button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary btn-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              + Add Candidate
            </motion.button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, maxWidth: 320 }}
          />
          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            style={{ ...inputStyle, maxWidth: 180 }}
          >
            <option value="all">All Stages</option>
            {PIPELINE_STAGES.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner" />
          </div>
        ) : viewMode === 'board' ? (
          /* Kanban Board */
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 400 }}>
            {activePipelineStages.map(stage => {
              const stageCandidates = candidates.filter(c => c.pipelineStage === stage.key);
              return (
                <div
                  key={stage.key}
                  className="flex-shrink-0 rounded-xl p-3"
                  style={{ width: 260, background: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: stage.color }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{stage.label}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full ml-auto" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-secondary)' }}>
                      {stageCandidates.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {stageCandidates.map(candidate => (
                      <motion.div
                        key={candidate.id}
                        className="rounded-lg p-3 cursor-pointer transition-all hover:ring-1 hover:ring-[var(--color-gold)]/30"
                        style={{ background: 'var(--color-surface-raised)', border: '1px solid rgba(255,255,255,0.04)' }}
                        onClick={() => navigate(`/candidates/${candidate.id}`)}
                        whileHover={{ y: -2 }}
                        layout
                      >
                        <div className="font-medium text-sm mb-1" style={{ color: 'var(--color-text-primary)' }}>{candidate.name}</div>
                        {candidate.currentRole && (
                          <div className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                            {candidate.currentRole}{candidate.currentCompany ? ` at ${candidate.currentCompany}` : ''}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          {candidate.source && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-secondary)' }}>
                              {candidate.source}
                            </span>
                          )}
                          {candidate._count && candidate._count.sessions > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--color-gold)' }}>
                              {candidate._count.sessions} interview{candidate._count.sessions > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {stageCandidates.length === 0 && (
                      <div className="text-center py-6 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        No candidates
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--color-surface)' }}>
                  {['Name', 'Role', 'Stage', 'Source', 'Experience', 'Added'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map(candidate => (
                  <tr
                    key={candidate.id}
                    className="cursor-pointer transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onClick={() => navigate(`/candidates/${candidate.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>{candidate.name}</div>
                      {candidate.email && <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{candidate.email}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {candidate.currentRole || '—'}{candidate.currentCompany ? ` at ${candidate.currentCompany}` : ''}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: `${stageColor(candidate.pipelineStage)}20`, color: stageColor(candidate.pipelineStage) }}>
                        {PIPELINE_STAGES.find(s => s.key === candidate.pipelineStage)?.label || candidate.pipelineStage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{candidate.source || '—'}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{candidate.yearsExperience ? `${candidate.yearsExperience} yrs` : '—'}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {filteredCandidates.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      No candidates found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Candidate Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <motion.div
              className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
              style={{ background: 'var(--color-surface-raised)', border: '1px solid rgba(255,255,255,0.08)' }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h2 className="heading-md mb-4" style={{ color: 'var(--color-text-primary)' }}>Add Candidate</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Name *</label>
                  <input style={inputStyle} value={newCandidate.name} onChange={e => setNewCandidate(p => ({ ...p, name: e.target.value }))} placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Email</label>
                  <input style={inputStyle} type="email" value={newCandidate.email} onChange={e => setNewCandidate(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Current Role</label>
                    <input style={inputStyle} value={newCandidate.currentRole} onChange={e => setNewCandidate(p => ({ ...p, currentRole: e.target.value }))} placeholder="VP Engineering" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Company</label>
                    <input style={inputStyle} value={newCandidate.currentCompany} onChange={e => setNewCandidate(p => ({ ...p, currentCompany: e.target.value }))} placeholder="Acme Inc" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>Source</label>
                  <select style={inputStyle} value={newCandidate.source} onChange={e => setNewCandidate(p => ({ ...p, source: e.target.value }))}>
                    <option value="">Select source</option>
                    {['referral', 'linkedin', 'job_board', 'agency', 'internal', 'direct'].map(s => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="btn btn-ghost flex-1">Cancel</button>
                <motion.button
                  onClick={handleAddCandidate}
                  disabled={!newCandidate.name.trim()}
                  className="btn btn-primary flex-1 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add Candidate
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

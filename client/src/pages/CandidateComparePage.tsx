import { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { NavBar } from '@/components/NavBar';

const BASE_URL = import.meta.env.BASE_URL || '/';
const apiUrl = (path: string) => `${BASE_URL}api/${path}`;

export function CandidateComparePage() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const ids = params.get('ids');
    if (!ids) { setLoading(false); return; }

    fetch(apiUrl(`candidates/compare?ids=${ids}`), { credentials: 'include' })
      .then(res => res.json())
      .then(data => setCandidates(data))
      .catch(err => console.warn('Failed to load comparison:', err))
      .finally(() => setLoading(false));
  }, [searchString]);

  const dimensions = ['domain_expertise', 'hands_on_accountability', 'character', 'people_influence', 'strategy_change', 'motivation', 'financial_fit'];
  const dimLabels: Record<string, string> = {
    domain_expertise: 'Domain Expertise',
    hands_on_accountability: 'Hands-On & Accountability',
    character: 'Character',
    people_influence: 'People & Influence',
    strategy_change: 'Strategy & Change',
    motivation: 'Motivation',
    financial_fit: 'Financial Fit',
  };

  return (
    <div className="bg-gradient-dark min-h-screen safe-top">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-24">
        <button onClick={() => navigate('/candidates')} className="text-sm mb-4 hover:opacity-80 transition-opacity" style={{ color: 'var(--color-text-secondary)' }}>
          &larr; Back to Pipeline
        </button>
        <h1 className="heading-lg mb-6" style={{ color: 'var(--color-text-primary)' }}>Candidate Comparison</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="spinner" /></div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Select candidates from the pipeline to compare them side by side.
            </p>
            <button
              onClick={() => navigate('/candidates')}
              className="btn btn-primary btn-sm"
            >
              Go to Pipeline
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--color-text-secondary)', width: 200 }}>Attribute</th>
                  {candidates.map(c => (
                    <th key={c.id} className="text-center px-4 py-3">
                      <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{c.name}</div>
                      <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{c.currentRole || '—'}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Stage</td>
                  {candidates.map(c => (
                    <td key={c.id} className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {c.pipelineStage}
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Experience</td>
                  {candidates.map(c => (
                    <td key={c.id} className="px-4 py-3 text-center text-xs" style={{ color: 'var(--color-text-primary)' }}>
                      {c.yearsExperience ? `${c.yearsExperience} yrs` : '—'}
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Fit Score</td>
                  {candidates.map(c => {
                    const fit = c.intelligence?.find((i: any) => i.type === 'fit_analysis');
                    return (
                      <td key={c.id} className="px-4 py-3 text-center">
                        <span className="text-lg font-bold text-gold">{fit?.data?.overallFit ?? '—'}</span>
                        {fit && <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>/100</span>}
                      </td>
                    );
                  })}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Interviews</td>
                  {candidates.map(c => (
                    <td key={c.id} className="px-4 py-3 text-center text-xs" style={{ color: 'var(--color-text-primary)' }}>
                      {c._count?.sessions ?? c.sessions?.length ?? 0}
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>References</td>
                  {candidates.map(c => (
                    <td key={c.id} className="px-4 py-3 text-center text-xs" style={{ color: 'var(--color-text-primary)' }}>
                      {c._count?.references ?? c.references?.length ?? 0}
                    </td>
                  ))}
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Source</td>
                  {candidates.map(c => (
                    <td key={c.id} className="px-4 py-3 text-center text-xs" style={{ color: 'var(--color-text-primary)' }}>
                      {c.source || '—'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/NavBar';

const BASE_URL = import.meta.env.BASE_URL || '/';
const apiUrl = (path: string) => `${BASE_URL}api/${path}`;

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

type TabKey = 'overview' | 'intelligence' | 'documents' | 'references' | 'notes' | 'interviews';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'intelligence', label: 'Intelligence' },
  { key: 'documents', label: 'Documents' },
  { key: 'references', label: 'References' },
  { key: 'notes', label: 'Notes' },
  { key: 'interviews', label: 'Interviews' },
];

export function CandidateProfilePage() {
  const [, params] = useRoute('/candidates/:id');
  const [, navigate] = useLocation();
  const candidateId = params?.id;

  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [noteText, setNoteText] = useState('');
  const [linkedinText, setLinkedinText] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [analyzing, setAnalyzing] = useState('');
  const [refForm, setRefForm] = useState({ refereeName: '', refereeEmail: '', refereeRelation: 'manager', refereeCompany: '' });
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [referenceLink, setReferenceLink] = useState<string | null>(null);

  const fetchCandidate = async () => {
    if (!candidateId) return;
    try {
      setFetchError(null);
      const res = await fetch(apiUrl(`candidates/${candidateId}`), { credentials: 'include' });
      if (res.status === 404) {
        setFetchError('not_found');
        setCandidate(null);
      } else if (!res.ok) {
        setFetchError('network');
      } else {
        setCandidate(await res.json());
      }
    } catch (err) {
      setFetchError('network');
      console.warn('Failed to load candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCandidate(); }, [candidateId]);

  const moveStage = async (stage: string) => {
    try {
      setActionError(null);
      const res = await fetch(apiUrl(`candidates/${candidateId}/stage`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ stage }),
      });
      if (!res.ok) throw new Error('Failed to update stage');
      fetchCandidate();
    } catch (err) {
      setActionError('Failed to update pipeline stage. Please try again.');
      console.warn('Failed to move candidate:', err);
    }
  };

  const analyzeLinkedIn = async () => {
    if (!linkedinText.trim()) return;
    setAnalyzing('linkedin');
    try {
      await fetch(apiUrl(`candidates/${candidateId}/analyze-linkedin`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ profileText: linkedinText }),
      });
      setLinkedinText('');
      fetchCandidate();
    } catch (err) {
      console.warn('LinkedIn analysis failed:', err);
    } finally {
      setAnalyzing('');
    }
  };

  const uploadResume = async () => {
    if (!resumeText.trim()) return;
    setAnalyzing('resume');
    try {
      await fetch(apiUrl(`candidates/${candidateId}/documents`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'resume', filename: 'resume.txt', mimeType: 'text/plain', content: resumeText }),
      });
      setResumeText('');
      fetchCandidate();
    } catch (err) {
      console.warn('Resume upload failed:', err);
    } finally {
      setAnalyzing('');
    }
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    try {
      setActionError(null);
      const res = await fetch(apiUrl(`candidates/${candidateId}/notes`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: noteText }),
      });
      if (!res.ok) throw new Error('Failed to add note');
      setNoteText('');
      fetchCandidate();
    } catch (err) {
      setActionError('Failed to add note. Please try again.');
      console.warn('Failed to add note:', err);
    }
  };

  const addReference = async () => {
    if (!refForm.refereeName.trim()) return;
    try {
      setActionError(null);
      const res = await fetch(apiUrl(`candidates/${candidateId}/references`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(refForm),
      });
      if (!res.ok) throw new Error('Failed to add reference');
      setRefForm({ refereeName: '', refereeEmail: '', refereeRelation: 'manager', refereeCompany: '' });
      fetchCandidate();
    } catch (err) {
      setActionError('Failed to add reference. Please try again.');
      console.warn('Failed to add reference:', err);
    }
  };

  const sendReference = async (refId: string) => {
    try {
      setActionError(null);
      setReferenceLink(null);
      const res = await fetch(apiUrl(`candidates/${candidateId}/references/${refId}/send`), {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to send reference questionnaire');
      const data = await res.json();
      setReferenceLink(`${window.location.origin}${data.referenceUrl}`);
      fetchCandidate();
    } catch (err) {
      setActionError('Failed to send reference questionnaire. Please try again.');
      console.warn('Failed to send reference:', err);
    }
  };

  const analyzeReference = async (refId: string) => {
    setAnalyzing(`ref-${refId}`);
    try {
      setActionError(null);
      const res = await fetch(apiUrl(`candidates/${candidateId}/references/${refId}/analyze`), { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to analyze reference');
      fetchCandidate();
    } catch (err) {
      setActionError('Failed to analyze reference. Please try again.');
      console.warn('Failed to analyze reference:', err);
    } finally {
      setAnalyzing('');
    }
  };

  const generateBriefing = async () => {
    setAnalyzing('briefing');
    try {
      const res = await fetch(apiUrl(`candidates/${candidateId}/generate-briefing`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roleName: candidate?.currentRole || 'General', roleLevel: 'C-Suite' }),
      });
      if (res.ok) fetchCandidate();
    } catch (err) {
      console.warn('Briefing generation failed:', err);
    } finally {
      setAnalyzing('');
    }
  };

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

  if (loading) {
    return (
      <div className="bg-gradient-dark min-h-screen safe-top">
        <NavBar />
        <div className="flex items-center justify-center py-20"><div className="spinner" /></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="bg-gradient-dark min-h-screen safe-top">
        <NavBar />
        <div className="text-center py-20" style={{ color: 'var(--color-text-secondary)' }}>
          {fetchError === 'not_found' ? (
            <>
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Candidate not found</p>
              <p className="text-sm mb-4">This candidate may have been removed or the link is incorrect.</p>
              <button onClick={() => navigate('/candidates')} className="btn btn-primary btn-sm">Back to Pipeline</button>
            </>
          ) : fetchError === 'network' ? (
            <>
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Connection error</p>
              <p className="text-sm mb-4">Could not load candidate data. Please check your connection and try again.</p>
              <button onClick={() => { setLoading(true); fetchCandidate(); }} className="btn btn-primary btn-sm">Retry</button>
            </>
          ) : (
            <p>Candidate not found</p>
          )}
        </div>
      </div>
    );
  }

  const intelligence = candidate.intelligence || [];
  const documents = candidate.documents || [];
  const references = candidate.references || [];
  const notes = candidate.notes || [];
  const sessions = candidate.sessions || [];

  const resumeAnalysis = intelligence.find((i: any) => i.type === 'resume_analysis');
  const linkedinAnalysis = intelligence.find((i: any) => i.type === 'linkedin_analysis');
  const fitAnalysis = intelligence.find((i: any) => i.type === 'fit_analysis');
  const briefing = intelligence.find((i: any) => i.type === 'briefing');

  return (
    <div className="bg-gradient-dark min-h-screen safe-top">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-24">
        {/* Back + Header */}
        <button onClick={() => navigate('/candidates')} className="text-sm mb-4 hover:opacity-80 transition-opacity" style={{ color: 'var(--color-text-secondary)' }}>
          &larr; Back to Pipeline
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="heading-lg" style={{ color: 'var(--color-text-primary)' }}>{candidate.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {candidate.currentRole && (
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {candidate.currentRole}{candidate.currentCompany ? ` at ${candidate.currentCompany}` : ''}
                </span>
              )}
              <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: `${stageColor(candidate.pipelineStage)}20`, color: stageColor(candidate.pipelineStage) }}>
                {PIPELINE_STAGES.find(s => s.key === candidate.pipelineStage)?.label}
              </span>
              {candidate.source && (
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-secondary)' }}>
                  {candidate.source}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={candidate.pipelineStage}
              onChange={e => moveStage(e.target.value)}
              className="text-xs font-medium px-3 py-2 rounded-lg"
              style={{ ...inputStyle, maxWidth: 160, fontSize: '0.75rem' }}
            >
              {PIPELINE_STAGES.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
            <motion.button onClick={generateBriefing} disabled={analyzing === 'briefing'} className="btn btn-primary btn-sm" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {analyzing === 'briefing' ? 'Generating...' : 'Generate AI Briefing'}
            </motion.button>
          </div>
        </div>

        {/* Contact Info */}
        {(candidate.email || candidate.phone || candidate.linkedinUrl) && (
          <div className="flex gap-4 mb-6 flex-wrap text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {candidate.email && <span>{candidate.email}</span>}
            {candidate.phone && <span>{candidate.phone}</span>}
            {candidate.linkedinUrl && <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">LinkedIn</a>}
          </div>
        )}

        {/* Action Error Banner */}
        {actionError && (
          <div className="mb-4 rounded-xl p-4 flex items-center justify-between" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <span className="text-sm" style={{ color: '#EF4444' }}>{actionError}</span>
            <button onClick={() => setActionError(null)} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
              Dismiss
            </button>
          </div>
        )}

        {/* Reference Link Banner */}
        {referenceLink && (
          <div className="mb-4 rounded-xl p-4" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: '#34D399' }}>Reference form link generated</span>
              <button onClick={() => setReferenceLink(null)} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399' }}>
                Dismiss
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input readOnly value={referenceLink} className="flex-1 text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid rgba(255,255,255,0.06)' }} />
              <button onClick={() => { navigator.clipboard.writeText(referenceLink); }} className="btn btn-primary btn-sm">Copy</button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap"
              style={{
                color: activeTab === tab.key ? 'var(--color-gold)' : 'var(--color-text-secondary)',
                borderBottom: activeTab === tab.key ? '2px solid var(--color-gold)' : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid gap-4 md:grid-cols-2">
            {/* Pipeline Timeline */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Pipeline Stage</h3>
              <div className="flex items-center gap-1 overflow-x-auto">
                {PIPELINE_STAGES.filter(s => !['rejected', 'withdrawn'].includes(s.key)).map((stage, i) => {
                  const isActive = candidate.pipelineStage === stage.key;
                  const stageIdx = PIPELINE_STAGES.findIndex(s => s.key === stage.key);
                  const currentIdx = PIPELINE_STAGES.findIndex(s => s.key === candidate.pipelineStage);
                  const isPast = stageIdx < currentIdx;
                  return (
                    <div key={stage.key} className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: isActive ? stage.color : isPast ? `${stage.color}40` : 'rgba(255,255,255,0.06)',
                          color: isActive || isPast ? '#0D0D1A' : 'var(--color-text-secondary)',
                        }}
                      >
                        {isPast ? '✓' : i + 1}
                      </div>
                      {i < 5 && <div className="w-4 h-0.5 mx-0.5" style={{ background: isPast ? `${stage.color}60` : 'rgba(255,255,255,0.06)' }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Interviews', value: sessions.length },
                  { label: 'References', value: references.length },
                  { label: 'Documents', value: documents.length },
                  { label: 'AI Analyses', value: intelligence.length },
                ].map(stat => (
                  <div key={stat.label} className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="text-xl font-bold text-gold">{stat.value}</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Highlights */}
            {resumeAnalysis && (
              <div className="glass rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Resume Highlights</h3>
                {resumeAnalysis.data?.strengths && (
                  <div className="mb-3">
                    <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-gold)' }}>Strengths</div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {resumeAnalysis.data.strengths.slice(0, 4).map((s: string, i: number) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                )}
                {resumeAnalysis.data?.redFlags?.length > 0 && (
                  <div>
                    <div className="text-xs font-medium mb-1 text-red-400">Red Flags</div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {resumeAnalysis.data.redFlags.map((f: string, i: number) => <li key={i}>• {f}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Fit Analysis */}
            {fitAnalysis && (
              <div className="glass rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Fit Analysis</h3>
                <div className="text-3xl font-bold text-gold mb-2">{fitAnalysis.data?.overallFit || '—'}<span className="text-lg">/100</span></div>
                {fitAnalysis.data?.gaps?.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs font-medium mb-1 text-amber-400">Gaps</div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {fitAnalysis.data.gaps.slice(0, 3).map((g: string, i: number) => <li key={i}>• {g}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Briefing */}
            {briefing && (
              <div className="glass rounded-xl p-5 md:col-span-2">
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>AI Interview Briefing</h3>
                <div className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>{briefing.data?.interviewStrategy}</div>
                {briefing.data?.suggestedQuestions?.length > 0 && (
                  <div>
                    <div className="text-xs font-medium mb-2" style={{ color: 'var(--color-gold)' }}>Suggested Questions</div>
                    <div className="space-y-2">
                      {briefing.data.suggestedQuestions.slice(0, 5).map((q: any, i: number) => (
                        <div key={i} className="p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <div className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>{q.question}</div>
                          <div className="text-[10px] mt-1" style={{ color: 'var(--color-text-secondary)' }}>{q.rationale}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'intelligence' && (
          <div className="space-y-6">
            {/* LinkedIn Analysis Input */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Analyze LinkedIn Profile</h3>
              <textarea
                style={{ ...inputStyle, minHeight: 100, resize: 'none' }}
                placeholder="Paste LinkedIn profile text here..."
                value={linkedinText}
                onChange={e => setLinkedinText(e.target.value)}
              />
              <motion.button
                onClick={analyzeLinkedIn}
                disabled={!linkedinText.trim() || analyzing === 'linkedin'}
                className="btn btn-primary btn-sm mt-3 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {analyzing === 'linkedin' ? 'Analyzing...' : 'Analyze with AI'}
              </motion.button>
            </div>

            {/* Existing Intelligence */}
            {intelligence.map((intel: any) => (
              <div key={intel.id} className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {intel.type.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  </h3>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {new Date(intel.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-60 p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--color-text-secondary)' }}>
                  {JSON.stringify(intel.data, null, 2)}
                </pre>
              </div>
            ))}
            {intelligence.length === 0 && !linkedinText && (
              <div className="text-center py-12 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                No intelligence gathered yet. Upload a resume or paste LinkedIn profile text to begin.
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Resume Upload */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Upload Resume (Text)</h3>
              <textarea
                style={{ ...inputStyle, minHeight: 120, resize: 'none' }}
                placeholder="Paste resume text here..."
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
              />
              <motion.button
                onClick={uploadResume}
                disabled={!resumeText.trim() || analyzing === 'resume'}
                className="btn btn-primary btn-sm mt-3 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {analyzing === 'resume' ? 'Uploading & Analyzing...' : 'Upload & Analyze'}
              </motion.button>
            </div>

            {/* Document List */}
            {documents.map((doc: any) => (
              <div key={doc.id} className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>{doc.filename}</div>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--color-gold)' }}>{doc.type}</span>
                </div>
                <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {doc.mimeType} &middot; {new Date(doc.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {documents.length === 0 && !resumeText && (
              <div className="text-center py-12 text-sm" style={{ color: 'var(--color-text-secondary)' }}>No documents uploaded yet.</div>
            )}
          </div>
        )}

        {activeTab === 'references' && (
          <div className="space-y-6">
            {/* Add Reference */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Add Referee</h3>
              <div className="grid grid-cols-2 gap-3">
                <input style={inputStyle} placeholder="Referee name *" value={refForm.refereeName} onChange={e => setRefForm(p => ({ ...p, refereeName: e.target.value }))} />
                <input style={inputStyle} placeholder="Email" type="email" value={refForm.refereeEmail} onChange={e => setRefForm(p => ({ ...p, refereeEmail: e.target.value }))} />
                <select style={inputStyle} value={refForm.refereeRelation} onChange={e => setRefForm(p => ({ ...p, refereeRelation: e.target.value }))}>
                  {['manager', 'peer', 'report', 'client'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input style={inputStyle} placeholder="Company" value={refForm.refereeCompany} onChange={e => setRefForm(p => ({ ...p, refereeCompany: e.target.value }))} />
              </div>
              <motion.button
                onClick={addReference}
                disabled={!refForm.refereeName.trim()}
                className="btn btn-primary btn-sm mt-3 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Referee
              </motion.button>
            </div>

            {/* Reference List */}
            {references.map((ref: any) => (
              <div key={ref.id} className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>{ref.refereeName}</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{ref.refereeRelation}{ref.refereeCompany ? ` at ${ref.refereeCompany}` : ''}</div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full" style={{
                    background: ref.status === 'completed' ? 'rgba(52,211,153,0.1)' : ref.status === 'sent' ? 'rgba(96,165,250,0.1)' : 'rgba(255,255,255,0.06)',
                    color: ref.status === 'completed' ? '#34D399' : ref.status === 'sent' ? '#60A5FA' : 'var(--color-text-secondary)',
                  }}>
                    {ref.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  {ref.status === 'pending' && (
                    <button onClick={() => sendReference(ref.id)} className="btn btn-ghost btn-sm">Send Questionnaire</button>
                  )}
                  {ref.status === 'completed' && !ref.aiAnalysis && (
                    <motion.button
                      onClick={() => analyzeReference(ref.id)}
                      disabled={analyzing === `ref-${ref.id}`}
                      className="btn btn-primary btn-sm disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {analyzing === `ref-${ref.id}` ? 'Analyzing...' : 'AI Analyze'}
                    </motion.button>
                  )}
                </div>
                {ref.aiAnalysis && (
                  <div className="mt-3 p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-gold)' }}>AI Analysis</div>
                    <pre className="text-xs whitespace-pre-wrap max-h-40 overflow-auto" style={{ color: 'var(--color-text-secondary)' }}>
                      {JSON.stringify(ref.aiAnalysis, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
            {references.length === 0 && (
              <div className="text-center py-12 text-sm" style={{ color: 'var(--color-text-secondary)' }}>No references added yet.</div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            {/* Add Note */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Add Note</h3>
              <textarea
                style={{ ...inputStyle, minHeight: 80, resize: 'none' }}
                placeholder="Write a note about this candidate..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
              />
              <motion.button
                onClick={addNote}
                disabled={!noteText.trim()}
                className="btn btn-primary btn-sm mt-3 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Note
              </motion.button>
            </div>

            {/* Notes List */}
            {notes.map((note: any) => (
              <div key={note.id} className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--color-gold)' }}>{note.userName}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{note.content}</p>
              </div>
            ))}
            {notes.length === 0 && !noteText && (
              <div className="text-center py-12 text-sm" style={{ color: 'var(--color-text-secondary)' }}>No notes yet.</div>
            )}
          </div>
        )}

        {activeTab === 'interviews' && (
          <div className="space-y-4">
            {sessions.map((session: any) => (
              <div key={session.id} className="glass rounded-xl p-5 cursor-pointer hover:ring-1 hover:ring-[var(--color-gold)]/30 transition-all" onClick={() => navigate(`/report/${session.id}`)}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      {session.setup?.roleName || 'Interview'} — {session.setup?.roleLevel || ''}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {new Date(session.createdAt).toLocaleDateString()} &middot; {session.status}
                    </div>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--color-gold)' }}>View Report &rarr;</span>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="text-center py-12 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                No interviews conducted yet.
                <br />
                <button onClick={() => navigate('/setup')} className="text-gold mt-2 hover:underline">Start an interview</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

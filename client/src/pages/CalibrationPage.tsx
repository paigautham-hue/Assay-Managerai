import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/NavBar';
import { useAuth } from '@/context/AuthContext';
import { DIMENSION_DISPLAY_NAMES } from '../types';
import type { AssayReport } from '../types';

const BASE_URL = import.meta.env.BASE_URL || '/';

interface CalibrationNote {
  id: string;
  calibrationSessionId: string;
  userId: string;
  userName: string;
  content: string;
  sectionRef: string | null;
  createdAt: string;
}

interface CalibrationSession {
  id: string;
  reportId: string;
  title: string;
  status: string;
  createdAt: string;
  notes: CalibrationNote[];
}

const SECTION_OPTIONS = [
  { value: '', label: 'General' },
  { value: 'gate_banner', label: 'Gate Status' },
  { value: 'executive_summary', label: 'Executive Summary' },
  { value: 'case_against', label: 'Case Against' },
  { value: 'pyramid_score', label: 'Pyramid Score' },
  ...Object.entries(DIMENSION_DISPLAY_NAMES).map(([key, label]) => ({
    value: `dimension_${key}`,
    label,
  })),
  { value: 'raise_the_bar', label: 'Raise the Bar' },
  { value: 'context_fit', label: 'Context Fit' },
  { value: 'deliberation', label: 'Deliberation' },
  { value: 'follow_up', label: 'Follow-Up Questions' },
  { value: 'psychological', label: 'Psychological Profile' },
];

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function avatarColor(userId: string): string {
  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#14B8A6'];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0;
  return colors[Math.abs(hash) % colors.length];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Mini Report Viewer (left panel) ─────────────────────────────────────────

function ReportViewer({ report }: { report: AssayReport }) {
  const gateColor = report.gateBanner.status === 'passed' ? 'var(--color-green)' : report.gateBanner.status === 'flagged' ? 'var(--color-amber)' : 'var(--color-red)';
  const gateBg = report.gateBanner.status === 'passed' ? 'rgba(52,211,153,0.1)' : report.gateBanner.status === 'flagged' ? 'rgba(251,191,36,0.1)' : 'rgba(248,113,113,0.1)';

  return (
    <div className="space-y-4">
      {/* Gate Banner */}
      <div data-section="gate_banner" className="rounded-xl p-6 text-center" style={{ background: gateBg, border: `2px solid ${gateColor}` }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: gateColor }}>Overall Assessment</p>
        <h3 className="text-lg font-bold mb-1" style={{ color: gateColor }}>
          {report.gateBanner.status === 'passed' ? 'Clear to Advance' : report.gateBanner.status === 'flagged' ? 'Proceed With Caution' : 'Do Not Advance'}
        </h3>
        <p className="text-sm font-semibold" style={{ color: gateColor }}>
          {report.pyramidScore.overall.toFixed(2)} / 5.0
        </p>
      </div>

      {/* Executive Summary */}
      <div data-section="executive_summary" className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-gold)' }}>Executive Summary</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{report.executiveSummary}</p>
      </div>

      {/* Case Against */}
      {report.caseAgainst && (
        <div data-section="case_against" className="rounded-xl p-6" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-red)' }}>Case Against</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{report.caseAgainst}</p>
        </div>
      )}

      {/* Pyramid Score */}
      <div data-section="pyramid_score" className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-gold)' }}>Dimension Scores</h3>
        <div className="space-y-2">
          {report.pyramidScore.dimensions.map(d => (
            <div key={d.dimension} className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {DIMENSION_DISPLAY_NAMES[d.dimension] || d.dimension}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(d.score / 5) * 100}%`, background: d.score >= 3.5 ? 'var(--color-green)' : d.score >= 2.5 ? 'var(--color-amber)' : 'var(--color-red)' }} />
                </div>
                <span className="text-xs font-mono w-8 text-right" style={{ color: 'var(--color-text-primary)' }}>{d.score.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Assessment */}
      {report.deepAssessment?.map(da => (
        <div key={da.dimension} data-section={`dimension_${da.dimension}`} className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-gold)' }}>
            {DIMENSION_DISPLAY_NAMES[da.dimension] || da.dimension}
          </h3>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>{da.narrative}</p>
          {da.strengths.length > 0 && (
            <div className="mb-2">
              <span className="text-xs font-semibold" style={{ color: 'var(--color-green)' }}>Strengths: </span>
              <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{da.strengths.join(', ')}</span>
            </div>
          )}
          {da.concerns.length > 0 && (
            <div>
              <span className="text-xs font-semibold" style={{ color: 'var(--color-red)' }}>Concerns: </span>
              <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{da.concerns.join(', ')}</span>
            </div>
          )}
        </div>
      ))}

      {/* Raise the Bar */}
      {report.raiseTheBar && (
        <div data-section="raise_the_bar" className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-gold)' }}>Raise the Bar</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{report.raiseTheBar}</p>
        </div>
      )}

      {/* Context Fit */}
      {report.contextFit && (
        <div data-section="context_fit" className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-gold)' }}>Context Fit</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{report.contextFit}</p>
        </div>
      )}

      {/* Deliberation */}
      {report.deliberation && (
        <div data-section="deliberation" className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-gold)' }}>Deliberation</h3>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--color-text-secondary)' }}>{report.deliberation.chairmanSynthesis}</p>
          <p className="text-xs font-semibold mt-2" style={{ color: report.deliberation.finalRecommendation === 'hire' ? 'var(--color-green)' : 'var(--color-red)' }}>
            Final: {report.deliberation.finalRecommendation.replace(/_/g, ' ').toUpperCase()}
          </p>
        </div>
      )}

      {/* Follow-Up Questions */}
      {report.followUpQuestions?.length > 0 && (
        <div data-section="follow_up" className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--color-gold)' }}>Follow-Up Questions</h3>
          <ul className="space-y-2">
            {report.followUpQuestions.map((q, i) => (
              <li key={i} className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{i + 1}.</span> {q.question}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Notes Panel (right side) ────────────────────────────────────────────────

function NotesPanel({
  notes,
  onAddNote,
  viewerCount,
  sessionStatus,
}: {
  notes: CalibrationNote[];
  onAddNote: (content: string, sectionRef: string) => void;
  viewerCount: number;
  sessionStatus: string;
}) {
  const [content, setContent] = useState('');
  const [sectionRef, setSectionRef] = useState('');
  const notesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    notesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [notes.length]);

  // Group notes by section
  const grouped = new Map<string, CalibrationNote[]>();
  for (const note of notes) {
    const key = note.sectionRef || '';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(note);
  }

  const sectionLabel = (ref: string) => {
    if (!ref) return 'General';
    const found = SECTION_OPTIONS.find(o => o.value === ref);
    return found?.label || ref;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddNote(content.trim(), sectionRef);
    setContent('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Viewer count badge */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-tertiary)' }}>
          Team Notes
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-green)' }} />
          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            {viewerCount} {viewerCount === 1 ? 'viewer' : 'viewers'}
          </span>
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        {notes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>No notes yet. Start the conversation.</p>
          </div>
        )}

        {Array.from(grouped.entries()).map(([section, sectionNotes]) => (
          <div key={section}>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ color: 'var(--color-gold)', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                {sectionLabel(section)}
              </span>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {sectionNotes.map(note => (
              <motion.div
                key={note.id}
                className="flex gap-3 mb-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background: avatarColor(note.userId), color: '#fff' }}
                >
                  {getInitials(note.userName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>{note.userName}</span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{timeAgo(note.createdAt)}</span>
                  </div>
                  <p className="text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{note.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
        <div ref={notesEndRef} />
      </div>

      {/* Add note form */}
      {sessionStatus === 'active' && (
        <form onSubmit={handleSubmit} className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex gap-2 mb-2">
            <select
              value={sectionRef}
              onChange={e => setSectionRef(e.target.value)}
              className="text-xs px-2 py-1.5 rounded-lg flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--color-text-secondary)',
                outline: 'none',
              }}
            >
              {SECTION_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Add a note..."
              className="flex-1 text-sm px-3 py-2 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--color-text-primary)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{
                background: content.trim() ? 'var(--color-gold)' : 'rgba(255,255,255,0.05)',
                color: content.trim() ? '#000' : 'var(--color-text-tertiary)',
                cursor: content.trim() ? 'pointer' : 'default',
              }}
            >
              Send
            </button>
          </div>
        </form>
      )}

      {sessionStatus === 'concluded' && (
        <div className="p-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>This calibration session has been concluded.</p>
        </div>
      )}
    </div>
  );
}

// ─── Calibration Page ────────────────────────────────────────────────────────

export function CalibrationPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const [session, setSession] = useState<CalibrationSession | null>(null);
  const [report, setReport] = useState<AssayReport | null>(null);
  const [notes, setNotes] = useState<CalibrationNote[]>([]);
  const [viewerCount, setViewerCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch session and report
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const sessionRes = await fetch(`${BASE_URL}api/calibration/${id}`, { credentials: 'include' });
        if (!sessionRes.ok) throw new Error('Session not found');
        const sessionData: CalibrationSession = await sessionRes.json();
        setSession(sessionData);
        setNotes(sessionData.notes);

        const reportRes = await fetch(`${BASE_URL}api/reports/${sessionData.reportId}`, { credentials: 'include' });
        if (!reportRes.ok) throw new Error('Report not found');
        const reportData = await reportRes.json();
        // reportData could be the full report object or have reportData nested
        const parsed: AssayReport = reportData.reportData
          ? { ...reportData.reportData, id: reportData.id, sessionId: reportData.sessionId, candidateName: reportData.candidateName, roleName: reportData.roleName, createdAt: reportData.createdAt }
          : reportData;
        setReport(parsed);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // SSE connection for real-time updates
  useEffect(() => {
    if (!id) return;

    const es = new EventSource(`${BASE_URL}api/calibration/${id}/stream`, { withCredentials: true } as any);
    eventSourceRef.current = es;

    es.addEventListener('note', (e: MessageEvent) => {
      const note: CalibrationNote = JSON.parse(e.data);
      setNotes(prev => {
        if (prev.some(n => n.id === note.id)) return prev;
        return [...prev, note];
      });
    });

    es.addEventListener('viewers', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setViewerCount(data.count);
    });

    es.addEventListener('status', (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setSession(prev => prev ? { ...prev, status: data.status } : prev);
    });

    es.onerror = () => {
      // EventSource auto-reconnects
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [id]);

  const handleAddNote = useCallback(async (content: string, sectionRef: string) => {
    if (!id) return;
    try {
      await fetch(`${BASE_URL}api/calibration/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content, sectionRef: sectionRef || null }),
      });
    } catch {
      // Note will appear via SSE if successful
    }
  }, [id]);

  const handleConclude = useCallback(async () => {
    if (!id || !confirm('Conclude this calibration session?')) return;
    try {
      await fetch(`${BASE_URL}api/calibration/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'concluded' }),
      });
    } catch {
      // Status update will appear via SSE
    }
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

  if (error || !session || !report) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <NavBar />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>{error || 'Session not found'}</p>
          <button onClick={() => navigate('/')} className="btn btn-secondary mt-6">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <NavBar />

      {/* Header */}
      <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/report/${session.reportId}`)}
              className="text-sm flex items-center gap-1 transition-colors"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              ← Back
            </button>
            <div>
              <h1 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{session.title}</h1>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                {report.candidateName} &middot; {report.roleName}
                {session.status === 'concluded' && (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-tertiary)' }}>
                    Concluded
                  </span>
                )}
              </p>
            </div>
          </div>
          {session.status === 'active' && (
            <button
              onClick={handleConclude}
              className="btn btn-secondary px-4 py-2 text-sm"
            >
              Conclude Session
            </button>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Left: Report (60%) */}
        <div className="w-[60%] overflow-y-auto p-6" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-3xl mx-auto">
            <ReportViewer report={report} />
          </div>
        </div>

        {/* Right: Notes panel (40%) */}
        <div className="w-[40%] flex flex-col" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <NotesPanel
            notes={notes}
            onAddNote={handleAddNote}
            viewerCount={viewerCount}
            sessionStatus={session.status}
          />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useAssayStore } from '@/store/useAssayStore';
import type { InterviewSession, InterviewSetup, GateName } from '@/types';

const BASE_URL = import.meta.env.BASE_URL || '/';
const apiUrl = (path: string) => `${BASE_URL}api/${path}`;

interface InviteData {
  id: string;
  candidateName: string;
  candidateEmail: string | null;
  roleName: string;
  roleLevel: string;
  jobDescription: string | null;
  activeGates: string[];
  interviewMode: string;
  status: string;
  expiresAt: string;
}

type PageState = 'loading' | 'ready' | 'starting' | 'error';

export function CandidateInvitePage() {
  const [, params] = useRoute('/invite/:token');
  const [, navigate] = useLocation();
  const token = params?.token;
  const { refresh } = useAuth();
  const setSession = useAssayStore(s => s.setSession);

  const [invite, setInvite] = useState<InviteData | null>(null);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [candidateName, setCandidateName] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchInvite();
  }, [token]);

  async function fetchInvite() {
    try {
      const res = await fetch(apiUrl(`public/invite/${token}`));
      if (res.ok) {
        const data = await res.json();
        setInvite(data);
        setCandidateName(data.candidateName || '');
        setPageState('ready');
      } else {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        if (res.status === 410) {
          setErrorMessage('This invite link has expired. Please request a new one from your interviewer.');
        } else if (res.status === 409) {
          setErrorMessage('This interview has already been started. Please contact your interviewer if you need a new link.');
        } else if (res.status === 404) {
          setErrorMessage('This invite link is invalid. Please check the URL or request a new link.');
        } else {
          setErrorMessage(err.error || 'Something went wrong. Please try again.');
        }
        setPageState('error');
      }
    } catch {
      setErrorMessage('Unable to connect. Please check your internet connection and try again.');
      setPageState('error');
    }
  }

  async function handleStart() {
    if (!token || !candidateName.trim()) return;
    setPageState('starting');

    try {
      const res = await fetch(apiUrl(`public/invite/${token}/start`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // credentials: 'include' required so the server's Set-Cookie (candidate JWT)
        // is stored by the browser/WKWebView for subsequent authenticated API calls.
        credentials: 'include',
        body: JSON.stringify({ candidateName: candidateName.trim() }),
      });

      if (res.ok) {
        const data = await res.json();

        // Build a frontend InterviewSession from the server-created DB record.
        const dbSession = data.session;
        const setup = dbSession.setup as InterviewSetup;
        const session: InterviewSession = {
          id: dbSession.id,
          setup: {
            ...setup,
            activeGates: (setup.activeGates ?? []) as GateName[],
          },
          status: 'preparing',
          transcript: [],
          observations: [],
          voiceProvider: 'gemini',
        };

        // Hydrate the Zustand store so InterviewPage finds the session.
        setSession(session);

        // Reload auth context — the server set an ephemeral candidate JWT cookie
        // so /auth/me now returns a valid user with role 'interviewer'.
        await refresh();

        navigate('/interview');
      } else {
        const err = await res.json().catch(() => ({ error: 'Failed to start' }));
        setErrorMessage(err.error || 'Failed to start the interview. Please try again.');
        setPageState('error');
      }
    } catch {
      setErrorMessage('Unable to connect. Please check your internet connection and try again.');
      setPageState('error');
    }
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center safe-top pb-safe"
      style={{ background: 'linear-gradient(170deg, #0D0D1A 0%, #0F1028 40%, #111130 70%, #0D0D1A 100%)' }}
    >
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
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
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 0.5px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)' }}
        />
      </div>

      <div className="relative w-full max-w-lg mx-auto px-5">
        <AnimatePresence mode="wait">
          {/* Loading state */}
          {pageState === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-12 h-12 rounded-full border-2 border-t-transparent mx-auto mb-4 animate-spin" style={{ borderColor: 'rgba(201,168,76,0.3)', borderTopColor: 'transparent' }} />
              <p style={{ color: 'var(--color-text-secondary)' }}>Loading interview details...</p>
            </motion.div>
          )}

          {/* Error state */}
          {pageState === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl p-8 sm:p-10 text-center"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <svg className="w-8 h-8" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Unable to Load Interview</h2>
              <p className="mb-6" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{errorMessage}</p>
              <button
                onClick={() => { setPageState('loading'); fetchInvite(); }}
                className="text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
                style={{ color: 'var(--color-gold)', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Ready / Starting state */}
          {(pageState === 'ready' || pageState === 'starting') && invite && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Logo */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold" style={{
                  background: 'linear-gradient(135deg, #D4B85A 0%, #F5E6A3 30%, #C9A84C 60%, #B8943D 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  letterSpacing: '-0.04em',
                }}>ASSAY</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Executive Interview Assessment</p>
              </div>

              {/* Main card */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                {/* Header accent */}
                <div className="h-1" style={{ background: 'linear-gradient(90deg, #D4B85A, #C9A84C, #B8943D)' }} />

                <div className="p-8 sm:p-10">
                  <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>You're Invited to Interview</h2>
                  <p className="text-sm mb-8" style={{ color: 'var(--color-text-tertiary)' }}>Complete your AI-powered interview assessment</p>

                  {/* Role details */}
                  <div className="space-y-3 mb-8">
                    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Role</div>
                      <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{invite.roleName}</div>
                    </div>
                    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Level</div>
                      <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{invite.roleLevel}</div>
                    </div>
                    {invite.jobDescription && (
                      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Description</div>
                        <div className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{invite.jobDescription}</div>
                      </div>
                    )}
                  </div>

                  {/* Candidate name input */}
                  <div className="mb-8">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="Enter your full name"
                      autoCapitalize="words"
                      autoCorrect="off"
                      spellCheck={false}
                      className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all focus:ring-2 focus:ring-[#C9A84C]/30 min-h-[44px]"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'var(--color-text-primary)',
                        WebkitAppearance: 'none',
                      }}
                    />
                  </div>

                  {/* Requirements */}
                  <div className="mb-6 space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Before You Begin</p>
                    <div className="space-y-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      <div className="flex items-start gap-2"><span>🎤</span><span>A working microphone is required</span></div>
                      <div className="flex items-start gap-2"><span>🔇</span><span>Find a quiet environment with minimal background noise</span></div>
                      <div className="flex items-start gap-2"><span>⏱</span><span>Allow 45-90 minutes for the full interview</span></div>
                      <div className="flex items-start gap-2"><span>🌐</span><span>Stable internet connection recommended</span></div>
                      <div className="flex items-start gap-2"><span>💻</span><span>Use Chrome, Safari, or Edge for the best experience</span></div>
                    </div>
                  </div>

                  {/* Start button */}
                  <button
                    onClick={handleStart}
                    disabled={pageState === 'starting' || !candidateName.trim()}
                    className="w-full group relative inline-flex items-center justify-center gap-3 font-bold px-8 py-4 rounded-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{
                      background: pageState === 'starting'
                        ? 'rgba(201,168,76,0.3)'
                        : 'linear-gradient(135deg, #D4B85A 0%, #C9A84C 50%, #B8943D 100%)',
                      color: '#0D0D1A',
                      boxShadow: '0 4px 20px rgba(201,168,76,0.35)',
                      fontSize: '1.0625rem',
                    }}
                  >
                    {pageState === 'starting' ? (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        <span>Preparing Interview...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3l14 9-14 9V3z" />
                        </svg>
                        <span>Start Interview</span>
                      </>
                    )}
                  </button>

                  {/* Info footer */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure, AI-powered interview assessment</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

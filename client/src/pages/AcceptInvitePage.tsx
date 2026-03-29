import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { ROLE_DISPLAY_NAMES } from '@/types/admin';
import type { UserRole } from '@/types/admin';

const BASE_URL = import.meta.env.BASE_URL || '/';
const api = (path: string) => `${BASE_URL}api/${path}`;

interface InviteInfo {
  email: string;
  role: UserRole;
  expiresAt: string;
}

export function AcceptInvitePage() {
  const [, navigate] = useLocation();
  const { login } = useAuth();

  const token = new URLSearchParams(window.location.search).get('token') || '';

  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [loadError, setLoadError] = useState('');
  const [isLoadingInvite, setIsLoadingInvite] = useState(true);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!token) { setLoadError('No invitation token provided.'); setIsLoadingInvite(false); return; }
    fetch(api(`auth/accept-invite/${token}`))
      .then(async r => {
        const data = await r.json();
        if (!r.ok) { setLoadError(data.error || 'Invalid invitation'); return; }
        setInvite(data);
      })
      .catch(() => setLoadError('Failed to load invitation'))
      .finally(() => setIsLoadingInvite(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!invite) return;
    if (!name.trim()) { setSubmitError('Name is required'); return; }
    if (password.length < 8) { setSubmitError('Password must be at least 8 characters'); return; }
    if (password !== confirmPassword) { setSubmitError('Passwords do not match'); return; }

    setIsSubmitting(true); setSubmitError('');
    try {
      const res = await fetch(api('auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: invite.email.trim().toLowerCase(), name: name.trim(), password, inviteToken: token }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitError(data.error || 'Registration failed'); return; }
      await login(invite.email.trim().toLowerCase(), password);
      navigate('/');
    } catch { setSubmitError('Network error — please try again'); }
    finally { setIsSubmitting(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 safe-top pb-safe" style={{ background: '#0D0D1A' }}>
      <motion.div className="w-full max-w-sm" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-[#C9A84C] text-2xl font-bold">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white">ASSAY</h1>
          <p className="text-[#8B8B9E] text-sm mt-1">Executive Interview Assessment</p>
        </div>

        <div className="bg-[#12122A] border border-white/8 rounded-2xl p-6 shadow-2xl">
          {isLoadingInvite ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : loadError ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-3">⚠️</div>
              <p className="text-white font-semibold mb-1">Invitation Problem</p>
              <p className="text-[#8B8B9E] text-sm mb-4">{loadError}</p>
              <button onClick={() => navigate('/login')} className="text-[#C9A84C] text-sm hover:underline active:opacity-60 py-2 px-4 min-h-[44px]">Go to login →</button>
            </div>
          ) : invite ? (
            <>
              <div className="bg-[#C9A84C]/8 border border-[#C9A84C]/20 rounded-xl p-4 mb-5">
                <p className="text-[#8B8B9E] text-xs mb-1">You've been invited to join as</p>
                <p className="text-[#C9A84C] font-semibold text-sm">{ROLE_DISPLAY_NAMES[invite.role]}</p>
                <p className="text-[#8B8B9E] text-xs mt-1 font-mono">{invite.email}</p>
              </div>

              <h2 className="text-white font-bold text-base mb-4">Create your account</h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[#8B8B9E] text-xs font-medium mb-1">Email</label>
                  <input
                    type="email" value={invite.email} disabled
                    className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-[#8B8B9E] text-base opacity-70 min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-[#8B8B9E] text-xs font-medium mb-1">Full name</label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)} required autoFocus
                    placeholder="Your full name"
                    autoCapitalize="words" autoCorrect="off" spellCheck={false}
                    className="w-full bg-[#0D0D1A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-base placeholder-[#4A4A5E] focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                    style={{ WebkitAppearance: 'none' }}
                  />
                </div>
                <div>
                  <label className="block text-[#8B8B9E] text-xs font-medium mb-1">Password</label>
                  <input
                    type="password" value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="Min. 8 characters"
                    autoComplete="new-password" autoCapitalize="none" autoCorrect="off" spellCheck={false}
                    className="w-full bg-[#0D0D1A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-base placeholder-[#4A4A5E] focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                    style={{ WebkitAppearance: 'none' }}
                  />
                </div>
                <div>
                  <label className="block text-[#8B8B9E] text-xs font-medium mb-1">Confirm password</label>
                  <input
                    type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                    placeholder="Repeat password"
                    autoComplete="new-password" autoCapitalize="none" autoCorrect="off" spellCheck={false}
                    className="w-full bg-[#0D0D1A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-base placeholder-[#4A4A5E] focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                    style={{ WebkitAppearance: 'none' }}
                  />
                </div>

                {submitError && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{submitError}</p>}

                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#C9A84C] text-[#0D0D1A] font-semibold text-sm hover:bg-[#D4B56A] active:bg-[#B8943D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mt-2 min-h-[44px]"
                >
                  {isSubmitting && <span className="w-4 h-4 border-2 border-[#0D0D1A] border-t-transparent rounded-full animate-spin" />}
                  Create Account & Join
                </button>
              </form>

              <p className="text-center text-[#4A4A5E] text-xs mt-4">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="text-[#C9A84C] hover:underline">Sign in</button>
              </p>
            </>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

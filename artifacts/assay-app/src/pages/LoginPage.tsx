import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const BASE_URL = import.meta.env.BASE_URL || '/';
const apiUrl = (path: string) => `${BASE_URL}api/${path}`;

type Mode = 'login' | 'register';

export function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err === 'google_denied') setError('Google sign-in was cancelled.');
    if (err === 'google_failed') setError('Google sign-in failed. Please try again.');
    if (err === 'google_not_configured') setError('Google sign-in is not available. Please use email and password.');
  }, []);

  useEffect(() => {
    fetch(apiUrl('auth/providers'), { credentials: 'include' })
      .then(r => r.json())
      .then(data => setGoogleAvailable(!!data.google))
      .catch(() => setGoogleAvailable(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        navigate('/');
      } else {
        const res = await fetch(apiUrl('auth/register'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, name, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Registration failed');
        }
        await login(email, password);
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = apiUrl('auth/google');
  }

  const inputFocusStyle = {
    WebkitAppearance: 'none' as const,
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 relative overflow-hidden safe-top pb-safe">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, var(--color-gold), transparent 70%)', top: '-15%', right: '-10%', animation: 'breathe 10s ease-in-out infinite' }} />
        <div className="absolute w-[350px] h-[350px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, var(--color-blue, #60A5FA), transparent 70%)', bottom: '-5%', left: '-8%', animation: 'breathe 14s ease-in-out infinite reverse' }} />
        <div className="absolute w-[250px] h-[250px] rounded-full opacity-[0.02]" style={{ background: 'radial-gradient(circle, var(--color-purple, #A78BFA), transparent 70%)', top: '40%', left: '60%', animation: 'breathe 12s ease-in-out infinite' }} />
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 relative overflow-hidden"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <div className="absolute inset-0 rounded-2xl animate-pulse-ring" style={{ border: '2px solid rgba(201,168,76,0.15)' }} />
            {/* Shimmer sweep on the logo mark */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.4) 50%, transparent 100%)',
                animation: 'shimmer-logo 2.5s ease-in-out 0.5s 1 forwards',
                opacity: 0,
              }}
            />
            <span style={{ color: 'var(--color-gold)' }} className="font-bold text-2xl relative z-10">A</span>
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-gold-gradient">ASSAY</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>Premium AI-powered executive assessment</p>
        </div>

        <div className="glassmorphism rounded-2xl p-8" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(201,168,76,0.03)' }}>
          {/* Tab switcher with animated indicator */}
          <div className="flex rounded-lg p-1 mb-6 relative" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-3 text-sm font-medium rounded-md transition-colors relative z-10 min-h-[44px]"
                style={{
                  color: mode === m ? 'var(--color-dark)' : 'var(--color-text-tertiary)',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
            {/* Animated gold pill indicator */}
            <motion.div
              className="absolute top-1 bottom-1 rounded-md"
              style={{ background: 'var(--color-gold)', width: 'calc(50% - 4px)' }}
              layoutId="login-tab-indicator"
              animate={{ left: mode === 'login' ? 4 : 'calc(50% + 0px)' }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {mode === 'register' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Jane Smith"
                    autoComplete="name"
                    autoCapitalize="words"
                    autoCorrect="off"
                    spellCheck={false}
                    className="w-full border rounded-lg px-3.5 py-3 text-base transition-all min-h-[44px] focus:outline-none"
                    style={{
                      ...inputFocusStyle,
                      background: 'rgba(255,255,255,0.05)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      color: 'var(--color-text-primary)',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 2px rgba(212,175,55,0.2)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>Email</label>
              <input
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="w-full border rounded-lg px-3.5 py-3 text-base transition-all min-h-[44px] focus:outline-none"
                style={{
                  ...inputFocusStyle,
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'var(--color-text-primary)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 2px rgba(212,175,55,0.2)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="w-full border rounded-lg px-3.5 py-3 text-base transition-all min-h-[44px] focus:outline-none"
                style={{
                  ...inputFocusStyle,
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'var(--color-text-primary)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 2px rgba(212,175,55,0.2)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3.5 py-2.5">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-semibold py-3 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              style={{
                background: 'var(--color-gold)',
                color: 'var(--color-dark)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-gold-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-gold)'; }}
            >
              {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {googleAvailable && (
            <>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3" style={{ background: 'transparent', color: 'var(--color-text-tertiary)' }}>or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2.5 border font-medium py-3 rounded-lg text-sm transition-all min-h-[44px]"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'var(--color-text-primary)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}

          {mode === 'register' && (
            <p className="text-xs text-center mt-4" style={{ color: 'var(--color-text-tertiary)' }}>
              The first account created becomes the Owner.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { ROLE_DISPLAY_NAMES } from '@/types/admin';
import type { UserRole } from '@/types/admin';

interface NavBarProps {
  animate?: boolean;
}

export function NavBar({ animate = true }: NavBarProps) {
  const { user, logout, hasRole } = useAuth();
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate('/login');
  }

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const nav = (
    <nav className="nav-bar">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-11 h-11 rounded-lg bg-gradient-gold flex items-center justify-center">
            <span className="text-[#0D0D1A] font-bold text-lg">A</span>
          </div>
          <span className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>ASSAY</span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-white leading-none">{user?.name || 'User'}</p>
              <p className="text-[10px] text-[#8B8B9E] mt-0.5">
                {user ? ROLE_DISPLAY_NAMES[user.role as UserRole] : ''}
              </p>
            </div>
            <div className="avatar avatar-sm bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C]">
              {initial}
            </div>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-[#12122A] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-[#8B8B9E] text-xs truncate">{user?.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20">
                    {user ? ROLE_DISPLAY_NAMES[user.role as UserRole] : ''}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { setOpen(false); navigate('/'); }}
                    className="w-full text-left px-4 py-3 text-sm text-[#8B8B9E] hover:text-white hover:bg-white/5 transition-colors min-h-[44px]"
                  >
                    Dashboard
                  </button>

                  {hasRole('owner', 'admin') && (
                    <button
                      onClick={() => { setOpen(false); navigate('/admin'); }}
                      className="w-full text-left px-4 py-3 text-sm text-[#8B8B9E] hover:text-white hover:bg-white/5 transition-colors min-h-[44px]"
                    >
                      Admin Panel
                    </button>
                  )}
                </div>

                <div className="border-t border-white/5 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors min-h-[44px]"
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );

  if (!animate) return nav;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {nav}
    </motion.div>
  );
}

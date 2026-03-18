import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { NavBar } from '@/components/NavBar';
import type { AdminUser, UserRole } from '@/types/admin';
import { ROLE_DISPLAY_NAMES, ROLE_DESCRIPTIONS } from '@/types/admin';

const BASE_URL = import.meta.env.BASE_URL || '/';
const apiUrl = (path: string) => `${BASE_URL}api/${path}`;

const ROLE_COLORS: Record<UserRole, string> = {
  owner: 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30',
  admin: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  interviewer: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  viewer: 'bg-white/10 text-[#8B8B9E] border-white/10',
};

export function AdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const res = await fetch(apiUrl('auth/users'), { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load users');
      setUsers(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }

  async function updateRole(userId: string, role: UserRole) {
    if (updatingId) return;
    setUpdatingId(userId);
    try {
      const res = await fetch(apiUrl(`auth/users/${userId}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      const updated = await res.json();
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: updated.role } : u));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  }

  const roleOptions: UserRole[] = ['owner', 'admin', 'interviewer', 'viewer'];

  return (
    <div className="min-h-screen bg-[#1A1A2E]">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-widest text-[#8B8B9E] mb-1">ADMINISTRATION</p>
            <h1 className="text-3xl font-bold text-[#C9A84C]">User Management</h1>
            <p className="text-[#8B8B9E] mt-1 text-sm">Manage team access and permissions</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {roleOptions.map(role => (
              <div key={role} className="bg-[#12122A] border border-white/5 rounded-xl p-4">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs border font-medium mb-2 ${ROLE_COLORS[role]}`}>
                  {ROLE_DISPLAY_NAMES[role]}
                </span>
                <p className="text-[#8B8B9E] text-xs leading-relaxed">{ROLE_DESCRIPTIONS[role]}</p>
                <p className="text-white text-lg font-bold mt-2">
                  {users.filter(u => u.role === role).length}
                </p>
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-[#12122A] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="text-white font-semibold text-sm">
                Team Members <span className="text-[#8B8B9E] font-normal ml-1">({users.length})</span>
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {users.map(u => (
                  <div key={u.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-9 h-9 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#C9A84C] text-sm font-semibold">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-medium truncate">{u.name}</p>
                        {u.id === currentUser?.id && (
                          <span className="text-[10px] text-[#C9A84C] bg-[#C9A84C]/10 px-1.5 py-0.5 rounded-full font-medium">you</span>
                        )}
                        {u.googleId && (
                          <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full">Google</span>
                        )}
                      </div>
                      <p className="text-[#8B8B9E] text-xs truncate">{u.email}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {u.id === currentUser?.id || currentUser?.role !== 'owner' && u.role === 'owner' ? (
                        <span className={`px-2.5 py-1 rounded-full text-xs border font-medium ${ROLE_COLORS[u.role as UserRole]}`}>
                          {ROLE_DISPLAY_NAMES[u.role as UserRole]}
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          disabled={updatingId === u.id}
                          onChange={(e) => updateRole(u.id, e.target.value as UserRole)}
                          className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#C9A84C]/50 disabled:opacity-50 cursor-pointer"
                        >
                          {roleOptions.map(r => (
                            <option key={r} value={r} className="bg-[#1A1A2E]">
                              {ROLE_DISPLAY_NAMES[r]}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

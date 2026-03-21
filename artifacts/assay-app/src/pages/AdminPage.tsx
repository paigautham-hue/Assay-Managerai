import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { NavBar } from '@/components/NavBar';
import type { AdminUser, Invitation, ActivityLogEntry, OrgSettings, UserRole, UserStatus } from '@/types/admin';
import { ROLE_DISPLAY_NAMES, ROLE_DESCRIPTIONS, ROLE_HIERARCHY } from '@/types/admin';

const BASE_URL = import.meta.env.BASE_URL || '/';
const api = (path: string) => `${BASE_URL}api/${path}`;

// ── Design tokens ─────────────────────────────────────────────────────────────
const ROLE_COLORS: Record<UserRole, string> = {
  owner:       'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/40',
  admin:       'bg-violet-500/20 text-violet-300 border-violet-500/30',
  interviewer: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  viewer:      'bg-white/8 text-[#8B8B9E] border-white/10',
};
const STATUS_COLORS: Record<UserStatus, string> = {
  active:    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  suspended: 'bg-red-500/20 text-red-400 border-red-500/30',
};
const ACTION_LABELS: Record<string, string> = {
  'user.registered':   'User registered',
  'user.login':        'User signed in',
  'user.updated':      'User updated',
  'user.deleted':      'User deleted',
  'invitation.created': 'Invitation sent',
  'invitation.cancelled': 'Invitation cancelled',
  'organization.updated': 'Organization updated',
};

function formatRelative(iso: string) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div className={`${sizes[size]} rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center flex-shrink-0`}>
      <span className="text-[#C9A84C] font-semibold">{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {children}
    </span>
  );
}

// ── Confirm Dialog ─────────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        className="relative bg-[#12122A] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-white font-bold text-base mb-2">{title}</h3>
        <p className="text-[#8B8B9E] text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl border border-white/10 text-[#8B8B9E] text-sm font-medium hover:border-white/20 transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${danger ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'bg-[#C9A84C] text-[#0D0D1A] hover:bg-[#D4B56A]'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── User Detail Drawer ─────────────────────────────────────────────────────────
interface UserDrawerProps {
  user: AdminUser;
  currentUser: AdminUser;
  onClose: () => void;
  onRoleChange: (id: string, role: UserRole) => Promise<void>;
  onStatusToggle: (id: string, status: UserStatus) => Promise<void>;
  onDelete: (id: string) => void;
}
function UserDrawer({ user, currentUser, onClose, onRoleChange, onStatusToggle, onDelete }: UserDrawerProps) {
  const roleOptions = (['owner', 'admin', 'interviewer', 'viewer'] as UserRole[]).filter(r => {
    if (r === 'owner' && currentUser.role !== 'owner') return false;
    return true;
  });
  const canModify = currentUser.role === 'owner' || (user.role !== 'owner' && ROLE_HIERARCHY[currentUser.role] > ROLE_HIERARCHY[user.role]);
  const isSelf = user.id === currentUser.id;

  return (
    <div className="fixed inset-0 z-40 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        className="relative bg-[#0D0D1A] border-l border-white/8 w-full max-w-sm h-full overflow-y-auto shadow-2xl"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-base">User Details</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#8B8B9E] hover:text-white transition-colors">✕</button>
          </div>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/8">
            <Avatar name={user.name} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white font-semibold">{user.name}</p>
                {isSelf && <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20 text-[10px]">you</Badge>}
              </div>
              <p className="text-[#8B8B9E] text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={ROLE_COLORS[user.role]}>{ROLE_DISPLAY_NAMES[user.role]}</Badge>
                <Badge className={STATUS_COLORS[user.status]}>{user.status}</Badge>
                {user.googleId && <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Google</Badge>}
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-[#12122A] rounded-xl p-4 space-y-3">
              <h3 className="text-[#8B8B9E] text-xs font-semibold uppercase tracking-wider">Account Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8B8B9E]">Member since</span>
                  <span className="text-white">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B8B9E]">Last active</span>
                  <span className="text-white">{user.lastActiveAt ? formatRelative(user.lastActiveAt) : 'Never'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B8B9E]">Auth method</span>
                  <span className="text-white">{user.googleId && user.hasPassword ? 'Google + Password' : user.googleId ? 'Google' : 'Password'}</span>
                </div>
              </div>
            </div>

            {canModify && !isSelf && (
              <div className="bg-[#12122A] rounded-xl p-4 space-y-3">
                <h3 className="text-[#8B8B9E] text-xs font-semibold uppercase tracking-wider">Role</h3>
                <div className="grid grid-cols-2 gap-2">
                  {roleOptions.map(r => (
                    <button
                      key={r}
                      onClick={() => onRoleChange(user.id, r)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${user.role === r ? ROLE_COLORS[r] : 'border-white/8 text-[#8B8B9E] hover:border-white/20 hover:text-white'}`}
                    >
                      {ROLE_DISPLAY_NAMES[r]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {canModify && !isSelf && (
            <div className="space-y-3 pt-4 border-t border-white/8">
              <button
                onClick={() => onStatusToggle(user.id, user.status === 'active' ? 'suspended' : 'active')}
                className={`w-full py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  user.status === 'active'
                    ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                    : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                {user.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
              </button>
              {currentUser.role === 'owner' && user.role !== 'owner' && (
                <button
                  onClick={() => onDelete(user.id)}
                  className="w-full py-2.5 rounded-xl text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete User
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Invite Modal ───────────────────────────────────────────────────────────────
interface InviteModalProps {
  currentUser: AdminUser;
  onClose: () => void;
  onInviteSent: (inv: Invitation) => void;
}
function InviteModal({ currentUser, onClose, onInviteSent }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('interviewer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Invitation | null>(null);

  const clientInviteUrl = result
    ? `${window.location.origin}${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/accept-invite?token=${result.token}`
    : '';

  const roleOptions = (['admin', 'interviewer', 'viewer'] as UserRole[]).concat(currentUser.role === 'owner' ? ['owner'] : []);

  async function handleSend() {
    if (!email.trim()) { setError('Email is required'); return; }
    setIsLoading(true); setError('');
    try {
      const res = await fetch(api('auth/invitations'), {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to send invitation'); return; }
      setResult(data);
      onInviteSent(data);
    } catch { setError('Network error'); }
    finally { setIsLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        className="relative bg-[#12122A] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-bold text-base">Invite Team Member</h2>
            <p className="text-[#8B8B9E] text-xs mt-0.5">They'll receive an invite link to join your team</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#8B8B9E] transition-colors">✕</button>
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
              <p className="text-emerald-400 font-semibold text-sm mb-1">Invitation created!</p>
              <p className="text-[#8B8B9E] text-xs">Share this link with {result.email}</p>
            </div>
            <div className="bg-[#0D0D1A] border border-white/8 rounded-xl p-3">
              <p className="text-[#C9A84C] text-xs font-mono break-all leading-relaxed">{clientInviteUrl}</p>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(clientInviteUrl); }}
              className="w-full py-2.5 rounded-xl bg-[#C9A84C] text-[#0D0D1A] text-sm font-semibold hover:bg-[#D4B56A] transition-colors"
            >
              Copy Invite Link
            </button>
            <button onClick={onClose} className="w-full py-2 text-[#8B8B9E] text-sm hover:text-white transition-colors">Done</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-[#8B8B9E] text-xs font-medium mb-1.5">Email address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full bg-[#0D0D1A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4A4A5E] focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
            </div>

            <div>
              <label className="block text-[#8B8B9E] text-xs font-medium mb-1.5">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {(['interviewer', 'viewer', 'admin', ...(currentUser.role === 'owner' ? ['owner'] : [])] as UserRole[]).map(r => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-3 py-2.5 rounded-xl text-xs text-left border transition-all ${role === r ? ROLE_COLORS[r] : 'border-white/8 text-[#8B8B9E] hover:border-white/20'}`}
                  >
                    <div className="font-semibold mb-0.5">{ROLE_DISPLAY_NAMES[r]}</div>
                    <div className="opacity-70 leading-tight" style={{ fontSize: '10px' }}>{ROLE_DESCRIPTIONS[r].split(',')[0]}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

            <button
              onClick={handleSend} disabled={isLoading || !email.trim()}
              className="w-full py-2.5 rounded-xl bg-[#C9A84C] text-[#0D0D1A] text-sm font-semibold hover:bg-[#D4B56A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <span className="w-3.5 h-3.5 border-2 border-[#0D0D1A] border-t-transparent rounded-full animate-spin" />}
              Send Invitation
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
interface UsersTabProps {
  users: AdminUser[];
  currentUser: AdminUser;
  onRoleChange: (id: string, role: UserRole) => Promise<void>;
  onStatusToggle: (id: string, status: UserStatus) => Promise<void>;
  onDelete: (id: string) => void;
  onInvite: () => void;
}
function UsersTab({ users, currentUser, onRoleChange, onStatusToggle, onDelete, onInvite }: UsersTabProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);

  const filtered = users.filter(u => {
    const matchesSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A5E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#12122A] border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-[#4A4A5E] focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as UserRole | 'all')}
            className="bg-[#12122A] border border-white/8 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 cursor-pointer">
            <option value="all">All roles</option>
            {(['owner','admin','interviewer','viewer'] as UserRole[]).map(r => <option key={r} value={r}>{ROLE_DISPLAY_NAMES[r]}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as UserStatus | 'all')}
            className="bg-[#12122A] border border-white/8 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C]/40 cursor-pointer">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="bg-[#12122A] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm">
            Team Members <span className="text-[#8B8B9E] font-normal ml-1">({filtered.length}{filtered.length !== users.length ? ` of ${users.length}` : ''})</span>
          </h2>
          <button onClick={onInvite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-semibold border border-[#C9A84C]/20 hover:bg-[#C9A84C]/20 transition-colors">
            <span className="text-base leading-none">+</span> Invite
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-[#8B8B9E] text-sm">No users match your filters</div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(u => (
              <motion.div key={u.id} layout className="flex items-center gap-3 px-4 sm:px-6 py-4 hover:bg-white/2 transition-colors cursor-pointer" onClick={() => setSelectedUser(u)}>
                <Avatar name={u.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white text-sm font-medium truncate">{u.name}</p>
                    {u.id === currentUser.id && <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20 text-[10px]">you</Badge>}
                    {u.googleId && <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">Google</Badge>}
                  </div>
                  <p className="text-[#8B8B9E] text-xs truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {u.status === 'suspended' && <Badge className={STATUS_COLORS.suspended}>Suspended</Badge>}
                  <Badge className={ROLE_COLORS[u.role]}>{ROLE_DISPLAY_NAMES[u.role]}</Badge>
                  <span className="text-[#4A4A5E] text-xs hidden sm:block">{u.lastActiveAt ? formatRelative(u.lastActiveAt) : '—'}</span>
                  <svg className="w-4 h-4 text-[#4A4A5E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedUser && (
          <UserDrawer
            user={selectedUser} currentUser={currentUser}
            onClose={() => setSelectedUser(null)}
            onRoleChange={async (id, role) => { await onRoleChange(id, role); setSelectedUser(prev => prev ? { ...prev, role } : null); }}
            onStatusToggle={async (id, status) => { await onStatusToggle(id, status); setSelectedUser(prev => prev ? { ...prev, status } : null); }}
            onDelete={id => { setSelectedUser(null); setConfirmDelete(users.find(u => u.id === id) || null); }}
          />
        )}
        {confirmDelete && (
          <ConfirmDialog
            title="Delete User"
            message={`Are you sure you want to permanently delete ${confirmDelete.name} (${confirmDelete.email})? This action cannot be undone.`}
            confirmLabel="Delete"
            danger
            onConfirm={() => { onDelete(confirmDelete.id); setConfirmDelete(null); }}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Invitations Tab ───────────────────────────────────────────────────────────
interface InvitationsTabProps {
  invitations: Invitation[];
  currentUser: AdminUser;
  onCancel: (id: string) => void;
  onInvite: () => void;
}
function InvitationsTab({ invitations, currentUser, onCancel, onInvite }: InvitationsTabProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<Invitation | null>(null);

  const pending = invitations.filter(i => !i.acceptedAt && new Date(i.expiresAt) > new Date());
  const accepted = invitations.filter(i => i.acceptedAt);
  const expired = invitations.filter(i => !i.acceptedAt && new Date(i.expiresAt) <= new Date());

  function copyLink(inv: Invitation) {
    const base = window.location.origin + (import.meta.env.BASE_URL || '/');
    const url = `${base}accept-invite?token=${inv.token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function InviteRow({ inv, showActions }: { inv: Invitation; showActions: boolean }) {
    const isExpired = !inv.acceptedAt && new Date(inv.expiresAt) <= new Date();
    const isAccepted = !!inv.acceptedAt;
    return (
      <div className="flex items-center gap-3 px-4 sm:px-6 py-4">
        <div className="w-9 h-9 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-violet-400 text-sm">✉</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{inv.email}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <Badge className={ROLE_COLORS[inv.role]}>{ROLE_DISPLAY_NAMES[inv.role]}</Badge>
            <span className="text-[#8B8B9E] text-xs">
              {isAccepted ? `Accepted ${formatRelative(inv.acceptedAt!)}` : isExpired ? 'Expired' : `Expires ${formatRelative(inv.expiresAt)}`}
            </span>
            {inv.invitedBy && <span className="text-[#4A4A5E] text-xs hidden sm:inline">by {inv.invitedBy.name}</span>}
          </div>
        </div>
        {showActions && !isAccepted && !isExpired && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => copyLink(inv)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${copiedId === inv.id ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-white/10 text-[#8B8B9E] hover:border-white/20 hover:text-white'}`}>
              {copiedId === inv.id ? 'Copied!' : 'Copy link'}
            </button>
            <button onClick={() => setConfirmCancel(inv)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
              Cancel
            </button>
          </div>
        )}
        {(isAccepted || isExpired) && (
          <Badge className={isAccepted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-[#8B8B9E] border-white/10'}>
            {isAccepted ? 'Accepted' : 'Expired'}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#8B8B9E] text-sm">{pending.length} pending invitation{pending.length !== 1 ? 's' : ''}</p>
        {['owner', 'admin'].includes(currentUser.role) && (
          <button onClick={onInvite}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C9A84C] text-[#0D0D1A] text-sm font-semibold hover:bg-[#D4B56A] transition-colors">
            <span className="text-base leading-none">+</span> New Invitation
          </button>
        )}
      </div>

      {invitations.length === 0 ? (
        <div className="bg-[#12122A] border border-white/5 rounded-2xl py-16 text-center">
          <div className="text-4xl mb-3">✉</div>
          <p className="text-white font-medium mb-1">No invitations yet</p>
          <p className="text-[#8B8B9E] text-sm mb-4">Invite team members to collaborate</p>
          <button onClick={onInvite} className="px-4 py-2 rounded-xl bg-[#C9A84C] text-[#0D0D1A] text-sm font-semibold hover:bg-[#D4B56A] transition-colors">
            Send First Invitation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.length > 0 && (
            <div className="bg-[#12122A] border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-4 sm:px-6 py-3 border-b border-white/5">
                <h3 className="text-white text-xs font-semibold uppercase tracking-wider">Pending ({pending.length})</h3>
              </div>
              <div className="divide-y divide-white/5">
                {pending.map(inv => <InviteRow key={inv.id} inv={inv} showActions />)}
              </div>
            </div>
          )}
          {accepted.length > 0 && (
            <div className="bg-[#12122A] border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-4 sm:px-6 py-3 border-b border-white/5">
                <h3 className="text-[#8B8B9E] text-xs font-semibold uppercase tracking-wider">Accepted ({accepted.length})</h3>
              </div>
              <div className="divide-y divide-white/5">
                {accepted.map(inv => <InviteRow key={inv.id} inv={inv} showActions={false} />)}
              </div>
            </div>
          )}
          {expired.length > 0 && (
            <div className="bg-[#12122A] border border-white/5 rounded-2xl overflow-hidden opacity-60">
              <div className="px-4 sm:px-6 py-3 border-b border-white/5">
                <h3 className="text-[#8B8B9E] text-xs font-semibold uppercase tracking-wider">Expired ({expired.length})</h3>
              </div>
              <div className="divide-y divide-white/5">
                {expired.map(inv => <InviteRow key={inv.id} inv={inv} showActions={false} />)}
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {confirmCancel && (
          <ConfirmDialog
            title="Cancel Invitation"
            message={`Cancel the invitation sent to ${confirmCancel.email}? They won't be able to use the invite link.`}
            confirmLabel="Cancel Invitation" danger
            onConfirm={() => { onCancel(confirmCancel.id); setConfirmCancel(null); }}
            onCancel={() => setConfirmCancel(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Activity Tab ──────────────────────────────────────────────────────────────
function ActivityTab({ currentUserId }: { currentUserId: string }) {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(api('auth/activity'), { credentials: 'include' })
      .then(r => r.json()).then(setLogs).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  function ActionIcon({ action }: { action: string }) {
    const icons: Record<string, string> = {
      'user.registered': '👤', 'user.login': '🔑', 'user.updated': '✏️',
      'user.deleted': '🗑️', 'invitation.created': '✉️', 'invitation.cancelled': '❌',
      'organization.updated': '🏢',
    };
    return <span className="text-base">{icons[action] || '📋'}</span>;
  }

  if (isLoading) {
    return <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="bg-[#12122A] border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-white/5">
        <h2 className="text-white font-semibold text-sm">Activity Log <span className="text-[#8B8B9E] font-normal">({logs.length})</span></h2>
      </div>
      {logs.length === 0 ? (
        <div className="py-16 text-center text-[#8B8B9E] text-sm">No activity recorded yet</div>
      ) : (
        <div className="divide-y divide-white/5">
          {logs.map(log => {
            const isSelfActor = log.actorId === currentUserId;
            const actorName = isSelfActor ? 'You' : (log.actor?.name || 'System');
            return (
              <div key={log.id} className="flex items-start gap-3 px-4 sm:px-6 py-3.5">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 flex-shrink-0 mt-0.5">
                  <ActionIcon action={log.action} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">{ACTION_LABELS[log.action] || log.action}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[#8B8B9E] text-xs">{actorName}</span>
                    {log.details && typeof log.details === 'object' && 'email' in log.details && (
                      <span className="text-[#4A4A5E] text-xs">{String(log.details.email)}</span>
                    )}
                    {log.details && typeof log.details === 'object' && 'targetEmail' in log.details && (
                      <span className="text-[#4A4A5E] text-xs">→ {String(log.details.targetEmail)}</span>
                    )}
                  </div>
                </div>
                <span className="text-[#4A4A5E] text-xs flex-shrink-0 mt-0.5">{formatRelative(log.createdAt)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────
function SettingsTab({ currentUser }: { currentUser: AdminUser }) {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [orgName, setOrgName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(api('auth/organization'), { credentials: 'include' })
      .then(r => r.json()).then(data => { setOrg(data); setOrgName(data.name); }).catch(() => {});
  }, []);

  async function saveOrg() {
    if (!orgName.trim()) return;
    setIsSaving(true); setError(''); setSaved(false);
    try {
      const res = await fetch(api('auth/organization'), {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }
      setOrg(prev => prev ? { ...prev, name: data.name } : null);
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch { setError('Network error'); }
    finally { setIsSaving(false); }
  }

  const isOwner = currentUser.role === 'owner';

  return (
    <div className="space-y-4">
      <div className="bg-[#12122A] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-sm mb-4">Organization</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[#8B8B9E] text-xs font-medium mb-1.5">Organization name</label>
            <div className="flex gap-2">
              <input
                type="text" value={orgName} onChange={e => setOrgName(e.target.value)}
                disabled={!isOwner}
                placeholder="Your organization name"
                className="flex-1 bg-[#0D0D1A] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-[#4A4A5E] focus:outline-none focus:border-[#C9A84C]/50 disabled:opacity-50 transition-colors"
              />
              {isOwner && (
                <button onClick={saveOrg} disabled={isSaving || !orgName.trim() || orgName === org?.name}
                  className="px-4 py-2.5 rounded-xl bg-[#C9A84C] text-[#0D0D1A] text-sm font-semibold hover:bg-[#D4B56A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                  {isSaving && <span className="w-3.5 h-3.5 border-2 border-[#0D0D1A] border-t-transparent rounded-full animate-spin" />}
                  {saved ? 'Saved ✓' : 'Save'}
                </button>
              )}
            </div>
            {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
          </div>
          {org && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-[#0D0D1A] rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-white">{org.userCount}</p>
                <p className="text-[#8B8B9E] text-xs mt-0.5">Total members</p>
              </div>
              <div className="bg-[#0D0D1A] rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-[#C9A84C]">{org.id ? 'Pro' : 'Free'}</p>
                <p className="text-[#8B8B9E] text-xs mt-0.5">Plan</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#12122A] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-sm mb-4">Role Permissions</h3>
        <div className="space-y-3">
          {(['owner', 'admin', 'interviewer', 'viewer'] as UserRole[]).map(r => (
            <div key={r} className="flex items-start gap-3 p-3 rounded-xl bg-[#0D0D1A]">
              <Badge className={ROLE_COLORS[r]}>{ROLE_DISPLAY_NAMES[r]}</Badge>
              <p className="text-[#8B8B9E] text-xs leading-relaxed pt-0.5">{ROLE_DESCRIPTIONS[r]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#12122A] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-semibold text-sm mb-1">Your Account</h3>
        <p className="text-[#8B8B9E] text-xs mb-4">Personal profile settings</p>
        <div className="flex items-center gap-4">
          <Avatar name={currentUser.name} size="lg" />
          <div>
            <p className="text-white font-semibold text-sm">{currentUser.name}</p>
            <p className="text-[#8B8B9E] text-xs">{currentUser.email}</p>
            <div className="flex gap-2 mt-1.5">
              <Badge className={ROLE_COLORS[currentUser.role]}>{ROLE_DISPLAY_NAMES[currentUser.role]}</Badge>
              {currentUser.googleId && <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Google</Badge>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main AdminPage ─────────────────────────────────────────────────────────────

type Tab = 'users' | 'invitations' | 'activity' | 'settings';

export function AdminPage() {
  const { user: currentUser } = useAuth();
  const [tab, setTab] = useState<Tab>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(api('auth/users'), { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load users');
      setUsers(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    }
  }, []);

  const fetchInvitations = useCallback(async () => {
    try {
      const res = await fetch(api('auth/invitations'), { credentials: 'include' });
      if (res.ok) setInvitations(await res.json());
    } catch { /* non-critical */ }
  }, []);

  useEffect(() => {
    Promise.all([fetchUsers(), fetchInvitations()]).finally(() => setIsLoading(false));
  }, [fetchUsers, fetchInvitations]);

  async function handleRoleChange(id: string, role: UserRole) {
    const res = await fetch(api(`auth/users/${id}`), {
      method: 'PATCH', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: updated.role } : u));
    }
  }

  async function handleStatusToggle(id: string, currentStatus: UserStatus) {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const res = await fetch(api(`auth/users/${id}`), {
      method: 'PATCH', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
  }

  async function handleDelete(id: string) {
    const res = await fetch(api(`auth/users/${id}`), { method: 'DELETE', credentials: 'include' });
    if (res.ok) setUsers(prev => prev.filter(u => u.id !== id));
  }

  async function handleCancelInvite(id: string) {
    const res = await fetch(api(`auth/invitations/${id}`), { method: 'DELETE', credentials: 'include' });
    if (res.ok) setInvitations(prev => prev.filter(i => i.id !== id));
  }

  const TABS = [
    { id: 'users' as Tab, label: 'Users', count: users.length },
    { id: 'invitations' as Tab, label: 'Invitations', count: invitations.filter(i => !i.acceptedAt && new Date(i.expiresAt) > new Date()).length || undefined },
    { id: 'activity' as Tab, label: 'Activity' },
    { id: 'settings' as Tab, label: 'Settings' },
  ];

  const roleCounts = (['owner','admin','interviewer','viewer'] as UserRole[]).reduce((acc, r) => ({ ...acc, [r]: users.filter(u => u.role === r).length }), {} as Record<UserRole, number>);

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest text-[#8B8B9E] mb-1">ADMINISTRATION</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#C9A84C]">User Management</h1>
            <p className="text-[#8B8B9E] mt-1 text-sm">Manage team access, permissions, and invitations</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {(['owner','admin','interviewer','viewer'] as UserRole[]).map(role => (
                  <div key={role} className="bg-[#12122A] border border-white/5 rounded-xl p-4 cursor-pointer hover:border-white/10 transition-colors" onClick={() => setTab('users')}>
                    <Badge className={`${ROLE_COLORS[role]} mb-2`}>{ROLE_DISPLAY_NAMES[role]}</Badge>
                    <p className="text-[#8B8B9E] text-xs leading-relaxed mb-2">{ROLE_DESCRIPTIONS[role]}</p>
                    <p className="text-white text-2xl font-bold">{roleCounts[role]}</p>
                  </div>
                ))}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex border-b border-white/8 mb-6 gap-0">
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`relative px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${tab === t.id ? 'text-[#C9A84C]' : 'text-[#8B8B9E] hover:text-white'}`}>
                    {t.label}
                    {t.count !== undefined && t.count > 0 && (
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${tab === t.id ? 'bg-[#C9A84C]/20 text-[#C9A84C]' : 'bg-white/10 text-[#8B8B9E]'}`}>{t.count}</span>
                    )}
                    {tab === t.id && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A84C]" />}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
                  {tab === 'users' && currentUser && (
                    <UsersTab users={users} currentUser={currentUser as AdminUser} onRoleChange={handleRoleChange} onStatusToggle={handleStatusToggle} onDelete={handleDelete} onInvite={() => setShowInviteModal(true)} />
                  )}
                  {tab === 'invitations' && currentUser && (
                    <InvitationsTab invitations={invitations} currentUser={currentUser as AdminUser} onCancel={handleCancelInvite} onInvite={() => setShowInviteModal(true)} />
                  )}
                  {tab === 'activity' && currentUser && <ActivityTab currentUserId={currentUser.id} />}
                  {tab === 'settings' && currentUser && <SettingsTab currentUser={currentUser as AdminUser} />}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showInviteModal && currentUser && (
          <InviteModal
            currentUser={currentUser as AdminUser}
            onClose={() => setShowInviteModal(false)}
            onInviteSent={inv => {
              setInvitations(prev => [inv, ...prev]);
              fetchInvitations();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

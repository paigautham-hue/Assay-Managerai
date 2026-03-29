import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GATE_DEFINITIONS } from '../lib/gates';
import type { GateName } from '../types';

const BASE_URL = import.meta.env.BASE_URL || '/';
const apiUrl = (path: string) => `${BASE_URL}api/${path}`;

const CORE_GATE_IDS: GateName[] = ['integrity', 'accountability', 'harm_pattern', 'context_misalignment'];
const OPTIONAL_GATE_IDS: GateName[] = ['financial_fluency', 'customer_orientation', 'people_judgment', 'decision_velocity', 'technical_depth'];
const PSYCHOLOGICAL_GATE_IDS: GateName[] = ['covert_narcissism', 'overconfidence_bias', 'burnout_trajectory'];

const ROLE_LEVELS = ['C-Suite', 'VP', 'Director', 'Senior Manager', 'Manager'] as const;

interface CreateInviteModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateInviteModal({ open, onClose }: CreateInviteModalProps) {
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roleLevel, setRoleLevel] = useState<string>('C-Suite');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedGates, setSelectedGates] = useState<Set<GateName>>(new Set(CORE_GATE_IDS));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function toggleGate(gate: GateName) {
    // Core gates are always on
    if (CORE_GATE_IDS.includes(gate)) return;
    setSelectedGates(prev => {
      const next = new Set(prev);
      if (next.has(gate)) next.delete(gate);
      else next.add(gate);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!candidateName.trim() || !roleName.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(apiUrl('invites'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          candidateName: candidateName.trim(),
          candidateEmail: candidateEmail.trim() || undefined,
          roleName: roleName.trim(),
          roleLevel,
          jobDescription: jobDescription.trim() || undefined,
          activeGates: Array.from(selectedGates),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Build client-side URL since the server baseUrl may not be correct for the SPA
        const clientUrl = `${window.location.origin}/invite/${data.token}`;
        setInviteUrl(clientUrl);
      } else {
        console.error('Failed to create invite');
      }
    } catch (err) {
      console.error('Create invite error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCopy() {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClose() {
    setCandidateName('');
    setCandidateEmail('');
    setRoleName('');
    setRoleLevel('C-Suite');
    setJobDescription('');
    setSelectedGates(new Set(CORE_GATE_IDS));
    setInviteUrl(null);
    setCopied(false);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header accent */}
            <div className="h-1" style={{ background: 'linear-gradient(90deg, #D4B85A, #C9A84C, #B8943D)' }} />

            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {inviteUrl ? 'Invite Created' : 'Create Interview Invite'}
                  </h2>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                    {inviteUrl ? 'Share this link with the candidate' : 'Generate a shareable invite link for candidates'}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {inviteUrl ? (
                /* Success state - show invite link */
                <div>
                  <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
                    <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-gold)' }}>Invite Link</div>
                    <div className="text-sm break-all font-mono" style={{ color: 'var(--color-text-primary)' }}>{inviteUrl}</div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCopy}
                      className="flex-1 inline-flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl transition-all"
                      style={{
                        background: copied ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #D4B85A 0%, #C9A84C 50%, #B8943D 100%)',
                        color: copied ? '#22c55e' : '#0D0D1A',
                        border: copied ? '1px solid rgba(34,197,94,0.3)' : 'none',
                      }}
                    >
                      {copied ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Link
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleClose}
                      className="px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-secondary)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      Done
                    </button>
                  </div>
                  <p className="text-xs mt-4 text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                    This link expires in 7 days. The candidate can start the interview without logging in.
                  </p>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Candidate name */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                      Candidate Name <span style={{ color: 'var(--color-gold)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. Jane Smith"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text-primary)' }}
                    />
                  </div>

                  {/* Candidate email */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                      Candidate Email
                    </label>
                    <input
                      type="email"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="jane@example.com (optional)"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text-primary)' }}
                    />
                  </div>

                  {/* Role name */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                      Role Name <span style={{ color: 'var(--color-gold)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="e.g. VP Engineering"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text-primary)' }}
                    />
                  </div>

                  {/* Role level */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                      Role Level <span style={{ color: 'var(--color-gold)' }}>*</span>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {ROLE_LEVELS.map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setRoleLevel(level)}
                          className="px-3 py-2 rounded-lg text-xs font-semibold transition-all text-center"
                          style={{
                            background: roleLevel === level ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${roleLevel === level ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)'}`,
                            color: roleLevel === level ? 'var(--color-gold)' : 'var(--color-text-secondary)',
                          }}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Job description */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>
                      Job Description
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Brief description of the role (optional)"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all resize-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text-primary)' }}
                    />
                  </div>

                  {/* Gate selection */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
                      Assessment Gates
                    </label>

                    {/* Core gates (always on) */}
                    <div className="mb-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-gold)', opacity: 0.7 }}>Core (always active)</div>
                      <div className="flex flex-wrap gap-1.5">
                        {CORE_GATE_IDS.map(gate => (
                          <span
                            key={gate}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium"
                            style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--color-gold)', border: '1px solid rgba(201,168,76,0.2)' }}
                          >
                            {GATE_DEFINITIONS[gate].displayName}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Optional gates */}
                    <div className="mb-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>Optional</div>
                      <div className="flex flex-wrap gap-1.5">
                        {OPTIONAL_GATE_IDS.map(gate => (
                          <button
                            key={gate}
                            type="button"
                            onClick={() => toggleGate(gate)}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                            style={{
                              background: selectedGates.has(gate) ? 'rgba(96,165,250,0.12)' : 'rgba(255,255,255,0.04)',
                              color: selectedGates.has(gate) ? '#60a5fa' : 'var(--color-text-tertiary)',
                              border: `1px solid ${selectedGates.has(gate) ? 'rgba(96,165,250,0.25)' : 'rgba(255,255,255,0.06)'}`,
                            }}
                          >
                            {GATE_DEFINITIONS[gate].displayName}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Psychological gates */}
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>Psychological</div>
                      <div className="flex flex-wrap gap-1.5">
                        {PSYCHOLOGICAL_GATE_IDS.map(gate => (
                          <button
                            key={gate}
                            type="button"
                            onClick={() => toggleGate(gate)}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                            style={{
                              background: selectedGates.has(gate) ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.04)',
                              color: selectedGates.has(gate) ? '#a855f7' : 'var(--color-text-tertiary)',
                              border: `1px solid ${selectedGates.has(gate) ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.06)'}`,
                            }}
                          >
                            {GATE_DEFINITIONS[gate].displayName}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !candidateName.trim() || !roleName.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #D4B85A 0%, #C9A84C 50%, #B8943D 100%)',
                      color: '#0D0D1A',
                      boxShadow: '0 4px 20px rgba(201,168,76,0.35)',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span>Generate Invite Link</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

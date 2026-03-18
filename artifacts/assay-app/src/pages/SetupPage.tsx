import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAssayStore } from '../store/useAssayStore';
import { motion, AnimatePresence } from 'framer-motion';
import type { GateName } from '../types';
import { GATE_DEFINITIONS, ROLE_GATE_PRESETS } from '../lib/gates';

const CORE_GATE_IDS: GateName[] = ['integrity', 'accountability', 'harm_pattern', 'context_misalignment'];
const OPTIONAL_GATE_IDS: GateName[] = ['financial_fluency', 'customer_orientation', 'people_judgment', 'decision_velocity', 'technical_depth'];
const PSYCHOLOGICAL_GATE_IDS: GateName[] = ['covert_narcissism', 'overconfidence_bias', 'burnout_trajectory'];

const ROLE_LEVELS = [
  { value: 'C-Suite', label: 'C-Suite', icon: '👑', description: 'CEO, CFO, CTO, COO' },
  { value: 'VP', label: 'VP', icon: '📊', description: 'Vice President' },
  { value: 'Director', label: 'Director', icon: '🎯', description: 'Director level' },
  { value: 'Senior Manager', label: 'Senior Manager', icon: '📈', description: 'Senior Manager' },
  { value: 'Manager', label: 'Manager', icon: '👥', description: 'Manager' },
];

const ROLE_AUTOCOMPLETE = ['CEO', 'CFO', 'CTO', 'COO', 'VP Engineering', 'VP Sales', 'VP Operations', 'VP Product', 'Head of Engineering', 'Engineering Manager', 'Product Manager', 'Sales Manager'];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 600 : -600, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 600 : -600, opacity: 0 }),
};

function getDefaultOptionalGates(roleName: string): Set<GateName> {
  for (const [key, gates] of Object.entries(ROLE_GATE_PRESETS)) {
    if (roleName.toUpperCase().includes(key.toUpperCase())) {
      return new Set<GateName>(gates as GateName[]);
    }
  }
  return new Set<GateName>(['financial_fluency', 'people_judgment']);
}

function SummaryCard({ label, value, icon, onEdit }: { label: string; value: string; icon: string; onEdit: () => void }) {
  return (
    <motion.div
      className="glass rounded-lg p-4 flex items-center justify-between"
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      whileHover={{ x: 4 }}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="label">{label}</div>
          <div className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{value}</div>
        </div>
      </div>
      <motion.button
        type="button"
        onClick={onEdit}
        className="text-gold text-sm font-semibold hover:opacity-80 transition-opacity"
        whileHover={{ scale: 1.1 }}
      >
        Edit
      </motion.button>
    </motion.div>
  );
}

export function SetupPage() {
  const [, navigate] = useLocation();
  const { createSession } = useAssayStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    candidateName: '',
    roleName: '',
    roleLevel: 'C-Suite' as 'C-Suite' | 'VP' | 'Director' | 'Senior Manager' | 'Manager',
    jobDescription: '',
    cvSummary: '',
    interviewMode: 'active' as 'active' | 'shadow',
  });

  const [optionalGates, setOptionalGates] = useState<Set<GateName>>(() => getDefaultOptionalGates(''));

  const goNext = () => {
    if (currentStep === 1) {
      setOptionalGates(getDefaultOptionalGates(formData.roleName));
    }
    setDirection(1);
    setCurrentStep(s => Math.min(s + 1, 6));
  };
  const goBack = () => {
    if (currentStep > 1) { setDirection(-1); setCurrentStep(s => s - 1); }
    else { navigate('/'); }
  };

  const handleRoleNameChange = (value: string) => {
    setFormData(p => ({ ...p, roleName: value }));
    if (value.length > 0) {
      const filtered = ROLE_AUTOCOMPLETE.filter(r => r.toUpperCase().includes(value.toUpperCase()));
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectRole = (role: string) => {
    setFormData(p => ({ ...p, roleName: role }));
    setShowSuggestions(false);
    setOptionalGates(getDefaultOptionalGates(role));
  };

  const toggleGate = (gate: GateName) => {
    const newGates = new Set(optionalGates);
    if (newGates.has(gate)) newGates.delete(gate);
    else newGates.add(gate);
    setOptionalGates(newGates);
  };

  const handleLaunch = async () => {
    if (!formData.candidateName || !formData.roleName) return;
    setIsLoading(true);
    try {
      createSession({
        candidateName: formData.candidateName,
        roleName: formData.roleName,
        roleLevel: formData.roleLevel,
        jobDescription: formData.jobDescription,
        cvSummary: formData.cvSummary,
        interviewMode: formData.interviewMode,
        activeGates: [...CORE_GATE_IDS, ...Array.from(optionalGates)],
      });
      navigate('/interview');
    } catch {
      alert('Failed to create interview session');
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = formData.candidateName.trim() && formData.roleName.trim();

  const inputStyle: React.CSSProperties = {
    background: 'var(--color-surface)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    color: 'var(--color-text-primary)',
    fontSize: '1rem',
    width: '100%',
    outline: 'none',
  };

  const headingStyle: React.CSSProperties = { color: 'var(--color-text-primary)' };
  const subStyle: React.CSSProperties = { color: 'var(--color-text-secondary)', fontSize: '0.875rem' };

  return (
    <div className="bg-gradient-dark min-h-screen pt-8 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="heading-lg" style={headingStyle}>Set Up Interview</h1>
            <button onClick={goBack} className="btn btn-ghost btn-sm">
              {currentStep > 1 ? '← Back' : '✕'}
            </button>
          </div>
          <p className="text-sm mb-4" style={subStyle}>Step {currentStep} of 6</p>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full"
              style={{ background: 'var(--color-gold)' }}
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / 6) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 1 && (
            <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <div>
                <h2 className="heading-md mb-2" style={headingStyle}>Who are we assessing?</h2>
                <p style={subStyle}>Tell us about the candidate and role</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={headingStyle}>Candidate Name</label>
                <input
                  type="text"
                  placeholder="e.g., Sarah Johnson"
                  value={formData.candidateName}
                  onChange={e => setFormData(p => ({ ...p, candidateName: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && isStep1Valid && goNext()}
                  style={inputStyle}
                  autoFocus
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold mb-2" style={headingStyle}>Role Name</label>
                <input
                  type="text"
                  placeholder="e.g., VP Engineering"
                  value={formData.roleName}
                  onChange={e => handleRoleNameChange(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && isStep1Valid && goNext()}
                  style={inputStyle}
                />
                {showSuggestions && (
                  <motion.div
                    className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg z-10"
                    style={{ background: 'var(--color-surface-raised)', border: '1px solid rgba(255,255,255,0.08)' }}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {suggestions.map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => selectRole(role)}
                        className="block w-full text-left px-4 py-3 text-sm transition-colors hover:opacity-80"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {role}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
              <motion.button type="button" onClick={goNext} disabled={!isStep1Valid} className="btn btn-primary w-full mt-8 disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Continue
              </motion.button>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <div>
                <h2 className="heading-md mb-2" style={headingStyle}>What level is this role?</h2>
                <p style={subStyle}>Select the seniority level</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ROLE_LEVELS.map(level => (
                  <motion.button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, roleLevel: level.value as any }))}
                    className="relative p-4 rounded-lg border-2 transition-all"
                    style={{
                      borderColor: formData.roleLevel === level.value ? 'var(--color-gold)' : 'rgba(255,255,255,0.08)',
                      background: formData.roleLevel === level.value ? 'rgba(201,168,76,0.1)' : 'var(--color-surface-raised)',
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="text-2xl mb-2">{level.icon}</div>
                    <div className="font-semibold text-sm" style={headingStyle}>{level.label}</div>
                    <div className="text-xs mt-1" style={subStyle}>{level.description}</div>
                    {formData.roleLevel === level.value && (
                      <motion.div className="absolute top-2 right-2" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                          <span className="text-xs font-bold" style={{ color: '#0D0D1A' }}>✓</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
              <motion.button type="button" onClick={goNext} className="btn btn-primary w-full mt-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Continue</motion.button>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <div>
                <h2 className="heading-md mb-2" style={headingStyle}>Tell us more (optional)</h2>
                <p style={subStyle}>Add context that helps AI understand the role better</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={headingStyle}>Job Description or Key Responsibilities</label>
                <textarea
                  placeholder="Paste the job description or key responsibilities..."
                  value={formData.jobDescription}
                  onChange={e => setFormData(p => ({ ...p, jobDescription: e.target.value }))}
                  rows={4}
                  style={{ ...inputStyle, minHeight: '100px', resize: 'none' }}
                />
                <p className="text-xs mt-2" style={subStyle}>You can skip this step if needed</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={headingStyle}>CV Summary or Background</label>
                <textarea
                  placeholder="Paste candidate background, experience, or education..."
                  value={formData.cvSummary}
                  onChange={e => setFormData(p => ({ ...p, cvSummary: e.target.value }))}
                  rows={4}
                  style={{ ...inputStyle, minHeight: '100px', resize: 'none' }}
                />
              </div>
              <motion.button type="button" onClick={goNext} className="btn btn-primary w-full mt-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Continue</motion.button>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <div>
                <h2 className="heading-md mb-2" style={headingStyle}>Assessment Gates</h2>
                <p style={subStyle}>These determine pass/fail criteria</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={headingStyle}>
                  <span className="text-gold">✓</span> Core Gates (Always Checked)
                </h3>
                <div className="space-y-2">
                  {CORE_GATE_IDS.map(gateId => (
                    <div key={gateId} className="glass rounded-lg p-3">
                      <div className="font-medium text-sm" style={headingStyle}>{GATE_DEFINITIONS[gateId]?.displayName}</div>
                      <div className="text-xs mt-1" style={subStyle}>{GATE_DEFINITIONS[gateId]?.description}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3" style={headingStyle}>Optional Gates (Toggle to Add)</h3>
                <div className="space-y-2">
                  {OPTIONAL_GATE_IDS.map(gateId => (
                    <motion.button
                      key={gateId}
                      type="button"
                      onClick={() => toggleGate(gateId)}
                      className="w-full text-left glass rounded-lg p-3 border-2 transition-all"
                      style={{
                        borderColor: optionalGates.has(gateId) ? 'var(--color-gold)' : 'rgba(255,255,255,0.06)',
                        background: optionalGates.has(gateId) ? 'rgba(201,168,76,0.05)' : undefined,
                      }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0">
                          {optionalGates.has(gateId) ? (
                            <div className="w-5 h-5 rounded bg-gold flex items-center justify-center">
                              <span className="text-xs font-bold" style={{ color: '#0D0D1A' }}>✓</span>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded border" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm" style={headingStyle}>{GATE_DEFINITIONS[gateId]?.displayName}</div>
                          <div className="text-xs mt-1" style={subStyle}>{GATE_DEFINITIONS[gateId]?.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: '#A78BFA' }}>
                  🧠 Psychological Gates
                </h3>
                <p className="text-xs mb-3" style={subStyle}>Deep personality risk screening — automatically enabled based on role</p>
                <div className="space-y-2">
                  {PSYCHOLOGICAL_GATE_IDS.map(gateId => (
                    <motion.button
                      key={gateId}
                      type="button"
                      onClick={() => toggleGate(gateId)}
                      className="w-full text-left glass rounded-lg p-3 border-2 transition-all"
                      style={{
                        borderColor: optionalGates.has(gateId) ? '#A78BFA' : 'rgba(255,255,255,0.06)',
                        background: optionalGates.has(gateId) ? 'rgba(167,139,250,0.07)' : undefined,
                      }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0">
                          {optionalGates.has(gateId) ? (
                            <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: '#A78BFA' }}>
                              <span className="text-xs font-bold" style={{ color: '#0D0D1A' }}>✓</span>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded border" style={{ borderColor: 'rgba(167,139,250,0.3)' }} />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm flex items-center gap-2" style={headingStyle}>
                            {GATE_DEFINITIONS[gateId]?.displayName}
                            {optionalGates.has(gateId) && (
                              <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA' }}>
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-xs mt-1" style={subStyle}>{GATE_DEFINITIONS[gateId]?.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
              <motion.button type="button" onClick={goNext} className="btn btn-primary w-full mt-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Continue</motion.button>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div key="step5" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <div>
                <h2 className="heading-md mb-2" style={headingStyle}>Interview Mode</h2>
                <p style={subStyle}>How should the AI conduct the interview?</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {(['active', 'shadow'] as const).map(mode => (
                  <motion.button
                    key={mode}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, interviewMode: mode }))}
                    className="relative p-6 rounded-lg border-2 transition-all text-left"
                    style={{
                      borderColor: formData.interviewMode === mode ? 'var(--color-gold)' : 'rgba(255,255,255,0.08)',
                      background: formData.interviewMode === mode ? 'rgba(201,168,76,0.1)' : 'var(--color-surface-raised)',
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="text-3xl mb-3">{mode === 'active' ? '🎤' : '👁️'}</div>
                    <div className="font-semibold text-lg" style={headingStyle}>{mode === 'active' ? 'Active' : 'Shadow'} Mode</div>
                    <div className="text-sm mt-2" style={subStyle}>
                      {mode === 'active' ? 'AI leads the interview and asks questions' : 'AI observes while you conduct the interview'}
                    </div>
                    {formData.interviewMode === mode && (
                      <motion.div className="absolute top-4 right-4" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                          <span className="text-sm font-bold" style={{ color: '#0D0D1A' }}>✓</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
              <motion.button type="button" onClick={goNext} className="btn btn-primary w-full mt-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Continue</motion.button>
            </motion.div>
          )}

          {currentStep === 6 && (
            <motion.div key="step6" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
              <div>
                <h2 className="heading-md mb-2" style={headingStyle}>Ready to begin?</h2>
                <p style={subStyle}>Review your setup below</p>
              </div>
              <div className="space-y-3">
                <SummaryCard label="Candidate" value={formData.candidateName} icon="👤" onEdit={() => { setDirection(-5); setCurrentStep(1); }} />
                <SummaryCard label="Role" value={`${formData.roleName} (${formData.roleLevel})`} icon="🎯" onEdit={() => { setDirection(-4); setCurrentStep(2); }} />
                <SummaryCard label="Interview Mode" value={formData.interviewMode === 'active' ? 'AI Leads' : 'Observe Only'} icon={formData.interviewMode === 'active' ? '🎤' : '👁️'} onEdit={() => { setDirection(-1); setCurrentStep(5); }} />
                <SummaryCard label="Gates" value={`${CORE_GATE_IDS.length + optionalGates.size} gates enabled`} icon="🔍" onEdit={() => { setDirection(-2); setCurrentStep(4); }} />
              </div>
              <p className="text-center text-sm" style={subStyle}>Estimated Duration: ~30-45 minutes</p>
              <motion.button
                type="button"
                onClick={handleLaunch}
                disabled={isLoading}
                className="btn btn-primary w-full py-4 text-lg disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Launching...' : 'Launch Interview'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

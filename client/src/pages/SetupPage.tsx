import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useAssayStore } from '../store/useAssayStore';
import { motion, AnimatePresence } from 'framer-motion';
import type { GateName } from '../types';
import { GATE_DEFINITIONS, ROLE_GATE_PRESETS } from '../lib/gates';
import { ROLE_TEMPLATES, type RoleTemplate } from '../lib/roleTemplates';

const BASE_URL = import.meta.env.BASE_URL || '/';
const apiUrl = (path: string) => `${BASE_URL}api/${path}`;

interface CandidateOption {
  id: string;
  name: string;
  currentRole?: string;
  currentCompany?: string;
}

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

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

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
      style={{ border: '1px solid var(--color-border-subtle)' }}
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
        className="text-gold text-sm font-semibold hover:opacity-80 active:opacity-60 transition-opacity px-3 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Edit
      </motion.button>
    </motion.div>
  );
}

export function SetupPage() {
  const [, navigate] = useLocation();
  const { createSession, setCandidate, setCandidateBriefing } = useAssayStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidateResults, setCandidateResults] = useState<CandidateOption[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [showCandidateResults, setShowCandidateResults] = useState(false);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingReady, setBriefingReady] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    candidateName: '',
    roleName: '',
    roleLevel: 'C-Suite' as 'C-Suite' | 'VP' | 'Director' | 'Senior Manager' | 'Manager',
    jobDescription: '',
    cvSummary: '',
    interviewMode: 'active' as 'active' | 'shadow',
  });

  const [optionalGates, setOptionalGates] = useState<Set<GateName>>(() => getDefaultOptionalGates(''));
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const searchCandidates = useCallback(async (query: string) => {
    if (query.length < 2) { setCandidateResults([]); setShowCandidateResults(false); return; }
    try {
      const res = await fetch(apiUrl(`candidates?search=${encodeURIComponent(query)}`), { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setCandidateResults(data.slice(0, 8));
        setShowCandidateResults(data.length > 0);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchCandidates(candidateSearch), 300);
    return () => clearTimeout(timer);
  }, [candidateSearch, searchCandidates]);

  const selectCandidate = (c: CandidateOption) => {
    setSelectedCandidateId(c.id);
    setCandidate(c.id);
    setFormData(p => ({ ...p, candidateName: c.name }));
    setCandidateSearch(c.name);
    setShowCandidateResults(false);
  };

  const clearCandidate = () => {
    setSelectedCandidateId(null);
    setCandidate(null);
    setCandidateSearch('');
    setBriefingReady(false);
    setCandidateBriefing(null);
  };

  const generateBriefing = async () => {
    if (!selectedCandidateId) return;
    setBriefingLoading(true);
    setSetupError(null);
    try {
      const res = await fetch(apiUrl(`candidates/${selectedCandidateId}/generate-briefing`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roleName: formData.roleName, roleLevel: formData.roleLevel, jobDescription: formData.jobDescription }),
      });
      if (res.ok) {
        const data = await res.json();
        setCandidateBriefing(data.briefing);
        setBriefingReady(true);
      } else {
        setSetupError('Failed to generate AI briefing. Please try again.');
      }
    } catch (err) {
      setSetupError('Failed to generate AI briefing. Please check your connection and try again.');
      console.warn('Briefing generation failed:', err);
    }
    setBriefingLoading(false);
  };

  const goNext = () => {
    if (currentStep === 1 && !selectedTemplate) {
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

  const applyTemplate = (template: RoleTemplate) => {
    setSelectedTemplate(template.id);
    setFormData(p => ({
      ...p,
      roleName: template.roleName,
      roleLevel: template.roleLevel as typeof p.roleLevel,
      jobDescription: template.jobDescription,
    }));
    setOptionalGates(new Set<GateName>(template.suggestedGates));
  };

  const clearTemplate = () => {
    setSelectedTemplate(null);
    setFormData(p => ({
      ...p,
      roleName: '',
      roleLevel: 'C-Suite',
      jobDescription: '',
    }));
    setOptionalGates(getDefaultOptionalGates(''));
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
    setSetupError(null);
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
    } catch (err) {
      setSetupError('Failed to create interview session. Please try again.');
      console.warn('Failed to create session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = formData.candidateName.trim() && formData.roleName.trim();

  const goldFocusStyle = '0 0 0 2px rgba(201,168,76,0.4), 0 0 16px rgba(201,168,76,0.15)';

  const inputStyle: React.CSSProperties = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    color: 'var(--color-text-primary)',
    fontSize: '1rem',
    width: '100%',
    outline: 'none',
    minHeight: 44,
    WebkitAppearance: 'none',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.boxShadow = goldFocusStyle;
    e.currentTarget.style.borderColor = 'var(--color-gold)';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
  };

  const headingStyle: React.CSSProperties = { color: 'var(--color-text-primary)' };
  const subStyle: React.CSSProperties = { color: 'var(--color-text-secondary)', fontSize: '0.875rem' };

  const handleCardHoverEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'perspective(600px) rotateX(-2deg) rotateY(3deg) translateY(-4px)';
  };
  const handleCardHoverLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'none';
  };

  return (
    <div className="bg-gradient-dark min-h-screen pt-8 pb-safe overflow-x-hidden safe-top" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 5rem)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="heading-lg" style={headingStyle}>Set Up Interview</h1>
            <button onClick={goBack} className="btn btn-ghost btn-sm">
              {currentStep > 1 ? '← Back' : '✕'}
            </button>
          </div>
          <p className="text-sm mb-4" style={subStyle}>Step {currentStep} of 6</p>
          {/* Progress bar with gradient glow trail */}
          <div className="relative h-1 rounded-full overflow-hidden" style={{ background: 'var(--color-border-subtle)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-light))',
                boxShadow: '0 0 12px var(--color-gold), 0 0 4px var(--color-gold-light)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / 6) * 100}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 1 && (
            <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={springTransition} className="space-y-6">
              <div>
                <h2 className="heading-md mb-2" style={headingStyle}>Who are we assessing?</h2>
                <p style={subStyle}>Tell us about the candidate and role</p>
              </div>

              {/* Role Benchmark Templates */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold" style={headingStyle}>Use a Template</label>
                  {selectedTemplate && (
                    <motion.button
                      type="button"
                      onClick={clearTemplate}
                      className="text-xs font-medium px-2 py-1 rounded transition-opacity hover:opacity-80"
                      style={{ color: 'var(--color-text-secondary)', background: 'var(--color-border-subtle)' }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      Clear Template
                    </motion.button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {ROLE_TEMPLATES.map(template => {
                    const isSelected = selectedTemplate === template.id;
                    return (
                      <motion.button
                        key={template.id}
                        type="button"
                        onClick={() => applyTemplate(template)}
                        className="relative p-3 rounded-lg border-2 text-left"
                        style={{
                          borderColor: isSelected ? 'var(--color-gold)' : 'var(--color-border-subtle)',
                          background: isSelected ? 'rgba(201,168,76,0.1)' : 'var(--color-surface-raised)',
                          transition: 'transform 0.3s ease, border-color 0.2s ease, background 0.2s ease',
                        }}
                        onMouseEnter={handleCardHoverEnter}
                        onMouseLeave={handleCardHoverLeave}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className="text-xl mb-1">{template.icon}</div>
                        <div className="font-semibold text-xs leading-tight" style={headingStyle}>{template.title}</div>
                        <span
                          className="inline-block text-[10px] mt-1 px-1.5 py-0.5 rounded font-medium"
                          style={{
                            background: template.category === 'C-Suite' ? 'rgba(201,168,76,0.15)' : template.category === 'VP' ? 'rgba(96,165,250,0.15)' : template.category === 'Director' ? 'rgba(167,139,250,0.15)' : 'rgba(52,211,153,0.15)',
                            color: template.category === 'C-Suite' ? 'var(--color-gold)' : template.category === 'VP' ? 'var(--color-blue)' : template.category === 'Director' ? '#A78BFA' : 'var(--color-green)',
                          }}
                        >
                          {template.category}
                        </span>
                        {isSelected && (
                          <motion.div className="absolute top-2 right-2" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <div className="w-4 h-4 rounded-full bg-gold flex items-center justify-center">
                              <span className="text-[10px] font-bold" style={{ color: 'var(--color-dark)' }}>✓</span>
                            </div>
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t" style={{ borderColor: 'var(--color-border-subtle)' }} />

              {/* Candidate Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={headingStyle}>Link Existing Candidate (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search candidates by name..."
                    value={candidateSearch}
                    onChange={e => { setCandidateSearch(e.target.value); if (selectedCandidateId) clearCandidate(); }}
                    style={inputStyle}
                  />
                  {selectedCandidateId && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399' }}>
                        Linked to candidate record
                      </span>
                      <button onClick={clearCandidate} className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Clear</button>
                    </div>
                  )}
                  {showCandidateResults && (
                    <motion.div
                      className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
                      style={{ background: 'var(--color-surface-raised)', border: '1px solid rgba(255,255,255,0.08)' }}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {candidateResults.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => selectCandidate(c)}
                          className="block w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/5 active:bg-white/8 min-h-[44px]"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          <div>{c.name}</div>
                          {c.currentRole && <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{c.currentRole}{c.currentCompany ? ` at ${c.currentCompany}` : ''}</div>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={headingStyle}>Candidate Name</label>
                <input
                  type="text"
                  placeholder="e.g., Sarah Johnson"
                  value={formData.candidateName}
                  onChange={e => setFormData(p => ({ ...p, candidateName: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && isStep1Valid && goNext()}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
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
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  style={inputStyle}
                />
                {showSuggestions && (
                  <motion.div
                    className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg z-10"
                    style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-subtle)' }}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {suggestions.map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => selectRole(role)}
                        className="block w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/5 active:bg-white/8 min-h-[44px]"
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
            <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={springTransition} className="space-y-6">
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
                    className="relative p-4 rounded-lg border-2"
                    style={{
                      borderColor: formData.roleLevel === level.value ? 'var(--color-gold)' : 'var(--color-border-subtle)',
                      background: formData.roleLevel === level.value ? 'rgba(201,168,76,0.1)' : 'var(--color-surface-raised)',
                      transition: 'transform 0.3s ease, border-color 0.2s ease, background 0.2s ease',
                    }}
                    onMouseEnter={handleCardHoverEnter}
                    onMouseLeave={handleCardHoverLeave}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="text-2xl mb-2">{level.icon}</div>
                    <div className="font-semibold text-sm" style={headingStyle}>{level.label}</div>
                    <div className="text-xs mt-1" style={subStyle}>{level.description}</div>
                    {formData.roleLevel === level.value && (
                      <motion.div className="absolute top-2 right-2" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                          <span className="text-xs font-bold" style={{ color: 'var(--color-dark)' }}>✓</span>
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
            <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={springTransition} className="space-y-6">
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
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
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
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  style={{ ...inputStyle, minHeight: '100px', resize: 'none' }}
                />
              </div>
              <motion.button type="button" onClick={goNext} className="btn btn-primary w-full mt-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Continue</motion.button>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={springTransition} className="space-y-6">
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
                  {OPTIONAL_GATE_IDS.map(gateId => {
                    const isOn = optionalGates.has(gateId);
                    return (
                      <motion.button
                        key={gateId}
                        type="button"
                        onClick={() => toggleGate(gateId)}
                        className="w-full text-left glass rounded-lg p-3 border-2 transition-all"
                        style={{
                          borderColor: isOn ? 'var(--color-gold)' : 'var(--color-border-subtle)',
                          background: isOn ? 'rgba(201,168,76,0.05)' : undefined,
                          boxShadow: isOn ? '0 0 0 1px var(--color-gold), inset 0 0 12px rgba(201,168,76,0.06)' : 'none',
                        }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0">
                            {isOn ? (
                              <div className="w-5 h-5 rounded bg-gold flex items-center justify-center" style={{ boxShadow: '0 0 8px rgba(201,168,76,0.5)' }}>
                                <span className="text-xs font-bold" style={{ color: 'var(--color-dark)' }}>✓</span>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded border" style={{ borderColor: 'var(--color-text-tertiary)' }} />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm" style={headingStyle}>{GATE_DEFINITIONS[gateId]?.displayName}</div>
                            <div className="text-xs mt-1" style={subStyle}>{GATE_DEFINITIONS[gateId]?.description}</div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: '#A78BFA' }}>
                  🧠 Psychological Gates
                </h3>
                <p className="text-xs mb-3" style={subStyle}>Deep personality risk screening — automatically enabled based on role</p>
                <div className="space-y-2">
                  {PSYCHOLOGICAL_GATE_IDS.map(gateId => {
                    const isOn = optionalGates.has(gateId);
                    return (
                      <motion.button
                        key={gateId}
                        type="button"
                        onClick={() => toggleGate(gateId)}
                        className="w-full text-left glass rounded-lg p-3 border-2 transition-all"
                        style={{
                          borderColor: isOn ? '#A78BFA' : 'var(--color-border-subtle)',
                          background: isOn ? 'rgba(167,139,250,0.07)' : undefined,
                          boxShadow: isOn ? '0 0 0 1px #A78BFA, inset 0 0 12px rgba(167,139,250,0.06)' : 'none',
                        }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0">
                            {isOn ? (
                              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: '#A78BFA', boxShadow: '0 0 8px rgba(167,139,250,0.5)' }}>
                                <span className="text-xs font-bold" style={{ color: 'var(--color-dark)' }}>✓</span>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded border" style={{ borderColor: 'rgba(167,139,250,0.3)' }} />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm flex items-center gap-2" style={headingStyle}>
                              {GATE_DEFINITIONS[gateId]?.displayName}
                              {isOn && (
                                <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA' }}>
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="text-xs mt-1" style={subStyle}>{GATE_DEFINITIONS[gateId]?.description}</div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              <motion.button type="button" onClick={goNext} className="btn btn-primary w-full mt-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Continue</motion.button>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div key="step5" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={springTransition} className="space-y-6">
              <div>
                <h2 className="heading-md mb-2" style={headingStyle}>Interview Mode</h2>
                <p style={subStyle}>How should the AI conduct the interview?</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {(['active', 'shadow'] as const).map(mode => {
                  const isSelected = formData.interviewMode === mode;
                  return (
                    <motion.button
                      key={mode}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, interviewMode: mode }))}
                      className="relative p-6 rounded-lg border-2 text-left"
                      style={{
                        borderColor: isSelected ? 'var(--color-gold)' : 'var(--color-border-subtle)',
                        background: isSelected ? 'rgba(201,168,76,0.1)' : 'var(--color-surface-raised)',
                        boxShadow: isSelected ? '0 0 0 1px var(--color-gold), inset 0 0 16px rgba(201,168,76,0.08)' : 'none',
                        transition: 'transform 0.3s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={handleCardHoverEnter}
                      onMouseLeave={handleCardHoverLeave}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="text-3xl mb-3">{mode === 'active' ? '🎤' : '👁️'}</div>
                      <div className="font-semibold text-lg" style={headingStyle}>{mode === 'active' ? 'Active' : 'Shadow'} Mode</div>
                      <div className="text-sm mt-2" style={subStyle}>
                        {mode === 'active' ? 'AI leads the interview and asks questions' : 'AI observes while you conduct the interview'}
                      </div>
                      {isSelected && (
                        <motion.div className="absolute top-4 right-4" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center" style={{ boxShadow: '0 0 10px rgba(201,168,76,0.5)' }}>
                            <span className="text-sm font-bold" style={{ color: 'var(--color-dark)' }}>✓</span>
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <motion.button type="button" onClick={goNext} className="btn btn-primary w-full mt-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Continue</motion.button>
            </motion.div>
          )}

          {currentStep === 6 && (
            <motion.div key="step6" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={springTransition} className="space-y-6">
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
              {selectedCandidateId && !briefingReady && (
                <motion.button
                  type="button"
                  onClick={generateBriefing}
                  disabled={briefingLoading}
                  className="w-full py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                  style={{ background: 'rgba(167,139,250,0.1)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.2)' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {briefingLoading ? 'Generating AI Briefing...' : 'Generate Pre-Interview AI Briefing'}
                </motion.button>
              )}
              {briefingReady && (
                <div className="glass rounded-lg p-4" style={{ border: '1px solid rgba(52,211,153,0.2)' }}>
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#34D399' }}>
                    <span>&#10003;</span> AI Briefing Ready
                  </div>
                  <p className="text-xs mt-1" style={subStyle}>Intelligence will be injected into the AI interviewer and assessors.</p>
                </div>
              )}
              {setupError && (
                <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <span className="text-sm" style={{ color: '#EF4444' }}>{setupError}</span>
                  <button onClick={() => setSetupError(null)} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
                    Dismiss
                  </button>
                </div>
              )}
              <p className="text-center text-sm" style={subStyle}>Estimated Duration: ~30-45 minutes</p>
              <motion.button
                type="button"
                onClick={handleLaunch}
                disabled={isLoading}
                className="btn btn-primary btn-magnetic w-full py-4 text-lg disabled:opacity-50"
                style={{
                  backgroundSize: '200% auto',
                  backgroundImage: 'linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-light) 50%, var(--color-gold) 100%)',
                  animation: isLoading ? 'none' : 'shimmer 2s linear infinite',
                }}
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

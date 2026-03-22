import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.BASE_URL || '/';
const api = (path: string) => `${BASE_URL}api/${path}`;

export interface AIPersonality {
  style: 'formal' | 'casual' | 'balanced';
  pace: 'thorough' | 'moderate' | 'efficient';
  focusAreas: string[];
  customInstructions: string;
  interviewerName: string;
}

const STYLE_OPTIONS: { value: AIPersonality['style']; label: string; desc: string }[] = [
  { value: 'formal', label: 'Formal', desc: 'Professional and measured tone' },
  { value: 'balanced', label: 'Balanced', desc: 'Natural mix of warmth and professionalism' },
  { value: 'casual', label: 'Casual', desc: 'Relaxed, conversational approach' },
];

const PACE_OPTIONS: { value: AIPersonality['pace']; label: string; desc: string }[] = [
  { value: 'thorough', label: 'Thorough', desc: 'Longer, more detailed questions' },
  { value: 'moderate', label: 'Moderate', desc: 'Balanced depth and efficiency' },
  { value: 'efficient', label: 'Efficient', desc: 'Shorter, more direct questions' },
];

const FOCUS_AREAS = ['Leadership', 'Strategy', 'Culture', 'Technical', 'People', 'Financial'] as const;

export function PersonalityConfig() {
  const [personality, setPersonality] = useState<AIPersonality>({
    style: 'balanced',
    pace: 'moderate',
    focusAreas: [],
    customInstructions: '',
    interviewerName: 'Sophia',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(api('personality'), { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(data => setPersonality(data))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    setError('');
    try {
      const res = await fetch(api('personality'), {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personality),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Save failed' }));
        throw new Error(data.error || 'Save failed');
      }
      const updated = await res.json();
      setPersonality(updated);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFocusArea = (area: string) => {
    setPersonality(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area],
    }));
  };

  if (error && !personality.interviewerName) {
    return (
      <div className="text-center py-16">
        <p className="text-sm mb-4" style={{ color: 'var(--color-red)' }}>Failed to load personality settings</p>
        <button onClick={() => window.location.reload()} className="btn btn-secondary btn-sm">Retry</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Interviewer Name */}
      <div className="bg-[#12122A] border border-white/5 rounded-xl p-5">
        <h3 className="text-white font-semibold text-sm mb-1">Interviewer Name</h3>
        <p className="text-[#8B8B9E] text-xs mb-3">The AI interviewer will introduce itself with this name</p>
        <input
          type="text"
          value={personality.interviewerName}
          onChange={e => setPersonality(prev => ({ ...prev, interviewerName: e.target.value }))}
          placeholder="Sophia"
          className="w-full bg-[#0D0D1A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-[#8B8B9E]/50 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
        />
      </div>

      {/* Conversation Style */}
      <div className="bg-[#12122A] border border-white/5 rounded-xl p-5">
        <h3 className="text-white font-semibold text-sm mb-1">Conversation Style</h3>
        <p className="text-[#8B8B9E] text-xs mb-4">How should the AI interviewer communicate?</p>
        <div className="space-y-2">
          {STYLE_OPTIONS.map(opt => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                personality.style === opt.value
                  ? 'border-[#C9A84C]/40 bg-[#C9A84C]/5'
                  : 'border-white/8 hover:border-white/15'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  personality.style === opt.value ? 'border-[#C9A84C]' : 'border-[#8B8B9E]/50'
                }`}>
                  {personality.style === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                  )}
                </div>
              </div>
              <div>
                <span className="text-white text-sm font-medium">{opt.label}</span>
                <p className="text-[#8B8B9E] text-xs mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Interview Pace */}
      <div className="bg-[#12122A] border border-white/5 rounded-xl p-5">
        <h3 className="text-white font-semibold text-sm mb-1">Interview Pace</h3>
        <p className="text-[#8B8B9E] text-xs mb-4">How deep should the AI go on each topic?</p>
        <div className="space-y-2">
          {PACE_OPTIONS.map(opt => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                personality.pace === opt.value
                  ? 'border-[#C9A84C]/40 bg-[#C9A84C]/5'
                  : 'border-white/8 hover:border-white/15'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  personality.pace === opt.value ? 'border-[#C9A84C]' : 'border-[#8B8B9E]/50'
                }`}>
                  {personality.pace === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                  )}
                </div>
              </div>
              <div>
                <span className="text-white text-sm font-medium">{opt.label}</span>
                <p className="text-[#8B8B9E] text-xs mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Focus Areas */}
      <div className="bg-[#12122A] border border-white/5 rounded-xl p-5">
        <h3 className="text-white font-semibold text-sm mb-1">Focus Areas</h3>
        <p className="text-[#8B8B9E] text-xs mb-4">Select areas the AI should emphasize during interviews</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FOCUS_AREAS.map(area => {
            const selected = personality.focusAreas.includes(area);
            return (
              <button
                key={area}
                onClick={() => toggleFocusArea(area)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  selected
                    ? 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/30'
                    : 'border-white/8 text-[#8B8B9E] hover:border-white/20 hover:text-white'
                }`}
              >
                <span className="mr-1.5">{selected ? '✓' : '○'}</span>
                {area}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Instructions */}
      <div className="bg-[#12122A] border border-white/5 rounded-xl p-5">
        <h3 className="text-white font-semibold text-sm mb-1">Custom Instructions</h3>
        <p className="text-[#8B8B9E] text-xs mb-3">Additional guidance for the AI interviewer (appended verbatim to the system prompt)</p>
        <textarea
          value={personality.customInstructions}
          onChange={e => setPersonality(prev => ({ ...prev, customInstructions: e.target.value }))}
          placeholder="e.g., Always ask about experience with distributed systems. Probe for examples of cross-functional collaboration..."
          rows={4}
          className="w-full bg-[#0D0D1A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-[#8B8B9E]/50 focus:outline-none focus:border-[#C9A84C]/50 transition-colors resize-none"
        />
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileTap={{ scale: 0.97 }}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            isSaving
              ? 'bg-[#C9A84C]/50 text-[#0D0D1A]/50 cursor-not-allowed'
              : 'bg-[#C9A84C] text-[#0D0D1A] hover:bg-[#D4B56A]'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Personality'}
        </motion.button>
        {saveStatus === 'success' && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-emerald-400 text-sm font-medium"
          >
            Saved successfully
          </motion.span>
        )}
      </div>
    </div>
  );
}

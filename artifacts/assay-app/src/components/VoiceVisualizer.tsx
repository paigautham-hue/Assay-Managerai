import { useMemo } from 'react';

interface VoiceVisualizerProps {
  status: 'idle' | 'speaking' | 'listening' | 'processing';
  audioLevel?: number;
  /** Override the visualizer diameter in px (default: responsive 208/240) */
  size?: number;
}

/**
 * Premium AI interviewer visualization — "Sophia"
 * Sophisticated luminous orb with concentric rings, reactive waveforms,
 * and particle effects. Inspired by Siri, Apple Intelligence, and
 * premium AI product design.
 */
export function VoiceVisualizer({ status, audioLevel = 0.5, size }: VoiceVisualizerProps) {
  const level = Math.min(1, audioLevel);

  const config = useMemo(() => {
    switch (status) {
      case 'speaking':
        return {
          primary: '#C9A84C',
          secondary: '#E8D48B',
          tertiary: '#8B6914',
          glowIntensity: 0.6 + level * 0.4,
          label: 'Sophia is speaking',
          dotColor: 'bg-[#C9A84C]',
          ringSpeed: '3s',
          pulseScale: 1.05 + level * 0.15,
          orbScale: 1 + level * 0.08,
        };
      case 'listening':
        return {
          primary: '#60A5FA',
          secondary: '#93C5FD',
          tertiary: '#2563EB',
          glowIntensity: 0.4,
          label: 'Listening…',
          dotColor: 'bg-blue-400',
          ringSpeed: '6s',
          pulseScale: 1.02,
          orbScale: 1,
        };
      case 'processing':
        return {
          primary: '#A78BFA',
          secondary: '#C4B5FD',
          tertiary: '#7C3AED',
          glowIntensity: 0.35,
          label: 'Thinking…',
          dotColor: 'bg-purple-400',
          ringSpeed: '2s',
          pulseScale: 1.03,
          orbScale: 0.98,
        };
      default:
        return {
          primary: '#64748B',
          secondary: '#94A3B8',
          tertiary: '#475569',
          glowIntensity: 0.15,
          label: 'Ready',
          dotColor: 'bg-slate-500',
          ringSpeed: '8s',
          pulseScale: 1,
          orbScale: 1,
        };
    }
  }, [status, level]);

  // Generate waveform bars for speaking state
  const waveformBars = useMemo(() => {
    const bars = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 360;
      const baseHeight = 3;
      const maxHeight = status === 'speaking' ? 8 + level * 18 : status === 'listening' ? 4 : 2;
      // Create organic variation using multiple sine waves
      const variation = Math.sin(i * 0.8) * 0.3 + Math.sin(i * 1.6) * 0.2 + Math.cos(i * 0.5) * 0.5;
      const height = baseHeight + maxHeight * Math.abs(variation);
      bars.push({ angle, height });
    }
    return bars;
  }, [status, level]);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Main container */}
      <div
        className={size ? 'relative flex items-center justify-center' : 'relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center'}
        style={size ? { width: size, height: size } : undefined}
      >

        {/* Ambient glow — large, soft background */}
        <div
          className="absolute inset-[-40%] rounded-full transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle, ${config.primary}${Math.round(config.glowIntensity * 40).toString(16).padStart(2, '0')} 0%, ${config.primary}08 40%, transparent 70%)`,
            transform: `scale(${config.pulseScale})`,
          }}
        />

        {/* Outer rotating ring */}
        <div
          className="absolute inset-[-8%] rounded-full"
          style={{
            border: `1px solid ${config.primary}20`,
            animation: `spin ${config.ringSpeed} linear infinite`,
          }}
        >
          {/* Ring accent dots */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: config.primary, opacity: 0.6 }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 rounded-full" style={{ background: config.secondary, opacity: 0.4 }} />
        </div>

        {/* Second rotating ring — counter direction */}
        <div
          className="absolute inset-[4%] rounded-full"
          style={{
            border: `1px solid ${config.secondary}15`,
            animation: `spin ${config.ringSpeed} linear infinite reverse`,
          }}
        >
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full" style={{ background: config.primary, opacity: 0.4 }} />
        </div>

        {/* Inner pulsing ring */}
        <div
          className="absolute inset-[12%] rounded-full transition-all duration-500"
          style={{
            border: `1.5px solid ${config.primary}30`,
            boxShadow: `inset 0 0 20px ${config.primary}10`,
            transform: `scale(${status === 'speaking' ? 1 + level * 0.05 : 1})`,
          }}
        />

        {/* Waveform ring — circular bars */}
        <svg
          className="absolute inset-[8%] w-[84%] h-[84%]"
          viewBox="0 0 200 200"
          style={{ animation: status === 'speaking' ? 'spin 20s linear infinite' : 'none' }}
        >
          {waveformBars.map((bar, i) => {
            const radians = (bar.angle * Math.PI) / 180;
            const innerR = 72;
            const x1 = 100 + innerR * Math.cos(radians);
            const y1 = 100 + innerR * Math.sin(radians);
            const x2 = 100 + (innerR + bar.height) * Math.cos(radians);
            const y2 = 100 + (innerR + bar.height) * Math.sin(radians);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={config.primary}
                strokeWidth={status === 'speaking' ? 2.5 : 1.5}
                strokeLinecap="round"
                opacity={status === 'speaking' ? 0.5 + level * 0.5 : 0.2}
                style={{
                  transition: 'all 0.15s ease-out',
                }}
              />
            );
          })}
        </svg>

        {/* Core orb */}
        <div
          className="relative w-[55%] h-[55%] rounded-full transition-all duration-300 ease-out"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${config.secondary}40, ${config.primary}30 40%, ${config.tertiary}50 70%, ${config.primary}20 100%)`,
            boxShadow: `
              0 0 40px ${config.primary}${Math.round(config.glowIntensity * 60).toString(16).padStart(2, '0')},
              0 0 80px ${config.primary}${Math.round(config.glowIntensity * 30).toString(16).padStart(2, '0')},
              inset 0 0 30px ${config.secondary}20,
              inset -8px -8px 20px ${config.tertiary}30
            `,
            transform: `scale(${config.orbScale})`,
          }}
        >
          {/* Glass highlight — top-left light reflection */}
          <div
            className="absolute top-[12%] left-[18%] w-[35%] h-[25%] rounded-full"
            style={{
              background: `linear-gradient(135deg, ${config.secondary}30, transparent)`,
              filter: 'blur(4px)',
            }}
          />

          {/* Secondary highlight */}
          <div
            className="absolute bottom-[20%] right-[15%] w-[20%] h-[15%] rounded-full"
            style={{
              background: `linear-gradient(315deg, ${config.primary}15, transparent)`,
              filter: 'blur(3px)',
            }}
          />

          {/* Center icon — subtle AI symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-[35%] h-[35%]" style={{ opacity: 0.4 }}>
              <defs>
                <linearGradient id="ai-icon-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={config.secondary} />
                  <stop offset="100%" stopColor={config.primary} />
                </linearGradient>
              </defs>
              {/* Neural network / brain-inspired icon */}
              <circle cx="12" cy="6" r="1.5" fill="url(#ai-icon-grad)" />
              <circle cx="6" cy="12" r="1.5" fill="url(#ai-icon-grad)" />
              <circle cx="18" cy="12" r="1.5" fill="url(#ai-icon-grad)" />
              <circle cx="12" cy="18" r="1.5" fill="url(#ai-icon-grad)" />
              <circle cx="12" cy="12" r="2" fill="url(#ai-icon-grad)" />
              <line x1="12" y1="6" x2="12" y2="12" stroke="url(#ai-icon-grad)" strokeWidth="0.8" opacity="0.6" />
              <line x1="6" y1="12" x2="12" y2="12" stroke="url(#ai-icon-grad)" strokeWidth="0.8" opacity="0.6" />
              <line x1="18" y1="12" x2="12" y2="12" stroke="url(#ai-icon-grad)" strokeWidth="0.8" opacity="0.6" />
              <line x1="12" y1="18" x2="12" y2="12" stroke="url(#ai-icon-grad)" strokeWidth="0.8" opacity="0.6" />
              <line x1="12" y1="6" x2="6" y2="12" stroke="url(#ai-icon-grad)" strokeWidth="0.5" opacity="0.3" />
              <line x1="12" y1="6" x2="18" y2="12" stroke="url(#ai-icon-grad)" strokeWidth="0.5" opacity="0.3" />
              <line x1="6" y1="12" x2="12" y2="18" stroke="url(#ai-icon-grad)" strokeWidth="0.5" opacity="0.3" />
              <line x1="18" y1="12" x2="12" y2="18" stroke="url(#ai-icon-grad)" strokeWidth="0.5" opacity="0.3" />
            </svg>
          </div>
        </div>

        {/* Floating particles */}
        {status !== 'idle' && (
          <>
            <div
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: config.primary,
                top: '15%',
                right: '20%',
                opacity: 0.5,
                animation: 'float-particle-1 4s ease-in-out infinite',
              }}
            />
            <div
              className="absolute w-0.5 h-0.5 rounded-full"
              style={{
                background: config.secondary,
                bottom: '22%',
                left: '18%',
                opacity: 0.4,
                animation: 'float-particle-2 5s ease-in-out infinite',
              }}
            />
            <div
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: config.primary,
                top: '40%',
                left: '8%',
                opacity: 0.3,
                animation: 'float-particle-3 6s ease-in-out infinite',
              }}
            />
          </>
        )}
      </div>

      {/* Name */}
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: config.primary, opacity: 0.7 }}>
        Sophia
      </p>

      {/* Status label */}
      <div className="mt-1.5 flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${status !== 'idle' ? 'animate-pulse' : ''}`} />
        <span className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
          {config.label}
        </span>
      </div>

      {/* Particle animations */}
      <style>{`
        @keyframes float-particle-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          25% { transform: translate(-6px, -8px) scale(1.3); opacity: 0.7; }
          50% { transform: translate(4px, -12px) scale(0.8); opacity: 0.3; }
          75% { transform: translate(8px, -4px) scale(1.1); opacity: 0.6; }
        }
        @keyframes float-particle-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          33% { transform: translate(8px, 6px) scale(1.2); opacity: 0.6; }
          66% { transform: translate(-4px, 10px) scale(0.7); opacity: 0.3; }
        }
        @keyframes float-particle-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(6px, -8px) scale(1.4); opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

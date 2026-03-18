import { useMemo } from 'react';

interface VoiceVisualizerProps {
  status: 'idle' | 'speaking' | 'listening' | 'processing';
  audioLevel?: number;
}

export function VoiceVisualizer({ status, audioLevel = 0.5 }: VoiceVisualizerProps) {
  const rings = useMemo(() => Array.from({ length: 4 }, (_, i) => i), []);

  const getRingOpacity = (index: number) => {
    const baseOpacity = 0.4;
    const levelFactor = audioLevel * 0.5;
    return Math.max(0.1, baseOpacity - index * 0.1 + levelFactor);
  };

  const getRingColor = () => {
    switch (status) {
      case 'speaking': return '#C9A84C';
      case 'listening': return '#60A5FA';
      case 'processing': return '#64748B';
      default: return '#475569';
    }
  };

  const containerAnimation = status === 'speaking'
    ? 'animate-pulse-ring'
    : status === 'listening'
    ? 'animate-pulse-subtle'
    : status === 'processing'
    ? 'animate-spin-slow'
    : '';

  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      <div className={`absolute w-6 h-6 rounded-full z-10 transition-colors duration-300 ${status === 'speaking' ? 'bg-gold' : 'bg-slate-300'}`} />

      <svg className={`absolute w-full h-full ${containerAnimation}`} viewBox="0 0 256 256">
        {rings.map((ringIndex) => {
          const radius = 30 + ringIndex * 30;
          return (
            <g key={ringIndex}>
              <circle
                cx="128"
                cy="128"
                r={radius}
                fill="none"
                stroke={getRingColor()}
                strokeWidth={2}
                className="transition-opacity duration-300"
                style={{ opacity: getRingOpacity(ringIndex) }}
              />
              {status === 'speaking' && [0, 90, 180, 270].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const x = 128 + radius * Math.cos(rad);
                const y = 128 + radius * Math.sin(rad);
                return (
                  <circle
                    key={`dot-${ringIndex}-${angle}`}
                    cx={x}
                    cy={y}
                    r="2.5"
                    fill="#C9A84C"
                    opacity={getRingOpacity(ringIndex)}
                  />
                );
              })}
            </g>
          );
        })}

        {status === 'listening' && (
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`wave-${i}`}
                x1={88 + i * 20}
                y1="128"
                x2={88 + i * 20}
                y2={128 - 15}
                stroke="#60A5FA"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
            ))}
          </g>
        )}
      </svg>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-24 whitespace-nowrap">
        <p className="text-sm font-semibold text-slate-300">
          {status === 'speaking' && (
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse-subtle" />
              AI Speaking
            </span>
          )}
          {status === 'listening' && (
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-subtle" />
              Listening
            </span>
          )}
          {status === 'processing' && (
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-spin-slow" />
              Processing
            </span>
          )}
          {status === 'idle' && (
            <span className="text-slate-500">Ready</span>
          )}
        </p>
      </div>
    </div>
  );
}

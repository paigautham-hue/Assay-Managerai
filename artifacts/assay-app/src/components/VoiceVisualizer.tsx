import { useMemo } from 'react';

interface VoiceVisualizerProps {
  status: 'idle' | 'speaking' | 'listening' | 'processing';
  audioLevel?: number;
}

export function VoiceVisualizer({ status, audioLevel = 0.5 }: VoiceVisualizerProps) {
  // Animated mouth based on audio level
  const mouthOpen = status === 'speaking' ? Math.min(8, audioLevel * 16) : 0;
  const mouthCurve = status === 'listening' ? 4 : status === 'idle' ? 2 : 0;

  // Aura colour per status
  const auraColor = useMemo(() => {
    switch (status) {
      case 'speaking': return '#C9A84C';
      case 'listening': return '#60A5FA';
      case 'processing': return '#A78BFA';
      default: return '#475569';
    }
  }, [status]);

  const earringColor = auraColor;

  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Aura glow rings */}
      <svg className="absolute w-full h-full" viewBox="0 0 256 256">
        <defs>
          <radialGradient id="auraGrad" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={auraColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={auraColor} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="128" cy="115" r="120" fill="url(#auraGrad)">
          <animate attributeName="r" values="110;125;110" dur={status === 'speaking' ? '1.2s' : '3s'} repeatCount="indefinite" />
        </circle>
        <circle cx="128" cy="115" r="95" fill="none" stroke={auraColor} strokeWidth="1" opacity="0.2">
          <animate attributeName="r" values="90;100;90" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Face SVG */}
      <svg className="relative z-10" viewBox="0 0 200 230" width="200" height="230">
        <defs>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C68642" />
            <stop offset="100%" stopColor="#8D5524" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2C1810" />
            <stop offset="100%" stopColor="#1A0E08" />
          </linearGradient>
          <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8967A" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#E8967A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lipGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C44569" />
            <stop offset="100%" stopColor="#A23B56" />
          </linearGradient>
        </defs>

        {/* Hair — back layer */}
        <ellipse cx="100" cy="82" rx="72" ry="78" fill="url(#hairGrad)" />
        <ellipse cx="100" cy="140" rx="55" ry="60" fill="url(#hairGrad)" />
        {/* Long flowing strands on sides */}
        <path d="M 35 80 Q 25 140 38 195 Q 42 200 48 195 Q 38 140 42 85 Z" fill="url(#hairGrad)" opacity="0.9" />
        <path d="M 165 80 Q 175 140 162 195 Q 158 200 152 195 Q 162 140 158 85 Z" fill="url(#hairGrad)" opacity="0.9" />

        {/* Ears */}
        <ellipse cx="42" cy="105" rx="8" ry="12" fill="url(#skinGrad)" />
        <ellipse cx="158" cy="105" rx="8" ry="12" fill="url(#skinGrad)" />

        {/* Earrings */}
        <circle cx="42" cy="120" r="4" fill={earringColor} opacity="0.85">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="158" cy="120" r="4" fill={earringColor} opacity="0.85">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Face shape */}
        <ellipse cx="100" cy="108" rx="52" ry="62" fill="url(#skinGrad)" />

        {/* Neck */}
        <rect x="88" y="160" width="24" height="22" rx="6" fill="#B5713F" />

        {/* Hair — front bangs */}
        <path d="M 52 60 Q 70 30 100 28 Q 130 30 148 60 Q 140 50 120 45 Q 100 42 80 45 Q 60 50 52 60 Z" fill="url(#hairGrad)" />
        {/* Side framing wisps */}
        <path d="M 52 60 Q 48 80 50 95 Q 54 85 55 70 Z" fill="url(#hairGrad)" opacity="0.7" />
        <path d="M 148 60 Q 152 80 150 95 Q 146 85 145 70 Z" fill="url(#hairGrad)" opacity="0.7" />

        {/* Eyebrows */}
        <path d="M 68 80 Q 78 74 90 78" stroke="#3D2314" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 132 80 Q 122 74 110 78" stroke="#3D2314" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Eyes — whites */}
        <ellipse cx="80" cy="92" rx="12" ry="9" fill="#FDFAF6" />
        <ellipse cx="120" cy="92" rx="12" ry="9" fill="#FDFAF6" />

        {/* Irises */}
        <circle cx="80" cy="92" r="6" fill="#5C3317" />
        <circle cx="120" cy="92" r="6" fill="#5C3317" />

        {/* Pupils */}
        <circle cx="80" cy="92" r="3" fill="#1A0A00" />
        <circle cx="120" cy="92" r="3" fill="#1A0A00" />

        {/* Eye highlights */}
        <circle cx="83" cy="89" r="2" fill="white" opacity="0.8" />
        <circle cx="123" cy="89" r="2" fill="white" opacity="0.8" />

        {/* Eyelashes — top */}
        <path d="M 68 88 Q 74 82 80 84" stroke="#1A0A00" strokeWidth="1.5" fill="none" />
        <path d="M 92 84 Q 86 82 80 84" stroke="#1A0A00" strokeWidth="1.5" fill="none" />
        <path d="M 108 88 Q 114 82 120 84" stroke="#1A0A00" strokeWidth="1.5" fill="none" />
        <path d="M 132 84 Q 126 82 120 84" stroke="#1A0A00" strokeWidth="1.5" fill="none" />

        {/* Blinking animation during processing */}
        {status === 'processing' && (
          <>
            <ellipse cx="80" cy="92" rx="12" ry="9" fill="url(#skinGrad)" className="animate-blink" />
            <ellipse cx="120" cy="92" rx="12" ry="9" fill="url(#skinGrad)" className="animate-blink" />
          </>
        )}

        {/* Nose */}
        <path d="M 98 96 Q 96 108 92 112 Q 96 114 100 114 Q 104 114 108 112 Q 104 108 102 96" fill="none" stroke="#A0663A" strokeWidth="1.2" strokeLinecap="round" />

        {/* Cheek blush */}
        <ellipse cx="65" cy="108" rx="12" ry="8" fill="url(#blushGrad)" />
        <ellipse cx="135" cy="108" rx="12" ry="8" fill="url(#blushGrad)" />

        {/* Mouth / lips */}
        {mouthOpen > 1 ? (
          /* Speaking: open mouth */
          <g>
            <ellipse cx="100" cy="130" rx="14" ry={mouthOpen} fill="#6B1D2D" />
            <path d={`M 86 ${130 - mouthOpen * 0.3} Q 93 ${128 - mouthOpen * 0.2} 100 ${128 - mouthOpen * 0.3} Q 107 ${128 - mouthOpen * 0.2} 114 ${130 - mouthOpen * 0.3}`} fill="url(#lipGrad)" />
            <path d={`M 86 ${130 + mouthOpen * 0.3} Q 93 ${132 + mouthOpen * 0.2} 100 ${132 + mouthOpen * 0.3} Q 107 ${132 + mouthOpen * 0.2} 114 ${130 + mouthOpen * 0.3}`} fill="url(#lipGrad)" />
          </g>
        ) : (
          /* Resting / listening: closed smile */
          <g>
            <path d={`M 86 128 Q 93 ${128 + mouthCurve} 100 ${128 + mouthCurve + 1} Q 107 ${128 + mouthCurve} 114 128`} fill="url(#lipGrad)" stroke="#A23B56" strokeWidth="1" />
            <path d="M 88 128 Q 100 126 112 128" fill="url(#lipGrad)" stroke="none" />
          </g>
        )}
      </svg>

      {/* Status label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <p className="text-sm font-semibold text-slate-300">
          {status === 'speaking' && (
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              Sophia is speaking
            </span>
          )}
          {status === 'listening' && (
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Listening…
            </span>
          )}
          {status === 'processing' && (
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-spin" />
              Thinking…
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

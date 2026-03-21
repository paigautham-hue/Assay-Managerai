import { useMemo } from 'react';

interface VoiceVisualizerProps {
  status: 'idle' | 'speaking' | 'listening' | 'processing';
  audioLevel?: number;
}

/**
 * Professional AI interviewer avatar — "Sophia"
 * Uses a refined, minimalist portrait style with subtle gradients,
 * smooth curves, and elegant animations. Not a cartoon.
 */
export function VoiceVisualizer({ status, audioLevel = 0.5 }: VoiceVisualizerProps) {
  const level = Math.min(1, audioLevel);

  const statusConfig = useMemo(() => {
    switch (status) {
      case 'speaking': return { glow: '#C9A84C', glowOpacity: 0.35, label: 'Sophia is speaking', dotClass: 'bg-gold animate-pulse' };
      case 'listening': return { glow: '#60A5FA', glowOpacity: 0.2, label: 'Listening…', dotClass: 'bg-blue-400 animate-pulse' };
      case 'processing': return { glow: '#A78BFA', glowOpacity: 0.2, label: 'Thinking…', dotClass: 'bg-purple-400 animate-spin' };
      default: return { glow: '#475569', glowOpacity: 0.1, label: 'Ready', dotClass: 'bg-slate-500' };
    }
  }, [status]);

  // Mouth animation — subtle, proportional to audio
  const mouthOpenY = status === 'speaking' ? 2 + level * 5 : 0;
  const smileCurve = status === 'listening' ? 3 : status === 'idle' ? 1.5 : 0;

  return (
    <div className="relative flex flex-col items-center">
      {/* Container with glow */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${statusConfig.glow}${Math.round(statusConfig.glowOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
            transform: status === 'speaking' ? `scale(${1.05 + level * 0.1})` : 'scale(1)',
          }}
        />

        {/* Portrait SVG */}
        <svg viewBox="0 0 200 200" className="relative z-10 w-48 h-48" style={{ filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.4))' }}>
          <defs>
            {/* Skin — warm, multi-stop for realism */}
            <radialGradient id="sv-skin" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#D4956B" />
              <stop offset="50%" stopColor="#C17F56" />
              <stop offset="100%" stopColor="#A66D45" />
            </radialGradient>
            {/* Hair — rich dark brown with depth */}
            <linearGradient id="sv-hair" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#1E1108" />
              <stop offset="40%" stopColor="#2A1810" />
              <stop offset="100%" stopColor="#0F0906" />
            </linearGradient>
            {/* Lips — natural matte rose */}
            <linearGradient id="sv-lip" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B84055" />
              <stop offset="100%" stopColor="#8C2F42" />
            </linearGradient>
            {/* Blush — subtle */}
            <radialGradient id="sv-blush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4806A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#D4806A" stopOpacity="0" />
            </radialGradient>
            {/* Eye iris — warm hazel */}
            <radialGradient id="sv-iris" cx="45%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#6B4423" />
              <stop offset="70%" stopColor="#3D2112" />
              <stop offset="100%" stopColor="#1A0D06" />
            </radialGradient>
            {/* Neck shadow */}
            <linearGradient id="sv-neck" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A66D45" />
              <stop offset="100%" stopColor="#8E5C39" />
            </linearGradient>
            {/* Subtle nose shadow */}
            <linearGradient id="sv-noseShadow" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#B8784D" stopOpacity="0" />
              <stop offset="100%" stopColor="#8E5C39" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* === HAIR — back volume === */}
          <ellipse cx="100" cy="78" rx="62" ry="65" fill="url(#sv-hair)" />
          {/* Hair cascading down sides */}
          <path d="M 42 75 C 35 105 37 145 45 170 C 48 172 52 168 50 145 C 48 115 44 90 46 78 Z" fill="url(#sv-hair)" />
          <path d="M 158 75 C 165 105 163 145 155 170 C 152 172 148 168 150 145 C 152 115 156 90 154 78 Z" fill="url(#sv-hair)" />

          {/* === NECK === */}
          <path d="M 88 152 L 88 178 Q 88 185 95 185 L 105 185 Q 112 185 112 178 L 112 152 Z" fill="url(#sv-neck)" />
          {/* Shoulders hint */}
          <path d="M 88 180 Q 60 185 50 195 L 150 195 Q 140 185 112 180 Z" fill="#0D0D1A" opacity="0.6" />

          {/* === FACE === */}
          <ellipse cx="100" cy="105" rx="46" ry="54" fill="url(#sv-skin)" />

          {/* Jaw contour — subtle shadow */}
          <path d="M 56 105 Q 58 140 75 155 Q 90 163 100 164 Q 110 163 125 155 Q 142 140 144 105" fill="none" stroke="#8E5C39" strokeWidth="0.5" opacity="0.3" />

          {/* === EARS === */}
          <ellipse cx="54" cy="103" rx="5" ry="9" fill="url(#sv-skin)" />
          <ellipse cx="146" cy="103" rx="5" ry="9" fill="url(#sv-skin)" />
          {/* Earrings — small elegant studs */}
          <circle cx="54" cy="114" r="2.5" fill={statusConfig.glow} opacity="0.8" />
          <circle cx="146" cy="114" r="2.5" fill={statusConfig.glow} opacity="0.8" />

          {/* === HAIR — front === */}
          {/* Soft parted bangs */}
          <path d="M 58 60 Q 65 38 85 32 Q 98 30 100 33 Q 95 40 80 48 Q 65 55 58 60 Z" fill="url(#sv-hair)" />
          <path d="M 142 60 Q 135 38 115 32 Q 102 30 100 33 Q 105 40 120 48 Q 135 55 142 60 Z" fill="url(#sv-hair)" />
          {/* Side frame */}
          <path d="M 58 60 Q 54 72 55 88 Q 58 80 59 68 Z" fill="url(#sv-hair)" opacity="0.8" />
          <path d="M 142 60 Q 146 72 145 88 Q 142 80 141 68 Z" fill="url(#sv-hair)" opacity="0.8" />
          {/* Hair shine highlight */}
          <path d="M 75 38 Q 85 34 95 36" stroke="#3A2215" strokeWidth="1" fill="none" opacity="0.4" />

          {/* === EYEBROWS — natural arch === */}
          <path d="M 72 82 Q 78 77 85 78 Q 90 79 92 80" stroke="#2A1810" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M 128 82 Q 122 77 115 78 Q 110 79 108 80" stroke="#2A1810" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* === EYES === */}
          {/* Eye whites — almond shape */}
          <path d="M 72 93 Q 82 86 92 93 Q 82 99 72 93 Z" fill="#FAF8F5" />
          <path d="M 108 93 Q 118 86 128 93 Q 118 99 108 93 Z" fill="#FAF8F5" />

          {/* Irises */}
          <circle cx="82" cy="93" r="5.5" fill="url(#sv-iris)" />
          <circle cx="118" cy="93" r="5.5" fill="url(#sv-iris)" />

          {/* Pupils */}
          <circle cx="82" cy="93" r="2.5" fill="#0A0500" />
          <circle cx="118" cy="93" r="2.5" fill="#0A0500" />

          {/* Eye highlights — gives life */}
          <circle cx="84" cy="91" r="1.8" fill="white" opacity="0.85" />
          <circle cx="120" cy="91" r="1.8" fill="white" opacity="0.85" />
          <circle cx="80" cy="95" r="0.8" fill="white" opacity="0.4" />
          <circle cx="116" cy="95" r="0.8" fill="white" opacity="0.4" />

          {/* Upper eyelid line — gives definition */}
          <path d="M 72 93 Q 82 86 92 93" fill="none" stroke="#1A0D06" strokeWidth="1.2" />
          <path d="M 108 93 Q 118 86 128 93" fill="none" stroke="#1A0D06" strokeWidth="1.2" />

          {/* Lashes — refined, not heavy */}
          <path d="M 72 92 Q 70 89 69 87" stroke="#1A0D06" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <path d="M 92 92 Q 94 89 95 87" stroke="#1A0D06" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <path d="M 108 92 Q 106 89 105 87" stroke="#1A0D06" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <path d="M 128 92 Q 130 89 131 87" stroke="#1A0D06" strokeWidth="0.8" fill="none" strokeLinecap="round" />

          {/* Blinking overlay during processing */}
          {status === 'processing' && (
            <>
              <path d="M 72 93 Q 82 86 92 93 Q 82 99 72 93 Z" fill="url(#sv-skin)" className="animate-blink" />
              <path d="M 108 93 Q 118 86 128 93 Q 118 99 108 93 Z" fill="url(#sv-skin)" className="animate-blink" />
            </>
          )}

          {/* === NOSE === */}
          <path d="M 99 96 Q 97 108 94 113 Q 97 115 100 115 Q 103 115 106 113 Q 103 108 101 96" fill="url(#sv-noseShadow)" stroke="#A0663A" strokeWidth="0.6" strokeLinecap="round" />
          {/* Nostril dots */}
          <circle cx="96" cy="113" r="1" fill="#8E5C39" opacity="0.4" />
          <circle cx="104" cy="113" r="1" fill="#8E5C39" opacity="0.4" />

          {/* === CHEEK BLUSH === */}
          <ellipse cx="70" cy="108" rx="10" ry="6" fill="url(#sv-blush)" />
          <ellipse cx="130" cy="108" rx="10" ry="6" fill="url(#sv-blush)" />

          {/* === MOUTH === */}
          {mouthOpenY > 1 ? (
            /* Speaking mouth */
            <g>
              {/* Mouth interior */}
              <ellipse cx="100" cy="130" rx="11" ry={mouthOpenY} fill="#5A1525" />
              {/* Teeth hint */}
              <rect x="93" y={128 - mouthOpenY * 0.2} width="14" height={Math.min(3, mouthOpenY * 0.4)} rx="1" fill="#F5F0EA" opacity="0.6" />
              {/* Upper lip */}
              <path d={`M 89 ${129 - mouthOpenY * 0.3} Q 94 ${127 - mouthOpenY * 0.15} 100 ${126.5 - mouthOpenY * 0.2} Q 106 ${127 - mouthOpenY * 0.15} 111 ${129 - mouthOpenY * 0.3}`} fill="url(#sv-lip)" />
              {/* Cupid's bow */}
              <path d={`M 96 ${127 - mouthOpenY * 0.2} Q 98 ${126 - mouthOpenY * 0.15} 100 ${126.5 - mouthOpenY * 0.2} Q 102 ${126 - mouthOpenY * 0.15} 104 ${127 - mouthOpenY * 0.2}`} fill="url(#sv-lip)" />
              {/* Lower lip */}
              <path d={`M 89 ${131 + mouthOpenY * 0.2} Q 95 ${133 + mouthOpenY * 0.3} 100 ${133 + mouthOpenY * 0.35} Q 105 ${133 + mouthOpenY * 0.3} 111 ${131 + mouthOpenY * 0.2}`} fill="url(#sv-lip)" />
            </g>
          ) : (
            /* Closed / smiling mouth */
            <g>
              {/* Upper lip with cupid's bow */}
              <path d={`M 89 128 Q 94 127 97 127.5 Q 99 126.5 100 126.5 Q 101 126.5 103 127.5 Q 106 127 111 128`} fill="url(#sv-lip)" />
              {/* Lower lip — smile curve */}
              <path d={`M 89 128 Q 95 ${129 + smileCurve} 100 ${129.5 + smileCurve} Q 105 ${129 + smileCurve} 111 128`} fill="url(#sv-lip)" />
              {/* Lip line */}
              <path d={`M 89 128 Q 100 ${128.5 + smileCurve * 0.3} 111 128`} stroke="#8C2F42" strokeWidth="0.5" fill="none" />
            </g>
          )}

          {/* Lip highlight */}
          <ellipse cx="100" cy="127" rx="4" ry="1" fill="white" opacity="0.08" />
        </svg>
      </div>

      {/* Status label */}
      <div className="mt-4 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
        <span className="text-sm font-medium text-slate-300">{statusConfig.label}</span>
      </div>
    </div>
  );
}

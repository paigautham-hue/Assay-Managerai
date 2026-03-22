import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EmotionDataPoint } from '../lib/emotionEngine';

// ─── Emotion emoji map ──────────────────────────────────────────────────────

const EMOTION_EMOJI: Record<string, string> = {
  Joy: '😊',
  Excitement: '🤩',
  Contentment: '😌',
  Pride: '😤',
  Amusement: '😄',
  Interest: '🤔',
  Love: '❤️',
  Calmness: '😌',
  Anxiety: '😰',
  Fear: '😨',
  Sadness: '😢',
  Anger: '😠',
  Disgust: '🤢',
  Confusion: '😕',
  Surprise: '😲',
  'Surprise (positive)': '😮',
  'Surprise (negative)': '😧',
  Contempt: '😒',
  Boredom: '😑',
  Disappointment: '😞',
  Embarrassment: '😳',
  Stress: '😣',
  Doubt: '🤨',
};

function getEmoji(emotion: string): string {
  return EMOTION_EMOJI[emotion] ?? '🔵';
}

// ─── Color helpers ──────────────────────────────────────────────────────────

function valenceColor(valence: number): string {
  if (valence > 0.3) return 'var(--color-green)';
  if (valence < -0.3) return 'var(--color-red)';
  return 'var(--color-amber)';
}

function valenceBg(valence: number): string {
  if (valence > 0.3) return 'rgba(52,211,153,0.25)';
  if (valence < -0.3) return 'rgba(248,113,113,0.25)';
  return 'rgba(251,191,36,0.25)';
}

// ─── Component ──────────────────────────────────────────────────────────────

interface EmotionHeatmapProps {
  dataPoints: EmotionDataPoint[];
}

export function EmotionHeatmap({ dataPoints }: EmotionHeatmapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest data point
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [dataPoints.length]);

  if (dataPoints.length === 0) return null;

  const latest = dataPoints[dataPoints.length - 1];
  const dominantIntensity = latest.emotions[0]?.score ?? 0;

  return (
    <div className="space-y-3">
      {/* Section label */}
      <h3
        className="text-xs font-bold uppercase tracking-wide"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        Live Emotion
      </h3>

      {/* Scrolling timeline */}
      <div
        ref={scrollRef}
        className="flex gap-0.5 overflow-x-auto pb-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch' as any,
        }}
      >
        {dataPoints.map((dp, idx) => {
          const intensity = dp.emotions[0]?.score ?? 0;
          const barHeight = Math.max(12, Math.round(intensity * 48));

          return (
            <motion.div
              key={idx}
              className="flex-shrink-0 rounded-sm cursor-default group relative"
              style={{
                width: 6,
                height: barHeight,
                background: valenceColor(dp.valence),
                alignSelf: 'flex-end',
                opacity: 0.6 + intensity * 0.4,
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.2 }}
              title={`${dp.dominantEmotion} (${Math.round(dp.valence * 100)}%)`}
            >
              {/* Hover tooltip */}
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10"
                style={{
                  background: 'rgba(0,0,0,0.85)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {getEmoji(dp.dominantEmotion)} {dp.dominantEmotion}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Current dominant emotion badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={latest.dominantEmotion}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{
            background: valenceBg(latest.valence),
            border: `1px solid ${valenceColor(latest.valence)}40`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-sm">{getEmoji(latest.dominantEmotion)}</span>
          <span
            className="text-xs font-semibold"
            style={{ color: valenceColor(latest.valence) }}
          >
            {latest.dominantEmotion}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

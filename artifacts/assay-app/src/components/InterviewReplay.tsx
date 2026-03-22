import { useState, useRef, useEffect, useCallback } from 'react';
import type { TranscriptEntry } from '../types';

interface InterviewReplayProps {
  audioUrl: string;
  transcript: TranscriptEntry[];
}

export function InterviewReplay({ audioUrl, transcript }: InterviewReplayProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeEntryIndex, setActiveEntryIndex] = useState(-1);

  // Update current time from audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => { setIsPlaying(false); setActiveEntryIndex(-1); };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('loadedmetadata', onDurationChange);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('loadedmetadata', onDurationChange);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // Determine the active transcript entry based on audioTimestamp
  useEffect(() => {
    if (!transcript.length || !duration) return;

    // Find the last entry whose audioTimestamp <= currentTime
    let active = -1;
    for (let i = 0; i < transcript.length; i++) {
      const ts = transcript[i].audioTimestamp;
      if (ts !== undefined && ts !== null && ts <= currentTime) {
        active = i;
      }
    }
    setActiveEntryIndex(active);
  }, [currentTime, transcript, duration]);

  // Auto-scroll to active entry
  useEffect(() => {
    if (activeEntryIndex < 0) return;
    const container = transcriptContainerRef.current;
    if (!container) return;
    const activeEl = container.querySelector(`[data-entry-index="${activeEntryIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeEntryIndex]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = fraction * duration;
  }, [duration]);

  const seekToEntry = useCallback((index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const entry = transcript[index];
    if (entry?.audioTimestamp !== undefined && entry.audioTimestamp !== null) {
      audio.currentTime = entry.audioTimestamp;
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    }
  }, [transcript]);

  const formatTime = (s: number) => {
    if (!isFinite(s) || isNaN(s)) return '00:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Player controls */}
      <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-4">
          {/* Play/Pause button */}
          <button
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
            style={{
              background: 'var(--color-gold)',
              color: '#0D0D1A',
            }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="3" y="2" width="4" height="12" rx="1" />
                <rect x="9" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 2.5v11l9-5.5z" />
              </svg>
            )}
          </button>

          {/* Progress bar */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--color-text-tertiary)', minWidth: 40 }}>
              {formatTime(currentTime)}
            </span>
            <div
              className="flex-1 h-2 rounded-full cursor-pointer relative"
              style={{ background: 'rgba(255,255,255,0.1)' }}
              onClick={handleProgressClick}
            >
              <div
                className="h-full rounded-full transition-[width] duration-100"
                style={{
                  width: `${progress}%`,
                  background: 'var(--color-gold)',
                }}
              />
            </div>
            <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--color-text-tertiary)', minWidth: 40 }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Transcript with highlight */}
      <div
        ref={transcriptContainerRef}
        className="max-h-80 overflow-y-auto p-4 space-y-3"
        style={{ scrollBehavior: 'smooth' }}
      >
        {transcript.length === 0 ? (
          <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-tertiary)' }}>
            No transcript entries available.
          </p>
        ) : (
          transcript.map((entry, index) => {
            const isActive = index === activeEntryIndex;
            const isAI = entry.speaker === 'ai';

            return (
              <div
                key={entry.id || index}
                data-entry-index={index}
                onClick={() => seekToEntry(index)}
                className="rounded-lg p-3 cursor-pointer transition-all duration-200"
                style={{
                  background: isActive
                    ? 'rgba(212, 175, 55, 0.12)'
                    : 'rgba(255,255,255,0.02)',
                  border: isActive
                    ? '1px solid rgba(212, 175, 55, 0.3)'
                    : '1px solid transparent',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{
                      color: isAI ? 'var(--color-gold)' : 'var(--color-blue)',
                    }}
                  >
                    {isAI ? 'Interviewer' : 'Candidate'}
                  </span>
                  {entry.audioTimestamp !== undefined && entry.audioTimestamp !== null && (
                    <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      {formatTime(entry.audioTimestamp)}
                    </span>
                  )}
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  }}
                >
                  {entry.text}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

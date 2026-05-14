// ─── ChannelCard ─────────────────────────────────────────────────────────────
// Card with proper light/dark mode, overflow control, and truncation.

import { memo, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTvStore } from '../store/tvStore';
import StreamStatusBadge from './StreamStatusBadge';
import { getCurrentProgram, formatTime } from '../services/epgService';
import type { Channel } from '../store/tvStore';

interface Props {
  channel: Channel;
  style?: React.CSSProperties;
}

const ChannelCard = memo(function ChannelCard({ channel, style }: Props) {
  const currentChannel = useTvStore((s) => s.currentChannel);
  const favorites = useTvStore((s) => s.favorites);
  const toggleFavorite = useTvStore((s) => s.toggleFavorite);
  const setCurrentChannel = useTvStore((s) => s.setCurrentChannel);
  const addRecent = useTvStore((s) => s.addRecent);
  const playbackStatus = useTvStore((s) => s.playbackStatus);

  const [logoError, setLogoError] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const isActive = currentChannel?.id === channel.id;
  const isPlaying = isActive && playbackStatus === 'playing';
  const isOffline = channel.status === 'offline';
  const isFav = favorites.has(channel.id);

  const handlePlay = useCallback(() => {
    if (isOffline) return;
    setCurrentChannel(channel);
    addRecent(channel);
  }, [channel, isOffline, setCurrentChannel, addRecent]);

  const handleFav = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(channel.id);
  }, [channel.id, toggleFavorite]);

  const epg = getCurrentProgram(channel.group, channel.name);

  return (
    <div
      ref={ref}
      style={style}
      onClick={handlePlay}
      role="button"
      tabIndex={isOffline ? -1 : 0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePlay(); } }}
      aria-label={`${isOffline ? '(Offline) ' : ''}${channel.name}`}
      className={[
        'group relative flex flex-col gap-2 overflow-hidden rounded-2xl border p-3 transition-all duration-200',
        isOffline
          ? 'pointer-events-none cursor-not-allowed border-slate-200 bg-slate-100/60 opacity-45 grayscale dark:border-slate-800/50 dark:bg-slate-900/30'
          : isActive
            ? 'border-brand-300/60 bg-white shadow-card-hover dark:border-brand-700/40 dark:bg-slate-900'
            : 'cursor-pointer border-slate-100 bg-white shadow-card hover:border-brand-200/70 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-brand-700/30',
      ].join(' ')}
    >
      {/* Top row: logo + name + fav */}
      <div className="flex items-start gap-2.5 overflow-hidden">
        {/* Channel logo / flag */}
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border transition-transform duration-300 group-hover:scale-105"
          style={{
            background: `${channel.color}10`,
            borderColor: `${channel.color}25`,
          }}
        >
          {inView && channel.logo && !logoError ? (
            <img
              src={channel.logo}
              alt=""
              className="h-full w-full object-contain p-1"
              loading="lazy"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-lg leading-none">{channel.flag}</span>
          )}
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{channel.name}</p>
          <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">{channel.country} · {channel.language}</p>
        </div>

        {/* Fav + compact status */}
        <div className="flex flex-shrink-0 items-center gap-1">
          {!isOffline && (
            <button
              onClick={handleFav}
              className={`rounded-lg p-1 transition-all ${
                isFav ? 'text-amber-400' : 'text-slate-300 opacity-0 group-hover:opacity-100 hover:text-amber-400 dark:text-slate-600'
              }`}
              aria-label={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          )}
          <StreamStatusBadge status={channel.status} compact />
        </div>
      </div>

      {/* Category + Status badge row */}
      <div className="flex items-center gap-2 overflow-hidden">
        <span
          className="flex-shrink-0 truncate rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
          style={{
            background: `${channel.color}12`,
            color: channel.color,
            border: `1px solid ${channel.color}20`,
          }}
        >
          {channel.group}
        </span>
        <StreamStatusBadge status={channel.status} />
      </div>

      {/* EPG current program */}
      {!isOffline && inView && (
        <div className="overflow-hidden">
          <div className="flex items-center justify-between gap-2 text-[10px]">
            <span className="min-w-0 truncate text-slate-400 dark:text-slate-500">{epg.title}</span>
            <span className="flex-shrink-0 text-slate-300 dark:text-slate-600">{formatTime(epg.startTime)}</span>
          </div>
          <div className="mt-1 h-0.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${epg.progress * 100}%`,
                background: `linear-gradient(to right, ${channel.color}90, ${channel.color}40)`,
              }}
            />
          </div>
        </div>
      )}

      {/* Active channel indicator badge */}
      {isActive && (
        <div className="absolute -right-px -top-px overflow-hidden rounded-bl-xl rounded-tr-2xl bg-brand-600 px-2.5 py-1">
          <div className="flex items-center gap-1">
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-3">
                {[3, 5, 4, 6].map((h, i) => (
                  <span
                    key={i}
                    className="inline-block w-[2px] rounded-full bg-white"
                    style={{
                      height: h,
                      animation: `tvBounce${i} 0.5s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.07}s`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="h-2 w-2 animate-spin rounded-full border border-white/40 border-t-white" />
            )}
            <span className="text-[9px] font-black uppercase text-white">
              {isPlaying ? 'EN VIVO' : 'CARGANDO'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

// ── Skeleton ──
export function ChannelCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-start gap-2.5">
        <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="min-w-0 flex-1 space-y-1.5 overflow-hidden">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
      <div className="h-4 w-16 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
      <div className="h-0.5 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

export default ChannelCard;

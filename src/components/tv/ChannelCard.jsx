import { memo } from 'react';

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
function StopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}
function WifiOffIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" />
    </svg>
  );
}
function StarIcon({ filled }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function TvDotIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="m8 3 4 4 4-4" />
    </svg>
  );
}

// Animated signal bars (TV style)
function SignalBars({ active, color, size = 14 }) {
  const bars = [
    { h: 4,  delay: 0 },
    { h: 8,  delay: 0.1 },
    { h: 12, delay: 0.2 },
    { h: 6,  delay: 0.05 },
  ];
  return (
    <span className="flex items-end gap-0.5" style={{ height: size, width: size + 6 }}>
      {bars.map((b, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: 3,
            height: active ? b.h : 3,
            borderRadius: 2,
            background: active ? color : 'currentColor',
            opacity: active ? 1 : 0.25,
            transition: 'height 0.2s ease',
            animation: active ? `tvBounce${i} 0.6s ease-in-out infinite alternate` : 'none',
            animationDelay: active ? `${b.delay}s` : '0s',
          }}
        />
      ))}
    </span>
  );
}

const ChannelCard = memo(function ChannelCard({
  channel,
  isActive,
  isPlaying,
  isLoading,
  isOffline,
  isFavorite,
  onPlay,
  onStop,
  onToggleFavorite,
}) {
  const disabled = isOffline;

  const handleClick = () => {
    if (disabled) return;
    if (isPlaying) onStop();
    else onPlay(channel);
  };

  return (
    <div
      className={[
        'group relative flex flex-col gap-2 rounded-2xl border p-3 transition-all duration-200',
        disabled
          ? 'cursor-not-allowed border-slate-100 bg-slate-50/60 opacity-45 dark:border-slate-800/50 dark:bg-slate-900/30'
          : isActive
          ? 'border-brand-300/60 bg-white shadow-card-hover dark:border-brand-700/40 dark:bg-slate-900'
          : 'cursor-pointer border-slate-100 bg-white shadow-card hover:border-brand-200/70 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-brand-700/30',
      ].join(' ')}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      aria-label={`${disabled ? '(Sin señal) ' : ''}${channel.name}`}
    >
      {/* Top row: icon + category badge + fav */}
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl"
          style={{
            background: `${channel.color}16`,
            border: `1px solid ${channel.color}30`,
          }}
        >
          {channel.flag}
        </div>

        <div className="flex flex-1 items-start justify-between gap-1 overflow-hidden">
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
            style={{ background: `${channel.color}18`, color: channel.color }}
          >
            {channel.category}
          </span>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(channel.id); }}
              className={`rounded-lg p-1 transition-colors ${
                isFavorite ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400 dark:text-slate-600'
              }`}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
              <StarIcon filled={isFavorite} />
            </button>
          )}
        </div>
      </div>

      {/* Channel name */}
      <div className="flex items-center gap-1.5 overflow-hidden">
        <TvDotIcon color={disabled ? '#94a3b8' : channel.color} />
        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{channel.name}</p>
      </div>

      {/* Country */}
      <p className="truncate text-xs text-slate-400 dark:text-slate-500">{channel.country}</p>

      {/* Status row */}
      <div className="flex items-center justify-between gap-2">
        {disabled ? (
          <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <WifiOffIcon /> Sin señal
          </span>
        ) : isPlaying ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <SignalBars active color={channel.color} />
            En vivo
          </span>
        ) : isLoading ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-amber-500 dark:text-amber-400">
            <span className="h-2.5 w-2.5 animate-spin rounded-full border border-amber-400 border-t-transparent" />
            Conectando…
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Disponible
          </span>
        )}

        {/* Play/Stop overlay button */}
        {!disabled && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
            className={[
              'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl transition-all',
              isActive
                ? 'bg-brand-600 text-white shadow-glow-sm'
                : 'bg-slate-100 text-slate-500 opacity-0 group-hover:opacity-100 dark:bg-slate-800 dark:text-slate-400',
            ].join(' ')}
            aria-label={isPlaying ? 'Detener' : 'Reproducir'}
          >
            {isPlaying ? <StopIcon /> : <PlayIcon />}
          </button>
        )}
      </div>
    </div>
  );
});

export function ChannelCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-start gap-2">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="flex-1 space-y-1.5">
          <div className="h-4 w-16 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

export default ChannelCard;

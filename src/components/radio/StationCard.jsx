import { memo } from 'react';

// ── Icons ──────────────────────────────────────────────────────────────────────
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
function StopIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}
function WifiOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}

export function SignalBars({ active, color = '#6366f1', size = 'md' }) {
  const heights = size === 'sm' ? [3, 5, 8, 11] : [4, 7, 10, 14];
  const width   = size === 'sm' ? 2 : 3;
  return (
    <span className="inline-flex items-end" style={{ gap: 2, height: heights[3] }}>
      {heights.map((h, i) => (
        <span key={i} style={{
          width, height: h, borderRadius: 2,
          background: active ? color : '#94a3b8',
          opacity: active ? 1 : 0.3,
          animation: active ? `audioBounce${i} ${0.5 + i * 0.12}s ease-in-out infinite alternate` : 'none',
        }} />
      ))}
    </span>
  );
}

// ── Skeleton loader for a single card ─────────────────────────────────────────
export function StationCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="h-11 w-11 flex-shrink-0 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}

// ── Main card ──────────────────────────────────────────────────────────────────
const StationCard = memo(function StationCard({ station, isActive, isPlaying, isLoading, isOffline, isFavorite, onPlay, onStop, onToggleFavorite }) {
  const handleClick = () => {
    if (isOffline) return;
    if (isActive && isPlaying) onStop();
    else onPlay(station);
  };

  const handleFav = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(station.id);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isOffline}
      title={isOffline ? 'Esta emisora está fuera de línea' : station.name}
      aria-label={isOffline ? `${station.name} — fuera de línea` : station.name}
      className={[
        'group relative flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200',
        isOffline
          ? 'cursor-not-allowed border-slate-100/60 bg-slate-50/40 opacity-45 dark:border-slate-800/40 dark:bg-slate-900/20'
          : isActive
          ? 'border-brand-300/70 bg-brand-50/80 shadow-glow-sm dark:border-brand-700/50 dark:bg-brand-900/20'
          : 'border-slate-100 bg-white shadow-card hover:-translate-y-0.5 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900',
      ].join(' ')}
      style={isActive && !isOffline ? { boxShadow: `0 0 20px ${station.color}1a` } : undefined}
    >
      {/* ── Icon area ── */}
      <div
        className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl transition-all"
        style={{
          background: isOffline ? '#f1f5f920' : `${station.color}18`,
          border: `1px solid ${isOffline ? '#e2e8f030' : `${station.color}30`}`,
        }}
      >
        {/* State icon */}
        {isOffline ? (
          <span className="text-slate-300 dark:text-slate-600"><WifiOffIcon /></span>
        ) : isLoading ? (
          <div
            className="h-5 w-5 rounded-full border-2 border-slate-200 border-t-brand-500 dark:border-slate-700 dark:border-t-brand-400"
            style={{ animation: 'spin 0.75s linear infinite' }}
          />
        ) : isPlaying ? (
          <SignalBars active color={station.color} />
        ) : (
          <span className="transition-opacity duration-150 group-hover:opacity-0">{station.flag}</span>
        )}

        {/* Play/stop overlay (only when online) */}
        {!isOffline && !isLoading && (
          <span
            className={[
              'absolute inset-0 flex items-center justify-center rounded-xl text-white transition-all duration-150',
              isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
            ].join(' ')}
            style={{ background: `${station.color}cc` }}
          >
            {isPlaying ? <StopIcon /> : <PlayIcon />}
          </span>
        )}
      </div>

      {/* ── Text ── */}
      <div className="min-w-0 flex-1">
        <div className={[
          'truncate text-sm font-semibold leading-snug transition-colors',
          isOffline
            ? 'text-slate-400 dark:text-slate-600'
            : isActive
            ? 'text-slate-900 dark:text-white'
            : 'text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white',
        ].join(' ')}>
          {station.name}
        </div>

        <div className="mt-0.5 flex items-center gap-1.5">
          {isOffline ? (
            <span className="text-[10px] font-medium text-slate-300 dark:text-slate-700">Sin señal</span>
          ) : (
            <>
              <span className="truncate text-[11px] text-slate-400 dark:text-slate-500">{station.city}</span>
              <span className="text-slate-200 dark:text-slate-700">·</span>
              <span
                className="flex-shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                style={{ background: `${station.color}18`, color: station.color }}
              >
                {station.genre}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── Favorite star ── */}
      {onToggleFavorite && !isOffline && (
        <span
          role="button"
          tabIndex={0}
          onClick={handleFav}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleFav(e); } }}
          className={[
            'ml-auto flex-shrink-0 rounded-lg p-1 transition-all cursor-pointer',
            isFavorite
              ? 'text-amber-400'
              : 'text-slate-200 opacity-0 group-hover:opacity-100 dark:text-slate-700',
          ].join(' ')}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </span>
      )}

      {/* ── Online pulse dot ── */}
      {isActive && isPlaying && !isOffline && (
        <span
          className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full"
          style={{ background: station.color, animation: 'pulseDot 2s ease-in-out infinite' }}
        />
      )}
    </button>
  );
});

export default StationCard;

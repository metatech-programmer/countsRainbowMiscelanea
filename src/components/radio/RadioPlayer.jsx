import { memo } from 'react';
import { SignalBars } from './StationCard.jsx';

function VolumeIcon({ muted }) {
  return muted ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}
function HeadphonesIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}
function RetryIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

const STATUS_LABELS = {
  playing: { text: '● En vivo',     cls: 'text-emerald-400' },
  loading: { text: '⟳ Conectando…', cls: 'text-amber-400'  },
  error:   { text: '✕ Sin señal',   cls: 'text-red-400'     },
  idle:    { text: '—',             cls: 'text-slate-400'    },
};

const RadioPlayer = memo(function RadioPlayer({
  current, status, volume, muted, error,
  onStop, onRetry, onVolumeChange, onToggleMute,
}) {
  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';
  const isError   = status === 'error';
  const label     = STATUS_LABELS[status] ?? STATUS_LABELS.idle;

  if (!current) {
    return (
      <div className="card p-5">
        <div className="flex flex-col items-center py-8 text-center">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.18)' }}
          >
            <HeadphonesIcon />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Elige una emisora</p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Haz clic en cualquier tarjeta para escuchar
          </p>
        </div>
        {/* Volume always visible */}
        <VolumeRow volume={volume} muted={muted} onVolumeChange={onVolumeChange} onToggleMute={onToggleMute} />
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-5">
      {/* Status bar */}
      <div className="mb-4 flex items-center justify-between">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${label.cls}`}>
          {label.text}
        </span>
        {isPlaying && <SignalBars active color={current.color} />}
      </div>

      {/* Visual art */}
      <div
        className="relative mb-4 flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${current.color}20 0%, ${current.color}06 100%)`,
          border: `1px solid ${current.color}28`,
        }}
      >
        {isPlaying && (
          <>
            <div className="absolute h-20 w-20 rounded-full" style={{ background: `${current.color}12`, animation: 'pulseRing 2.2s ease-out infinite' }} />
            <div className="absolute h-12 w-12 rounded-full" style={{ background: `${current.color}18`, animation: 'pulseRing 2.2s ease-out infinite 0.6s' }} />
          </>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-9 w-9 rounded-full border-2 border-white/10 border-t-white/60" style={{ animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}
        <span className="relative z-10 text-5xl drop-shadow-md">{current.flag}</span>
      </div>

      {/* Station info */}
      <div className="mb-0.5 truncate text-base font-bold leading-snug text-slate-900 dark:text-white">
        {current.name}
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-slate-500">{current.city}</span>
        <span className="text-slate-200 dark:text-slate-700">·</span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{ background: `${current.color}20`, color: current.color }}
        >
          {current.genre}
        </span>
      </div>

      {/* Error state */}
      {isError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-800/50 dark:bg-red-900/15">
          <p className="text-xs text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={onRetry}
            className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-600 underline underline-offset-2 dark:text-red-400"
          >
            <RetryIcon /> Reintentar
          </button>
        </div>
      )}

      {/* Stop button */}
      <button
        onClick={onStop}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
        style={{ background: `linear-gradient(135deg, ${current.color}e0, ${current.color}90)` }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
        Detener
      </button>

      {/* Volume */}
      <VolumeRow volume={volume} muted={muted} onVolumeChange={onVolumeChange} onToggleMute={onToggleMute} />
    </div>
  );
});

function VolumeRow({ volume, muted, onVolumeChange, onToggleMute }) {
  return (
    <div className="flex items-center gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
      <button
        onClick={() => onToggleMute(!muted)}
        className="flex-shrink-0 text-slate-400 transition-colors hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
        aria-label={muted ? 'Activar sonido' : 'Silenciar'}
      >
        <VolumeIcon muted={muted} />
      </button>
      <input
        type="range" min="0" max="1" step="0.02"
        value={muted ? 0 : volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600 dark:bg-slate-700"
        aria-label="Volumen"
      />
      <span className="w-8 flex-shrink-0 text-right text-xs tabular-nums text-slate-400">
        {Math.round((muted ? 0 : volume) * 100)}%
      </span>
    </div>
  );
}

export default RadioPlayer;

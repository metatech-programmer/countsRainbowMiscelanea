// ─── TVHeader ────────────────────────────────────────────────────────────────
// Premium header — light/dark mode aware.

import { memo } from 'react';
import { useTvStore } from '../store/tvStore';

interface Props {
  totalCount: number;
  isLoading: boolean;
  progress: { loaded: number; total: number; current: string };
  onRefresh: () => void;
}

const TVHeader = memo(function TVHeader({ totalCount, isLoading, progress, onRefresh }: Props) {
  const metrics = useTvStore((s) => s.metrics);
  const sources = useTvStore((s) => s.sources);
  const successSources = sources.filter((s) => !s.error && (s.channelCount || 0) > 0);

  return (
    <div className="space-y-4 overflow-hidden">
      {/* Title */}
      <div>
        <p className="section-eyebrow">Televisión en vivo</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          IPTV Platform
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Plataforma de streaming en vivo con canales de todo el mundo
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs overflow-hidden">
        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">📺</span>
          {totalCount.toLocaleString()} canales
        </span>
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(52,211,153,0.5)]" />
          {metrics.onlineCount} online
        </span>
        {metrics.offlineCount > 0 && (
          <span className="flex items-center gap-1.5 text-red-500 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {metrics.offlineCount} offline
          </span>
        )}
        <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">📡</span>
          {successSources.length} fuentes activas
        </span>

        {!isLoading && (
          <button
            onClick={onRefresh}
            className="btn-ghost btn-sm ml-auto flex items-center gap-1.5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Actualizar listas
          </button>
        )}
      </div>

      {/* Loading progress bar */}
      {isLoading && (
        <div className="overflow-hidden rounded-2xl border border-brand-200/60 bg-brand-50/80 px-4 py-3 dark:border-brand-800/40 dark:bg-brand-900/20">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-brand-200 border-t-brand-500 dark:border-brand-800 dark:border-t-brand-400" />
              <span className="truncate text-sm font-semibold text-brand-700 dark:text-brand-300">
                Cargando listas de canales…
              </span>
            </div>
            <span className="flex-shrink-0 text-xs font-bold tabular-nums text-brand-600 dark:text-brand-400">
              {progress.loaded}/{progress.total}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-100 dark:bg-brand-900/40">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: progress.total > 0 ? `${(progress.loaded / progress.total) * 100}%` : '0%' }}
            />
          </div>
          {progress.current && (
            <p className="mt-1.5 truncate text-[10px] text-brand-500/60 dark:text-brand-400/40">
              Cargando: {progress.current}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

export default TVHeader;

// ─── StreamStatusBadge ──────────────────────────────────────────────────────
// Visual indicator for channel availability — light/dark aware.

import { memo } from 'react';
import type { ChannelStatus } from '../store/tvStore';

interface Props {
  status: ChannelStatus;
  compact?: boolean;
}

const CONFIG: Record<ChannelStatus, { label: string; dot: string; bg: string; text: string }> = {
  online: {
    label: 'Live',
    dot: 'bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.5)]',
    bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  unstable: {
    label: 'Inestable',
    dot: 'bg-amber-500 animate-pulse',
    bg: 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
  },
  offline: {
    label: 'Offline',
    dot: 'bg-red-500',
    bg: 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20',
    text: 'text-red-700 dark:text-red-400',
  },
  unknown: {
    label: 'Verificando',
    dot: 'bg-slate-400 animate-pulse dark:bg-slate-500',
    bg: 'bg-slate-100 border-slate-200 dark:bg-slate-500/10 dark:border-slate-500/20',
    text: 'text-slate-600 dark:text-slate-400',
  },
};

const StreamStatusBadge = memo(function StreamStatusBadge({ status, compact }: Props) {
  const c = CONFIG[status];

  if (compact) {
    return (
      <span className={`inline-flex h-2 w-2 flex-shrink-0 rounded-full ${c.dot}`} title={c.label} />
    );
  }

  return (
    <span className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${c.dot}`} />
      <span className="truncate">{c.label}</span>
    </span>
  );
});

export default StreamStatusBadge;

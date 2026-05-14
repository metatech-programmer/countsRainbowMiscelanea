// ─── ChannelGrid ─────────────────────────────────────────────────────────────
// Channel grid with infinite scroll — light/dark mode aware.

import { memo, useRef, useEffect, useState } from 'react';
import ChannelCard, { ChannelCardSkeleton } from './ChannelCard';
import type { Channel } from '../store/tvStore';

interface Props {
  channels: Channel[];
  isLoading: boolean;
}

const PAGE_SIZE = 60;
const SKELETON_COUNT = 12;

const ChannelGrid = memo(function ChannelGrid({ channels, isLoading }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [channels.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && visibleCount < channels.length) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, channels.length));
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, channels.length]);

  const visibleChannels = channels.slice(0, visibleCount);
  const hasMore = visibleCount < channels.length;

  if (isLoading && channels.length === 0) {
    return (
      <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <ChannelCardSkeleton key={`sk-${i}`} />
        ))}
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <div className="mb-4 text-5xl">📺</div>
        <p className="font-display text-lg font-bold text-slate-600 dark:text-slate-400">Sin resultados</p>
        <p className="mt-1 max-w-xs text-sm text-slate-400 dark:text-slate-600">
          Prueba cambiando los filtros, la categoría o el término de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleChannels.map((ch) => (
          <ChannelCard key={ch.id} channel={ch} />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={() => setVisibleCount((n) => Math.min(n + PAGE_SIZE, channels.length))}
            className="btn-ghost"
          >
            Ver más ({channels.length - visibleCount} restantes)
          </button>
          <p className="text-[10px] text-slate-400 dark:text-slate-600">
            Mostrando {visibleCount} de {channels.length} canales
          </p>
        </div>
      )}

      {!hasMore && channels.length > PAGE_SIZE && (
        <p className="mt-4 text-center text-[10px] text-slate-400 dark:text-slate-600">
          {channels.length} canales cargados
        </p>
      )}
    </>
  );
});

export default ChannelGrid;

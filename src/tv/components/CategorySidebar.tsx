// ─── CategorySidebar ─────────────────────────────────────────────────────────
// Sidebar with filters — light/dark mode aware, overflow controlled.

import { memo, useMemo } from 'react';
import { useTvStore } from '../store/tvStore';
import type { Channel } from '../store/tvStore';

interface Props {
  categories: string[];
  countries: string[];
  allChannels: Channel[];
}

const CAT_ICONS: Record<string, string> = {
  all: '📺', Noticias: '📰', Deportes: '⚽', Películas: '🎥', Kids: '🧒',
  Música: '🎵', Entretenimiento: '🎭', Documentales: '🔬', Generalista: '📡',
  Series: '🎬', Anime: '⛩️', Educación: '📚', Religión: '⛪', Cultura: '🎨',
  Clima: '🌤️', Compras: '🛒', Legislativo: '🏛️', 'Estilo de vida': '💫',
  Negocios: '💼',
};

const COUNTRY_FLAGS: Record<string, string> = {
  all: '🌍', CO: '🇨🇴', MX: '🇲🇽', AR: '🇦🇷', CL: '🇨🇱', PE: '🇵🇪', ES: '🇪🇸',
  US: '🇺🇸', PR: '🇵🇷', VE: '🇻🇪', EC: '🇪🇨', UY: '🇺🇾', BR: '🇧🇷',
  FR: '🇫🇷', DE: '🇩🇪', GB: '🇬🇧', INT: '🌐',
};

const CategorySidebar = memo(function CategorySidebar({ categories, countries, allChannels }: Props) {
  const filters = useTvStore((s) => s.filters);
  const setFilter = useTvStore((s) => s.setFilter);
  const favorites = useTvStore((s) => s.favorites);
  const metrics = useTvStore((s) => s.metrics);
  const recents = useTvStore((s) => s.recents);

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allChannels.length };
    for (const ch of allChannels) { counts[ch.group] = (counts[ch.group] || 0) + 1; }
    return counts;
  }, [allChannels]);

  const countryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ch of allChannels) { counts[ch.country] = (counts[ch.country] || 0) + 1; }
    return Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 12);
  }, [allChannels]);

  return (
    <aside className="space-y-3 overflow-hidden lg:sticky lg:top-20">
      {/* ── Metrics Panel ── */}
      <div className="card overflow-hidden p-4">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Estado del sistema</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { n: metrics.totalCount, label: 'Total', color: 'text-slate-900 dark:text-white' },
            { n: metrics.onlineCount, label: 'Online', color: 'text-emerald-600 dark:text-emerald-400' },
            { n: metrics.offlineCount, label: 'Offline', color: 'text-red-500 dark:text-red-400' },
            { n: metrics.avgLoadTime ? `${metrics.avgLoadTime}ms` : '—', label: 'Carga avg', color: 'text-brand-600 dark:text-brand-400' },
          ].map(({ n, label, color }) => (
            <div key={label} className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 text-center dark:border-slate-800 dark:bg-slate-800/40">
              <div className={`truncate text-lg font-black ${color}`}>{n}</div>
              <div className="truncate text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs (All / Recents / Favs) ── */}
      <div className="flex gap-1 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900/50">
        {[
          { key: 'all' as const, label: 'Todos', count: allChannels.length },
          { key: 'recents' as const, label: 'Recientes', count: recents.length, hide: !recents.length },
          { key: 'favs' as const, label: 'Favoritos', count: favorites.size, hide: !favorites.size },
        ].filter((t) => !t.hide).map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter('tab', t.key)}
            className={[
              'flex flex-1 items-center justify-center gap-1 overflow-hidden rounded-xl px-2 py-2 text-[11px] font-bold transition-all',
              filters.tab === t.key
                ? 'bg-white text-slate-900 shadow-card dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400',
            ].join(' ')}
          >
            <span className="truncate">{t.label}</span>
            <span className={`flex-shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
              filters.tab === t.key
                ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Category filters ── */}
      <div className="card overflow-hidden p-3">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Categorías</h3>
        <div className="flex max-h-48 flex-wrap gap-1 overflow-y-auto scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter('category', cat)}
              className={[
                'flex items-center gap-1 overflow-hidden rounded-lg px-2 py-1 text-[11px] font-semibold transition-all',
                filters.category === cat
                  ? 'bg-brand-600 text-white shadow-glow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
              ].join(' ')}
            >
              <span className="flex-shrink-0 text-xs">{CAT_ICONS[cat] || '📌'}</span>
              <span className="truncate">{cat === 'all' ? 'Todo' : cat}</span>
              {catCounts[cat] !== undefined && (
                <span className="flex-shrink-0 text-[9px] opacity-60">{catCounts[cat]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Country filters ── */}
      <div className="card overflow-hidden p-3">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Países</h3>
        <div className="flex flex-wrap gap-1 overflow-hidden">
          <button
            onClick={() => setFilter('country', 'all')}
            className={[
              'flex items-center gap-1 overflow-hidden rounded-lg px-2 py-1 text-[11px] font-semibold transition-all',
              filters.country === 'all'
                ? 'bg-brand-600 text-white shadow-glow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
            ].join(' ')}
          >
            🌍 <span className="truncate">Todos</span>
          </button>
          {countryCounts.map(([code, count]) => (
            <button
              key={code}
              onClick={() => setFilter('country', code)}
              className={[
                'flex items-center gap-1 overflow-hidden rounded-lg px-2 py-1 text-[11px] font-semibold transition-all',
                filters.country === code
                  ? 'bg-brand-600 text-white shadow-glow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
              ].join(' ')}
            >
              <span className="flex-shrink-0">{COUNTRY_FLAGS[code] || '🌐'}</span>
              <span className="truncate">{code}</span>
              <span className="flex-shrink-0 text-[9px] opacity-60">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Status filter ── */}
      <div className="card overflow-hidden p-3">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Estado</h3>
        <div className="flex flex-wrap gap-1 overflow-hidden">
          {[
            { key: 'all', label: 'Todos', icon: '📡' },
            { key: 'online', label: 'Online', icon: '🟢' },
            { key: 'unstable', label: 'Inestable', icon: '🟡' },
            { key: 'offline', label: 'Offline', icon: '🔴' },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter('status', s.key)}
              className={[
                'flex items-center gap-1 overflow-hidden rounded-lg px-2 py-1 text-[11px] font-semibold transition-all',
                filters.status === s.key
                  ? 'bg-brand-600 text-white shadow-glow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
              ].join(' ')}
            >
              <span className="flex-shrink-0">{s.icon}</span>
              <span className="truncate">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
});

export default CategorySidebar;

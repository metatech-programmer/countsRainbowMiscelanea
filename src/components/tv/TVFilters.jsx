import { memo } from 'react';
import { TV_REGIONS, TV_CATEGORIES } from '../../data/tvChannels.js';

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const TVFilters = memo(function TVFilters({
  region, setRegion,
  category, setCategory,
  search, setSearch,
  totalCount, filteredCount,
}) {
  const hasFilters = region !== 'all' || category !== 'all' || search;

  return (
    <div className="space-y-3">
      {/* Region tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        {TV_REGIONS.map((r) => (
          <button
            key={r.key}
            onClick={() => setRegion(r.key)}
            className={[
              'flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-150',
              region === r.key
                ? 'bg-brand-600 text-white shadow-glow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
            ].join(' ')}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        {TV_CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={[
              'flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150',
              category === c.key
                ? 'text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
            ].join(' ')}
            style={category === c.key ? { background: c.color } : {}}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar canal, país, categoría…"
          className="input py-2.5 pl-9 pr-8"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-2.5 flex items-center text-slate-400 transition-colors hover:text-slate-600"
            aria-label="Limpiar búsqueda"
          >
            <XIcon />
          </button>
        )}
      </div>

      {/* Count + clear */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {filteredCount === totalCount
            ? `${totalCount} canales disponibles`
            : `${filteredCount} de ${totalCount} canales`}
        </span>
        {hasFilters && (
          <button
            onClick={() => { setRegion('all'); setCategory('all'); setSearch(''); }}
            className="flex items-center gap-1 text-xs text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
          >
            <XIcon /> Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
});

export default TVFilters;

// ─── SearchBar ──────────────────────────────────────────────────────────────
// Search input — uses the app's `.input` class for consistent light/dark styling.

import { memo, useState, useEffect, useRef } from 'react';
import { useTvStore } from '../store/tvStore';
import { debounce } from '../utils/debounce';

interface Props {
  totalCount: number;
  filteredCount: number;
}

const SearchBar = memo(function SearchBar({ totalCount, filteredCount }: Props) {
  const setFilter = useTvStore((s) => s.setFilter);
  const resetFilters = useTvStore((s) => s.resetFilters);
  const filters = useTvStore((s) => s.filters);
  const [localSearch, setLocalSearch] = useState(filters.search);

  const debouncedRef = useRef(
    debounce((value: string) => { setFilter('search', value); }, 250),
  );

  useEffect(() => {
    debouncedRef.current(localSearch);
    return () => debouncedRef.current.cancel();
  }, [localSearch]);

  useEffect(() => {
    if (filters.search === '' && localSearch !== '') setLocalSearch('');
  }, [filters.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasFilters = filters.search || filters.country !== 'all' || filters.category !== 'all' || filters.status !== 'all';

  return (
    <div className="space-y-2 overflow-hidden">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400 dark:text-slate-500">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Buscar canales, países, categorías…"
          className="input py-2.5 pl-10 pr-10"
        />
        {localSearch && (
          <button
            onClick={() => setLocalSearch('')}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            aria-label="Limpiar búsqueda"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Result count + clear filters */}
      <div className="flex items-center justify-between overflow-hidden px-1">
        <span className="truncate text-xs text-slate-400 dark:text-slate-500">
          {filteredCount === totalCount
            ? `${totalCount} canales disponibles`
            : `${filteredCount} de ${totalCount} canales`}
        </span>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="flex flex-shrink-0 items-center gap-1 text-xs text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
});

export default SearchBar;

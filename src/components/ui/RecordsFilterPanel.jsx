/**
 * Panel de filtros unificado — usado en HistoryPage y StatsPage.
 * Props:
 *   filterType, setFilterType
 *   filterSearch, setFilterSearch        (solo historial; omitir en stats para ocultarlo)
 *   filterMin, setFilterMin
 *   filterMax, setFilterMax
 *   dateFrom, setDateFrom
 *   dateTo, setDateTo
 *   activePeriod, setActivePeriod        (presets rápidos 7D/30D…)
 *   onApplyDay, onApplyMonth, onApplyYear, onLoadAll  (callbacks de DB — opcionales)
 *   day, setDay, month, setMonth, year, setYear       (opcionales)
 *   onReset                              (limpiar todo)
 *   resultCount                          (número de registros filtrados)
 *   showSearch (bool, default true)
 *   showPeriodPresets (bool, default true)
 */

import { useRef, useState } from 'react';
import { formatCurrency } from '../../lib/utils.js';

const TYPE_CHIPS = [
  { value: 'all', label: 'Todos', icon: null },
  { value: 'venta', label: 'Ventas', icon: '💰' },
  { value: 'jer', label: 'JER', icon: '📦' },
  { value: 'gastos', label: 'Gastos', icon: '💸' },
];

const PERIOD_PRESETS = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1A', days: 365 },
  { label: 'Todo', days: null },
];

const AMOUNT_PRESETS = [
  { label: '< 10K', min: '', max: '10000' },
  { label: '10K–50K', min: '10000', max: '50000' },
  { label: '50K–200K', min: '50000', max: '200000' },
  { label: '> 200K', min: '200000', max: '' },
];

function getDateNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function XSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function ActiveChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:border-brand-800/50 dark:bg-brand-900/30 dark:text-brand-300">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="flex items-center justify-center rounded-full p-px hover:bg-brand-200 dark:hover:bg-brand-700/40"
        aria-label="Quitar filtro"
      >
        <XSmall />
      </button>
    </span>
  );
}

function RecordsFilterPanel({
  /* type filter */
  filterType = 'all', setFilterType,
  /* text search */
  filterSearch = '', setFilterSearch, showSearch = true,
  /* amount */
  filterMin = '', setFilterMin,
  filterMax = '', setFilterMax,
  /* date range (manual) */
  dateFrom = '', setDateFrom,
  dateTo = '', setDateTo,
  /* period presets */
  activePeriod, setActivePeriod, showPeriodPresets = true,
  /* date DB filters */
  day = '', setDay, month = '', setMonth, year = '', setYear,
  onApplyDay, onApplyMonth, onApplyYear, onLoadAll,
  /* misc */
  onReset,
  resultCount,
  loading = false,
}) {
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);

  function applyPreset(preset) {
    setActivePeriod?.(preset.days);
    if (preset.days === null) {
      setDateFrom?.('');
      setDateTo?.('');
    } else {
      setDateFrom?.(getDateNDaysAgo(preset.days));
      setDateTo?.('');
    }
  }

  function applyAmountPreset(p) {
    setFilterMin?.(p.min);
    setFilterMax?.(p.max);
  }

  const hasType = filterType !== 'all';
  const hasSearch = !!filterSearch;
  const hasAmount = !!(filterMin || filterMax);
  const hasDateManual = !!(dateFrom || dateTo);
  const hasDateDb = !!(day || month || year);
  const hasAny = hasType || hasSearch || hasAmount || hasDateManual || hasDateDb;

  const activeCount = [hasType, hasSearch, hasAmount, hasDateManual || hasDateDb].filter(Boolean).length;

  return (
    <section className="card overflow-hidden" aria-label="Filtros">

      {/* ── Top bar ── */}
      <div className="flex flex-col gap-3 px-5 py-4">

        {/* Row 1: search + toggle + clear */}
        <div className="flex flex-wrap items-center gap-2.5">
          {showSearch && (
            <div className="relative flex-1" style={{ minWidth: 200 }}>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </span>
              <input
                ref={searchRef}
                className="input pl-9 pr-9 py-2.5"
                value={filterSearch}
                onChange={(e) => setFilterSearch?.(e.target.value)}
                placeholder="Buscar por descripción..."
                aria-label="Buscar en registros"
              />
              {filterSearch && (
                <button
                  type="button"
                  onClick={() => { setFilterSearch?.(''); searchRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Limpiar búsqueda"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className={`btn-ghost btn-sm flex items-center gap-2 ${open ? 'border-brand-400 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : ''}`}
          >
            <FilterIcon />
            Filtros avanzados
            {activeCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {hasAny && (
            <button
              type="button"
              onClick={onReset}
              className="btn-ghost btn-sm text-rose-500 hover:border-rose-300 hover:text-rose-600 dark:text-rose-400"
            >
              Limpiar todo
            </button>
          )}
        </div>

        {/* Row 2: type chips */}
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por tipo">
          {TYPE_CHIPS.map((chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={() => setFilterType?.(chip.value)}
              aria-pressed={filterType === chip.value}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                filterType === chip.value
                  ? 'border-brand-600 bg-brand-600 text-white shadow-glow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {chip.icon && <span className="text-sm leading-none">{chip.icon}</span>}
              {chip.label}
            </button>
          ))}
        </div>

        {/* Row 3: period presets (optional) */}
        {showPeriodPresets && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Período:</span>
            {PERIOD_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                className={`rounded-xl border px-3 py-1 text-xs font-bold transition-all duration-150 ${
                  activePeriod === p.days
                    ? 'border-brand-600 bg-brand-600 text-white shadow-glow-sm'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Expanded advanced filters ── */}
      {open && (
        <div className="animate-slide-up border-t border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* Amount range */}
            <div>
              <p className="label-sm mb-2">Rango de monto</p>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {AMOUNT_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyAmountPreset(p)}
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all duration-150 ${
                      filterMin === p.min && filterMax === p.max
                        ? 'border-brand-500 bg-brand-500 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="input py-2 text-xs"
                  type="number"
                  min="0"
                  value={filterMin}
                  onChange={(e) => setFilterMin?.(e.target.value)}
                  placeholder="Mín"
                  aria-label="Monto mínimo"
                />
                <span className="flex-shrink-0 text-xs text-slate-400">—</span>
                <input
                  className="input py-2 text-xs"
                  type="number"
                  min="0"
                  value={filterMax}
                  onChange={(e) => setFilterMax?.(e.target.value)}
                  placeholder="Máx"
                  aria-label="Monto máximo"
                />
              </div>
            </div>

            {/* Date range manual */}
            <div>
              <p className="label-sm mb-2">Rango de fechas</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label className="w-12 flex-shrink-0 text-xs text-slate-400">Desde</label>
                  <input
                    className="input flex-1 py-2 text-xs"
                    type="date"
                    value={dateFrom}
                    max={dateTo || undefined}
                    onChange={(e) => { setDateFrom?.(e.target.value); setActivePeriod?.(null); }}
                    aria-label="Fecha desde"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-12 flex-shrink-0 text-xs text-slate-400">Hasta</label>
                  <input
                    className="input flex-1 py-2 text-xs"
                    type="date"
                    value={dateTo}
                    min={dateFrom || undefined}
                    onChange={(e) => { setDateTo?.(e.target.value); setActivePeriod?.(null); }}
                    aria-label="Fecha hasta"
                  />
                </div>
              </div>
            </div>

            {/* Date DB filters (día/mes/año exacto) */}
            {(onApplyDay || onApplyMonth || onApplyYear) && (
              <div>
                <p className="label-sm mb-2">Filtro exacto de fecha</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="w-12 flex-shrink-0 text-xs text-slate-400">Día</label>
                    <input className="input flex-1 py-2 text-xs" type="date" value={day} onChange={(e) => setDay?.(e.target.value)} aria-label="Día exacto" />
                    {day && (
                      <button type="button" onClick={onApplyDay} disabled={loading} className="btn-secondary btn-sm flex-shrink-0">
                        Ir
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-12 flex-shrink-0 text-xs text-slate-400">Mes</label>
                    <input className="input flex-1 py-2 text-xs" type="month" value={month} onChange={(e) => setMonth?.(e.target.value)} aria-label="Mes exacto" />
                    {month && (
                      <button type="button" onClick={onApplyMonth} disabled={loading} className="btn-secondary btn-sm flex-shrink-0">
                        Ir
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-12 flex-shrink-0 text-xs text-slate-400">Año</label>
                    <input className="input flex-1 py-2 text-xs" type="number" placeholder="2025" value={year} onChange={(e) => setYear?.(e.target.value)} aria-label="Año exacto" />
                    {year && (
                      <button type="button" onClick={onApplyYear} disabled={loading} className="btn-secondary btn-sm flex-shrink-0">
                        Ir
                      </button>
                    )}
                  </div>
                  {onLoadAll && (
                    <button type="button" className="btn-primary btn-sm mt-1 w-full" onClick={onLoadAll} disabled={loading}>
                      Ver todos los registros
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Active filter chips + result count ── */}
      {(hasAny || resultCount !== undefined) && (
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-5 py-3 dark:border-slate-800">
          {hasAny && <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Filtros:</span>}
          {hasType && (
            <ActiveChip
              label={TYPE_CHIPS.find((c) => c.value === filterType)?.label}
              onRemove={() => setFilterType?.('all')}
            />
          )}
          {hasSearch && (
            <ActiveChip label={`"${filterSearch}"`} onRemove={() => setFilterSearch?.('')} />
          )}
          {hasAmount && (
            <ActiveChip
              label={
                filterMin && filterMax
                  ? `${formatCurrency(Number(filterMin))} – ${formatCurrency(Number(filterMax))}`
                  : filterMin ? `≥ ${formatCurrency(Number(filterMin))}`
                  : `≤ ${formatCurrency(Number(filterMax))}`
              }
              onRemove={() => { setFilterMin?.(''); setFilterMax?.(''); }}
            />
          )}
          {dateFrom && (
            <ActiveChip label={`Desde ${dateFrom}`} onRemove={() => { setDateFrom?.(''); setActivePeriod?.(null); }} />
          )}
          {dateTo && (
            <ActiveChip label={`Hasta ${dateTo}`} onRemove={() => { setDateTo?.(''); setActivePeriod?.(null); }} />
          )}
          {day && <ActiveChip label={`Día: ${day}`} onRemove={() => setDay?.('')} />}
          {month && <ActiveChip label={`Mes: ${month}`} onRemove={() => setMonth?.('')} />}
          {year && <ActiveChip label={`Año: ${year}`} onRemove={() => setYear?.('')} />}

          {resultCount !== undefined && (
            <span
              className="ml-auto text-xs font-bold text-brand-600 dark:text-brand-400"
              aria-live="polite"
              aria-atomic="true"
            >
              {resultCount.toLocaleString('es-CO')} resultado{resultCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {resultCount} registros coinciden con los filtros aplicados.
      </p>
    </section>
  );
}

export default RecordsFilterPanel;

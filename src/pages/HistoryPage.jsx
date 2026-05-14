import { useEffect, useMemo, useRef, useState } from 'react';
import { deleteCount, getAllCounts, getCountsByDay, getCountsByMonth, getCountsByYear } from '../lib/db.js';
import { TRANSACTION_TYPES } from '../lib/constants.js';
import { formatCurrency } from '../lib/utils.js';
import { useVirtualList } from '../lib/useVirtualList.js';
import useRequestState from '../lib/useRequestState.js';
import { useConfirm } from '../components/ConfirmProvider.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import KpiCard from '../components/ui/KpiCard.jsx';
import TransactionBadge from '../components/ui/TransactionBadge.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

const ROW_HEIGHT = 56;
const VIRTUAL_THRESHOLD = 100;

const TYPE_CHIPS = [
  { value: 'all', label: 'Todos' },
  { value: 'venta', label: 'Ventas' },
  { value: 'jer', label: 'JER' },
  { value: 'gastos', label: 'Gastos' },
];

function TrashIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function HistoryPage() {
  const [counts, setCounts] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterMin, setFilterMin] = useState('');
  const [filterMax, setFilterMax] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const request = useRequestState();
  const { confirm } = useConfirm();
  const { push } = useToast();
  const resultsRef = useRef(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    try {
      request.setLoading();
      const data = await getAllCounts();
      setCounts(data.reverse());
      request.setSuccess();
    } catch (error) {
      request.setFailure(error);
      push({ title: 'Error', message: 'No se pudieron cargar los registros.', variant: 'error' });
    }
  }

  async function applyDateFilter(type) {
    try {
      request.setLoading();
      let data = [];
      if (type === 'day' && day) data = await getCountsByDay(day);
      if (type === 'month' && month) {
        const d = new Date(`${month}-01T00:00:00`);
        data = await getCountsByMonth(d.getFullYear(), d.getMonth() + 1);
      }
      if (type === 'year' && year) data = await getCountsByYear(year);
      setCounts(data.reverse());
      request.setSuccess();
    } catch (error) {
      request.setFailure(error);
      push({ title: 'Error', message: 'No se pudo aplicar el filtro.', variant: 'error' });
    }
  }

  function clearFilters() {
    setFilterType('all');
    setFilterSearch('');
    setFilterMin('');
    setFilterMax('');
    setDay('');
    setMonth('');
    setYear('');
  }

  const filtered = useMemo(() => {
    let result = [...counts];
    if (filterType !== 'all') result = result.filter((i) => i.type === filterType);
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      result = result.filter((i) => (i.description || '').toLowerCase().includes(q));
    }
    const minV = Number(filterMin);
    if (!isNaN(minV) && minV > 0) result = result.filter((i) => i.value >= minV);
    const maxV = Number(filterMax);
    if (!isNaN(maxV) && maxV > 0) result = result.filter((i) => i.value <= maxV);

    result.sort((a, b) => {
      let va = a[sortField];
      let vb = b[sortField];
      if (sortField === 'value') { va = Number(va); vb = Number(vb); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [counts, filterType, filterSearch, filterMin, filterMax, sortField, sortDir]);

  const totals = useMemo(() => filtered.reduce(
    (acc, item) => {
      if (item.type === TRANSACTION_TYPES.VENTA) acc.ventas += item.value;
      if (item.type === TRANSACTION_TYPES.JER) acc.jer += item.value;
      if (item.type === TRANSACTION_TYPES.GASTOS) acc.gastos += item.value;
      return acc;
    },
    { ventas: 0, jer: 0, gastos: 0 }
  ), [filtered]);

  async function handleDelete(id) {
    if (!id) return;
    const confirmed = await confirm({
      title: 'Eliminar registro',
      message: 'Esta accion eliminara permanentemente el registro.',
      confirmText: 'Eliminar',
    });
    if (!confirmed) return;
    try {
      request.setLoading();
      await deleteCount(id);
      await loadAll();
      push({ title: 'Eliminado', message: 'El registro fue eliminado.', variant: 'success' });
    } catch (error) {
      request.setFailure(error);
      push({ title: 'Error', message: 'No se pudo eliminar el registro.', variant: 'error' });
    }
  }

  function exportCsv() {
    if (filtered.length === 0) {
      push({ title: 'Sin datos', message: 'No hay registros para exportar.', variant: 'error' });
      return;
    }
    const header = 'Fecha,Tipo,Valor,Descripcion';
    const rows = filtered.map((i) => `${i.date},${i.type},${i.value},"${(i.description || '').replace(/"/g, '""')}"`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merkatodo-historial-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    push({ title: 'CSV exportado', message: `${filtered.length} registros descargados.`, variant: 'success' });
  }

  function toggleSort(field) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function SortIndicator({ field }) {
    if (sortField !== field) return <span className="text-slate-300 dark:text-slate-600">↕</span>;
    return <span className="text-brand-600">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  const useVirtual = filtered.length >= VIRTUAL_THRESHOLD;
  const virtualList = useVirtualList(useVirtual ? filtered : [], ROW_HEIGHT);

  const hasActiveFilter = filterType !== 'all' || filterSearch || filterMin || filterMax || day || month || year;

  const netProfit = totals.ventas - totals.gastos;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* Header */}
      <div>
        <p className="section-eyebrow">Administración</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Historial de operaciones
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {counts.length.toLocaleString('es-CO')} registros en total
        </p>
      </div>

      {/* KPIs del periodo filtrado */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Totales del periodo">
        <KpiCard eyebrow="Ventas" value={formatCurrency(totals.ventas)} colorClass="text-emerald-600 dark:text-emerald-400" loading={request.status === 'loading' && counts.length === 0} />
        <KpiCard eyebrow="JER" value={formatCurrency(totals.jer)} colorClass="text-sky-600 dark:text-sky-400" loading={request.status === 'loading' && counts.length === 0} />
        <KpiCard eyebrow="Gastos" value={formatCurrency(totals.gastos)} colorClass="text-rose-600 dark:text-rose-400" loading={request.status === 'loading' && counts.length === 0} />
        <KpiCard eyebrow="Ganancia neta" value={formatCurrency(netProfit)} colorClass={netProfit >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-rose-600 dark:text-rose-400'} loading={request.status === 'loading' && counts.length === 0} />
      </section>

      {/* Filter panel */}
      <section className="card">
        <div
          className="flex cursor-pointer items-center justify-between gap-4 p-5"
          onClick={() => setShowFilters((v) => !v)}
          role="button"
          aria-expanded={showFilters}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setShowFilters((v) => !v)}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <FilterIcon />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">Filtros y búsqueda</p>
              {hasActiveFilter && (
                <p className="text-xs text-brand-600 dark:text-brand-400">{filtered.length} resultados activos</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilter && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearFilters(); loadAll(); }}
                className="btn-ghost btn-sm"
              >
                Limpiar
              </button>
            )}
            <span className={`text-slate-400 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </span>
          </div>
        </div>

        {showFilters && (
          <div className="animate-slide-up border-t border-slate-100 p-5 dark:border-slate-800">
            {/* Type chips */}
            <div className="mb-5 flex flex-wrap gap-2">
              {TYPE_CHIPS.map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => setFilterType(chip.value)}
                  aria-pressed={filterType === chip.value}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                    filterType === chip.value
                      ? 'border-brand-600 bg-brand-600 text-white shadow-glow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div className="relative">
                <label className="label-sm mb-1.5 block">Buscar descripción</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <SearchIcon />
                  </span>
                  <input
                    className="input pl-9"
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    placeholder="Producto o detalle..."
                  />
                </div>
              </div>

              {/* Min amount */}
              <div>
                <label className="label-sm mb-1.5 block">Monto mínimo</label>
                <input className="input" type="number" min="0" value={filterMin} onChange={(e) => setFilterMin(e.target.value)} placeholder="0" />
              </div>

              {/* Max amount */}
              <div>
                <label className="label-sm mb-1.5 block">Monto máximo</label>
                <input className="input" type="number" min="0" value={filterMax} onChange={(e) => setFilterMax(e.target.value)} placeholder="∞" />
              </div>

              {/* Date filters */}
              <div>
                <label className="label-sm mb-1.5 block">Filtrar por fecha</label>
                <div className="flex flex-col gap-1.5">
                  <input
                    className="input py-2 text-xs"
                    type="date"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    aria-label="Filtrar por día"
                  />
                  <input
                    className="input py-2 text-xs"
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    aria-label="Filtrar por mes"
                  />
                  <input
                    className="input py-2 text-xs"
                    type="number"
                    placeholder="Año (ej: 2025)"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    aria-label="Filtrar por año"
                  />
                </div>
              </div>
            </div>

            {/* Date filter apply buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-secondary btn-sm" type="button" onClick={() => applyDateFilter('day')} disabled={!day || request.status === 'loading'}>
                Aplicar día
              </button>
              <button className="btn-secondary btn-sm" type="button" onClick={() => applyDateFilter('month')} disabled={!month || request.status === 'loading'}>
                Aplicar mes
              </button>
              <button className="btn-secondary btn-sm" type="button" onClick={() => applyDateFilter('year')} disabled={!year || request.status === 'loading'}>
                Aplicar año
              </button>
              <button className="btn-primary btn-sm" type="button" onClick={loadAll} disabled={request.status === 'loading'}>
                Ver todo
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Records table */}
      <section id="records-table" className="card p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Registros</h2>
            <p
              className="mt-0.5 text-sm text-slate-500 dark:text-slate-400"
              aria-live="polite"
              aria-atomic="true"
              ref={resultsRef}
            >
              {filtered.length.toLocaleString('es-CO')} registro{filtered.length !== 1 ? 's' : ''}
              {useVirtual ? ' — scroll para ver todos' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {request.status === 'loading' && <Spinner size="sm" />}
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={exportCsv}
              disabled={filtered.length === 0}
            >
              <DownloadIcon /> Exportar CSV
            </button>
          </div>
        </div>

        {request.status === 'error' && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-600 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-400">
            No se pudieron cargar los datos. <button type="button" className="underline" onClick={loadAll}>Reintentar</button>
          </div>
        )}

        {/* Virtualized or standard */}
        {useVirtual ? (
          <div
            ref={virtualList.containerRef}
            onScroll={virtualList.onScroll}
            className="overflow-auto rounded-xl scrollbar-thin"
            style={{ height: Math.min(filtered.length * ROW_HEIGHT + 48, 560) }}
            role="region"
            aria-label="Tabla de registros con scroll virtual"
            tabIndex={0}
          >
            <table className="table-modern min-w-[640px]" aria-rowcount={filtered.length}>
              <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur dark:bg-slate-900/95">
                <tr>
                  <th><button type="button" className="flex items-center gap-1 hover:text-brand-600" onClick={() => toggleSort('type')}>Tipo <SortIndicator field="type" /></button></th>
                  <th><button type="button" className="flex items-center gap-1 hover:text-brand-600" onClick={() => toggleSort('value')}>Valor <SortIndicator field="value" /></button></th>
                  <th>Descripción</th>
                  <th><button type="button" className="flex items-center gap-1 hover:text-brand-600" onClick={() => toggleSort('date')}>Fecha <SortIndicator field="date" /></button></th>
                  <th><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {virtualList.paddingTop > 0 && (
                  <tr aria-hidden="true" style={{ height: virtualList.paddingTop }}><td colSpan={5} /></tr>
                )}
                {virtualList.visibleItems.map(({ item, index }) => (
                  <tr key={item.id} aria-rowindex={index + 1} style={{ height: ROW_HEIGHT }}>
                    <td><TransactionBadge type={item.type} /></td>
                    <td className="font-semibold text-slate-900 dark:text-white">{formatCurrency(item.value)}</td>
                    <td className="max-w-[220px] truncate text-slate-500 dark:text-slate-400">{item.description}</td>
                    <td className="text-xs text-slate-400">{item.date}</td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:text-slate-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                        onClick={() => handleDelete(item.id)}
                        disabled={request.status === 'loading'}
                        aria-label={`Eliminar registro del ${item.date}`}
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
                {virtualList.paddingBottom > 0 && (
                  <tr aria-hidden="true" style={{ height: virtualList.paddingBottom }}><td colSpan={5} /></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            {filtered.length === 0 && request.status !== 'loading' ? (
              <EmptyState
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>}
                title="Sin resultados"
                description={hasActiveFilter ? 'Intenta cambiar los filtros activos' : 'No hay registros cargados'}
                action={hasActiveFilter && (
                  <button type="button" className="btn-ghost btn-sm" onClick={() => { clearFilters(); loadAll(); }}>
                    Limpiar filtros
                  </button>
                )}
              />
            ) : (
              <table className="table-modern min-w-[640px]">
                <thead>
                  <tr>
                    <th><button type="button" className="flex items-center gap-1 hover:text-brand-600" onClick={() => toggleSort('type')}>Tipo <SortIndicator field="type" /></button></th>
                    <th><button type="button" className="flex items-center gap-1 hover:text-brand-600" onClick={() => toggleSort('value')}>Valor <SortIndicator field="value" /></button></th>
                    <th>Descripción</th>
                    <th><button type="button" className="flex items-center gap-1 hover:text-brand-600" onClick={() => toggleSort('date')}>Fecha <SortIndicator field="date" /></button></th>
                    <th><span className="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} style={{ height: ROW_HEIGHT }}>
                      <td><TransactionBadge type={item.type} /></td>
                      <td className="font-semibold text-slate-900 dark:text-white">{formatCurrency(item.value)}</td>
                      <td className="max-w-[220px] truncate text-slate-500 dark:text-slate-400">{item.description}</td>
                      <td className="text-xs text-slate-400">{item.date}</td>
                      <td className="text-right">
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:text-slate-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                          onClick={() => handleDelete(item.id)}
                          disabled={request.status === 'loading'}
                          aria-label={`Eliminar registro del ${item.date}`}
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default HistoryPage;

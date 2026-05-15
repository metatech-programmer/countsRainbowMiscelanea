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
import RecordsFilterPanel from '../components/ui/RecordsFilterPanel.jsx';

const ROW_HEIGHT = 56;
const VIRTUAL_THRESHOLD = 100;

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

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activePeriod, setActivePeriod] = useState(null);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const request = useRequestState();
  const { confirm } = useConfirm();
  const { push } = useToast();

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
    setDateFrom('');
    setDateTo('');
    setActivePeriod(null);
    setDay('');
    setMonth('');
    setYear('');
    loadAll();
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
    if (dateFrom) result = result.filter((i) => i.date >= dateFrom);
    if (dateTo) result = result.filter((i) => i.date <= dateTo);

    result.sort((a, b) => {
      let va = a[sortField];
      let vb = b[sortField];
      if (sortField === 'value') { va = Number(va); vb = Number(vb); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [counts, filterType, filterSearch, filterMin, filterMax, dateFrom, dateTo, sortField, sortDir]);

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
      message: 'Esta acción eliminará permanentemente el registro.',
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
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  }

  function SortIndicator({ field }) {
    if (sortField !== field) return <span className="text-slate-300 dark:text-slate-600">↕</span>;
    return <span className="text-brand-600">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  const useVirtual = filtered.length >= VIRTUAL_THRESHOLD;
  const virtualList = useVirtualList(useVirtual ? filtered : [], ROW_HEIGHT);
  const netProfit = totals.ventas - totals.gastos;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-eyebrow">Administración</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Historial de operaciones
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {counts.length.toLocaleString('es-CO')} registros en total
          </p>
        </div>
        <button
          type="button"
          className="btn-ghost btn-sm"
          onClick={exportCsv}
          disabled={filtered.length === 0}
        >
          <DownloadIcon /> Exportar CSV
        </button>
      </div>

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Totales del período">
        <KpiCard eyebrow="Ventas" value={formatCurrency(totals.ventas)} colorClass="text-emerald-600 dark:text-emerald-400" loading={request.status === 'loading' && counts.length === 0} />
        <KpiCard eyebrow="JER" value={formatCurrency(totals.jer)} colorClass="text-sky-600 dark:text-sky-400" loading={request.status === 'loading' && counts.length === 0} />
        <KpiCard eyebrow="Gastos" value={formatCurrency(totals.gastos)} colorClass="text-rose-600 dark:text-rose-400" loading={request.status === 'loading' && counts.length === 0} />
        <KpiCard eyebrow="Ganancia neta" value={formatCurrency(netProfit)} colorClass={netProfit >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-rose-600 dark:text-rose-400'} loading={request.status === 'loading' && counts.length === 0} />
      </section>

      {/* Unified filter panel */}
      <RecordsFilterPanel
        filterType={filterType} setFilterType={setFilterType}
        filterSearch={filterSearch} setFilterSearch={setFilterSearch} showSearch
        filterMin={filterMin} setFilterMin={setFilterMin}
        filterMax={filterMax} setFilterMax={setFilterMax}
        dateFrom={dateFrom} setDateFrom={setDateFrom}
        dateTo={dateTo} setDateTo={setDateTo}
        activePeriod={activePeriod} setActivePeriod={setActivePeriod} showPeriodPresets
        day={day} setDay={setDay}
        month={month} setMonth={setMonth}
        year={year} setYear={setYear}
        onApplyDay={() => applyDateFilter('day')}
        onApplyMonth={() => applyDateFilter('month')}
        onApplyYear={() => applyDateFilter('year')}
        onLoadAll={loadAll}
        onReset={clearFilters}
        resultCount={filtered.length}
        loading={request.status === 'loading'}
      />

      {/* Records table */}
      <section className="card p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Registros</h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {filtered.length.toLocaleString('es-CO')} registro{filtered.length !== 1 ? 's' : ''}
              {useVirtual ? ' — scroll para ver todos' : ''}
            </p>
          </div>
          {request.status === 'loading' && <Spinner size="sm" />}
        </div>

        {request.status === 'error' && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-600 dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-400">
            No se pudieron cargar los datos. <button type="button" className="underline" onClick={loadAll}>Reintentar</button>
          </div>
        )}

        {useVirtual ? (
          <div
            ref={virtualList.containerRef}
            onScroll={virtualList.onScroll}
            className="overflow-auto rounded-xl scrollbar-thin"
            style={{ height: Math.min(filtered.length * ROW_HEIGHT + 48, 560) }}
            role="region"
            aria-label="Tabla de registros virtualizada"
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
                {virtualList.paddingTop > 0 && <tr aria-hidden="true" style={{ height: virtualList.paddingTop }}><td colSpan={5} /></tr>}
                {virtualList.visibleItems.map(({ item, index }) => (
                  <tr key={item.id} aria-rowindex={index + 1} style={{ height: ROW_HEIGHT }}>
                    <td><TransactionBadge type={item.type} /></td>
                    <td className="font-semibold text-slate-900 dark:text-white">{formatCurrency(item.value)}</td>
                    <td className="max-w-[220px] truncate text-slate-500 dark:text-slate-400">{item.description}</td>
                    <td className="text-xs text-slate-400">{item.date}</td>
                    <td className="text-right">
                      <button type="button" className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:text-slate-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400" onClick={() => handleDelete(item.id)} disabled={request.status === 'loading'} aria-label={`Eliminar registro del ${item.date}`}>
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
                {virtualList.paddingBottom > 0 && <tr aria-hidden="true" style={{ height: virtualList.paddingBottom }}><td colSpan={5} /></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            {filtered.length === 0 && request.status !== 'loading' ? (
              <EmptyState
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>}
                title="Sin resultados"
                description="Ajusta los filtros o carga todos los registros"
                action={<button type="button" className="btn-ghost btn-sm" onClick={clearFilters}>Limpiar filtros</button>}
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
                        <button type="button" className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:text-slate-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400" onClick={() => handleDelete(item.id)} disabled={request.status === 'loading'} aria-label={`Eliminar registro del ${item.date}`}>
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

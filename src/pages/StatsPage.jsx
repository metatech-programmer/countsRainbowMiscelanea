import { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { getAllCounts } from '../lib/db.js';
import { TRANSACTION_TYPES } from '../lib/constants.js';
import { formatCurrency } from '../lib/utils.js';
import useRequestState from '../lib/useRequestState.js';
import { useToast } from '../components/ToastProvider.jsx';
import KpiCard from '../components/ui/KpiCard.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import RecordsFilterPanel from '../components/ui/RecordsFilterPanel.jsx';

function StatChip({ label, value, colorClass }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`font-display text-xl font-bold ${colorClass}`}>{value}</span>
      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}

function InsightCard({ icon, title, value, subtitle, color = 'brand' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-700 border-brand-100 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-800/50',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50',
    sky: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800/50',
    rose: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/50',
    amber: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50',
  };
  return (
    <div className={`rounded-2xl border px-5 py-4 transition-all duration-200 hover:shadow-soft ${colors[color]}`}>
      <div className="flex items-start gap-3">
        {icon && <span className="mt-0.5 text-xl leading-none">{icon}</span>}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{title}</p>
          <p className="mt-0.5 font-display text-xl font-bold leading-tight">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs opacity-70">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function ExportMenu({ onCsv, onJson, disabled }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} disabled={disabled} className="btn-ghost btn-sm flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
        Exportar
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900">
          <button type="button" className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800" onClick={() => { onCsv(); setOpen(false); }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
            CSV
          </button>
          <button type="button" className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800" onClick={() => { onJson(); setOpen(false); }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
            JSON
          </button>
        </div>
      )}
    </div>
  );
}

function StatsPage() {
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterMin, setFilterMin] = useState('');
  const [filterMax, setFilterMax] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activePeriod, setActivePeriod] = useState(null);
  const request = useRequestState();
  const { push } = useToast();

  const trendRef = useRef(null);
  const distributionRef = useRef(null);
  const barRef = useRef(null);
  const weekdayRef = useRef(null);
  const trendChartRef = useRef(null);
  const distributionChartRef = useRef(null);
  const barChartRef = useRef(null);
  const weekdayChartRef = useRef(null);

  const isDark = document.documentElement.classList.contains('dark');
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const tickColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const legendColor = isDark ? '#94a3b8' : '#64748b';

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      request.setLoading();
      const counts = await getAllCounts();
      setData(counts);
      request.setSuccess();
    } catch (error) {
      request.setFailure(error);
      push({ title: 'Error', message: 'No se pudieron cargar las estadísticas.', variant: 'error' });
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
  }

  const filtered = useMemo(() => {
    let result = data;
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
    return result;
  }, [data, filterType, filterSearch, filterMin, filterMax, dateFrom, dateTo]);

  const totals = useMemo(() => filtered.reduce(
    (acc, item) => {
      if (item.type === TRANSACTION_TYPES.VENTA) acc.ventas += item.value;
      if (item.type === TRANSACTION_TYPES.JER) acc.jer += item.value;
      if (item.type === TRANSACTION_TYPES.GASTOS) acc.gastos += item.value;
      return acc;
    },
    { ventas: 0, jer: 0, gastos: 0 }
  ), [filtered]);

  const netProfit = totals.ventas - totals.gastos;
  const margin = totals.ventas > 0 ? (netProfit / totals.ventas) * 100 : 0;
  const totalIncome = totals.ventas + totals.jer;

  const grouped = useMemo(() => {
    return filtered.reduce((acc, item) => {
      if (!acc[item.date]) acc[item.date] = { venta: 0, jer: 0, gastos: 0 };
      acc[item.date][item.type] += item.value;
      return acc;
    }, {});
  }, [filtered]);

  const insights = useMemo(() => {
    const days = Object.keys(grouped);
    if (days.length === 0) return null;
    const dailyVentas = days.map((d) => grouped[d].venta);
    const maxDay = days.reduce((best, d) => (!best || grouped[d].venta > grouped[best].venta ? d : best), null);
    const avgVenta = dailyVentas.reduce((s, v) => s + v, 0) / dailyVentas.length;
    const daysWithSales = dailyVentas.filter((v) => v > 0).length;
    const nonExpenseOps = filtered.filter((i) => i.type !== TRANSACTION_TYPES.GASTOS);
    const avgTicket = nonExpenseOps.length > 0 ? (totals.ventas + totals.jer) / nonExpenseOps.length : 0;
    return { maxDay, maxValue: grouped[maxDay]?.venta ?? 0, avgVenta, daysWithSales, totalDays: days.length, avgTicket };
  }, [grouped, filtered, totals]);

  const weekdayStats = useMemo(() => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const stats = Array(7).fill(null).map(() => ({ ventas: 0, gastos: 0 }));
    filtered.forEach((item) => {
      const d = new Date(`${item.date}T00:00:00`);
      if (isNaN(d)) return;
      const dow = d.getDay();
      if (item.type === TRANSACTION_TYPES.VENTA) stats[dow].ventas += item.value;
      if (item.type === TRANSACTION_TYPES.GASTOS) stats[dow].gastos += item.value;
    });
    return { labels: days, stats };
  }, [filtered]);

  const topDescriptions = useMemo(() => {
    const map = {};
    filtered.forEach((item) => {
      if (!item.description) return;
      const key = item.description.toLowerCase().slice(0, 30);
      if (!map[key]) map[key] = { label: key, count: 0, total: 0 };
      map[key].count += 1;
      map[key].total += item.value;
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [filtered]);

  useEffect(() => {
    if (filtered.length === 0) {
      [trendChartRef, distributionChartRef, barChartRef, weekdayChartRef].forEach((r) => { r.current?.destroy(); r.current = null; });
      return;
    }
    renderCharts();
    return () => {
      [trendChartRef, distributionChartRef, barChartRef, weekdayChartRef].forEach((r) => { r.current?.destroy(); r.current = null; });
    };
  }, [filtered, isDark]);

  function renderCharts() {
    const labels = Object.keys(grouped).sort();
    const ventas = labels.map((k) => grouped[k].venta);
    const jer = labels.map((k) => grouped[k].jer);
    const gastos = labels.map((k) => grouped[k].gastos);

    [trendChartRef, distributionChartRef, barChartRef, weekdayChartRef].forEach((r) => r.current?.destroy());

    const tooltipBase = {
      backgroundColor: isDark ? '#1e293b' : '#0f172a',
      titleColor: '#f8fafc', bodyColor: '#cbd5e1',
      borderColor: isDark ? '#334155' : '#1e293b', borderWidth: 1,
      padding: 12, cornerRadius: 10,
    };
    const legendBase = {
      position: 'bottom',
      labels: { color: legendColor, font: { family: 'Plus Jakarta Sans', size: 12 }, padding: 16, usePointStyle: true, pointStyleWidth: 8 },
    };

    if (trendRef.current) {
      trendChartRef.current = new Chart(trendRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'Ventas', data: ventas, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', tension: 0.4, fill: true, pointBackgroundColor: '#10b981', pointRadius: labels.length > 30 ? 0 : 4, pointHoverRadius: 6 },
            { label: 'JER', data: jer, borderColor: '#0ea5e9', backgroundColor: 'rgba(14,165,233,0.08)', tension: 0.4, fill: true, pointBackgroundColor: '#0ea5e9', pointRadius: labels.length > 30 ? 0 : 4, pointHoverRadius: 6 },
            { label: 'Gastos', data: gastos, borderColor: '#f43f5e', backgroundColor: 'rgba(244,63,94,0.08)', tension: 0.4, fill: true, pointBackgroundColor: '#f43f5e', pointRadius: labels.length > 30 ? 0 : 4, pointHoverRadius: 6 },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: legendBase, tooltip: { ...tooltipBase, callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}` } } },
          scales: {
            x: { ticks: { color: tickColor, maxTicksLimit: 10, font: { size: 11 } }, grid: { color: gridColor } },
            y: { ticks: { color: tickColor, callback: (v) => formatCurrency(v), font: { size: 11 } }, grid: { color: gridColor } },
          },
        },
      });
    }

    if (distributionRef.current && (totals.ventas || totals.jer || totals.gastos)) {
      distributionChartRef.current = new Chart(distributionRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Ventas', 'JER', 'Gastos'],
          datasets: [{ data: [totals.ventas, totals.jer, totals.gastos], backgroundColor: ['#10b981', '#0ea5e9', '#f43f5e'], borderWidth: 3, borderColor: isDark ? '#0f172a' : '#ffffff', hoverOffset: 10 }],
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '68%',
          plugins: { legend: legendBase, tooltip: { ...tooltipBase, callbacks: { label: (ctx) => ` ${ctx.label}: ${formatCurrency(ctx.parsed)}` } } },
        },
      });
    }

    if (barRef.current && labels.length > 0) {
      barChartRef.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Ventas', data: ventas, backgroundColor: 'rgba(16,185,129,0.85)', borderRadius: 5, borderSkipped: false },
            { label: 'Gastos', data: gastos, backgroundColor: 'rgba(244,63,94,0.75)', borderRadius: 5, borderSkipped: false },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: legendBase, tooltip: { ...tooltipBase, callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}` } } },
          scales: {
            x: { ticks: { color: tickColor, maxTicksLimit: 12, font: { size: 11 } }, grid: { display: false } },
            y: { ticks: { color: tickColor, callback: (v) => formatCurrency(v), font: { size: 11 } }, grid: { color: gridColor } },
          },
        },
      });
    }

    if (weekdayRef.current) {
      weekdayChartRef.current = new Chart(weekdayRef.current, {
        type: 'radar',
        data: {
          labels: weekdayStats.labels,
          datasets: [
            { label: 'Ventas', data: weekdayStats.stats.map((s) => s.ventas), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.12)', pointBackgroundColor: '#10b981', pointRadius: 4 },
            { label: 'Gastos', data: weekdayStats.stats.map((s) => s.gastos), borderColor: '#f43f5e', backgroundColor: 'rgba(244,63,94,0.10)', pointBackgroundColor: '#f43f5e', pointRadius: 4 },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: legendBase, tooltip: { ...tooltipBase, callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.parsed.r)}` } } },
          scales: {
            r: {
              ticks: { color: tickColor, font: { size: 10 }, backdropColor: 'transparent', callback: (v) => formatCurrency(v) },
              grid: { color: gridColor },
              pointLabels: { color: tickColor, font: { size: 12, weight: '600' } },
            },
          },
        },
      });
    }
  }

  function exportCsv() {
    if (filtered.length === 0) return;
    const header = 'Fecha,Tipo,Valor,Descripcion';
    const rows = filtered.map((i) => `${i.date},${i.type},${i.value},"${(i.description || '').replace(/"/g, '""')}"`);
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `merkatodo-stats-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    push({ title: 'CSV exportado', message: `${filtered.length} registros descargados.`, variant: 'success' });
  }

  function exportJson() {
    if (filtered.length === 0) return;
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `merkatodo-stats-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
    push({ title: 'JSON exportado', message: `${filtered.length} registros descargados.`, variant: 'success' });
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-eyebrow">Analítica empresarial</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Panel de estadísticas
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Rendimiento financiero, tendencias y métricas del negocio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu onCsv={exportCsv} onJson={exportJson} disabled={filtered.length === 0} />
          <button
            type="button"
            onClick={loadData}
            className="btn-ghost btn-sm"
            disabled={request.status === 'loading'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={request.status === 'loading' ? 'animate-spin' : ''}><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
            Actualizar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Métricas clave">
        <KpiCard eyebrow="Ventas totales" value={formatCurrency(totals.ventas)} subtitle={`${filtered.filter((c) => c.type === 'venta').length} operaciones`} colorClass="text-emerald-600 dark:text-emerald-400" loading={request.status === 'loading' && data.length === 0} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>} />
        <KpiCard eyebrow="JER total" value={formatCurrency(totals.jer)} subtitle={`${filtered.filter((c) => c.type === 'jer').length} operaciones`} colorClass="text-sky-600 dark:text-sky-400" loading={request.status === 'loading' && data.length === 0} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-sky-500"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>} />
        <KpiCard eyebrow="Gastos totales" value={formatCurrency(totals.gastos)} subtitle={`${filtered.filter((c) => c.type === 'gastos').length} operaciones`} colorClass="text-rose-600 dark:text-rose-400" loading={request.status === 'loading' && data.length === 0} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-500"><path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" /></svg>} />
        <KpiCard eyebrow="Ganancia neta" value={formatCurrency(netProfit)} subtitle={`Margen ${margin.toFixed(1)}%`} colorClass={netProfit >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-rose-600 dark:text-rose-400'} loading={request.status === 'loading' && data.length === 0} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={netProfit >= 0 ? 'text-brand-500' : 'text-rose-500'}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>} />
      </section>

      {/* Unified filter panel — mismo componente que Historial */}
      <RecordsFilterPanel
        filterType={filterType} setFilterType={setFilterType}
        filterSearch={filterSearch} setFilterSearch={setFilterSearch} showSearch
        filterMin={filterMin} setFilterMin={setFilterMin}
        filterMax={filterMax} setFilterMax={setFilterMax}
        dateFrom={dateFrom} setDateFrom={setDateFrom}
        dateTo={dateTo} setDateTo={setDateTo}
        activePeriod={activePeriod} setActivePeriod={setActivePeriod} showPeriodPresets
        onReset={clearFilters}
        resultCount={filtered.length}
        loading={request.status === 'loading'}
      />

      {/* Loading */}
      {request.status === 'loading' && data.length === 0 && (
        <div className="flex items-center justify-center gap-3 py-16 text-sm font-semibold text-slate-500">
          <Spinner /> Cargando estadísticas...
        </div>
      )}

      {filtered.length === 0 && request.status !== 'loading' ? (
        <EmptyState
          icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>}
          title="Sin datos para mostrar"
          description="Ajusta los filtros o registra operaciones para ver estadísticas"
          action={<button type="button" className="btn-ghost btn-sm" onClick={clearFilters}>Limpiar filtros</button>}
        />
      ) : filtered.length > 0 && (
        <>
          {/* Secondary KPIs */}
          <section className="card p-5">
            <div className="flex flex-wrap items-center justify-around gap-6 divide-x divide-slate-100 dark:divide-slate-800">
              <StatChip label="Ingresos totales" value={formatCurrency(totalIncome)} colorClass="text-slate-900 dark:text-white" />
              <div className="pl-6"><StatChip label="Total operaciones" value={filtered.length.toLocaleString('es-CO')} colorClass="text-slate-900 dark:text-white" /></div>
              <div className="pl-6"><StatChip label="Días activos" value={insights?.totalDays ?? 0} colorClass="text-slate-900 dark:text-white" /></div>
              <div className="pl-6"><StatChip label="Eficiencia" value={totals.ventas > 0 ? `${margin.toFixed(0)}%` : '—'} colorClass={margin >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'} /></div>
              <div className="pl-6"><StatChip label="Ticket promedio" value={insights?.avgTicket ? formatCurrency(insights.avgTicket) : '—'} colorClass="text-slate-900 dark:text-white" /></div>
            </div>
          </section>

          {/* Insights */}
          {insights && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Insights del período</h2>
                <span className="badge-brand">Automático</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <InsightCard icon="🏆" title="Mejor día en ventas" value={insights.maxDay} subtitle={formatCurrency(insights.maxValue)} color="emerald" />
                <InsightCard icon="📊" title="Promedio diario ventas" value={formatCurrency(insights.avgVenta)} subtitle="Por día del período" color="brand" />
                <InsightCard icon="📅" title="Días con ventas" value={`${insights.daysWithSales} / ${insights.totalDays}`} subtitle="Días activos" color="sky" />
                <InsightCard icon={margin >= 0 ? '📈' : '📉'} title="Margen de ganancia" value={`${margin.toFixed(1)}%`} subtitle="Ventas menos gastos" color={margin >= 0 ? 'emerald' : 'rose'} />
              </div>
            </section>
          )}

          {/* Charts */}
          <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="card p-6">
              <h2 className="font-display mb-1 text-lg font-bold text-slate-900 dark:text-white">Tendencia de ingresos</h2>
              <p className="mb-4 text-xs text-slate-400">Evolución diaria de ventas, JER y gastos</p>
              <div style={{ height: 280 }}><canvas ref={trendRef} role="img" aria-label="Gráfica de línea: tendencia" /></div>
            </div>
            <div className="card p-6">
              <h2 className="font-display mb-1 text-lg font-bold text-slate-900 dark:text-white">Distribución</h2>
              <p className="mb-4 text-xs text-slate-400">Participación porcentual por categoría</p>
              <div className="relative" style={{ height: 280 }}>
                <canvas ref={distributionRef} role="img" aria-label="Gráfica dona: distribución" />
                {(totals.ventas || totals.jer || totals.gastos) && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className="font-display text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(totalIncome + totals.gastos)}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="font-display mb-1 text-lg font-bold text-slate-900 dark:text-white">Ventas vs Gastos</h2>
              <p className="mb-4 text-xs text-slate-400">Comparativa diaria de ingresos y egresos</p>
              <div style={{ height: 240 }}><canvas ref={barRef} role="img" aria-label="Gráfica barras: ventas vs gastos" /></div>
            </div>
            <div className="card p-6">
              <h2 className="font-display mb-1 text-lg font-bold text-slate-900 dark:text-white">Actividad por día de semana</h2>
              <p className="mb-4 text-xs text-slate-400">Distribución del volumen según el día</p>
              <div style={{ height: 240 }}><canvas ref={weekdayRef} role="img" aria-label="Gráfica radar: día de semana" /></div>
            </div>
          </section>

          {/* Top operaciones */}
          {topDescriptions.length > 0 && (
            <section className="card p-6">
              <h2 className="font-display mb-1 text-lg font-bold text-slate-900 dark:text-white">Operaciones más frecuentes</h2>
              <p className="mb-4 text-xs text-slate-400">Descripciones con mayor repetición en el período</p>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="table-modern min-w-[500px]">
                  <thead>
                    <tr><th>#</th><th>Descripción</th><th>Veces</th><th>Total acumulado</th><th>Promedio</th></tr>
                  </thead>
                  <tbody>
                    {topDescriptions.map((item, i) => (
                      <tr key={item.label}>
                        <td className="text-xs font-bold text-slate-400">#{i + 1}</td>
                        <td><span className="font-medium capitalize text-slate-800 dark:text-slate-200">{item.label}</span></td>
                        <td><span className="badge-brand">{item.count}x</span></td>
                        <td className="font-semibold text-slate-900 dark:text-white">{formatCurrency(item.total)}</td>
                        <td className="text-slate-500 dark:text-slate-400">{formatCurrency(item.total / item.count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Resumen financiero */}
          <section className="card p-6">
            <h2 className="font-display mb-4 text-lg font-bold text-slate-900 dark:text-white">Resumen financiero</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Ingresos brutos</p>
                <p className="mt-1 font-display text-2xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(totalIncome)}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${totalIncome + totals.gastos > 0 ? (totalIncome / (totalIncome + totals.gastos)) * 100 : 0}%` }} />
                </div>
              </div>
              <div className="rounded-xl bg-rose-50 p-4 dark:bg-rose-900/20">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">Egresos totales</p>
                <p className="mt-1 font-display text-2xl font-bold text-rose-700 dark:text-rose-300">{formatCurrency(totals.gastos)}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-rose-100 dark:bg-rose-900/40">
                  <div className="h-full rounded-full bg-rose-500" style={{ width: `${totalIncome + totals.gastos > 0 ? (totals.gastos / (totalIncome + totals.gastos)) * 100 : 0}%` }} />
                </div>
              </div>
              <div className={`rounded-xl p-4 ${netProfit >= 0 ? 'bg-brand-50 dark:bg-brand-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider ${netProfit >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-amber-600 dark:text-amber-400'}`}>Utilidad neta</p>
                <p className={`mt-1 font-display text-2xl font-bold ${netProfit >= 0 ? 'text-brand-700 dark:text-brand-300' : 'text-amber-700 dark:text-amber-300'}`}>{formatCurrency(netProfit)}</p>
                <p className={`mt-2 text-xs font-semibold ${netProfit >= 0 ? 'text-brand-500' : 'text-amber-500'}`}>{margin.toFixed(1)}% de margen</p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default StatsPage;

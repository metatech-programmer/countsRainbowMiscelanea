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

const TYPE_CHIPS = [
  { value: 'all', label: 'Todos' },
  { value: TRANSACTION_TYPES.VENTA, label: 'Ventas' },
  { value: TRANSACTION_TYPES.JER, label: 'JER' },
  { value: TRANSACTION_TYPES.GASTOS, label: 'Gastos' },
];

const PERIOD_PRESETS = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: 'Todo', days: null },
];

function getDateNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function InsightCard({ icon, title, value, subtitle, color = 'brand' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    sky: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  };
  return (
    <div className={`rounded-2xl px-5 py-4 ${colors[color]}`}>
      <div className="flex items-start gap-3">
        {icon && <span className="text-xl">{icon}</span>}
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{title}</p>
          <p className="mt-0.5 font-display text-lg font-bold leading-tight">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs opacity-70">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function StatsPage() {
  const [data, setData] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activePeriod, setActivePeriod] = useState(null);
  const request = useRequestState();
  const { push } = useToast();

  const trendRef = useRef(null);
  const distributionRef = useRef(null);
  const barRef = useRef(null);
  const trendChartRef = useRef(null);
  const distributionChartRef = useRef(null);
  const barChartRef = useRef(null);

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
      push({ title: 'Error', message: 'No se pudieron cargar las estadisticas.', variant: 'error' });
    }
  }

  function applyPreset(preset) {
    setActivePeriod(preset.days);
    if (preset.days === null) {
      setDateFrom('');
      setDateTo('');
    } else {
      setDateFrom(getDateNDaysAgo(preset.days));
      setDateTo('');
    }
  }

  const filtered = useMemo(() => {
    let result = data;
    if (filterType !== 'all') result = result.filter((i) => i.type === filterType);
    if (dateFrom) result = result.filter((i) => i.date >= dateFrom);
    if (dateTo) result = result.filter((i) => i.date <= dateTo);
    return result;
  }, [data, filterType, dateFrom, dateTo]);

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

    return { maxDay, maxValue: grouped[maxDay]?.venta ?? 0, avgVenta, daysWithSales, totalDays: days.length };
  }, [grouped]);

  useEffect(() => {
    if (filtered.length === 0) {
      [trendChartRef, distributionChartRef, barChartRef].forEach((r) => { r.current?.destroy(); r.current = null; });
      return;
    }
    renderCharts();
    return () => {
      [trendChartRef, distributionChartRef, barChartRef].forEach((r) => { r.current?.destroy(); r.current = null; });
    };
  }, [filtered, isDark]);

  function renderCharts() {
    const labels = Object.keys(grouped).sort();
    const ventas = labels.map((k) => grouped[k].venta);
    const jer = labels.map((k) => grouped[k].jer);
    const gastos = labels.map((k) => grouped[k].gastos);

    [trendChartRef, distributionChartRef, barChartRef].forEach((r) => r.current?.destroy());

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: legendColor, font: { family: 'Plus Jakarta Sans', size: 12 }, padding: 16, usePointStyle: true, pointStyleWidth: 8 },
        },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: isDark ? '#334155' : '#1e293b',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 10,
          callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y ?? ctx.parsed)}` },
        },
      },
    };

    if (trendRef.current) {
      trendChartRef.current = new Chart(trendRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'Ventas', data: ventas, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#10b981', pointRadius: labels.length > 30 ? 0 : 4 },
            { label: 'JER', data: jer, borderColor: '#0ea5e9', backgroundColor: 'rgba(14,165,233,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#0ea5e9', pointRadius: labels.length > 30 ? 0 : 4 },
            { label: 'Gastos', data: gastos, borderColor: '#f43f5e', backgroundColor: 'rgba(244,63,94,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#f43f5e', pointRadius: labels.length > 30 ? 0 : 4 },
          ],
        },
        options: {
          ...commonOptions,
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
          datasets: [{
            data: [totals.ventas, totals.jer, totals.gastos],
            backgroundColor: ['#10b981', '#0ea5e9', '#f43f5e'],
            borderWidth: 2,
            borderColor: isDark ? '#0f172a' : '#ffffff',
            hoverOffset: 8,
          }],
        },
        options: {
          ...commonOptions,
          cutout: '65%',
          plugins: { ...commonOptions.plugins, tooltip: { ...commonOptions.plugins.tooltip, callbacks: { label: (ctx) => ` ${ctx.label}: ${formatCurrency(ctx.parsed)}` } } },
        },
      });
    }

    if (barRef.current && labels.length > 0) {
      barChartRef.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Ventas', data: ventas, backgroundColor: 'rgba(16,185,129,0.8)', borderRadius: 4 },
            { label: 'Gastos', data: gastos, backgroundColor: 'rgba(244,63,94,0.7)', borderRadius: 4 },
          ],
        },
        options: {
          ...commonOptions,
          scales: {
            x: { ticks: { color: tickColor, maxTicksLimit: 12, font: { size: 11 } }, grid: { display: false } },
            y: { ticks: { color: tickColor, callback: (v) => formatCurrency(v), font: { size: 11 } }, grid: { color: gridColor } },
          },
        },
      });
    }
  }

  function handleReset() {
    setDateFrom('');
    setDateTo('');
    setFilterType('all');
    setActivePeriod(null);
  }

  const hasActiveFilter = dateFrom || dateTo || filterType !== 'all';

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* Header */}
      <div>
        <p className="section-eyebrow">Analítica</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Panel de estadísticas
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Rendimiento financiero y tendencias del negocio
        </p>
      </div>

      {/* Filter panel */}
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label mb-2">Período</p>
            <div className="flex flex-wrap gap-2">
              {PERIOD_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                    activePeriod === p.days
                      ? 'border-brand-600 bg-brand-600 text-white shadow-glow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {TYPE_CHIPS.map((chip) => (
              <button
                key={chip.value}
                type="button"
                onClick={() => setFilterType(chip.value)}
                aria-pressed={filterType === chip.value}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  filterType === chip.value
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="flex flex-col gap-1.5">
            <span className="label-sm">Desde</span>
            <input
              type="date"
              className="input"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => { setDateFrom(e.target.value); setActivePeriod(null); }}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="label-sm">Hasta</span>
            <input
              type="date"
              className="input"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => { setDateTo(e.target.value); setActivePeriod(null); }}
            />
          </label>
          {hasActiveFilter && (
            <div className="flex items-end">
              <button type="button" className="btn-ghost" onClick={handleReset}>Limpiar</button>
            </div>
          )}
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {filtered.length} registros coinciden con los filtros aplicados.
        </p>
      </section>

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard eyebrow="Ventas totales" value={formatCurrency(totals.ventas)} colorClass="text-emerald-600 dark:text-emerald-400" loading={request.status === 'loading' && data.length === 0} />
        <KpiCard eyebrow="JER total" value={formatCurrency(totals.jer)} colorClass="text-sky-600 dark:text-sky-400" loading={request.status === 'loading' && data.length === 0} />
        <KpiCard eyebrow="Gastos totales" value={formatCurrency(totals.gastos)} colorClass="text-rose-600 dark:text-rose-400" loading={request.status === 'loading' && data.length === 0} />
        <KpiCard
          eyebrow="Ganancia neta"
          value={formatCurrency(netProfit)}
          subtitle={`Margen ${margin.toFixed(1)}%`}
          colorClass={netProfit >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-rose-600 dark:text-rose-400'}
          loading={request.status === 'loading' && data.length === 0}
        />
      </section>

      {/* Loading / error state */}
      {request.status === 'loading' && data.length === 0 && (
        <div className="flex items-center justify-center gap-3 py-12 text-sm font-semibold text-slate-500">
          <Spinner /> Cargando estadísticas...
        </div>
      )}

      {filtered.length === 0 && request.status !== 'loading' ? (
        <EmptyState
          icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>}
          title="Sin datos para mostrar"
          description={hasActiveFilter ? 'Ajusta los filtros para ver estadísticas' : 'Registra operaciones para ver estadísticas'}
          action={hasActiveFilter && (
            <button type="button" className="btn-ghost btn-sm" onClick={handleReset}>Limpiar filtros</button>
          )}
        />
      ) : filtered.length > 0 && (
        <>
          {/* Insights automáticos */}
          {insights && (
            <section>
              <h2 className="font-display mb-4 text-lg font-bold text-slate-900 dark:text-white">Insights del período</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <InsightCard icon="🏆" title="Mejor día en ventas" value={insights.maxDay} subtitle={formatCurrency(insights.maxValue)} color="emerald" />
                <InsightCard icon="📊" title="Promedio diario ventas" value={formatCurrency(insights.avgVenta)} subtitle="Por día con actividad" color="brand" />
                <InsightCard icon="📅" title="Días con ventas" value={`${insights.daysWithSales} de ${insights.totalDays}`} subtitle="Días activos del período" color="sky" />
                <InsightCard icon={margin >= 0 ? '📈' : '📉'} title="Margen de ganancia" value={`${margin.toFixed(1)}%`} subtitle="Ventas menos gastos" color={margin >= 0 ? 'emerald' : 'rose'} />
              </div>
            </section>
          )}

          {/* Charts grid */}
          <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Trend chart */}
            <div className="card p-6">
              <h2 className="font-display mb-1 text-lg font-bold text-slate-900 dark:text-white">Tendencia de ingresos</h2>
              <p className="mb-5 text-xs text-slate-400">Evolución diaria de ventas, JER y gastos</p>
              <div style={{ height: 280 }}>
                <canvas ref={trendRef} role="img" aria-label="Gráfica de línea: tendencia de ventas, JER y gastos" />
              </div>
            </div>

            {/* Distribution doughnut */}
            <div className="card p-6">
              <h2 className="font-display mb-1 text-lg font-bold text-slate-900 dark:text-white">Distribución</h2>
              <p className="mb-5 text-xs text-slate-400">Participación porcentual de cada categoría</p>
              <div style={{ height: 280 }}>
                <canvas ref={distributionRef} role="img" aria-label="Gráfica de dona: distribución de ventas, JER y gastos" />
              </div>
            </div>
          </section>

          {/* Bar chart: ventas vs gastos por día */}
          <div className="card p-6">
            <h2 className="font-display mb-1 text-lg font-bold text-slate-900 dark:text-white">Ventas vs Gastos por día</h2>
            <p className="mb-5 text-xs text-slate-400">Comparativa de ingresos y egresos diarios</p>
            <div style={{ height: 240 }}>
              <canvas ref={barRef} role="img" aria-label="Gráfica de barras: ventas vs gastos por día" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StatsPage;

function KpiCard({ eyebrow, value, subtitle, icon, trend, colorClass = 'text-brand-600 dark:text-brand-400', loading = false }) {
  if (loading) {
    return (
      <div className="card p-5">
        <div className="skeleton mb-2 h-3 w-20 rounded" />
        <div className="skeleton h-7 w-32 rounded" />
      </div>
    );
  }

  return (
    <div className="card p-5 transition-all duration-200 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="label-sm truncate">{eyebrow}</p>
          <p className={`mt-1.5 font-display text-2xl font-bold tracking-tight ${colorClass}`}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
          )}
          {trend !== undefined && (
            <p className={`mt-1.5 text-xs font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}% vs ayer
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default KpiCard;

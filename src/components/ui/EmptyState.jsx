function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/30">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          {icon}
        </div>
      )}
      <div>
        {title && <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</p>}
        {description && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export default EmptyState;

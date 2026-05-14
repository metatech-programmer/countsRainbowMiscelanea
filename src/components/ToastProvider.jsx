import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

const VARIANT_STYLES = {
  success: {
    bar: 'bg-emerald-500',
    icon: '✓',
    iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
    title: 'text-emerald-700 dark:text-emerald-400',
  },
  error: {
    bar: 'bg-rose-500',
    icon: '✕',
    iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
    title: 'text-rose-700 dark:text-rose-400',
  },
  info: {
    bar: 'bg-brand-500',
    icon: 'i',
    iconBg: 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400',
    title: 'text-brand-700 dark:text-brand-400',
  },
};

function Toast({ toast, onDismiss }) {
  const styles = VARIANT_STYLES[toast.variant] ?? VARIANT_STYLES.info;
  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className="animate-slide-in-right relative flex w-full items-start gap-3 overflow-hidden rounded-2xl bg-white px-4 py-3.5 shadow-card dark:bg-slate-900"
    >
      {/* Left accent bar */}
      <div className={`absolute inset-y-0 left-0 w-1 rounded-l-2xl ${styles.bar}`} />
      {/* Icon */}
      <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold ${styles.iconBg}`}>
        {styles.icon}
      </div>
      {/* Content */}
      <div className="min-w-0 flex-1 pr-4">
        {toast.title && (
          <p className={`text-xs font-bold uppercase tracking-wider ${styles.title}`}>{toast.title}</p>
        )}
        {toast.message && (
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{toast.message}</p>
        )}
      </div>
      {/* Dismiss */}
      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-md text-slate-300 hover:bg-slate-100 hover:text-slate-500 dark:hover:bg-slate-800"
        aria-label="Cerrar notificación"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, ...toast }]);
    const duration = toast.duration ?? 3500;
    if (duration !== 0) {
      setTimeout(() => dismiss(id), duration);
    }
  }, [dismiss]);

  const api = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="fixed right-4 top-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2.5"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Notificaciones del sistema"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast debe usarse dentro de ToastProvider');
  return context;
}

export { ToastProvider, useToast };

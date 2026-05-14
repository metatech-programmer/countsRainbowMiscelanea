import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ConfirmContext = createContext(null);

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ConfirmDialog({ dialog, onClose }) {
  const panelRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement;
    const firstFocusable = panelRef.current?.querySelector(FOCUSABLE);
    firstFocusable?.focus();
    return () => { previouslyFocusedRef.current?.focus(); };
  }, []);

  function handleKeyDown(e) {
    if (e.key === 'Escape') { onClose(false); return; }
    if (e.key !== 'Tab') return;
    const focusable = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  const isDanger = dialog.confirmText?.toLowerCase().includes('eliminar') ||
    dialog.confirmText?.toLowerCase().includes('vaciar') ||
    dialog.confirmText?.toLowerCase().includes('restaurar');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
      aria-hidden="false"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(false); }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        className="animate-scale-in card w-full max-w-md p-6"
        onKeyDown={handleKeyDown}
      >
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h3 id="confirm-title" className="mt-3 font-display text-xl font-bold text-slate-900 dark:text-white">
          {dialog.title ?? 'Confirmar acción'}
        </h3>
        <p id="confirm-desc" className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {dialog.message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-ghost" onClick={() => onClose(false)} type="button">
            {dialog.cancelText ?? 'Cancelar'}
          </button>
          <button
            className={isDanger ? 'btn btn-danger' : 'btn-primary'}
            onClick={() => onClose(true)}
            type="button"
          >
            {dialog.confirmText ?? 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setDialog({ ...options, resolve });
    });
  }, []);

  const api = useMemo(() => ({ confirm }), [confirm]);

  function handleClose(value) {
    dialog?.resolve(value);
    setDialog(null);
  }

  return (
    <ConfirmContext.Provider value={api}>
      {children}
      {dialog && <ConfirmDialog dialog={dialog} onClose={handleClose} />}
    </ConfirmContext.Provider>
  );
}

function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error('useConfirm debe usarse dentro de ConfirmProvider');
  return context;
}

export { ConfirmProvider, useConfirm };

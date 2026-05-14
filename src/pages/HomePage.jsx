import { useEffect, useMemo, useRef, useState } from 'react';
import { addCount, deleteCount, getCountsByDay } from '../lib/db.js';
import { DEFAULT_ROWS_PER_PAGE, STORAGE_KEYS, TRANSACTION_TYPES, WHATSAPP_PHONE } from '../lib/constants.js';
import { formatCurrency, getLocalDate, safeJsonParse } from '../lib/utils.js';
import useRequestState from '../lib/useRequestState.js';
import BackupPanel from '../components/BackupPanel.jsx';
import { useConfirm } from '../components/ConfirmProvider.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import KpiCard from '../components/ui/KpiCard.jsx';
import TransactionBadge from '../components/ui/TransactionBadge.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

const paymentOptions = [
  {
    id: 'nequi',
    label: 'Nequi',
    // Nequi: morado oscuro con degradado a rosado
    active: 'border-[#6B21A8] bg-gradient-to-r from-[#6B21A8] to-[#EC4899] text-white shadow-[0_0_16px_rgba(107,33,168,0.4)]',
    inactive: 'border-[#6B21A8]/40 bg-gradient-to-r from-[#6B21A8]/8 to-[#EC4899]/8 text-[#6B21A8] hover:from-[#6B21A8]/15 hover:to-[#EC4899]/15 dark:border-[#A855F7]/40 dark:from-[#6B21A8]/15 dark:to-[#EC4899]/15 dark:text-[#d8b4fe]',
    dot: 'bg-gradient-to-r from-[#6B21A8] to-[#EC4899]',
  },
  {
    id: 'daviplata',
    label: 'Daviplata',
    // Daviplata: rojo intenso con texto blanco
    active: 'border-[#DC2626] bg-[#DC2626] text-white shadow-[0_0_16px_rgba(220,38,38,0.4)]',
    inactive: 'border-[#DC2626]/40 bg-[#DC2626]/6 text-[#DC2626] hover:bg-[#DC2626]/12 dark:border-[#EF4444]/40 dark:bg-[#DC2626]/12 dark:text-[#fca5a5]',
    dot: 'bg-[#DC2626]',
  },
];

const TYPE_CONFIG = {
  venta: { label: 'Venta', shortcut: 'V', color: 'border-emerald-400 bg-emerald-600 text-white shadow-[0_0_16px_rgba(16,185,129,0.3)]', inactive: 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300', icon: '💰' },
  jer: { label: 'JER', shortcut: 'J', color: 'border-sky-400 bg-sky-600 text-white shadow-[0_0_16px_rgba(14,165,233,0.3)]', inactive: 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300', icon: '📦' },
  gastos: { label: 'Gasto', shortcut: 'G', color: 'border-rose-400 bg-rose-600 text-white shadow-[0_0_16px_rgba(244,63,94,0.3)]', inactive: 'border-slate-200 bg-white text-slate-600 hover:border-rose-300 hover:text-rose-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300', icon: '💸' },
};

function CheckIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

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

function SendIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function PlusIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ListIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function HomePage() {
  const [type, setType] = useState(TRANSACTION_TYPES.VENTA);
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [valueError, setValueError] = useState('');
  const [suggestions, setSuggestions] = useState(() =>
    safeJsonParse(localStorage.getItem(STORAGE_KEYS.PAPELERIA_LISTA), [])
  );
  const [payment, setPayment] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const [counts, setCounts] = useState([]);
  const [list, setList] = useState(() => safeJsonParse(localStorage.getItem(STORAGE_KEYS.LIST), []));
  const [listItem, setListItem] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const valueInputRef = useRef(null);
  const descInputRef = useRef(null);
  const request = useRequestState();
  const { confirm } = useConfirm();
  const { push } = useToast();

  const dayKey = getLocalDate();

  useEffect(() => {
    loadCounts();
  }, []);

  // Keyboard shortcuts: V / J / G to switch type
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'v' || e.key === 'V') setType(TRANSACTION_TYPES.VENTA);
      if (e.key === 'j' || e.key === 'J') setType(TRANSACTION_TYPES.JER);
      if (e.key === 'g' || e.key === 'G') setType(TRANSACTION_TYPES.GASTOS);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  async function loadCounts() {
    try {
      request.setLoading();
      const data = await getCountsByDay(dayKey);
      setCounts(data.reverse());
      request.setSuccess();
    } catch (error) {
      request.setFailure(error);
      push({ title: 'Error', message: 'No se pudo cargar el resumen del dia.', variant: 'error' });
    }
  }

  const totals = useMemo(() => {
    return counts.reduce(
      (acc, item) => {
        if (item.type === TRANSACTION_TYPES.VENTA) acc.ventas += item.value;
        if (item.type === TRANSACTION_TYPES.JER) acc.jer += item.value;
        if (item.type === TRANSACTION_TYPES.GASTOS) acc.gastos += item.value;
        return acc;
      },
      { ventas: 0, jer: 0, gastos: 0 }
    );
  }, [counts]);

  const netProfit = totals.ventas - totals.gastos;

  const totalPages = rowsPerPage === 'all' ? 1 : Math.max(1, Math.ceil(counts.length / rowsPerPage));

  const displayCounts = useMemo(() => {
    if (rowsPerPage === 'all') return counts;
    const start = (currentPage - 1) * rowsPerPage;
    return counts.slice(start, start + rowsPerPage);
  }, [counts, currentPage, rowsPerPage]);

  async function handleSubmit(event) {
    event.preventDefault();
    const numericValue = Number(value);
    const cleanDescription = description.trim();
    let hasError = false;

    if (!numericValue || numericValue <= 0) {
      setValueError('Ingresa un monto valido.');
      valueInputRef.current?.focus();
      hasError = true;
    } else {
      setValueError('');
    }

    if (!cleanDescription) {
      setDescriptionError('Agrega una descripcion corta.');
      if (!hasError) descInputRef.current?.focus();
      hasError = true;
    } else {
      setDescriptionError('');
    }

    if (hasError) return;

    const prefix = payment ? `(${payment}) ` : '';
    const payload = {
      id: Date.now(),
      date: dayKey,
      type,
      value: numericValue,
      description: `${prefix}${cleanDescription.toLowerCase()}`,
    };

    try {
      request.setLoading();
      await addCount(payload);
      setValue('');
      setDescription('');
      setPayment('');
      setShowSuggestions(false);
      setLastSaved(payload);
      await loadCounts();
      if (!suggestions.includes(cleanDescription.toLowerCase())) {
        const updated = [cleanDescription.toLowerCase(), ...suggestions].slice(0, 12);
        setSuggestions(updated);
        localStorage.setItem(STORAGE_KEYS.PAPELERIA_LISTA, JSON.stringify(updated));
      }
      valueInputRef.current?.focus();
      push({ title: 'Registro guardado', message: `${TYPE_CONFIG[type].label} de ${formatCurrency(numericValue)} registrada.`, variant: 'success' });
    } catch (error) {
      request.setFailure(error);
      push({ title: 'Error', message: 'No se pudo guardar la operacion.', variant: 'error' });
    }
  }

  async function handleDelete(id) {
    const confirmed = await confirm({
      title: 'Eliminar registro',
      message: 'Esta accion eliminara permanentemente el registro.',
      confirmText: 'Eliminar',
    });
    if (!confirmed) return;
    try {
      request.setLoading();
      await deleteCount(id);
      await loadCounts();
      push({ title: 'Eliminado', message: 'El registro fue eliminado.', variant: 'success' });
    } catch (error) {
      request.setFailure(error);
      push({ title: 'Error', message: 'No se pudo eliminar el registro.', variant: 'error' });
    }
  }

  function addListItem(event) {
    event.preventDefault();
    const item = listItem.trim();
    if (!item) return;
    const updated = [...list, { text: item, done: false }];
    setList(updated);
    localStorage.setItem(STORAGE_KEYS.LIST, JSON.stringify(updated));
    setListItem('');
    push({ title: 'Producto agregado', message: item, variant: 'success' });
  }

  function toggleListItem(index) {
    const updated = list.map((item, i) => (i === index ? { ...item, done: !item.done } : item));
    setList(updated);
    localStorage.setItem(STORAGE_KEYS.LIST, JSON.stringify(updated));
  }

  async function removeListItem(index) {
    const confirmed = await confirm({
      title: 'Eliminar producto',
      message: `Eliminar "${typeof list[index] === 'string' ? list[index] : list[index].text}" de la lista?`,
      confirmText: 'Eliminar',
    });
    if (!confirmed) return;
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
    localStorage.setItem(STORAGE_KEYS.LIST, JSON.stringify(updated));
  }

  async function clearList() {
    if (list.length === 0) return;
    const confirmed = await confirm({
      title: 'Vaciar lista',
      message: 'Se eliminaran todos los productos pendientes.',
      confirmText: 'Vaciar',
    });
    if (!confirmed) return;
    setList([]);
    localStorage.removeItem(STORAGE_KEYS.LIST);
    push({ title: 'Lista vaciada', message: 'Todos los productos fueron eliminados.', variant: 'success' });
  }

  function sendList() {
    const items = list.filter((i) => !(i.done));
    if (items.length === 0) {
      push({ title: 'Lista vacia', message: 'No hay productos pendientes para enviar.', variant: 'error' });
      return;
    }
    const texto = items.map((i) => `* ${typeof i === 'string' ? i : i.text}`).join('%0A');
    const message = `Lista de pedidos:%0A%0A${texto}`;
    window.location.href = `whatsapp://send?phone=${WHATSAPP_PHONE}&text=${message}`;
  }

  const pendingCount = list.filter((i) => !(typeof i === 'object' && i.done)).length;

  function getListItemText(item) {
    return typeof item === 'string' ? item : item.text;
  }

  function getListItemDone(item) {
    return typeof item === 'object' && item.done;
  }

  const filteredSuggestions = showSuggestions && description
    ? suggestions.filter((s) => s.includes(description.toLowerCase())).slice(0, 6)
    : showSuggestions && !description
    ? suggestions.slice(0, 6)
    : [];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* Page header */}
      <div>
        <p className="section-eyebrow">Registro diario — {dayKey}</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Operaciones del día
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Registra ventas, servicios JER y gastos. Atajos: <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono dark:bg-slate-800">V</kbd> Venta · <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono dark:bg-slate-800">J</kbd> JER · <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono dark:bg-slate-800">G</kbd> Gasto
        </p>
      </div>

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumen financiero del día">
        <KpiCard
          eyebrow="Ventas"
          value={formatCurrency(totals.ventas)}
          subtitle={`${counts.filter((c) => c.type === 'venta').length} operaciones`}
          colorClass="text-emerald-600 dark:text-emerald-400"
          loading={request.status === 'loading' && counts.length === 0}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
        />
        <KpiCard
          eyebrow="JER"
          value={formatCurrency(totals.jer)}
          subtitle={`${counts.filter((c) => c.type === 'jer').length} operaciones`}
          colorClass="text-sky-600 dark:text-sky-400"
          loading={request.status === 'loading' && counts.length === 0}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-sky-500"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>}
        />
        <KpiCard
          eyebrow="Gastos"
          value={formatCurrency(totals.gastos)}
          subtitle={`${counts.filter((c) => c.type === 'gastos').length} operaciones`}
          colorClass="text-rose-600 dark:text-rose-400"
          loading={request.status === 'loading' && counts.length === 0}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-500"><path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>}
        />
        <KpiCard
          eyebrow="Ganancia neta"
          value={formatCurrency(netProfit)}
          subtitle={totals.ventas > 0 ? `Margen ${((netProfit / totals.ventas) * 100).toFixed(1)}%` : 'Sin ventas aún'}
          colorClass={netProfit >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-rose-600 dark:text-rose-400'}
          loading={request.status === 'loading' && counts.length === 0}
          icon={<TrendUpIcon />}
        />
      </section>

      {/* Main grid: Form + List */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

        {/* ── Registration form ── */}
        <div className="card p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Nueva operación</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Captura rápida de movimientos comerciales.</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            {/* Type selector */}
            <div>
              <p className="label mb-3">Tipo de operación</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setType(key)}
                    className={`type-chip flex flex-col items-center gap-1 py-3 text-center transition-all duration-150 ${
                      type === key ? cfg.color : cfg.inactive
                    }`}
                    aria-pressed={type === key}
                  >
                    <span className="text-lg leading-none">{cfg.icon}</span>
                    <span className="text-xs font-bold">{cfg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount-input" className="label mb-1.5 block">
                Monto <span className="text-rose-500">*</span>
              </label>
              <input
                id="amount-input"
                ref={valueInputRef}
                className={`input text-lg font-semibold ${valueError ? 'input-error' : ''}`}
                type="number"
                min="0"
                value={value}
                onChange={(e) => { setValue(e.target.value); setValueError(''); }}
                placeholder="0"
                autoComplete="off"
                aria-invalid={Boolean(valueError)}
                aria-describedby={valueError ? 'value-error' : undefined}
              />
              {valueError && (
                <p id="value-error" className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-rose-500">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  {valueError}
                </p>
              )}
              {value && Number(value) > 0 && (
                <p className="mt-1 text-xs text-slate-400">{formatCurrency(Number(value))}</p>
              )}
            </div>

            {/* Description with autocomplete */}
            <div className="relative">
              <label htmlFor="desc-input" className="label mb-1.5 block">
                Descripción <span className="text-rose-500">*</span>
              </label>
              <input
                id="desc-input"
                ref={descInputRef}
                className={`input ${descriptionError ? 'input-error' : ''}`}
                type="text"
                value={description}
                onChange={(e) => { setDescription(e.target.value); setDescriptionError(''); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Detalle del producto o servicio"
                autoComplete="off"
                aria-invalid={Boolean(descriptionError)}
                aria-describedby={descriptionError ? 'description-error' : undefined}
              />
              {descriptionError && (
                <p id="description-error" className="mt-1.5 text-xs font-semibold text-rose-500">{descriptionError}</p>
              )}

              {/* Autocomplete dropdown */}
              {filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900">
                  {filteredSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={() => { setDescription(s); setShowSuggestions(false); }}
                      className="flex w-full items-center px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment method */}
            <div>
              <p className="label mb-2">Método digital <span className="text-xs font-normal text-slate-400">(opcional)</span></p>
              <div className="flex flex-wrap gap-2">
                {paymentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPayment(payment === opt.id ? '' : opt.id)}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all duration-150 ${
                      payment === opt.id ? opt.active : opt.inactive
                    }`}
                    aria-pressed={payment === opt.id}
                  >
                    <span className={`h-2 w-2 rounded-full flex-shrink-0 ${payment === opt.id ? 'bg-white' : opt.dot}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary btn-lg w-full"
              disabled={request.status === 'loading'}
            >
              {request.status === 'loading' ? (
                <><Spinner size="sm" className="text-white" /> Guardando...</>
              ) : (
                <><CheckIcon size={18} /> Registrar operación</>
              )}
            </button>

            {/* Last saved feedback */}
            {lastSaved && (
              <div className="animate-slide-up rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800/50 dark:bg-emerald-900/20">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  ✓ Último guardado: {formatCurrency(lastSaved.value)} · {lastSaved.description}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* ── Pending orders list ── */}
        <div className="card p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Lista de pedidos
                {pendingCount > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                    {pendingCount}
                  </span>
                )}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Productos pendientes de orden</p>
            </div>
            {list.length > 0 && (
              <button className="btn-ghost btn-sm" type="button" onClick={clearList}>
                Vaciar
              </button>
            )}
          </div>

          <form className="flex gap-2" onSubmit={addListItem}>
            <input
              className="input flex-1"
              value={listItem}
              onChange={(e) => setListItem(e.target.value)}
              placeholder="Agregar producto..."
            />
            <button className="btn-primary flex-shrink-0" type="submit" aria-label="Agregar">
              <PlusIcon size={16} />
            </button>
          </form>

          <ul className="mt-4 flex flex-col gap-2" aria-label="Lista de productos">
            {list.length === 0 ? (
              <EmptyState
                icon={<ListIcon />}
                title="Lista vacía"
                description="Agrega productos para hacer pedidos"
              />
            ) : (
              list.map((item, index) => {
                const text = getListItemText(item);
                const done = getListItemDone(item);
                return (
                  <li
                    key={`${text}-${index}`}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-150 ${
                      done
                        ? 'border-slate-100 bg-slate-50/50 opacity-60 dark:border-slate-800 dark:bg-slate-900/30'
                        : 'border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900/50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleListItem(index)}
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all duration-150 ${
                        done
                          ? 'border-brand-500 bg-brand-500 text-white'
                          : 'border-slate-300 hover:border-brand-400 dark:border-slate-600'
                      }`}
                      aria-label={done ? 'Marcar como pendiente' : 'Marcar como completado'}
                    >
                      {done && <CheckIcon size={10} />}
                    </button>
                    <span className={`flex-1 text-sm font-medium ${done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {text}
                    </span>
                    <button
                      type="button"
                      className="flex-shrink-0 text-slate-300 transition-colors hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400"
                      onClick={() => removeListItem(index)}
                      aria-label={`Eliminar ${text}`}
                    >
                      <TrashIcon />
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          {list.length > 0 && (
            <button className="btn-primary mt-4 w-full" type="button" onClick={sendList}>
              <SendIcon size={15} /> Enviar por WhatsApp
            </button>
          )}
        </div>
      </section>

      {/* ── Daily records table ── */}
      <section className="card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Operaciones de hoy
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {counts.length} registro{counts.length !== 1 ? 's' : ''} · {dayKey}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {request.status === 'loading' && <Spinner size="sm" />}
            <select
              className="input w-auto py-2 text-xs"
              value={rowsPerPage}
              onChange={(e) => {
                const v = e.target.value;
                setRowsPerPage(v === 'all' ? 'all' : Number(v));
                setCurrentPage(1);
              }}
            >
              {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n} por página</option>)}
              <option value="all">Todos</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto scrollbar-thin">
          {counts.length === 0 && request.status !== 'loading' ? (
            <EmptyState
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
              title="Sin registros hoy"
              description="Empieza registrando tu primera operación del día"
            />
          ) : (
            <table className="table-modern min-w-[640px]">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Descripción</th>
                  <th>Hora</th>
                  <th><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {displayCounts.map((item) => {
                  const ts = new Date(item.id);
                  const hora = !isNaN(ts) ? ts.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : '--';
                  return (
                    <tr key={item.id}>
                      <td><TransactionBadge type={item.type} /></td>
                      <td className="font-semibold text-slate-900 dark:text-white">{formatCurrency(item.value)}</td>
                      <td className="max-w-[240px] truncate text-slate-500 dark:text-slate-400">{item.description}</td>
                      <td className="text-xs text-slate-400">{hora}</td>
                      <td className="text-right">
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:text-slate-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                          onClick={() => handleDelete(item.id)}
                          aria-label={`Eliminar registro de ${formatCurrency(item.value)}`}
                        >
                          <TrashIcon size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {rowsPerPage !== 'all' && totalPages > 1 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <p className="text-xs text-slate-400">
              Página {currentPage} de {totalPages} · {counts.length} registros
            </p>
            <div className="flex gap-1">
              <button className="btn-ghost btn-sm" type="button" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>‹‹</button>
              <button className="btn-ghost btn-sm" type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>‹ Anterior</button>
              <button className="btn-ghost btn-sm" type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Siguiente ›</button>
              <button className="btn-ghost btn-sm" type="button" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>››</button>
            </div>
          </div>
        )}
      </section>

      <BackupPanel />
    </div>
  );
}

export default HomePage;

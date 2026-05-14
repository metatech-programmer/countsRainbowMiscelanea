export const DB_NAME = 'CountsMiscelanea';
export const DB_VERSION = 1;
export const STORE_NAME = 'counts';

export const TRANSACTION_TYPES = Object.freeze({
  VENTA: 'venta',
  JER: 'jer',
  GASTOS: 'gastos',
});

export const STORAGE_KEYS = Object.freeze({
  LIST: 'list',
  PAPELERIA_LISTA: 'papeleriaMiscelaneaLista',
  DARK_MODE: 'merkatodo_dark_mode',
  AUDIO_VOLUME: 'merkatodo_audio_volume',
  AUDIO_TRACK: 'merkatodo_audio_track',
});

export const COLOMBIA_UTC_OFFSET_MS = 5 * 60 * 60 * 1000;
export const DEFAULT_ROWS_PER_PAGE = 10;
export const WHATSAPP_PHONE = '3229383988';

export const TRANSACTION_LABELS = Object.freeze({
  venta: 'Venta',
  jer: 'JER',
  gastos: 'Gasto',
});

export const TRANSACTION_COLORS = Object.freeze({
  venta: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', dark_bg: 'dark:bg-emerald-900/30', dark_text: 'dark:text-emerald-300' },
  jer: { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500', dark_bg: 'dark:bg-sky-900/30', dark_text: 'dark:text-sky-300' },
  gastos: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', dark_bg: 'dark:bg-rose-900/30', dark_text: 'dark:text-rose-300' },
});

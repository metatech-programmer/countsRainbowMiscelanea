import { COLOMBIA_UTC_OFFSET_MS } from './constants.js';

export function getLocalDate() {
  return new Date(Date.now() - COLOMBIA_UTC_OFFSET_MS)
    .toISOString()
    .split('T')[0];
}

export function safeJsonParse(str, fallback = null) {
  try {
    const result = JSON.parse(str);
    return result ?? fallback;
  } catch {
    return fallback;
  }
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function debounce(fn, delay) {
  let timer;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

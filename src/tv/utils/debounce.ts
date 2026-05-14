// ─── Debounce / Throttle Utilities ────────────────────────────────────────────
// Used across the IPTV platform to rate-limit network calls,
// search queries, and stream validation requests.

/**
 * Classic debounce — waits `delay` ms after the last call before executing.
 * Returns a cancel-able wrapper.
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): T & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced as T & { cancel: () => void };
}

/**
 * Throttle — executes at most once every `interval` ms.
 * First call goes through immediately.
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval: number,
): T & { cancel: () => void } {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const throttled = (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = interval - (now - last);

    if (remaining <= 0) {
      if (timer) { clearTimeout(timer); timer = null; }
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return throttled as T & { cancel: () => void };
}

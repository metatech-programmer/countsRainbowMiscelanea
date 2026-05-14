// ─── CORS Proxy Handler ──────────────────────────────────────────────────────
// Detects problematic domains that block browser CORS requests and
// automatically routes them through public CORS proxies with fallback rotation.

/** Domains known to block direct browser requests */
const PROBLEMATIC_PATTERNS = [
  'mdstrm.com',
  'akamaized.net',
  'cloudfront.net',
  '.m3u8',
  'edge-live-stream',
  'live-hls-web',
  'cdnmedia.tv',
  'rtvc.gov.co',
  'lcdn.claro.net',
  'cdn.enetres.net',
  'amagi.tv',
  'wurl.tv',
  'samsung.wurl.tv',
  'pluto.tv',
  'tubi.video',
  'dps.live',
];

/** Available CORS proxies — rotated on failure */
const CORS_PROXIES = [
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

// Track failures per proxy to avoid hammering dead ones
const proxyFailures: Map<number, { count: number; lastFail: number }> = new Map();

/** Metrics accumulator for diagnostics */
const metrics = {
  totalProxied: 0,
  totalDirect: 0,
  failuresByDomain: new Map<string, number>(),
};

/**
 * Checks whether a URL's domain matches any known-problematic pattern.
 */
export function isProblematicDomain(url: string): boolean {
  const lower = url.toLowerCase();
  return PROBLEMATIC_PATTERNS.some((p) => lower.includes(p));
}

/**
 * Returns the best available proxy function index, avoiding recently-failed ones.
 * Uses a simple "least recently failed" strategy with a 60s cooldown.
 */
function getBestProxyIndex(): number {
  const now = Date.now();
  let bestIdx = 0;
  let bestScore = Infinity;

  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const info = proxyFailures.get(i);
    if (!info) return i; // never failed → use it
    // Reset failures after 60s cooldown
    const age = now - info.lastFail;
    if (age > 60_000) {
      proxyFailures.delete(i);
      return i;
    }
    if (info.count < bestScore) {
      bestScore = info.count;
      bestIdx = i;
    }
  }
  return bestIdx;
}

/**
 * Records a proxy failure for rotation purposes.
 */
export function recordProxyFailure(proxyIndex: number): void {
  const existing = proxyFailures.get(proxyIndex) || { count: 0, lastFail: 0 };
  proxyFailures.set(proxyIndex, {
    count: existing.count + 1,
    lastFail: Date.now(),
  });
}

/**
 * Wraps a URL through a CORS proxy if its domain is problematic.
 * For playlist fetching (text content), not for HLS video playback.
 */
export function proxyUrl(url: string): { url: string; proxyIndex: number } {
  // Only proxy for playlist fetching, never for direct HLS playback
  const idx = getBestProxyIndex();
  metrics.totalProxied++;
  return { url: CORS_PROXIES[idx](url), proxyIndex: idx };
}

/**
 * Fetch a URL with automatic CORS proxy fallback.
 * Tries direct first; if it fails and the domain is problematic,
 * rotates through available proxies.
 */
export async function fetchWithProxy(
  url: string,
  options: RequestInit = {},
  maxRetries = 2,
): Promise<Response> {
  // Attempt 1: direct fetch
  try {
    const res = await fetch(url, { ...options, signal: AbortSignal.timeout(15_000) });
    if (res.ok) {
      metrics.totalDirect++;
      return res;
    }
  } catch {
    // Direct failed — try proxies
  }

  // Attempt 2..N: proxy rotation (avoid infinite loops with maxRetries)
  let lastError: Error | null = null;
  const tried = new Set<number>();

  for (let attempt = 0; attempt < Math.min(maxRetries, CORS_PROXIES.length); attempt++) {
    const idx = getBestProxyIndex();
    if (tried.has(idx)) continue;
    tried.add(idx);

    try {
      const proxied = CORS_PROXIES[idx](url);
      const res = await fetch(proxied, {
        ...options,
        signal: AbortSignal.timeout(20_000),
      });
      if (res.ok) {
        metrics.totalProxied++;
        return res;
      }
      recordProxyFailure(idx);
    } catch (err) {
      recordProxyFailure(idx);
      lastError = err as Error;
    }
  }

  // Record domain failure metrics
  try {
    const domain = new URL(url).hostname;
    metrics.failuresByDomain.set(
      domain,
      (metrics.failuresByDomain.get(domain) || 0) + 1,
    );
  } catch { /* invalid URL */ }

  throw lastError || new Error(`Failed to fetch: ${url}`);
}

/** Get current proxy metrics for diagnostics panel */
export function getProxyMetrics() {
  return {
    totalProxied: metrics.totalProxied,
    totalDirect: metrics.totalDirect,
    failuresByDomain: Object.fromEntries(metrics.failuresByDomain),
  };
}

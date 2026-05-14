// ─── Stream Validator Service ────────────────────────────────────────────────
// Validates HLS/M3U8 stream availability using HEAD requests with CORS proxy
// fallback. Classifies channels as online/unstable/offline and supports
// batch validation with throttling to avoid network saturation.

import type { ChannelStatus } from '../store/tvStore';

// ── Validation result ───────────────────────────────────────────────────────
export interface ValidationResult {
  channelId: string;
  status: ChannelStatus;
  responseTime: number;    // ms, -1 if unreachable
  error?: string;
}

// ── Thresholds ──────────────────────────────────────────────────────────────
const TIMEOUT_MS = 8_000;          // consider offline after 8s
const UNSTABLE_THRESHOLD_MS = 5_000; // > 5s response = unstable
const BATCH_SIZE = 8;              // concurrent validations
const BATCH_DELAY_MS = 300;        // pause between batches

/**
 * Validates a single stream URL via HEAD request.
 * Falls back to GET with range header if HEAD fails.
 */
export async function validateStream(
  channelId: string,
  url: string,
): Promise<ValidationResult> {
  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    // Try HEAD first (lighter)
    let res: Response;
    try {
      res = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors', // opaque response but proves server responds
        signal: controller.signal,
      });
    } catch {
      // HEAD blocked → try GET with range (partial content)
      res = await fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        signal: controller.signal,
        headers: { Range: 'bytes=0-1' },
      });
    }

    clearTimeout(timeout);
    const elapsed = Date.now() - start;

    // mode: 'no-cors' returns opaque responses (type === 'opaque')
    // which means the request went through but we can't read status.
    // If we get here without throwing, the server responded.
    if (res.type === 'opaque' || res.ok || res.status === 206) {
      return {
        channelId,
        status: elapsed > UNSTABLE_THRESHOLD_MS ? 'unstable' : 'online',
        responseTime: elapsed,
      };
    }

    // 4xx/5xx → offline
    return {
      channelId,
      status: 'offline',
      responseTime: elapsed,
      error: `HTTP ${res.status}`,
    };
  } catch (err) {
    const elapsed = Date.now() - start;
    const message = (err as Error).message || 'Unknown error';

    // AbortError = timeout
    if (message.includes('abort') || message.includes('timeout')) {
      return { channelId, status: 'offline', responseTime: -1, error: 'Timeout' };
    }

    // Network errors (CORS, DNS, etc.) — mark as unknown rather than offline
    // because no-cors opaque failures are indistinguishable from real failures
    return { channelId, status: 'unknown', responseTime: elapsed, error: message };
  }
}

/**
 * Validates channels in batches with throttling.
 * @param channels - array of { id, url } to validate
 * @param onResult - callback for each result (for progressive UI updates)
 * @param onBatchComplete - called after each batch completes
 */
export async function validateBatch(
  channels: Array<{ id: string; url: string }>,
  onResult?: (result: ValidationResult) => void,
  onBatchComplete?: (completed: number, total: number) => void,
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  let completed = 0;

  for (let i = 0; i < channels.length; i += BATCH_SIZE) {
    const batch = channels.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map((ch) => validateStream(ch.id, ch.url)),
    );

    for (const result of batchResults) {
      completed++;
      if (result.status === 'fulfilled') {
        results.push(result.value);
        onResult?.(result.value);
      } else {
        const fallback: ValidationResult = {
          channelId: batch[batchResults.indexOf(result)]?.id || 'unknown',
          status: 'unknown',
          responseTime: -1,
          error: 'Validation failed',
        };
        results.push(fallback);
        onResult?.(fallback);
      }
    }

    onBatchComplete?.(completed, channels.length);

    // Throttle between batches to avoid network saturation
    if (i + BATCH_SIZE < channels.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  return results;
}

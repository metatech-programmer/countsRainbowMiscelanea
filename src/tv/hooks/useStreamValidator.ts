// ─── useStreamValidator Hook ─────────────────────────────────────────────────
// Manages periodic stream validation in the background, updating channel
// status in the store without blocking the UI.

import { useEffect, useRef, useCallback, useState } from 'react';
import { validateBatch } from '../services/streamValidator';
import { useTvStore } from '../store/tvStore';
import type { Channel } from '../store/tvStore';

const REVALIDATE_INTERVAL = 5 * 60 * 1000; // Re-check every 5 min
const MAX_VALIDATE_BATCH = 100;              // Don't validate more than 100 at once

export function useStreamValidator() {
  const { channels, batchUpdateStatus } = useTvStore();
  const [validating, setValidating] = useState(false);
  const [validatedCount, setValidatedCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef(false);

  const validate = useCallback(async (channelsToValidate?: Channel[]) => {
    const targets = (channelsToValidate || channels).slice(0, MAX_VALIDATE_BATCH);
    if (targets.length === 0) return;

    setValidating(true);
    setValidatedCount(0);
    abortRef.current = false;

    const updates: Array<{ id: string; status: Channel['status'] }> = [];

    await validateBatch(
      targets.map((c) => ({ id: c.id, url: c.url })),
      (result) => {
        if (abortRef.current) return;
        updates.push({ id: result.channelId, status: result.status });
        setValidatedCount((n) => n + 1);
      },
      (completed) => {
        if (abortRef.current) return;
        // Flush updates in batches of 20 for smoother UI
        if (completed % 20 === 0 || completed === targets.length) {
          batchUpdateStatus(updates.splice(0));
        }
      },
    );

    // Flush remaining
    if (updates.length > 0 && !abortRef.current) {
      batchUpdateStatus(updates);
    }

    setValidating(false);
  }, [channels, batchUpdateStatus]);

  // Auto-validate on mount and periodically
  useEffect(() => {
    if (channels.length === 0) return;

    // Initial delayed validation (give UI time to render)
    const initTimer = setTimeout(() => {
      validate(channels.slice(0, 50)); // validate first 50 quickly
    }, 3000);

    // Periodic revalidation
    intervalRef.current = setInterval(() => {
      // Validate a random sample of channels each cycle
      const sample = [...channels].sort(() => Math.random() - 0.5).slice(0, 30);
      validate(sample);
    }, REVALIDATE_INTERVAL);

    return () => {
      clearTimeout(initTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      abortRef.current = true;
    };
  }, [channels.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const stopValidation = useCallback(() => {
    abortRef.current = true;
    setValidating(false);
  }, []);

  return {
    validating,
    validatedCount,
    validate,
    stopValidation,
    totalToValidate: Math.min(channels.length, MAX_VALIDATE_BATCH),
  };
}

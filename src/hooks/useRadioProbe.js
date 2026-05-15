import { useState, useEffect, useCallback, useRef } from 'react';

// ── CORS proxy fallback (mismo patrón que TV proxyHandler.ts) ─────────────────
const CORS_PROXIES = [
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

/**
 * Probe a single stream URL via Audio element.
 * First tries the direct URL; if it fails within timeoutMs, retries once
 * through each CORS proxy in rotation (same strategy as the TV module).
 */
async function probeStream(url, timeoutMs = 5000) {
  const tryUrl = (src) =>
    new Promise((resolve) => {
      const audio = new Audio();
      let settled = false;

      const done = (ok) => {
        if (settled) return;
        settled = true;
        audio.oncanplay = null;
        audio.onerror = null;
        audio.onabort = null;
        try { audio.pause(); audio.src = ''; } catch { /* ignore */ }
        resolve(ok);
      };

      const timer = setTimeout(() => done(false), timeoutMs);
      audio.oncanplay = () => { clearTimeout(timer); done(true); };
      audio.onerror   = () => { clearTimeout(timer); done(false); };
      audio.onabort   = () => { clearTimeout(timer); done(false); };
      audio.preload = 'metadata';
      audio.src = src;
      audio.load();
    });

  // 1. Try direct
  if (await tryUrl(url)) return { ok: true, resolvedUrl: url };

  // 2. Try each proxy in order (short timeout on proxy attempts)
  for (const proxy of CORS_PROXIES) {
    const proxied = proxy(url);
    if (await tryUrl(proxied)) return { ok: true, resolvedUrl: proxied };
  }

  return { ok: false, resolvedUrl: url };
}

async function probeBatch(stations, signal, onProgress) {
  const BATCH = 6;
  const results = {};   // id → { ok, resolvedUrl }
  for (let i = 0; i < stations.length; i += BATCH) {
    if (signal?.aborted) break;
    const batch = stations.slice(i, i + BATCH);
    const checks = await Promise.all(
      batch.map((s) => probeStream(s.stream).then((r) => [s.id, r]))
    );
    for (const [id, r] of checks) results[id] = r;
    onProgress?.({ ...results });
  }
  return results;
}

export function useRadioProbe(stations, { recheckInterval = 5 * 60 * 1000 } = {}) {
  // connectivity[id]: { ok: bool, resolvedUrl: string } | undefined
  const [connectivity, setConnectivity] = useState({});
  const [probing, setProbing] = useState(false);
  const [probingDone, setProbingDone] = useState(false);

  const abortRef    = useRef(null);
  const stationsRef = useRef(stations);
  stationsRef.current = stations;

  const runProbes = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setProbing(true);
    setProbingDone(false);

    await probeBatch(
      stationsRef.current,
      ctrl.signal,
      (partial) => {
        if (!ctrl.signal.aborted) {
          setConnectivity((prev) => ({ ...prev, ...partial }));
        }
      }
    );

    if (!ctrl.signal.aborted) {
      setProbing(false);
      setProbingDone(true);
    }
  }, []);

  useEffect(() => {
    runProbes();
    const interval = setInterval(runProbes, recheckInterval);
    return () => {
      clearInterval(interval);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [runProbes, recheckInterval]);

  const markOffline = useCallback((id) => {
    setConnectivity((prev) => ({ ...prev, [id]: { ok: false, resolvedUrl: prev[id]?.resolvedUrl } }));
  }, []);

  const markOnline = useCallback((id, resolvedUrl) => {
    setConnectivity((prev) => ({ ...prev, [id]: { ok: true, resolvedUrl: resolvedUrl || prev[id]?.resolvedUrl } }));
  }, []);

  const isOffline = useCallback(
    (station) => connectivity[station.id]?.ok === false,
    [connectivity]
  );

  const isChecked = useCallback(
    (station) => connectivity[station.id] !== undefined,
    [connectivity]
  );

  /**
   * Returns the best URL to use for playback — proxy-resolved if the direct
   * stream failed the probe but a proxy succeeded.
   */
  const getPlayUrl = useCallback(
    (station) => connectivity[station.id]?.resolvedUrl || station.stream,
    [connectivity]
  );

  const onlineCount  = Object.values(connectivity).filter((v) => v?.ok).length;
  const checkedCount = Object.keys(connectivity).length;

  return {
    connectivity,
    probing,
    probingDone,
    isOffline,
    isChecked,
    getPlayUrl,
    markOffline,
    markOnline,
    onlineCount,
    checkedCount,
    recheckAll: runProbes,
  };
}

import { useState, useEffect, useCallback, useRef } from 'react';

const HLS_RE = /\.(m3u8?)(\?|$)/i;

function isHlsUrl(url) {
  return HLS_RE.test(url);
}

/**
 * Probe a single stream URL via Audio element.
 * HLS streams can't be probed with a plain Audio element (no native HLS support
 * in most browsers), so they are assumed online to avoid false negatives.
 * CORS proxies are intentionally NOT used: browsers block opaque responses for
 * media, so proxied audio streams always fail with OpaqueResponseBlocking.
 */
async function probeStream(url, timeoutMs = 6000) {
  // HLS streams need hls.js — native Audio element can't probe them
  if (isHlsUrl(url)) return { ok: true, resolvedUrl: url };

  return new Promise((resolve) => {
    const audio = new Audio();
    let settled = false;

    const done = (ok) => {
      if (settled) return;
      settled = true;
      audio.oncanplay = null;
      audio.onerror = null;
      audio.onabort = null;
      try { audio.pause(); audio.src = ''; } catch { /* ignore */ }
      resolve({ ok, resolvedUrl: url });
    };

    const timer = setTimeout(() => done(false), timeoutMs);
    audio.oncanplay = () => { clearTimeout(timer); done(true); };
    audio.onerror   = () => { clearTimeout(timer); done(false); };
    audio.onabort   = () => { clearTimeout(timer); done(false); };
    audio.preload = 'metadata';
    audio.src = url;
    audio.load();
  });
}

async function probeBatch(stations, signal, onProgress) {
  const BATCH = 6;
  const results = {};
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

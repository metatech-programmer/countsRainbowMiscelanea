import { useState, useEffect, useCallback, useRef } from 'react';

const HLS_RE = /\.(m3u8?)(\?|$)/i;

/**
 * Some stream URLs cannot be reliably probed from a browser:
 *
 * 1. HLS (.m3u8) — needs hls.js; native Audio can't decode it.
 * 2. Redirecting streams (zeno.fm, streamtheworld) — the browser follows the
 *    redirect cross-origin and gets an opaque response, which Audio refuses
 *    (OpaqueResponseBlocking). The token in the final URL also expires in ~60s
 *    so storing it is useless.
 *
 * These are assumed online and played with their original URL; the browser will
 * follow redirects at play-time (works fine in real playback, just not probe).
 */
function isAssumedOnline(url) {
  if (HLS_RE.test(url)) return true;
  try {
    const { hostname } = new URL(url);
    // zeno.fm: both the redirect entry point and pre-resolved CDN URLs
    if (hostname === 'stream.zeno.fm' || hostname.endsWith('.zeno.fm')) return true;
    // streamtheworld: redirect API and direct CDN nodes (NNN.live.streamtheworld.com)
    if (hostname.includes('streamtheworld.com')) return true;
    // mdstrm: redirect/live endpoints
    if (hostname === 'mdstrm.com' || hostname.endsWith('.mdstrm.com')) return true;
  } catch { /* ignore */ }
  return false;
}

/**
 * Probe a stream URL using an <audio> element.
 * Returns { ok: boolean, resolvedUrl: string }.
 */
async function probeStream(url, timeoutMs = 7000) {
  if (isAssumedOnline(url)) return { ok: true, resolvedUrl: url };

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

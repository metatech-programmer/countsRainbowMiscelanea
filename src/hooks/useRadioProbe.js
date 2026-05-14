import { useState, useEffect, useCallback, useRef } from 'react';

async function probeStream(url, timeoutMs = 4000) {
  return new Promise((resolve) => {
    const audio = new Audio();
    let settled = false;

    const done = (ok) => {
      if (settled) return;
      settled = true;
      audio.oncanplay = null;
      audio.onerror   = null;
      audio.onabort   = null;
      try { audio.pause(); audio.src = ''; } catch { /* ignore */ }
      resolve(ok);
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
      batch.map((s) => probeStream(s.stream).then((ok) => [s.id, ok]))
    );
    for (const [id, ok] of checks) results[id] = ok;
    // Emit incremental results so UI updates as batches complete
    onProgress?.({ ...results });
  }
  return results;
}

export function useRadioProbe(stations, { recheckInterval = 5 * 60 * 1000 } = {}) {
  // connectivity[id]: true = online, false = offline, undefined = not yet checked
  const [connectivity, setConnectivity] = useState({});
  // probing: true while any batch is still running
  const [probing, setProbing] = useState(false);
  // probingDone: true once the first full pass has completed
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
          // Merge partial results so cards appear progressively
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
    setConnectivity((prev) => ({ ...prev, [id]: false }));
  }, []);

  const markOnline = useCallback((id) => {
    setConnectivity((prev) => ({ ...prev, [id]: true }));
  }, []);

  // A static station is "offline" only when explicitly tested as false
  const isOffline = useCallback(
    (station) => connectivity[station.id] === false,
    [connectivity]
  );

  // A static station is "checked" when it has a definitive result
  const isChecked = useCallback(
    (station) => connectivity[station.id] !== undefined,
    [connectivity]
  );

  const onlineCount  = Object.values(connectivity).filter(Boolean).length;
  const checkedCount = Object.keys(connectivity).length;

  return {
    connectivity,
    probing,
    probingDone,
    isOffline,
    isChecked,
    markOffline,
    markOnline,
    onlineCount,
    checkedCount,
    recheckAll: runProbes,
  };
}

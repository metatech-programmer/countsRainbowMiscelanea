import { useState, useEffect, useCallback, useRef } from 'react';

// ── TV stream probe strategy ───────────────────────────────────────────────────
// HLS/m3u8 streams are cross-origin — browser CORS blocks both <video> preload
// and fetch mode:'cors'. fetch mode:'no-cors' always "succeeds" with an opaque
// response regardless of whether the server is actually alive.
//
// We mark all channels online at startup and rely on ground-truth feedback from
// actual playback (markOffline / markOnline) to hide channels that genuinely
// fail when the user tries them. The "recheckAll" clears that history so
// previously-failed channels get another chance (e.g. after reconnecting).
export function useTVProbe(channels) {
  const [connectivity, setConnectivity] = useState({});
  const [probingDone, setProbingDone]   = useState(false);

  const channelsRef = useRef(channels);
  channelsRef.current = channels;

  const initOnline = useCallback(() => {
    const all = {};
    for (const ch of channelsRef.current) all[ch.id] = true;
    setConnectivity(all);
    setProbingDone(true);
  }, []);

  useEffect(() => {
    initOnline();
  }, [initOnline]);

  const markOffline = useCallback((id) => {
    setConnectivity((prev) => ({ ...prev, [id]: false }));
  }, []);

  const markOnline = useCallback((id) => {
    setConnectivity((prev) => ({ ...prev, [id]: true }));
  }, []);

  const isOffline = useCallback(
    (channel) => connectivity[channel.id] === false,
    [connectivity]
  );

  const onlineCount  = Object.values(connectivity).filter(Boolean).length;
  const offlineCount = Object.values(connectivity).filter((v) => v === false).length;

  // recheckAll resets all to online, giving every channel a fresh chance
  const recheckAll = useCallback(() => {
    initOnline();
  }, [initOnline]);

  return {
    connectivity,
    probing: false,
    probingDone,
    isOffline,
    isChecked: () => true,
    markOffline,
    markOnline,
    onlineCount,
    offlineCount,
    checkedCount: Object.keys(connectivity).length,
    recheckAll,
  };
}

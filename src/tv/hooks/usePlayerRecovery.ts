// ─── usePlayerRecovery Hook ──────────────────────────────────────────────────
// Enterprise-level HLS player lifecycle management with:
// - Automatic reconnection on network/media errors
// - Exponential backoff retry
// - Memory cleanup on unmount
// - Safari native HLS support
// - Black screen detection
// - Diagnostic logging

import { useEffect, useRef, useCallback } from 'react';
import Hls from 'hls.js';
import { useTvStore } from '../store/tvStore';
import type { Channel } from '../store/tvStore';

// ── Constants ───────────────────────────────────────────────────────────────
const MAX_RETRIES = 5;
const BASE_RETRY_DELAY = 2000; // 2s base, exponential backoff
const BLACK_SCREEN_CHECK_INTERVAL = 10_000; // check every 10s

// ── Advanced HLS config ─────────────────────────────────────────────────────
const HLS_CONFIG: Partial<Hls['config']> = {
  enableWorker: true,
  lowLatencyMode: true,
  backBufferLength: 90,
  maxBufferLength: 120,
  liveSyncDuration: 5,
  liveMaxLatencyDuration: 10,
  maxMaxBufferLength: 600,
  startFragPrefetch: true,
};

export function usePlayerRecovery(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const {
    currentChannel, playbackStatus,
    setPlaybackStatus, setPlaybackError,
    incrementRetry, resetRetry, retryCount,
    recordLoadTime, recordError, recordWatch,
    updateChannelStatus,
  } = useTvStore();

  const hlsRef = useRef<Hls | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blackScreenRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loadStartRef = useRef<number>(0);
  const mountedRef = useRef(true);

  // ── Cleanup ──
  const cleanup = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (blackScreenRef.current) {
      clearInterval(blackScreenRef.current);
      blackScreenRef.current = null;
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
  }, [videoRef]);

  // ── Black screen detector ──
  const startBlackScreenDetection = useCallback(() => {
    if (blackScreenRef.current) clearInterval(blackScreenRef.current);
    blackScreenRef.current = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.paused || !mountedRef.current) return;

      // Check if video is stuck (currentTime not advancing)
      const lastTime = (video as any).__lastCheckedTime || 0;
      if (video.currentTime === lastTime && video.currentTime > 0) {
        console.warn('[SmartPlayer] Black screen detected — attempting recovery');
        if (hlsRef.current) {
          hlsRef.current.startLoad();
        } else {
          video.load();
          video.play().catch(() => {});
        }
      }
      (video as any).__lastCheckedTime = video.currentTime;
    }, BLACK_SCREEN_CHECK_INTERVAL);
  }, [videoRef]);

  // ── Retry with exponential backoff ──
  const scheduleRetry = useCallback((channel: Channel) => {
    const currentRetry = useTvStore.getState().retryCount;
    if (currentRetry >= MAX_RETRIES) {
      setPlaybackError(`No se pudo conectar después de ${MAX_RETRIES} intentos.`);
      updateChannelStatus(channel.id, 'offline');
      return;
    }

    incrementRetry();
    const delay = BASE_RETRY_DELAY * Math.pow(2, currentRetry);
    console.log(`[SmartPlayer] Retry ${currentRetry + 1}/${MAX_RETRIES} in ${delay}ms`);

    setPlaybackStatus('loading');
    retryTimerRef.current = setTimeout(() => {
      if (mountedRef.current) {
        loadChannel(channel);
      }
    }, delay);
  }, [incrementRetry, setPlaybackError, setPlaybackStatus, updateChannelStatus]);

  // ── Load channel ──
  const loadChannel = useCallback((channel: Channel) => {
    const video = videoRef.current;
    if (!video || !mountedRef.current) return;

    cleanup();
    loadStartRef.current = Date.now();
    setPlaybackStatus('loading');

    const onPlaying = () => {
      if (!mountedRef.current) return;
      const loadTime = Date.now() - loadStartRef.current;
      setPlaybackStatus('playing');
      resetRetry();
      recordLoadTime(loadTime);
      recordWatch(channel.id);
      updateChannelStatus(channel.id, 'online');
      startBlackScreenDetection();
    };

    const onError = (errorMsg: string) => {
      if (!mountedRef.current) return;
      console.warn(`[SmartPlayer] Error: ${errorMsg}`);
      try {
        const domain = new URL(channel.url).hostname;
        recordError(domain);
      } catch { /* invalid URL */ }
      scheduleRetry(channel);
    };

    const onWaiting = () => {
      if (!mountedRef.current) return;
      setPlaybackStatus('buffering');
    };

    video.onplaying = onPlaying;
    video.onwaiting = onWaiting;
    video.onerror = () => onError('Video element error');

    // HLS stream via hls.js
    const isHls = /\.m3u8($|\?)/i.test(channel.url);

    if (isHls && Hls.isSupported()) {
      const hls = new Hls(HLS_CONFIG);
      hlsRef.current = hls;

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!data.fatal) return;

        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.warn('[SmartPlayer] Network error — attempting startLoad()');
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.warn('[SmartPlayer] Media error — attempting recoverMediaError()');
            hls.recoverMediaError();
            break;
          default:
            // Fatal unknown error — destroy and retry
            console.error('[SmartPlayer] Fatal error — destroying instance');
            cleanup();
            onError(`Fatal: ${data.details}`);
        }
      });

      hls.loadSource(channel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => onError('Autoplay blocked'));
      });
    } else if (isHls && video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = channel.url;
      video.play().catch(() => onError('Safari autoplay blocked'));
    } else {
      // Direct URL (MP4, etc.)
      video.src = channel.url;
      video.play().catch(() => onError('Playback failed'));
    }
  }, [videoRef, cleanup, setPlaybackStatus, resetRetry, recordLoadTime,
      recordWatch, updateChannelStatus, startBlackScreenDetection,
      scheduleRetry, recordError]);

  // ── React to channel changes ──
  useEffect(() => {
    if (currentChannel) {
      resetRetry();
      loadChannel(currentChannel);
    } else {
      cleanup();
      setPlaybackStatus('idle');
    }
  }, [currentChannel?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cleanup on unmount ──
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // ── Stop playback ──
  const stop = useCallback(() => {
    cleanup();
    useTvStore.getState().setCurrentChannel(null);
    setPlaybackStatus('idle');
    resetRetry();
  }, [cleanup, setPlaybackStatus, resetRetry]);

  // ── Play next channel ──
  const playNext = useCallback(() => {
    const state = useTvStore.getState();
    if (!state.currentChannel) return;
    const allChannels = state.channels.filter((c) => c.status !== 'offline');
    const idx = allChannels.findIndex((c) => c.id === state.currentChannel?.id);
    const next = allChannels[(idx + 1) % allChannels.length];
    if (next) {
      state.setCurrentChannel(next);
      state.addRecent(next);
    }
  }, []);

  // ── Play previous channel ──
  const playPrev = useCallback(() => {
    const state = useTvStore.getState();
    if (!state.currentChannel) return;
    const allChannels = state.channels.filter((c) => c.status !== 'offline');
    const idx = allChannels.findIndex((c) => c.id === state.currentChannel?.id);
    const prev = allChannels[(idx - 1 + allChannels.length) % allChannels.length];
    if (prev) {
      state.setCurrentChannel(prev);
      state.addRecent(prev);
    }
  }, []);

  return { loadChannel, stop, playNext, playPrev, cleanup };
}

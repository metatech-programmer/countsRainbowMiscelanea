import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SmartPlayer from '../tv/components/SmartPlayer';
import { useTvStore } from '../tv/store/tvStore';

const MediaContext = createContext(null);

// ── Constants ─────────────────────────────────────────────────────────────────
const AUDIO_TIMEOUT_MS    = 12_000; // abort load if no canplay within 12s
const MAX_AUTO_RETRIES    = 2;      // auto-retry count on transient errors
const RETRY_DELAY_MS      = 2_000;

// ── Mini player icons ─────────────────────────────────────────────────────────
function PlayIcon({ stop = false }) {
  return stop ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function MediaProvider({ children }) {
  const location    = useLocation();
  const audioRef    = useRef(null);
  const retryRef    = useRef(null);   // retry timeout handle
  const retriesRef  = useRef(0);      // auto-retry counter
  const timeoutRef  = useRef(null);   // load-timeout handle

  const [tvSlot, setTvSlot]           = useState(null);
  const [tvFrameStyle, setTvFrameStyle] = useState(null);

  const currentTvChannel = useTvStore((s) => s.currentChannel);

  const [audio, setAudio] = useState({
    current: null,
    status: 'idle',    // 'idle' | 'loading' | 'playing' | 'error'
    error:  '',
    volume: parseFloat(localStorage.getItem('audio_volume') || '0.8'),
    muted:  false,
  });

  // Keep a ref to audio state to access inside closures without stale captures
  const audioStateRef = useRef(audio);
  audioStateRef.current = audio;

  // ── Audio element helpers ──────────────────────────────────────────────────
  const ensureAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    return audioRef.current;
  }, []);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    if (retryRef.current)   { clearTimeout(retryRef.current);   retryRef.current   = null; }
  }, []);

  // ── Stop audio ────────────────────────────────────────────────────────────
  const stopAudio = useCallback(() => {
    clearTimers();
    retriesRef.current = 0;
    const player = ensureAudio();
    player.onplaying = null;
    player.onerror   = null;
    player.pause();
    player.src = '';
    setAudio((prev) => ({ ...prev, status: 'idle', current: null, error: '' }));
  }, [clearTimers, ensureAudio]);

  // ── Core play logic (also used by auto-retry) ─────────────────────────────
  const _doPlay = useCallback((station) => {
    clearTimers();
    const player = ensureAudio();
    player.pause();
    player.onplaying = null;
    player.onerror   = null;
    player.src = '';

    setAudio((prev) => ({ ...prev, current: station, status: 'loading', error: '' }));

    const { volume, muted } = audioStateRef.current;
    player.volume = muted ? 0 : volume;
    player.src = station.stream;
    player.load();

    const onPlaying = () => {
      clearTimers();
      retriesRef.current = 0;
      setAudio((prev) => ({ ...prev, status: 'playing', error: '' }));
    };

    const onFail = (message) => {
      clearTimers();
      player.onplaying = null;
      player.onerror   = null;

      // Auto-retry on transient failures
      if (retriesRef.current < MAX_AUTO_RETRIES) {
        retriesRef.current += 1;
        setAudio((prev) => ({ ...prev, status: 'loading', error: '' }));
        retryRef.current = setTimeout(() => _doPlay(station), RETRY_DELAY_MS);
      } else {
        retriesRef.current = 0;
        setAudio((prev) => ({
          ...prev,
          status: 'error',
          error: message || 'No se pudo conectar. La emisora puede estar fuera de línea.',
        }));
      }
    };

    // Hard timeout — some streams stall indefinitely without erroring
    timeoutRef.current = setTimeout(
      () => onFail('Sin respuesta del servidor. La emisora puede estar fuera de línea.'),
      AUDIO_TIMEOUT_MS
    );

    player.onplaying = onPlaying;
    player.onerror   = () => onFail('No se pudo conectar. La emisora puede estar fuera de línea.');
    player.play().catch(() => onFail('No se pudo iniciar la reproducción.'));
  }, [clearTimers, ensureAudio]);

  // ── Public playAudio ──────────────────────────────────────────────────────
  const playAudio = useCallback((station) => {
    // 🛑 Automatically stop TV when Audio plays
    useTvStore.getState().setCurrentChannel(null); 
    retriesRef.current = 0;
    _doPlay(station);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_doPlay]);

  // ── Volume / mute ─────────────────────────────────────────────────────────
  const setAudioVolume = useCallback((volume) => {
    localStorage.setItem('audio_volume', String(volume));
    setAudio((prev) => ({ ...prev, volume, muted: false }));
    const player = ensureAudio();
    player.volume = volume;
  }, [ensureAudio]);

  const setAudioMuted = useCallback((muted) => {
    setAudio((prev) => ({ ...prev, muted }));
    const player = ensureAudio();
    player.volume = muted ? 0 : audioStateRef.current.volume;
  }, [ensureAudio]);

  // Keep volume in sync when state changes outside of setAudioVolume
  useEffect(() => {
    const player = ensureAudio();
    player.volume = audio.muted ? 0 : audio.volume;
  }, [audio.muted, audio.volume, ensureAudio]);

  // ── TV frame positioning ──────────────────────────────────────────────────
  useLayoutEffect(() => {
    const updateFrame = () => {
      if (tvSlot && location.pathname === '/tv') {
        const rect = tvSlot.getBoundingClientRect();
        setTvFrameStyle({
          position: 'fixed',
          left: `${rect.left}px`, top: `${rect.top}px`,
          width: `${rect.width}px`, height: `${rect.height}px`,
          zIndex: 20,
        });
      } else {
        setTvFrameStyle({
          position: 'fixed',
          right: '1rem', bottom: '1rem',
          width: 'min(360px, calc(100vw - 2rem))',
          height: '210px',
          zIndex: 50,
        });
      }
    };
    updateFrame();
    window.addEventListener('resize', updateFrame);
    window.addEventListener('scroll', updateFrame, true);
    return () => {
      window.removeEventListener('resize', updateFrame);
      window.removeEventListener('scroll', updateFrame, true);
    };
  }, [location.pathname, tvSlot]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => () => clearTimers(), [clearTimers]);

  // ── Context value ─────────────────────────────────────────────────────────
  const value = useMemo(() => ({
    audio,
    playAudio, stopAudio,
    setAudioVolume, setAudioMuted,
    setTvSlot,
  }), [audio, playAudio, setAudioMuted, setAudioVolume, stopAudio]);

  const showAudioMini = audio.current && location.pathname !== '/audio';
  const showTvMini    = currentTvChannel && location.pathname !== '/tv' && !tvSlot;

  return (
    <MediaContext.Provider value={value}>
      {children}

      {/* ── TV frame ── */}
      {(tvSlot || showTvMini || currentTvChannel) && (
        <div
          className={`${tvSlot && location.pathname === '/tv' ? '' : 'fixed shadow-card-hover'} transition-all duration-300 ease-out z-[90]`}
          style={{ ...tvFrameStyle, opacity: currentTvChannel ? 1 : 0, pointerEvents: currentTvChannel ? 'auto' : 'none' }}
        >
          <SmartPlayer isFloating={location.pathname !== '/tv'} />
        </div>
      )}

      {/* ── Audio mini player ── */}
      {showAudioMini && (
        <div className="fixed bottom-4 left-4 z-50 w-[min(340px,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-3 shadow-card-hover dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl"
              style={{
                background: `${audio.current.color}18`,
                border: `1px solid ${audio.current.color}33`,
              }}
            >
              {audio.current.flag}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                {audio.current.name}
              </p>
              <p className="truncate text-xs text-slate-500">
                {audio.status === 'playing' ? 'Radio en vivo'
                  : audio.status === 'loading' ? 'Conectando…'
                  : audio.status === 'error' ? 'Error de conexión'
                  : audio.status}
              </p>
            </div>
            <button
              type="button"
              onClick={audio.status === 'playing' ? stopAudio : () => playAudio(audio.current)}
              className="btn-icon btn-secondary flex-shrink-0"
              aria-label={audio.status === 'playing' ? 'Detener radio' : 'Reanudar radio'}
            >
              <PlayIcon stop={audio.status === 'playing'} />
            </button>
          </div>
        </div>
      )}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error('useMedia debe usarse dentro de MediaProvider');
  return ctx;
}

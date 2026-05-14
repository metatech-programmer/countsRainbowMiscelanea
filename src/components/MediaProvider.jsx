import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Hls from 'hls.js';

const MediaContext = createContext(null);

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

export function MediaProvider({ children }) {
  const location = useLocation();
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [tvSlot, setTvSlot] = useState(null);
  const [tvFrameStyle, setTvFrameStyle] = useState(null);
  const [audio, setAudio] = useState({
    current: null,
    status: 'idle',
    error: '',
    volume: parseFloat(localStorage.getItem('audio_volume') || '0.8'),
    muted: false,
  });
  const [tv, setTv] = useState({
    current: null,
    status: 'idle',
    error: '',
  });

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    return audioRef.current;
  }, []);

  const stopTv = useCallback(() => {
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
    setTv((prev) => ({ ...prev, status: 'idle', current: null, error: '' }));
  }, []);

  const stopAudio = useCallback(() => {
    const player = ensureAudio();
    player.pause();
    player.src = '';
    setAudio((prev) => ({ ...prev, status: 'idle', current: null, error: '' }));
  }, [ensureAudio]);

  const playAudio = useCallback((station) => {
    stopTv();
    const player = ensureAudio();
    player.pause();
    player.src = '';
    setAudio((prev) => ({ ...prev, current: station, status: 'loading', error: '' }));
    player.src = station.stream;
    player.volume = audio.muted ? 0 : audio.volume;
    player.load();

    const onPlay = () => setAudio((prev) => ({ ...prev, status: 'playing', error: '' }));
    const onError = () => setAudio((prev) => ({
      ...prev,
      status: 'error',
      error: 'No se pudo conectar. La emisora puede estar fuera de línea.',
    }));

    player.onplaying = onPlay;
    player.onerror = onError;
    player.play().catch(onError);
  }, [audio.muted, audio.volume, ensureAudio, stopTv]);

  const setAudioVolume = useCallback((volume) => {
    localStorage.setItem('audio_volume', String(volume));
    setAudio((prev) => ({ ...prev, volume, muted: false }));
    const player = ensureAudio();
    player.volume = volume;
  }, [ensureAudio]);

  const setAudioMuted = useCallback((muted) => {
    setAudio((prev) => ({ ...prev, muted }));
    const player = ensureAudio();
    player.volume = muted ? 0 : audio.volume;
  }, [audio.volume, ensureAudio]);

  const playTv = useCallback((channel) => {
    stopAudio();
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    video.pause();
    video.removeAttribute('src');
    video.load();

    setTv({ current: channel, status: 'loading', error: '' });

    const onPlaying = () => setTv((prev) => ({ ...prev, status: 'playing', error: '' }));
    const onError = () => setTv((prev) => ({
      ...prev,
      status: 'error',
      error: 'No se pudo reproducir este stream. Puede estar caído, geobloqueado o bloqueado por CORS.',
    }));

    video.onplaying = onPlaying;
    video.onerror = onError;

    if (/\.m3u8($|\?)/i.test(channel.url) && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsRef.current = hls;
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) onError();
      });
      hls.loadSource(channel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(onError));
    } else {
      video.src = channel.url;
      video.play().catch(onError);
    }
  }, [stopAudio]);

  useEffect(() => {
    const player = ensureAudio();
    player.volume = audio.muted ? 0 : audio.volume;
  }, [audio.muted, audio.volume, ensureAudio]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || location.pathname === '/tv' || tv.status !== 'playing') return;
    if (document.pictureInPictureElement || !document.pictureInPictureEnabled || !video.requestPictureInPicture) return;
    video.requestPictureInPicture().catch(() => {});
  }, [location.pathname, tv.status]);

  useLayoutEffect(() => {
    function updateFrame() {
      if (tvSlot && location.pathname === '/tv') {
        const rect = tvSlot.getBoundingClientRect();
        setTvFrameStyle({
          position: 'fixed',
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          zIndex: 20,
        });
        return;
      }
      setTvFrameStyle({
        position: 'fixed',
        right: '1rem',
        bottom: '1rem',
        width: 'min(360px, calc(100vw - 2rem))',
        zIndex: 50,
      });
    }

    updateFrame();
    window.addEventListener('resize', updateFrame);
    window.addEventListener('scroll', updateFrame, true);
    return () => {
      window.removeEventListener('resize', updateFrame);
      window.removeEventListener('scroll', updateFrame, true);
    };
  }, [location.pathname, tvSlot]);

  const value = useMemo(() => ({
    audio,
    tv,
    playAudio,
    stopAudio,
    setAudioVolume,
    setAudioMuted,
    playTv,
    stopTv,
    setTvSlot,
  }), [audio, playAudio, playTv, setAudioMuted, setAudioVolume, stopAudio, stopTv, tv]);

  const showAudioMini = audio.current && location.pathname !== '/audio';
  const showTvMini = tv.current && location.pathname !== '/tv' && !tvSlot;

  return (
    <MediaContext.Provider value={value}>
      {children}

      {(tvSlot || showTvMini || tv.current) && (
        <div
          className={`overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-card-hover dark:border-slate-800 ${
            tvSlot && location.pathname === '/tv' ? '' : 'fixed'
          }`}
          style={{
            ...tvFrameStyle,
            opacity: tv.current ? 1 : 0,
            pointerEvents: tv.current ? 'auto' : 'none',
          }}
        >
          <div className={tvSlot && location.pathname === '/tv' ? 'h-full w-full' : 'aspect-video'}>
            <video ref={videoRef} className="h-full w-full bg-black" controls playsInline />
          </div>
          {showTvMini && (
            <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 dark:bg-slate-900">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">{tv.current?.name}</p>
                <p className="truncate text-[10px] text-slate-500">{tv.status === 'playing' ? 'Reproduciendo TV' : tv.status}</p>
              </div>
              <button type="button" onClick={stopTv} className="btn-ghost btn-sm">
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}

      {showAudioMini && (
        <div className="fixed bottom-4 left-4 z-50 w-[min(340px,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-3 shadow-card-hover dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl"
              style={{ background: `${audio.current.color}18`, border: `1px solid ${audio.current.color}33` }}
            >
              {audio.current.flag}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{audio.current.name}</p>
              <p className="truncate text-xs text-slate-500">{audio.status === 'playing' ? 'Radio en vivo' : audio.status}</p>
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

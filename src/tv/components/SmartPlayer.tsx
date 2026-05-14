// ─── SmartPlayer (Enterprise-level) ──────────────────────────────────────────
// Video player area — dark background is standard for media players,
// but info bar adapts to light/dark. All text truncated properly.

import { useRef, useEffect, useCallback, memo } from 'react';
import { usePlayerRecovery } from '../hooks/usePlayerRecovery';
import { useTvStore } from '../store/tvStore';
import { getCurrentProgram, getNextProgram, formatTime } from '../services/epgService';
import StreamStatusBadge from './StreamStatusBadge';
import { useMedia } from '../../components/MediaProvider';

interface Props {
  isFloating?: boolean;
}

const SmartPlayer = memo(function SmartPlayer({ isFloating }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { stop, playNext, playPrev } = usePlayerRecovery(videoRef);

  const currentChannel = useTvStore((s) => s.currentChannel);
  const playbackStatus = useTvStore((s) => s.playbackStatus);
  const playbackError = useTvStore((s) => s.playbackError);
  const retryCount = useTvStore((s) => s.retryCount);
  const volume = useTvStore((s) => s.volume);
  const isMuted = useTvStore((s) => s.isMuted);
  const setVolume = useTvStore((s) => s.setVolume);
  const setMuted = useTvStore((s) => s.setMuted);
  const isFullscreen = useTvStore((s) => s.isFullscreen);
  const setFullscreen = useTvStore((s) => s.setFullscreen);

  const isPlaying = playbackStatus === 'playing';
  const isLoading = playbackStatus === 'loading';
  const isBuffering = playbackStatus === 'buffering';
  const isError = playbackStatus === 'error';

  const { stopAudio } = useMedia();

  // ── Stop audio when TV plays ──
  useEffect(() => {
    if (currentChannel) {
      stopAudio();
    }
  }, [currentChannel, stopAudio]);

  // ── Volume sync ──
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // ── Fullscreen ──
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullscreen(false);
    } else {
      containerRef.current.requestFullscreen();
      setFullscreen(true);
    }
  }, [setFullscreen]);

  // ── PiP ──
  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch { /* PiP not supported */ }
  }, []);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case ' ': case 'k':
          e.preventDefault();
          if (videoRef.current) { videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause(); }
          break;
        case 'f': e.preventDefault(); toggleFullscreen(); break;
        case 'p': e.preventDefault(); togglePiP(); break;
        case 'm': e.preventDefault(); setMuted(!isMuted); break;
        case 'ArrowUp': e.preventDefault(); setVolume(Math.min(1, volume + 0.1)); break;
        case 'ArrowDown': e.preventDefault(); setVolume(Math.max(0, volume - 0.1)); break;
        case 'ArrowRight': case 'n': e.preventDefault(); playNext(); break;
        case 'ArrowLeft': e.preventDefault(); playPrev(); break;
        case 'Escape':
          if (isFullscreen) { document.exitFullscreen(); setFullscreen(false); }
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isMuted, volume, isFullscreen, toggleFullscreen, togglePiP, setMuted, setVolume, playNext, playPrev, setFullscreen]);

  const epg = currentChannel ? getCurrentProgram(currentChannel.group, currentChannel.name) : null;
  const nextProg = currentChannel ? getNextProgram(currentChannel.group, currentChannel.name) : null;

  return (
    <div ref={containerRef} className="h-full w-full flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-card dark:border-slate-800">
      {/* ── Video area (always dark — standard for media players) ── */}
      <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900">
        <video ref={videoRef} className="h-full w-full bg-black" playsInline autoPlay controls={false} />

        {/* Empty state */}
        {!currentChannel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-slate-100 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-200 bg-brand-50 text-brand-600 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white/30">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="7" width="18" height="13" rx="2" /><path d="m8 3 4 4 4-4" />
              </svg>
            </div>
            <p className="font-display text-lg font-bold text-slate-900 dark:text-white/60">Selecciona un canal</p>
            <p className="mt-1.5 max-w-xs text-center text-xs text-slate-500 dark:text-white/30">Elige un canal de la lista para comenzar</p>
            <div className="mt-3 flex gap-2 text-[10px] text-slate-400 dark:text-white/20">
              <kbd className="rounded border border-slate-200 px-1.5 py-0.5 dark:border-white/10">←→</kbd> Navegar
              <kbd className="rounded border border-slate-200 px-1.5 py-0.5 dark:border-white/10">F</kbd> Pantalla completa
              <kbd className="rounded border border-slate-200 px-1.5 py-0.5 dark:border-white/10">M</kbd> Silenciar
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {(isLoading || isBuffering) && currentChannel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-brand-400" />
            <p className="mt-3 text-sm font-medium text-white/70">
              {isBuffering ? 'Cargando buffer…' : 'Conectando…'}
            </p>
            {retryCount > 0 && (
              <p className="mt-1 text-xs text-amber-400/80">Reintento {retryCount}/5</p>
            )}
          </div>
        )}

        {/* Error fallback */}
        {isError && currentChannel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-red-950/90 to-slate-950/95 backdrop-blur-sm">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <p className="font-display text-base font-bold text-white">Error de reproducción</p>
            <p className="mt-1 max-w-[220px] truncate text-center text-xs text-white/50">{playbackError}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => { if (currentChannel) useTvStore.getState().setCurrentChannel({ ...currentChannel }); }} className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20">Reintentar</button>
              <button onClick={playNext} className="rounded-xl bg-brand-600/30 px-3 py-1.5 text-xs font-semibold text-brand-200 hover:bg-brand-600/40">Siguiente →</button>
            </div>
          </div>
        )}

        {/* Top overlay — channel info */}
        {currentChannel && isPlaying && (
          <div className="absolute inset-x-0 top-0 flex items-start justify-between overflow-hidden bg-gradient-to-b from-black/60 to-transparent p-3">
            <div className="flex min-w-0 items-center gap-2 overflow-hidden">
              {currentChannel.logo ? (
                <img src={currentChannel.logo} alt="" className="h-5 w-5 flex-shrink-0 rounded object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <span className="flex-shrink-0 text-sm">{currentChannel.flag}</span>
              )}
              <div className="min-w-0 overflow-hidden">
                <p className="truncate text-xs font-bold text-white">{currentChannel.name}</p>
                <p className="truncate text-[10px] text-white/50">{currentChannel.group} · {currentChannel.country}</p>
              </div>
            </div>
            <StreamStatusBadge status="online" />
          </div>
        )}

        {/* Floating Mini Header */}
        {isFloating && currentChannel && (
          <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{currentChannel.name}</p>
              <p className="truncate text-[9px] text-white/50">{playbackStatus === 'playing' ? 'En vivo' : playbackStatus}</p>
            </div>
            <button onClick={stop} className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        )}

        {/* Bottom controls */}
        {currentChannel && !isFloating && (
          <div className="absolute inset-x-0 bottom-0 overflow-hidden bg-gradient-to-t from-black/80 to-transparent p-3">
            {/* EPG bar */}
            {epg && isPlaying && (
              <div className="mb-2 overflow-hidden">
                <div className="mb-1 flex items-center justify-between gap-2 text-[10px]">
                  <span className="min-w-0 truncate font-semibold text-white/70">Ahora: {epg.title}</span>
                  <span className="flex-shrink-0 text-white/40">{formatTime(epg.startTime)} – {formatTime(epg.endTime)}</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-500 transition-all duration-1000" style={{ width: `${epg.progress * 100}%` }} />
                </div>
                {nextProg && <p className="mt-1 truncate text-[9px] text-white/30">Siguiente: {nextProg.title}</p>}
              </div>
            )}

            {/* Controls row */}
            <div className="flex items-center gap-1.5 overflow-hidden">
              <button onClick={playPrev} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white" title="Canal anterior">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
              </button>
              <button onClick={stop} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white" title="Detener">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
              </button>
              <button onClick={playNext} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white" title="Siguiente canal">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zm-3.5 6L4 6v12z" transform="rotate(180 12 12)"/></svg>
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => setMuted(!isMuted)} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white" title={isMuted ? 'Activar sonido' : 'Silenciar'}>
                  {isMuted ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  )}
                </button>
                <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
                  onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                  className="hidden h-1 w-14 cursor-pointer appearance-none rounded-full bg-white/20 accent-brand-400 sm:block [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-400"
                />
              </div>
              <div className="flex-1" />
              <button onClick={togglePiP} className="hidden rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white sm:block" title="PiP">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><rect x="11" y="10" width="9" height="6" rx="1" fill="currentColor" opacity="0.3"/></svg>
              </button>
              <button onClick={toggleFullscreen} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white" title="Pantalla completa">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isFullscreen ? (<><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></>) : (<><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></>)}
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Info bar below player (light/dark aware) ── */}
      {currentChannel && !isFloating && (
        <div className="border-t border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {currentChannel.logo ? (
              <img src={currentChannel.logo} alt="" className="h-7 w-7 flex-shrink-0 rounded-lg bg-slate-50 object-contain p-0.5 dark:bg-slate-800" onError={(e) => { (e.target as HTMLImageElement).className = 'hidden'; }} />
            ) : (
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm dark:bg-slate-800">{currentChannel.flag}</span>
            )}
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{currentChannel.name}</p>
              <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">{currentChannel.group} · {currentChannel.country} · {currentChannel.language}</p>
            </div>
            <button onClick={stop} className="btn-ghost btn-sm flex-shrink-0">Detener</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default SmartPlayer;

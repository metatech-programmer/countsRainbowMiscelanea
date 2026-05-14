import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useMedia } from '../components/MediaProvider.jsx';
import { TV_CHANNELS, TV_REGIONS } from '../data/tvChannels.js';
import { useTVProbe } from '../hooks/useTVProbe.js';
import ChannelCard, { ChannelCardSkeleton } from '../components/tv/ChannelCard.jsx';
import TVFilters from '../components/tv/TVFilters.jsx';

// ── CSS keyframes injected once ───────────────────────────────────────────────
const KF_ID = 'tv-kf';
function injectKeyframes() {
  if (document.getElementById(KF_ID)) return;
  const s = document.createElement('style');
  s.id = KF_ID;
  s.textContent = `
    ${[0,1,2,3].map((i) => `@keyframes tvBounce${i}{from{transform:scaleY(.2)}to{transform:scaleY(1)}}`).join('')}
    @keyframes tvSpin{to{transform:rotate(360deg)}}
    @keyframes tvPulse{0%,100%{opacity:1}50%{opacity:.4}}
  `;
  document.head.appendChild(s);
}

// ── Persistence ───────────────────────────────────────────────────────────────
const RECENTS_KEY = 'tv_recents_v2';
const FAVS_KEY    = 'tv_favs_v2';
const loadRecents = () => { try { return JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]'); } catch { return []; } };
const loadFavs    = () => { try { return new Set(JSON.parse(localStorage.getItem(FAVS_KEY)    || '[]')); } catch { return new Set(); } };
const saveRecents = (l) => localStorage.setItem(RECENTS_KEY, JSON.stringify(l));
const saveFavs    = (s) => localStorage.setItem(FAVS_KEY,    JSON.stringify([...s]));

const SKELETON_COUNT = 12;

// ── Loading banner ────────────────────────────────────────────────────────────
function ProbeLoadingBanner({ checkedCount, totalCount }) {
  const pct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-brand-200/60 bg-brand-50/80 px-4 py-3 dark:border-brand-800/40 dark:bg-brand-900/20">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-block text-brand-500" style={{ animation: 'tvSpin 1s linear infinite' }}>⟳</span>
          <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">
            Verificando canales disponibles…
          </span>
        </div>
        <span className="text-xs font-bold tabular-nums text-brand-600 dark:text-brand-400">
          {checkedCount}/{totalCount}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-100 dark:bg-brand-900/40">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ hasFilters }) {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div className="mb-4 text-5xl">📺</div>
      <p className="font-semibold text-slate-600 dark:text-slate-400">
        {hasFilters ? 'Sin resultados con estos filtros' : 'No se encontraron canales disponibles'}
      </p>
      <p className="mt-1 text-sm text-slate-400 dark:text-slate-600">
        {hasFilters
          ? 'Prueba cambiando región, categoría o buscando por nombre.'
          : 'Todos los canales de esta sección están fuera de línea ahora mismo.'}
      </p>
    </div>
  );
}

// ── TV Player sidebar ─────────────────────────────────────────────────────────
function TVPlayer({ current, status, error, onStop }) {
  const tvStageRef = useRef(null);
  const { setTvSlot } = useMedia();

  useEffect(() => {
    setTvSlot(tvStageRef.current);
    return () => setTvSlot(null);
  }, [setTvSlot]);

  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';
  const isError   = status === 'error';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-card dark:border-slate-800">
      <div className="relative aspect-video bg-black">
        <div ref={tvStageRef} className="h-full w-full bg-black" />
        {!current && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-center dark:bg-slate-950">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-200 bg-brand-50 text-brand-600 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="m8 3 4 4 4-4" />
              </svg>
            </div>
            <p className="font-display text-lg font-bold text-slate-900 dark:text-white">Selecciona un canal</p>
            <p className="mt-1.5 max-w-xs text-xs text-slate-500 dark:text-slate-400">
              Solo se muestran los canales que están en línea ahora mismo.
            </p>
          </div>
        )}
        {isLoading && current && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-brand-300" />
          </div>
        )}
      </div>

      {/* Info bar */}
      <div className="flex items-center gap-3 border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 flex-shrink-0 rounded-full ${
              isPlaying ? 'bg-emerald-400' : isError ? 'bg-red-400' : isLoading ? 'bg-amber-400' : 'bg-slate-400'
            }`} />
            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {current?.name || 'Sin reproducción'}
            </p>
          </div>
          {current && (
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              {current.category} · {current.country}
              {isPlaying ? ' · TV en vivo' : isLoading ? ' · Conectando…' : isError ? ' · Error' : ''}
            </p>
          )}
        </div>
        {current && (
          <button type="button" onClick={onStop} className="btn-ghost btn-sm flex-shrink-0">
            Detener
          </button>
        )}
      </div>

      {/* Error message */}
      {isError && (
        <div className="border-t border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-300">
          {error || 'No se pudo reproducir. El canal puede estar caído o bloqueado por CORS.'}
        </div>
      )}
    </div>
  );
}

// ── Quick channel bar ─────────────────────────────────────────────────────────
function QuickBar({ channels, currentId, isPlaying, onPlay }) {
  if (!channels.length) return null;
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
      {channels.map((ch) => {
        const active = currentId === ch.id;
        return (
          <button
            key={ch.id}
            onClick={() => onPlay(ch)}
            className={[
              'flex min-w-[140px] flex-shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all',
              active
                ? 'border-brand-400/60 bg-brand-50 dark:border-brand-700/40 dark:bg-brand-900/20'
                : 'border-slate-100 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800',
            ].join(' ')}
          >
            <span className="text-base leading-none">{ch.flag}</span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-bold text-slate-900 dark:text-white">{ch.name}</span>
              <span className="block truncate text-[10px] text-slate-400 dark:text-slate-500">{ch.category}</span>
            </span>
            {active && isPlaying && (
              <span className="ml-auto flex items-end gap-0.5" style={{ height: 12 }}>
                {[4, 8, 6, 10].map((h, i) => (
                  <span key={i} style={{
                    display: 'inline-block', width: 2.5, height: h, borderRadius: 1,
                    background: ch.color, animation: `tvBounce${i} 0.5s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.07}s`,
                  }} />
                ))}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function TVPage() {
  const { tv, playTv, stopTv } = useMedia();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [region,       setRegion]   = useState('all');
  const [category,     setCategory] = useState('all');
  const [search,       setSearch]   = useState('');
  const [visibleCount, setVisibleCount] = useState(SKELETON_COUNT);

  // ── Persistence ───────────────────────────────────────────────────────────
  const [recents,   setRecents]   = useState(loadRecents);
  const [favorites, setFavorites] = useState(loadFavs);
  const [tab, setTab] = useState('all');
  const prevTabRef = useRef(tab);

  // ── Probe ─────────────────────────────────────────────────────────────────
  const {
    probing, probingDone,
    isOffline,
    markOffline, markOnline,
    onlineCount, offlineCount, checkedCount,
    recheckAll,
  } = useTVProbe(TV_CHANNELS);

  const { current, status, error: tvError } = tv;
  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => { injectKeyframes(); }, []);

  useEffect(() => {
    setVisibleCount(SKELETON_COUNT);
  }, [region, category, search, tab]);

  useEffect(() => {
    if (prevTabRef.current !== tab) {
      prevTabRef.current = tab;
      recheckAll();
    }
  }, [tab, recheckAll]);

  // Ground-truth feedback from actual playback
  useEffect(() => {
    if (!current) return;
    if (status === 'playing') markOnline(current.id);
    if (status === 'error')   markOffline(current.id);
  }, [status, current, markOnline, markOffline]);

  // ── Filtering ─────────────────────────────────────────────────────────────
  const regionDef = TV_REGIONS.find((r) => r.key === region);

  const filtered = useMemo(() => {
    let base = TV_CHANNELS;
    if (tab === 'recents') {
      base = recents.filter((r) => TV_CHANNELS.find((c) => c.id === r.id));
    } else if (tab === 'favs') {
      base = TV_CHANNELS.filter((c) => favorites.has(c.id));
    }

    return base.filter((ch) => {
      if (isOffline(ch)) return false;

      if (regionDef?.countries && !regionDef.countries.includes(ch.country)) return false;
      if (category !== 'all' && ch.category !== category) return false;

      if (search) {
        const q = search.toLowerCase();
        if (
          !ch.name.toLowerCase().includes(q) &&
          !ch.category.toLowerCase().includes(q) &&
          !ch.country.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [regionDef, category, search, isOffline, tab, recents, favorites]);

  const visibleChannels = filtered.slice(0, visibleCount);
  const hasMore         = filtered.length > visibleCount;

  const skeletonSlots = probing
    ? Math.max(0, SKELETON_COUNT - visibleChannels.length)
    : 0;

  // ── Quick bar: recents if any, else trending defaults ─────────────────────
  const quickChannels = useMemo(() => {
    if (recents.length) return recents.slice(0, 10);
    return TV_CHANNELS.filter((c) =>
      ['co-senal', 'mx-estrellas', 'ar-eltrece', 'es-tve1', 'int-telemundo', 'lat-cinesony', 'lat-todonovelas', 'lat-animevision', 'int-france24es', 'int-dwespanol'].includes(c.id)
    );
  }, [recents]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const play = useCallback((channel) => {
    if (isOffline(channel)) return;
    playTv(channel);
    const next = [channel, ...recents.filter((r) => r.id !== channel.id)].slice(0, 20);
    setRecents(next);
    saveRecents(next);
  }, [isOffline, playTv, recents]);

  const handleStop = useCallback(() => stopTv(), [stopTv]);

  const toggleFav = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      saveFavs(next);
      return next;
    });
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const categoryCount = useMemo(() => new Set(TV_CHANNELS.map((c) => c.category)).size, []);
  const hasFilters = region !== 'all' || category !== 'all' || search;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* ── Header ── */}
      <div>
        <p className="section-eyebrow">Televisión en vivo</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          TV en Español
        </h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
          <span>{TV_CHANNELS.length} canales · {categoryCount} categorías</span>
          {offlineCount > 0 && (
            <span className="flex items-center gap-1.5 text-red-500 dark:text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              {offlineCount} sin señal detectada
            </span>
          )}
          {probingDone && (
            <button
              onClick={recheckAll}
              className="text-brand-600 underline underline-offset-2 transition-colors hover:text-brand-700 dark:text-brand-400"
            >
              Restablecer señal
            </button>
          )}
        </div>
      </div>

      {/* ── Layout ── */}
      <section>
        <div className="flex flex-col gap-6 lg:flex-row">

          {/* ═══ SIDEBAR ═══════════════════════════════════════════════════════ */}
          <aside className="lg:w-80 lg:flex-shrink-0">
            <div className="space-y-3 lg:sticky lg:top-20">
              <TVPlayer
                current={current}
                status={status}
                error={tvError}
                onStop={handleStop}
              />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { n: TV_CHANNELS.length, label: 'Canales'    },
                  { n: categoryCount,      label: 'Categorías' },
                  { n: favorites.size,     label: 'Favoritos'  },
                ].map(({ n, label }) => (
                  <div key={label} className="card px-2 py-2.5 text-center">
                    <div className="text-lg font-black text-slate-900 dark:text-white">{n}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</div>
                  </div>
                ))}
              </div>

              {/* Favorites shortcut */}
              {favorites.size > 0 && (
                <button
                  onClick={() => setTab((t) => t === 'favs' ? 'all' : 'favs')}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                    tab === 'favs'
                      ? 'border-amber-300/50 bg-amber-50 dark:border-amber-700/30 dark:bg-amber-900/10'
                      : 'card hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Mis favoritos</span>
                    <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      {favorites.size}
                    </span>
                  </div>
                </button>
              )}
            </div>
          </aside>

          {/* ═══ MAIN ══════════════════════════════════════════════════════════ */}
          <div className="min-w-0 flex-1">

            {/* Quick bar */}
            <div className="card mb-4 p-4">
              <div className="mb-3">
                <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  {recents.length ? '🕐 Vistos recientemente' : '⚡ Accesos rápidos'}
                </h2>
              </div>
              <QuickBar
                channels={quickChannels}
                currentId={current?.id}
                isPlaying={isPlaying}
                onPlay={play}
              />
            </div>

            {/* Tabs */}
            <div className="mb-4 flex gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900/50">
              {[
                { key: 'all',     label: 'Todos',      count: TV_CHANNELS.length },
                { key: 'recents', label: 'Recientes',  count: recents.length,   hide: !recents.length },
                { key: 'favs',    label: 'Favoritos',  count: favorites.size,   hide: !favorites.size },
              ].filter((t) => !t.hide).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={[
                    'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all',
                    tab === t.key
                      ? 'bg-white text-slate-900 shadow-card dark:bg-slate-800 dark:text-white'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400',
                  ].join(' ')}
                >
                  {t.label}
                  {tab === t.key && probing ? (
                    <span className="text-brand-500" style={{ display: 'inline-block', animation: 'tvSpin 1s linear infinite', fontSize: 11 }}>⟳</span>
                  ) : (
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                      tab === t.key
                        ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400'
                        : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                    }`}>
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Probe loading banner */}
            {probing && (
              <ProbeLoadingBanner
                checkedCount={checkedCount}
                totalCount={TV_CHANNELS.length}
              />
            )}

            {/* Filters */}
            <div className="mb-5">
              <TVFilters
                region={region}     setRegion={setRegion}
                category={category} setCategory={setCategory}
                search={search}     setSearch={setSearch}
                totalCount={probingDone ? filtered.length : TV_CHANNELS.length}
                filteredCount={filtered.length}
              />
            </div>

            {/* Grid */}
            {!probing && filtered.length === 0 ? (
              <EmptyState hasFilters={hasFilters} />
            ) : (
              <>
                <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleChannels.map((channel) => (
                    <ChannelCard
                      key={channel.id}
                      channel={channel}
                      isActive={current?.id === channel.id}
                      isPlaying={current?.id === channel.id && isPlaying}
                      isLoading={current?.id === channel.id && isLoading}
                      isOffline={false}
                      isFavorite={favorites.has(channel.id)}
                      onPlay={play}
                      onStop={handleStop}
                      onToggleFavorite={toggleFav}
                    />
                  ))}
                  {Array.from({ length: skeletonSlots }, (_, i) => (
                    <ChannelCardSkeleton key={`sk-${i}`} />
                  ))}
                </div>

                {hasMore && !probing && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setVisibleCount((n) => n + 48)}
                      className="btn-ghost"
                    >
                      Ver 48 más ({filtered.length - visibleCount} restantes)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

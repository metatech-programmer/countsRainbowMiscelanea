import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useMedia } from '../components/MediaProvider.jsx';
import { STATIONS, REGIONS, RADIO_COLORS, countryFlag } from '../data/radioStations.js';
import { useRadioProbe } from '../hooks/useRadioProbe.js';
import StationCard, { StationCardSkeleton } from '../components/radio/StationCard.jsx';
import RadioPlayer from '../components/radio/RadioPlayer.jsx';
import RadioFilters from '../components/radio/RadioFilters.jsx';
import QuickBar from '../components/radio/QuickBar.jsx';

// ── Remote source ─────────────────────────────────────────────────────────────
const REMOTE_SOURCE = {
  url: 'https://de1.api.radio-browser.info/json/stations/bylanguage/spanish?hidebroken=true&limit=200&order=clickcount&reverse=true',
};

function parseRemoteStation(item, index) {
  const code = item.countrycode || 'ON';
  const tags = String(item.tags || '').split(',').map((t) => t.trim()).filter(Boolean);
  return {
    id: `rb-${item.stationuuid || index}`,
    name: item.name?.trim() || `Radio ${index + 1}`,
    country: code,
    city: item.state || item.country || 'Online',
    genre: tags[0] || 'Radio',
    flag: countryFlag(code),
    color: RADIO_COLORS[index % RADIO_COLORS.length],
    stream: item.url_resolved || item.url,
    isRemote: true,
  };
}

// ── Keyframes ─────────────────────────────────────────────────────────────────
const KF_ID = 'radio-kf';
function injectKeyframes() {
  if (document.getElementById(KF_ID)) return;
  const s = document.createElement('style');
  s.id = KF_ID;
  s.textContent = `
    ${[0,1,2,3].map((i) => `@keyframes audioBounce${i}{from{transform:scaleY(.2)}to{transform:scaleY(1)}}`).join('')}
    @keyframes pulseRing{0%{transform:scale(1);opacity:.5}100%{transform:scale(2);opacity:0}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulseDot{0%,100%{opacity:1}50%{opacity:.3}}
  `;
  document.head.appendChild(s);
}

// ── Persistence ───────────────────────────────────────────────────────────────
const RECENTS_KEY = 'audio_recents_v2';
const FAVS_KEY    = 'audio_favs_v1';
const loadRecents = () => { try { return JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]'); } catch { return []; } };
const loadFavs    = () => { try { return new Set(JSON.parse(localStorage.getItem(FAVS_KEY) || '[]')); } catch { return new Set(); } };
const saveRecents = (l) => localStorage.setItem(RECENTS_KEY, JSON.stringify(l));
const saveFavs    = (s) => localStorage.setItem(FAVS_KEY, JSON.stringify([...s]));

// ── Skeleton count to fill the grid while probing ─────────────────────────────
const SKELETON_COUNT = 12;

// ── Loading overlay shown while the probe first runs ─────────────────────────
function ProbeLoadingBanner({ checkedCount, totalCount }) {
  const pct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-brand-200/60 bg-brand-50/80 px-4 py-3 dark:border-brand-800/40 dark:bg-brand-900/20">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block text-brand-500"
            style={{ animation: 'spin 1s linear infinite' }}
          >
            ⟳
          </span>
          <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">
            Verificando emisoras disponibles…
          </span>
        </div>
        <span className="text-xs font-bold tabular-nums text-brand-600 dark:text-brand-400">
          {checkedCount}/{totalCount}
        </span>
      </div>
      {/* Progress bar */}
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
function EmptyState({ probing, hasFilters }) {
  if (probing) return null; // covered by skeletons
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <div className="mb-4 text-5xl">📻</div>
      <p className="font-semibold text-slate-600 dark:text-slate-400">
        {hasFilters ? 'Sin resultados con estos filtros' : 'No se encontraron emisoras disponibles'}
      </p>
      <p className="mt-1 text-sm text-slate-400 dark:text-slate-600">
        {hasFilters
          ? 'Prueba cambiando región, género o buscando por nombre.'
          : 'Todas las emisoras de esta sección están fuera de línea ahora mismo.'}
      </p>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function AudioPage() {
  const { audio, playAudio, stopAudio, setAudioVolume, setAudioMuted } = useMedia();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [region, setRegion] = useState('all');
  const [genre,  setGenre]  = useState('Todos');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(SKELETON_COUNT);

  // ── Data state ────────────────────────────────────────────────────────────
  const [remoteStations, setRemoteStations] = useState([]);
  const [remoteLoading, setRemoteLoading]   = useState(false);
  const [recents,   setRecents]   = useState(loadRecents);
  const [favorites, setFavorites] = useState(loadFavs);
  const [tab, setTab] = useState('all'); // 'all' | 'recents' | 'favs'

  // Track the previous tab to detect changes and retrigger probe feedback
  const prevTabRef = useRef(tab);

  // ── Probe ─────────────────────────────────────────────────────────────────
  const {
    probing, probingDone,
    isOffline, isChecked,
    getPlayUrl,
    markOffline, markOnline,
    onlineCount, checkedCount,
    recheckAll,
  } = useRadioProbe(STATIONS);

  // ── Merged catalog ────────────────────────────────────────────────────────
  const allStations = useMemo(() => {
    const seen = new Set();
    return [...STATIONS, ...remoteStations].filter((s) => {
      const key = `${s.name.toLowerCase()}|${s.stream}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [remoteStations]);

  const allGenres = useMemo(
    () => ['Todos', ...Array.from(new Set(allStations.map((s) => s.genre))).sort()],
    [allStations]
  );

  const { current, status, volume, muted, error: errMsg } = audio;
  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => { injectKeyframes(); }, []);

  // Load remote stations once
  useEffect(() => {
    let cancelled = false;
    setRemoteLoading(true);
    fetch(REMOTE_SOURCE.url, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setRemoteStations(
          data
            .map(parseRemoteStation)
            .filter((s) => /^https?:\/\//i.test(s.stream))
            .slice(0, 300)
        );
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setRemoteLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Reset visible count when filters or tab change
  useEffect(() => {
    setVisibleCount(SKELETON_COUNT);
  }, [region, genre, search, tab]);

  // When tab changes, retrigger the probe so the user always sees the
  // "verifying" feedback from the start of the new tab view.
  useEffect(() => {
    if (prevTabRef.current !== tab) {
      prevTabRef.current = tab;
      recheckAll();
    }
  }, [tab, recheckAll]);

  // Ground-truth feedback from actual playback
  useEffect(() => {
    if (!current) return;
    if (status === 'playing') markOnline(current.id, current.stream);
    if (status === 'error')   markOffline(current.id);
  }, [status, current, markOnline, markOffline]);

  // ── Filtering ─────────────────────────────────────────────────────────────
  // A station is "ready to show" only when:
  //  - it's a remote station (not probed, assumed available), OR
  //  - it has been checked AND is online
  const regionDef = REGIONS.find((r) => r.key === region);

  const filtered = useMemo(() => {
    let base = allStations;
    if (tab === 'recents') base = recents.filter((s) => allStations.find((a) => a.id === s.id));
    else if (tab === 'favs') base = allStations.filter((s) => favorites.has(s.id));

    return base.filter((s) => {
      // Hide any station confirmed offline (static or remote)
      if (isOffline(s)) return false;

      if (regionDef?.countries && !regionDef.countries.includes(s.country)) return false;
      if (genre !== 'Todos' && s.genre !== genre) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.city.toLowerCase().includes(q) &&
          !s.genre.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [allStations, regionDef, genre, search, isOffline, tab, recents, favorites]);

  // While probing, the filtered list may be smaller than it will be once done.
  // We show skeletons to fill the remaining expected slots.
  const visibleStations = filtered.slice(0, visibleCount);
  const hasMore         = filtered.length > visibleCount;

  // How many skeleton cards to show alongside real results during probe
  const skeletonSlots = probing
    ? Math.max(0, SKELETON_COUNT - visibleStations.length)
    : 0;

  // ── Quick bar (always shows, ignores online filter for responsiveness) ────
  const quickStations = useMemo(() => {
    if (recents.length) return recents.slice(0, 12);
    return allStations.filter((s) => ['CO', 'ES', 'ON'].includes(s.country)).slice(0, 12);
  }, [recents, allStations]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const play = useCallback((station) => {
    if (isOffline(station)) return;
    const resolvedUrl = getPlayUrl(station);
    playAudio({ ...station, stream: resolvedUrl });
    const next = [station, ...recents.filter((r) => r.id !== station.id)].slice(0, 20);
    setRecents(next);
    saveRecents(next);
  }, [isOffline, getPlayUrl, playAudio, recents]);

  const handleStop   = useCallback(() => stopAudio(), [stopAudio]);
  const handleRetry  = useCallback(() => { if (current) play(current); }, [current, play]);
  const toggleFav    = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      saveFavs(next);
      return next;
    });
  }, []);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const countryCount = useMemo(() => new Set(allStations.map((s) => s.country)).size, [allStations]);
  const hasFilters   = region !== 'all' || genre !== 'Todos' || search;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* ── Header ── */}
      <div>
        <p className="section-eyebrow">Audio en vivo</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Radio mundial
        </h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
          <span>{allStations.length} emisoras · {countryCount} países</span>
          {probingDone && (
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {onlineCount} disponibles ahora
            </span>
          )}
          {remoteLoading && (
            <span className="text-brand-500 dark:text-brand-400">Cargando más radios…</span>
          )}
          {probingDone && !probing && (
            <button
              onClick={recheckAll}
              className="text-brand-600 underline underline-offset-2 transition-colors hover:text-brand-700 dark:text-brand-400"
            >
              Reverificar señal
            </button>
          )}
        </div>
      </div>

      {/* ── Layout ── */}
      <section>
        <div className="flex flex-col gap-6 lg:flex-row">

          {/* ═══ SIDEBAR ═══════════════════════════════════════════════════════ */}
          <aside className="lg:w-72 lg:flex-shrink-0">
            <div className="space-y-3 lg:sticky lg:top-20">
              <RadioPlayer
                current={current}
                status={status}
                volume={volume}
                muted={muted}
                error={errMsg}
                onStop={handleStop}
                onRetry={handleRetry}
                onVolumeChange={setAudioVolume}
                onToggleMute={setAudioMuted}
              />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { n: allStations.length,   label: 'Emisoras' },
                  { n: countryCount,         label: 'Países'   },
                  { n: allGenres.length - 1, label: 'Géneros'  },
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
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Mis favoritas</span>
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
                  {recents.length ? '🕐 Reproducidas recientemente' : '⚡ Accesos rápidos'}
                </h2>
              </div>
              <QuickBar
                stations={quickStations}
                currentId={current?.id}
                isPlaying={isPlaying}
                isOffline={isOffline}
                onPlay={play}
              />
            </div>

            {/* Tabs */}
            <div className="mb-4 flex gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900/50">
              {[
                { key: 'all',     label: 'Todas',     count: allStations.length },
                { key: 'recents', label: 'Recientes', count: recents.length,  hide: !recents.length },
                { key: 'favs',    label: 'Favoritas', count: favorites.size,  hide: !favorites.size },
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
                  {/* While probing show a spinner in the active tab instead of a stale count */}
                  {tab === t.key && probing ? (
                    <span
                      className="text-brand-500"
                      style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: 11 }}
                    >⟳</span>
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

            {/* Probe loading banner — shown at the top of any tab while verifying */}
            {probing && (
              <ProbeLoadingBanner
                checkedCount={checkedCount}
                totalCount={STATIONS.length}
              />
            )}

            {/* Filters */}
            <div className="mb-5">
              <RadioFilters
                region={region}  setRegion={setRegion}
                genre={genre}    setGenre={setGenre}
                search={search}  setSearch={setSearch}
                allGenres={allGenres}
                totalCount={probingDone ? filtered.length : STATIONS.length}
                filteredCount={filtered.length}
              />
            </div>

            {/* Grid */}
            {!probing && filtered.length === 0 ? (
              <EmptyState probing={probing} hasFilters={hasFilters} />
            ) : (
              <>
                <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  {/* Real cards — only stations that are confirmed online or remote */}
                  {visibleStations.map((station) => (
                    <StationCard
                      key={station.id}
                      station={station}
                      isActive={current?.id === station.id}
                      isPlaying={current?.id === station.id && isPlaying}
                      isLoading={current?.id === station.id && isLoading}
                      isOffline={false} // offline stations are already filtered out
                      isFavorite={favorites.has(station.id)}
                      onPlay={play}
                      onStop={handleStop}
                      onToggleFavorite={toggleFav}
                    />
                  ))}

                  {/* Skeleton slots — fill while probe is running */}
                  {Array.from({ length: skeletonSlots }, (_, i) => (
                    <StationCardSkeleton key={`sk-${i}`} />
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

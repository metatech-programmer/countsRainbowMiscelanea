import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMedia } from '../components/MediaProvider.jsx';

const PLAYLISTS = [
  {
    id: 'spanish',
    name: 'Todo en español',
    type: 'Idioma',
    accent: '#14b8a6',
    description: 'Canales publicos marcados en español por iptv-org.',
    url: 'https://iptv-org.github.io/iptv/languages/spa.m3u',
  },
  {
    id: 'movies-es',
    name: 'Películas',
    type: 'Películas',
    accent: '#f97316',
    description: 'Canales abiertos de cine filtrados a español/hispano.',
    url: 'https://iptv-org.github.io/iptv/categories/movies.m3u',
  },
  {
    id: 'series-es',
    name: 'Series',
    type: 'Series',
    accent: '#a855f7',
    description: 'Canales de series y reruns filtrados a español/hispano.',
    url: 'https://iptv-org.github.io/iptv/categories/series.m3u',
  },
  {
    id: 'anime-es',
    name: 'Anime y animación',
    type: 'Anime',
    accent: '#ec4899',
    description: 'Animación, anime e infantiles con señales hispanas.',
    url: 'https://iptv-org.github.io/iptv/categories/animation.m3u',
  },
  {
    id: 'kids-es',
    name: 'Infantil',
    type: 'Kids',
    accent: '#22c55e',
    description: 'Canales infantiles y familiares en español.',
    url: 'https://iptv-org.github.io/iptv/categories/kids.m3u',
  },
  {
    id: 'docs-es',
    name: 'Documentales',
    type: 'Docs',
    accent: '#84cc16',
    description: 'Documentales, cultura y divulgación en español.',
    url: 'https://iptv-org.github.io/iptv/categories/documentary.m3u',
  },
  {
    id: 'news-es',
    name: 'Noticias',
    type: 'Noticias',
    accent: '#3b82f6',
    description: 'Noticias 24/7 en español.',
    url: 'https://iptv-org.github.io/iptv/categories/news.m3u',
  },
  {
    id: 'sports-es',
    name: 'Deportes',
    type: 'Deportes',
    accent: '#ef4444',
    description: 'Deportes abiertos con señales hispanas disponibles.',
    url: 'https://iptv-org.github.io/iptv/categories/sports.m3u',
  },
  {
    id: 'music-es',
    name: 'Música',
    type: 'Música',
    accent: '#d946ef',
    description: 'Videoclips, música latina y canales musicales en español.',
    url: 'https://iptv-org.github.io/iptv/categories/music.m3u',
  },
  {
    id: 'entertainment-es',
    name: 'Entretenimiento',
    type: 'Variedad',
    accent: '#06b6d4',
    description: 'Magazines, variedad y entretenimiento general en español.',
    url: 'https://iptv-org.github.io/iptv/categories/entertainment.m3u',
  },
  {
    id: 'free-tv-es',
    name: 'Free-TV español',
    type: 'Curada',
    accent: '#0ea5e9',
    description: 'Lista curada global filtrada a países hispanos.',
    url: 'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8',
  },
  {
    id: 'tdt-spain',
    name: 'TDTChannels España',
    type: 'España',
    accent: '#6366f1',
    description: 'TDT española abierta desde la lista oficial de TDTChannels.',
    url: 'https://www.tdtchannels.com/lists/tv.m3u8',
  },
  {
    id: 'spain',
    name: 'España iptv-org',
    type: 'País',
    accent: '#f97316',
    description: 'Canales españoles disponibles en iptv-org.',
    url: 'https://iptv-org.github.io/iptv/countries/es.m3u',
  },
  {
    id: 'colombia',
    name: 'Colombia',
    type: 'País',
    accent: '#a855f7',
    description: 'Canales colombianos en abierto.',
    url: 'https://iptv-org.github.io/iptv/countries/co.m3u',
  },
  {
    id: 'mexico',
    name: 'México',
    type: 'País',
    accent: '#ec4899',
    description: 'Canales mexicanos de TV abierta y online.',
    url: 'https://iptv-org.github.io/iptv/countries/mx.m3u',
  },
  {
    id: 'argentina',
    name: 'Argentina',
    type: 'País',
    accent: '#22c55e',
    description: 'Canales argentinos disponibles publicamente.',
    url: 'https://iptv-org.github.io/iptv/countries/ar.m3u',
  },
  {
    id: 'chile',
    name: 'Chile',
    type: 'País',
    accent: '#06b6d4',
    description: 'Canales chilenos abiertos.',
    url: 'https://iptv-org.github.io/iptv/countries/cl.m3u',
  },
  {
    id: 'peru',
    name: 'Perú',
    type: 'País',
    accent: '#84cc16',
    description: 'Canales peruanos publicos y gratuitos.',
    url: 'https://iptv-org.github.io/iptv/countries/pe.m3u',
  },
  {
    id: 'venezuela',
    name: 'Venezuela',
    type: 'País',
    accent: '#ef4444',
    description: 'Canales venezolanos disponibles en abierto.',
    url: 'https://iptv-org.github.io/iptv/countries/ve.m3u',
  },
  {
    id: 'ecuador',
    name: 'Ecuador',
    type: 'País',
    accent: '#3b82f6',
    description: 'Canales ecuatorianos de iptv-org.',
    url: 'https://iptv-org.github.io/iptv/countries/ec.m3u',
  },
  {
    id: 'uruguay',
    name: 'Uruguay',
    type: 'País',
    accent: '#d946ef',
    description: 'Canales uruguayos disponibles publicamente.',
    url: 'https://iptv-org.github.io/iptv/countries/uy.m3u',
  },
  {
    id: 'bolivia',
    name: 'Bolivia',
    type: 'País',
    accent: '#f59e0b',
    description: 'Canales bolivianos publicos.',
    url: 'https://iptv-org.github.io/iptv/countries/bo.m3u',
  },
  {
    id: 'paraguay',
    name: 'Paraguay',
    type: 'País',
    accent: '#e11d48',
    description: 'Canales paraguayos de TV abierta online.',
    url: 'https://iptv-org.github.io/iptv/countries/py.m3u',
  },
  {
    id: 'costa-rica',
    name: 'Costa Rica',
    type: 'País',
    accent: '#2563eb',
    description: 'Canales costarricenses disponibles en abierto.',
    url: 'https://iptv-org.github.io/iptv/countries/cr.m3u',
  },
  {
    id: 'dominicana',
    name: 'Rep. Dominicana',
    type: 'País',
    accent: '#facc15',
    description: 'Canales dominicanos publicos.',
    url: 'https://iptv-org.github.io/iptv/countries/do.m3u',
  },
  {
    id: 'puerto-rico',
    name: 'Puerto Rico',
    type: 'País',
    accent: '#0ea5e9',
    description: 'Canales puertorriqueños en abierto.',
    url: 'https://iptv-org.github.io/iptv/countries/pr.m3u',
  },
  {
    id: 'latam',
    name: 'Latinoamérica',
    type: 'Región',
    accent: '#10b981',
    description: 'Canales publicos agrupados por region LATAM.',
    url: 'https://iptv-org.github.io/iptv/regions/latam.m3u',
  },
];

const PLAYLIST_SECTIONS = [
  { id: 'content', label: 'Contenido' },
  { id: 'countries', label: 'Países' },
  { id: 'all', label: 'Todas' },
];

function getPlaylistSection(playlist) {
  if (['spanish', 'movies-es', 'series-es', 'anime-es', 'kids-es', 'docs-es', 'news-es', 'sports-es', 'music-es', 'entertainment-es', 'free-tv-es'].includes(playlist.id)) {
    return 'content';
  }
  return 'countries';
}

const QUICK_STREAMS = [
  {
    id: 'dw-es',
    name: 'DW Espanol',
    group: 'Noticias',
    country: 'DE',
    logo: 'https://i.imgur.com/A1xzjOI.png',
    url: 'https://dwamdstream103.akamaized.net/hls/live/2015525/dwstream103/index.m3u8',
  },
  {
    id: 'france24-es',
    name: 'France 24 Espanol',
    group: 'Noticias',
    country: 'FR',
    logo: 'https://i.imgur.com/3w6w2Y4.png',
    url: 'https://static.france24.com/live/F24_ES_HI_HLS/live_web.m3u8',
  },
  {
    id: 'euronews-es',
    name: 'Euronews Español',
    group: 'Noticias',
    country: 'ES',
    logo: 'https://i.imgur.com/8RduwWt.png',
    url: 'https://euronews-euronews-spanish-2-mx.samsung.wurl.tv/manifest/playlist.m3u8',
  },
];

const SPANISH_COUNTRIES = new Set([
  'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'ES', 'GT', 'HN', 'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE',
]);

function isSpanishChannel(channel, source) {
  if (source.id === 'tdt-spain' || source.id === 'spanish') return true;
  const idCountry = (channel.tvgId || '').match(/\.([a-z]{2})(?:@|$)/i)?.[1]?.toUpperCase() || '';
  const country = ((channel.country || '').split(';')[0].trim().toUpperCase()) || idCountry;
  const language = (channel.language || '').toLowerCase();
  if (SPANISH_COUNTRIES.has(country)) return true;
  if (/(spanish|español|espanol|castellano|spa)/i.test(language)) return true;
  return false;
}

const FAVORITES_KEY = 'tv_favorites_v1';
const RECENT_KEY = 'tv_recent_v1';
const CUSTOM_KEY = 'tv_custom_playlist_url_v1';

function parseAttrs(text) {
  const attrs = {};
  const re = /([\w-]+)="([^"]*)"/g;
  let match;
  while ((match = re.exec(text))) attrs[match[1]] = match[2];
  return attrs;
}

function parseM3U(text, source) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const channels = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith('#EXTINF')) {
      const comma = line.indexOf(',');
      const header = comma >= 0 ? line.slice(0, comma) : line;
      const name = comma >= 0 ? line.slice(comma + 1).trim() : 'Canal sin nombre';
      const attrs = parseAttrs(header);
      current = {
        name: name || attrs['tvg-name'] || 'Canal sin nombre',
        tvgId: attrs['tvg-id'] || '',
        logo: attrs['tvg-logo'] || '',
        group: attrs['group-title'] || attrs['tvg-group'] || source.type || 'Sin grupo',
        country: attrs['tvg-country'] || attrs.country || '',
        language: attrs['tvg-language'] || attrs.language || '',
        source: source.name,
        sourceId: source.id,
      };
      continue;
    }

    if (!line.startsWith('#') && /^https?:\/\//i.test(line)) {
      const group = current?.group || source.type || 'Sin grupo';
      const unsafe = /adult|xxx|porn|nsfw/i.test(`${group} ${current?.name || ''}`);
      if (!unsafe) {
        const channel = {
          id: `${source.id}-${channels.length}-${line}`.replace(/\s+/g, '-'),
          name: current?.name || line,
          tvgId: current?.tvgId || '',
          logo: current?.logo || '',
          group,
          country: current?.country || '',
          language: current?.language || '',
          source: current?.source || source.name,
          sourceId: source.id,
          url: line,
        };
        if (isSpanishChannel(channel, source)) channels.push(channel);
      }
      current = null;
    }
  }

  return channels;
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function TvIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="m8 3 4 4 4-4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function StarIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.1 8.3 22 9.3 17 14.2 18.2 21 12 17.8 5.8 21 7 14.2 2 9.3 8.9 8.3 12 2" />
    </svg>
  );
}

export default function TVPage() {
  const tvStageRef = useRef(null);
  const { tv, playTv, stopTv, setTvSlot } = useMedia();
  const [selectedPlaylist, setSelectedPlaylist] = useState(PLAYLISTS[0]);
  const [playlistSection, setPlaylistSection] = useState('content');
  const [channels, setChannels] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('Todos');
  const [visibleCount, setVisibleCount] = useState(80);
  const [customUrl, setCustomUrl] = useState(() => localStorage.getItem(CUSTOM_KEY) || '');
  const [favorites, setFavorites] = useState(() => readJson(FAVORITES_KEY, []));
  const [recent, setRecent] = useState(() => readJson(RECENT_KEY, []));

  const selected = tv.current;
  const status = tv.status;
  const error = loadError || tv.error;

  useEffect(() => {
    setTvSlot(tvStageRef.current);
    return () => setTvSlot(null);
  }, [setTvSlot]);

  const loadPlaylist = useCallback(async (playlist) => {
    setSelectedPlaylist(playlist);
    setLoading(true);
    setLoadError('');
    setGroup('Todos');
    try {
      const res = await fetch(playlist.url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseM3U(text, playlist).slice(0, 2500);
      if (!parsed.length) throw new Error('La playlist no trajo canales reproducibles.');
      setChannels(parsed);
    } catch (err) {
      setChannels([]);
      setLoadError(`No se pudo cargar ${playlist.name}. Puede ser CORS, red o una lista temporalmente caida.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaylist(PLAYLISTS[0]);
  }, [loadPlaylist]);

  const playChannel = useCallback((channel) => {
    setLoadError('');
    playTv(channel);
    const nextRecent = [channel, ...recent.filter((item) => item.url !== channel.url)].slice(0, 12);
    setRecent(nextRecent);
    localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent));
  }, [playTv, recent]);

  const groups = useMemo(() => {
    const unique = Array.from(new Set(channels.map((item) => item.group || 'Sin grupo'))).sort();
    return ['Todos', 'Favoritos', 'Recientes', ...unique];
  }, [channels]);

  const favoriteUrls = useMemo(() => new Set(favorites.map((item) => item.url)), [favorites]);

  const visibleChannels = useMemo(() => {
    let base = channels;
    if (group === 'Favoritos') base = favorites;
    else if (group === 'Recientes') base = recent;
    else if (group !== 'Todos') base = channels.filter((item) => item.group === group);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      base = base.filter((item) =>
        item.name.toLowerCase().includes(q) ||
        (item.group || '').toLowerCase().includes(q) ||
        (item.country || '').toLowerCase().includes(q) ||
        (item.source || '').toLowerCase().includes(q)
      );
    }
    return base;
  }, [channels, favorites, group, query, recent]);
  const visibleChannelPage = visibleChannels.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(80);
  }, [group, query, selectedPlaylist.id]);

  const toggleFavorite = (channel) => {
    const exists = favoriteUrls.has(channel.url);
    const next = exists ? favorites.filter((item) => item.url !== channel.url) : [channel, ...favorites].slice(0, 100);
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  const loadCustom = () => {
    const url = customUrl.trim();
    if (!/^https?:\/\/.+/i.test(url)) {
      setLoadError('Pega una URL M3U valida que empiece por http:// o https://.');
      return;
    }
    localStorage.setItem(CUSTOM_KEY, url);
    loadPlaylist({
      id: 'custom',
      name: 'Mi lista M3U',
      type: 'Personal',
      accent: '#14b8a6',
      description: 'Playlist personalizada cargada por URL.',
      url,
    });
  };

  const heroStats = [
    { label: 'Listas', value: PLAYLISTS.length },
    { label: 'Cargados', value: channels.length },
    { label: 'Favoritos', value: favorites.length },
  ];
  const visiblePlaylists = PLAYLISTS.filter((playlist) => playlistSection === 'all' || getPlaylistSection(playlist) === playlistSection);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <p className="section-eyebrow">TV y streaming abierto</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Centro IPTV abierto
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Reproductor para listas M3U publicas: television global, peliculas, series, animacion, deportes, noticias, musica, paises e idiomas. Algunas senales pueden tener bloqueo regional o caidas temporales.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {heroStats.map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="card p-4">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">Listas rápidas</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Películas, series, anime y países hispanos en listas separadas.</p>
          </div>
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {PLAYLIST_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setPlaylistSection(section.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  playlistSection === section.id
                    ? 'bg-white text-brand-700 shadow-sm dark:bg-slate-950 dark:text-brand-300'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {visiblePlaylists.map((playlist) => {
          const active = selectedPlaylist.id === playlist.id;
          return (
            <button
              key={playlist.id}
              onClick={() => loadPlaylist(playlist)}
              className={`group flex min-w-[170px] flex-col rounded-xl border px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 ${
                active
                  ? 'border-brand-500 bg-brand-50 shadow-glow-sm dark:bg-brand-900/20'
                  : 'border-slate-100 bg-white shadow-card hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                  active ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {playlist.type}
                </span>
                <span className={`${active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-300 dark:text-slate-600'} group-hover:text-brand-500`}><TvIcon /></span>
              </div>
              <div className="truncate font-display text-sm font-bold text-slate-900 dark:text-white">{playlist.name}</div>
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{playlist.description}</p>
            </button>
          );
        })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <section className="min-w-0 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-card dark:border-slate-800">
            <div className="relative aspect-video bg-black">
              <div ref={tvStageRef} className="h-full w-full bg-black" />
              {!selected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-center dark:bg-slate-950">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-200 bg-brand-50 text-brand-600 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
                    <TvIcon />
                  </div>
                  <p className="font-display text-xl font-bold text-slate-900 dark:text-white">Selecciona un canal</p>
                  <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">Carga una lista, busca lo que quieres ver y reproduce desde el panel lateral.</p>
                </div>
              )}
              {status === 'loading' && selected && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-brand-300" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${status === 'playing' ? 'bg-emerald-400' : status === 'error' ? 'bg-red-400' : 'bg-slate-600'}`} />
                  <h2 className="truncate font-display text-lg font-bold text-slate-900 dark:text-white">{selected?.name || 'Sin reproduccion'}</h2>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                  {selected ? `${selected.group || 'Sin grupo'} · ${selected.source || selectedPlaylist.name}` : selectedPlaylist.description}
                </p>
              </div>
              <div className="flex gap-2">
                {selected && (
                  <button onClick={() => toggleFavorite(selected)} className="btn-secondary">
                    <StarIcon filled={favoriteUrls.has(selected.url)} />
                    Favorito
                  </button>
                )}
                <button onClick={stopTv} className="btn-ghost">
                  Detener
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="card p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Accesos rapidos verificados</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Streams publicos para probar el reproductor al instante.</p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {QUICK_STREAMS.map((channel) => (
                <button key={channel.id} onClick={() => playChannel({ ...channel, source: 'Acceso rapido', sourceId: 'quick' })}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800">
                  <img src={channel.logo} alt="" className="h-9 w-9 rounded-lg bg-slate-100 object-contain dark:bg-slate-950" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-slate-900 dark:text-white">{channel.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{channel.group} · {channel.country}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Cargar una lista propia</h3>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://ejemplo.com/playlist.m3u"
                className="input min-w-0 flex-1"
              />
              <button onClick={loadCustom} className="btn-primary">
                Cargar M3U
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Usa solo listas que tengas derecho a reproducir. El navegador puede bloquear algunas por CORS o geolocalizacion.</p>
          </div>
        </section>

        <aside className="card min-w-0 p-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">{selectedPlaylist.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{loading ? 'Cargando canales...' : `${visibleChannelPage.length} de ${visibleChannels.length} visibles`}</p>
            </div>
            {loading && <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-slate-600"><SearchIcon /></span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar canal, pais, categoria..."
                className="input py-2.5 pl-9 pr-3"
              />
            </div>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="input py-2.5"
            >
              {groups.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="scrollbar-thin mt-4 max-h-[58vh] space-y-2 overflow-y-auto pr-1">
            {loading ? (
              Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              ))
            ) : visibleChannels.length === 0 ? (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/50">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No hay resultados</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-600">Cambia filtros o carga otra lista.</p>
              </div>
            ) : (
              visibleChannelPage.map((channel) => {
                const active = selected?.url === channel.url;
                const fav = favoriteUrls.has(channel.url);
                return (
                  <div key={`${channel.sourceId}-${channel.url}`} className={`group flex items-center gap-3 rounded-xl border p-2.5 transition ${active ? 'border-brand-400 bg-brand-50 dark:border-brand-700 dark:bg-brand-900/20' : 'border-slate-100 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800'}`}>
                    <button onClick={() => playChannel(channel)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      {channel.logo ? (
                        <img src={channel.logo} alt="" className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-100 object-contain dark:bg-slate-950" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-950 dark:text-slate-500"><TvIcon /></span>
                      )}
                      <span className="min-w-0">
                        <span className={`block truncate text-sm font-bold ${active ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>{channel.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">{channel.group || 'Sin grupo'}{channel.country ? ` · ${channel.country}` : ''}</span>
                      </span>
                    </button>
                    <button onClick={() => toggleFavorite(channel)} className={`rounded-lg p-2 transition ${fav ? 'text-amber-500' : 'text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300'}`} aria-label="Marcar favorito">
                      <StarIcon filled={fav} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
          {visibleChannels.length > visibleChannelPage.length && (
            <button type="button" className="btn-ghost mt-4 w-full" onClick={() => setVisibleCount((n) => n + 80)}>
              Ver 80 canales más
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';

const PLAYLISTS = [
  {
    id: 'free-tv',
    name: 'Free-TV curada',
    type: 'Curada',
    accent: '#14b8a6',
    description: 'Canales gratuitos y mainstream mantenidos por Free-TV/IPTV.',
    url: 'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8',
  },
  {
    id: 'all',
    name: 'IPTV global',
    type: 'Todo',
    accent: '#6366f1',
    description: 'Indice completo de canales publicos de iptv-org.',
    url: 'https://iptv-org.github.io/iptv/index.m3u',
  },
  {
    id: 'movies',
    name: 'Peliculas',
    type: 'Categoria',
    accent: '#f97316',
    description: 'Canales abiertos orientados a cine y clasicos.',
    url: 'https://iptv-org.github.io/iptv/categories/movies.m3u',
  },
  {
    id: 'series',
    name: 'Series',
    type: 'Categoria',
    accent: '#a855f7',
    description: 'Canales abiertos de series, entretenimiento serial y reruns.',
    url: 'https://iptv-org.github.io/iptv/categories/series.m3u',
  },
  {
    id: 'animation',
    name: 'Anime y animacion',
    type: 'Categoria',
    accent: '#ec4899',
    description: 'Animacion, kids y canales tematicos afines.',
    url: 'https://iptv-org.github.io/iptv/categories/animation.m3u',
  },
  {
    id: 'kids',
    name: 'Kids',
    type: 'Categoria',
    accent: '#22c55e',
    description: 'Canales infantiles y familiares abiertos.',
    url: 'https://iptv-org.github.io/iptv/categories/kids.m3u',
  },
  {
    id: 'entertainment',
    name: 'Entretenimiento',
    type: 'Categoria',
    accent: '#06b6d4',
    description: 'Variedad, magazines, realities y entretenimiento general.',
    url: 'https://iptv-org.github.io/iptv/categories/entertainment.m3u',
  },
  {
    id: 'documentary',
    name: 'Documentales',
    type: 'Categoria',
    accent: '#84cc16',
    description: 'Documentales, cultura y divulgacion.',
    url: 'https://iptv-org.github.io/iptv/categories/documentary.m3u',
  },
  {
    id: 'sports',
    name: 'Deportes',
    type: 'Categoria',
    accent: '#ef4444',
    description: 'Canales deportivos disponibles como stream publico.',
    url: 'https://iptv-org.github.io/iptv/categories/sports.m3u',
  },
  {
    id: 'news',
    name: 'Noticias',
    type: 'Categoria',
    accent: '#3b82f6',
    description: 'Noticias en vivo de todo el mundo.',
    url: 'https://iptv-org.github.io/iptv/categories/news.m3u',
  },
  {
    id: 'music',
    name: 'Musica TV',
    type: 'Categoria',
    accent: '#d946ef',
    description: 'Canales musicales, videoclips y radio visual.',
    url: 'https://iptv-org.github.io/iptv/categories/music.m3u',
  },
  {
    id: 'latam',
    name: 'Latinoamerica',
    type: 'Region',
    accent: '#f59e0b',
    description: 'Canales publicos agrupados por region LATAM.',
    url: 'https://iptv-org.github.io/iptv/regions/latam.m3u',
  },
  {
    id: 'spanish',
    name: 'Espanol',
    type: 'Idioma',
    accent: '#e11d48',
    description: 'Canales que transmiten en espanol.',
    url: 'https://iptv-org.github.io/iptv/languages/spa.m3u',
  },
  {
    id: 'english',
    name: 'Ingles',
    type: 'Idioma',
    accent: '#2563eb',
    description: 'Canales que transmiten en ingles.',
    url: 'https://iptv-org.github.io/iptv/languages/eng.m3u',
  },
  {
    id: 'colombia',
    name: 'Colombia',
    type: 'Pais',
    accent: '#facc15',
    description: 'Canales colombianos disponibles en iptv-org.',
    url: 'https://iptv-org.github.io/iptv/countries/co.m3u',
  },
  {
    id: 'usa',
    name: 'Estados Unidos',
    type: 'Pais',
    accent: '#0ea5e9',
    description: 'Canales de Estados Unidos en playlist publica.',
    url: 'https://iptv-org.github.io/iptv/countries/us.m3u',
  },
];

const QUICK_STREAMS = [
  {
    id: 'nasa-tv',
    name: 'NASA TV Public',
    group: 'Ciencia',
    country: 'US',
    logo: 'https://i.imgur.com/rmyfoOI.png',
    url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-Public/master.m3u8',
  },
  {
    id: 'nasa-media',
    name: 'NASA TV Media',
    group: 'Ciencia',
    country: 'US',
    logo: 'https://i.imgur.com/rmyfoOI.png',
    url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV2-Media/master.m3u8',
  },
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
    id: 'aljazeera',
    name: 'Al Jazeera English',
    group: 'Noticias',
    country: 'QA',
    logo: 'https://i.imgur.com/8eB0R0Z.png',
    url: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8',
  },
];

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
          logo: current?.logo || '',
          group,
          country: current?.country || '',
          language: current?.language || '',
          source: current?.source || source.name,
          sourceId: source.id,
          url: line,
        };
        channels.push(channel);
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
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(PLAYLISTS[0]);
  const [channels, setChannels] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('Todos');
  const [customUrl, setCustomUrl] = useState(() => localStorage.getItem(CUSTOM_KEY) || '');
  const [favorites, setFavorites] = useState(() => readJson(FAVORITES_KEY, []));
  const [recent, setRecent] = useState(() => readJson(RECENT_KEY, []));

  useEffect(() => () => {
    if (hlsRef.current) hlsRef.current.destroy();
  }, []);

  const loadPlaylist = useCallback(async (playlist) => {
    setSelectedPlaylist(playlist);
    setLoading(true);
    setError('');
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
      setError(`No se pudo cargar ${playlist.name}. Puede ser CORS, red o una lista temporalmente caida.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaylist(PLAYLISTS[0]);
  }, [loadPlaylist]);

  const playChannel = useCallback((channel) => {
    const video = videoRef.current;
    if (!video) return;

    setSelected(channel);
    setStatus('loading');
    setError('');

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    video.pause();
    video.removeAttribute('src');
    video.load();

    const markPlaying = () => setStatus('playing');
    const markError = () => {
      setStatus('error');
      setError('No se pudo reproducir este stream. Puede estar caido, geobloqueado o bloqueado por CORS.');
    };

    video.onplaying = markPlaying;
    video.onerror = markError;

    if (/\.m3u8($|\?)/i.test(channel.url) && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsRef.current = hls;
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) markError();
      });
      hls.loadSource(channel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(markError));
    } else {
      video.src = channel.url;
      video.play().catch(markError);
    }

    const nextRecent = [channel, ...recent.filter((item) => item.url !== channel.url)].slice(0, 12);
    setRecent(nextRecent);
    localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent));
  }, [recent]);

  const stop = () => {
    const video = videoRef.current;
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    setStatus('idle');
  };

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

  const toggleFavorite = (channel) => {
    const exists = favoriteUrls.has(channel.url);
    const next = exists ? favorites.filter((item) => item.url !== channel.url) : [channel, ...favorites].slice(0, 100);
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  const loadCustom = () => {
    const url = customUrl.trim();
    if (!/^https?:\/\/.+/i.test(url)) {
      setError('Pega una URL M3U valida que empiece por http:// o https://.');
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

  return (
    <div className="-mx-4 -mt-8 min-h-screen bg-slate-950 text-white sm:-mx-6 lg:-mx-8">
      <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.22),transparent_34%),linear-gradient(135deg,#020617_0%,#0f172a_48%,#111827_100%)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-teal-200">
                <span className="h-2 w-2 rounded-full bg-teal-300" />
                TV, peliculas, series y mas
              </div>
              <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
                Centro IPTV abierto
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Reproductor para listas M3U publicas: television global, peliculas, series, animacion, deportes, noticias, musica, paises e idiomas. Algunas senales pueden tener bloqueo regional o caidas temporales.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:w-80">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center backdrop-blur">
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PLAYLISTS.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => loadPlaylist(playlist)}
                className="group rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5"
                style={{
                  borderColor: selectedPlaylist.id === playlist.id ? `${playlist.accent}aa` : 'rgba(255,255,255,0.1)',
                  background: selectedPlaylist.id === playlist.id ? `${playlist.accent}18` : 'rgba(255,255,255,0.04)',
                  boxShadow: selectedPlaylist.id === playlist.id ? `0 14px 40px ${playlist.accent}18` : 'none',
                }}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest" style={{ background: `${playlist.accent}24`, color: playlist.accent }}>
                    {playlist.type}
                  </span>
                  <span className="text-slate-600 group-hover:text-slate-400"><TvIcon /></span>
                </div>
                <div className="font-display text-base font-bold">{playlist.name}</div>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{playlist.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8">
        <section className="min-w-0 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
            <div className="relative aspect-video bg-black">
              <video ref={videoRef} className="h-full w-full bg-black" controls playsInline />
              {!selected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.16),transparent_42%),#020617] text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-400/25 bg-teal-400/10 text-teal-200">
                    <TvIcon />
                  </div>
                  <p className="font-display text-xl font-bold">Selecciona un canal</p>
                  <p className="mt-2 max-w-sm text-sm text-slate-500">Carga una lista, busca lo que quieres ver y reproduce desde el panel lateral.</p>
                </div>
              )}
              {status === 'loading' && selected && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-teal-300" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 border-t border-white/10 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${status === 'playing' ? 'bg-emerald-400' : status === 'error' ? 'bg-red-400' : 'bg-slate-600'}`} />
                  <h2 className="truncate font-display text-lg font-bold">{selected?.name || 'Sin reproduccion'}</h2>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {selected ? `${selected.group || 'Sin grupo'} · ${selected.source || selectedPlaylist.name}` : selectedPlaylist.description}
                </p>
              </div>
              <div className="flex gap-2">
                {selected && (
                  <button onClick={() => toggleFavorite(selected)} className="btn btn-secondary border-teal-500/30 bg-teal-500/10 text-teal-100 hover:bg-teal-500/20">
                    <StarIcon filled={favoriteUrls.has(selected.url)} />
                    Favorito
                  </button>
                )}
                <button onClick={stop} className="btn btn-ghost border-white/10 text-slate-300 hover:bg-white/10">
                  Detener
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold">Accesos rapidos verificados</h3>
                <p className="text-xs text-slate-500">Streams publicos para probar el reproductor al instante.</p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {QUICK_STREAMS.map((channel) => (
                <button key={channel.id} onClick={() => playChannel({ ...channel, source: 'Acceso rapido', sourceId: 'quick' })}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:bg-white/[0.07]">
                  <img src={channel.logo} alt="" className="h-9 w-9 rounded-lg bg-slate-900 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{channel.name}</div>
                    <div className="text-xs text-slate-500">{channel.group} · {channel.country}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="font-display text-base font-bold">Cargar una lista propia</h3>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://ejemplo.com/playlist.m3u"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400/30"
              />
              <button onClick={loadCustom} className="btn btn-primary bg-teal-600 hover:bg-teal-500">
                Cargar M3U
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-600">Usa solo listas que tengas derecho a reproducir. El navegador puede bloquear algunas por CORS o geolocalizacion.</p>
          </div>
        </section>

        <aside className="min-w-0 rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold">{selectedPlaylist.name}</h2>
              <p className="text-xs text-slate-500">{loading ? 'Cargando canales...' : `${visibleChannels.length} visibles de ${channels.length}`}</p>
            </div>
            {loading && <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-teal-300" />}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-600"><SearchIcon /></span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar canal, pais, categoria..."
                className="w-full rounded-xl border border-white/10 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400/30"
              />
            </div>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400/30"
            >
              {groups.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="scrollbar-thin mt-4 max-h-[58vh] space-y-2 overflow-y-auto pr-1">
            {loading ? (
              Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-xl bg-white/[0.04]" />
              ))
            ) : visibleChannels.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <p className="text-sm font-semibold text-slate-300">No hay resultados</p>
                <p className="mt-1 text-xs text-slate-600">Cambia filtros o carga otra lista.</p>
              </div>
            ) : (
              visibleChannels.map((channel) => {
                const active = selected?.url === channel.url;
                const fav = favoriteUrls.has(channel.url);
                return (
                  <div key={`${channel.sourceId}-${channel.url}`} className={`group flex items-center gap-3 rounded-xl border p-2.5 transition ${active ? 'border-teal-400/50 bg-teal-400/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'}`}>
                    <button onClick={() => playChannel(channel)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      {channel.logo ? (
                        <img src={channel.logo} alt="" className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-950 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-950 text-slate-500"><TvIcon /></span>
                      )}
                      <span className="min-w-0">
                        <span className={`block truncate text-sm font-bold ${active ? 'text-white' : 'text-slate-200'}`}>{channel.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-slate-500">{channel.group || 'Sin grupo'}{channel.country ? ` · ${channel.country}` : ''}</span>
                      </span>
                    </button>
                    <button onClick={() => toggleFavorite(channel)} className={`rounded-lg p-2 transition ${fav ? 'text-amber-300' : 'text-slate-600 hover:text-slate-300'}`} aria-label="Marcar favorito">
                      <StarIcon filled={fav} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

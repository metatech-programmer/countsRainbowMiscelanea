// ─── TV Global State (Zustand) ───────────────────────────────────────────────
// Single source of truth for the entire IPTV platform state.
// Separates concerns: channel data, playback, filters, favorites, metrics.

import { create } from 'zustand';

// ── Types ────────────────────────────────────────────────────────────────────
export type ChannelStatus = 'online' | 'unstable' | 'offline' | 'unknown';

export interface Channel {
  id: string;
  name: string;
  logo: string;
  group: string;       // normalized category
  country: string;     // ISO 3166-1 alpha-2
  language: string;
  url: string;
  status: ChannelStatus;
  isLive: boolean;
  source: string;      // playlist source identifier
  flag: string;        // emoji flag
  color: string;       // brand color
}

export interface PlaylistSource {
  id: string;
  name: string;
  url: string;
  type: 'country' | 'language' | 'category' | 'all';
  channelCount?: number;
  lastFetched?: number;
  error?: string;
}

export interface TVMetrics {
  onlineCount: number;
  offlineCount: number;
  unstableCount: number;
  totalCount: number;
  avgLoadTime: number;
  loadTimes: number[];       // last 50 load times for rolling avg
  errorsByDomain: Record<string, number>;
  mostWatched: Record<string, number>;
}

interface TVFilters {
  search: string;
  country: string;    // 'all' | ISO code
  category: string;   // 'all' | category name
  language: string;   // 'all' | language name
  status: string;     // 'all' | ChannelStatus
  tab: 'all' | 'recents' | 'favs';
}

interface TVState {
  // ── Channel data ──
  channels: Channel[];
  isLoading: boolean;
  loadError: string | null;
  sources: PlaylistSource[];

  // ── Playback ──
  currentChannel: Channel | null;
  playbackStatus: 'idle' | 'loading' | 'playing' | 'error' | 'buffering';
  playbackError: string;
  retryCount: number;
  isMuted: boolean;
  volume: number;
  isFullscreen: boolean;

  // ── Filters ──
  filters: TVFilters;

  // ── Favorites & History ──
  favorites: Set<string>;
  recents: Channel[];

  // ── Metrics ──
  metrics: TVMetrics;

  // ── Actions ──
  setChannels: (channels: Channel[]) => void;
  addChannels: (channels: Channel[]) => void;
  setLoading: (loading: boolean) => void;
  setLoadError: (error: string | null) => void;
  setSources: (sources: PlaylistSource[]) => void;

  setCurrentChannel: (channel: Channel | null) => void;
  setPlaybackStatus: (status: TVState['playbackStatus']) => void;
  setPlaybackError: (error: string) => void;
  incrementRetry: () => void;
  resetRetry: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setFullscreen: (fs: boolean) => void;

  updateChannelStatus: (id: string, status: ChannelStatus) => void;
  batchUpdateStatus: (updates: Array<{ id: string; status: ChannelStatus }>) => void;

  setFilter: <K extends keyof TVFilters>(key: K, value: TVFilters[K]) => void;
  resetFilters: () => void;

  toggleFavorite: (id: string) => void;
  addRecent: (channel: Channel) => void;

  recordLoadTime: (ms: number) => void;
  recordError: (domain: string) => void;
  recordWatch: (channelId: string) => void;
}

// ── Persistence helpers ──────────────────────────────────────────────────────
const FAVS_KEY = 'iptv_favorites_v1';
const RECENTS_KEY = 'iptv_recents_v1';
const VOLUME_KEY = 'iptv_volume';

function loadFavorites(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(FAVS_KEY) || '[]')); }
  catch { return new Set(); }
}

function saveFavorites(favs: Set<string>) {
  localStorage.setItem(FAVS_KEY, JSON.stringify([...favs]));
}

function loadRecents(): Channel[] {
  try { return JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]'); }
  catch { return []; }
}

function saveRecents(recents: Channel[]) {
  localStorage.setItem(RECENTS_KEY, JSON.stringify(recents.slice(0, 30)));
}

function loadVolume(): number {
  try { return parseFloat(localStorage.getItem(VOLUME_KEY) || '0.7'); }
  catch { return 0.7; }
}

// ── Default filters ──────────────────────────────────────────────────────────
const DEFAULT_FILTERS: TVFilters = {
  search: '',
  country: 'all',
  category: 'all',
  language: 'all',
  status: 'all',
  tab: 'all',
};

// ── Store ────────────────────────────────────────────────────────────────────
export const useTvStore = create<TVState>((set, get) => ({
  // State
  channels: [],
  isLoading: false,
  loadError: null,
  sources: [],

  currentChannel: null,
  playbackStatus: 'idle',
  playbackError: '',
  retryCount: 0,
  isMuted: false,
  volume: loadVolume(),
  isFullscreen: false,

  filters: { ...DEFAULT_FILTERS },

  favorites: loadFavorites(),
  recents: loadRecents(),

  metrics: {
    onlineCount: 0,
    offlineCount: 0,
    unstableCount: 0,
    totalCount: 0,
    avgLoadTime: 0,
    loadTimes: [],
    errorsByDomain: {},
    mostWatched: {},
  },

  // ── Channel data actions ──
  setChannels: (channels) => set({
    channels,
    metrics: {
      ...get().metrics,
      totalCount: channels.length,
      onlineCount: channels.filter((c) => c.status === 'online' || c.status === 'unknown').length,
      offlineCount: channels.filter((c) => c.status === 'offline').length,
      unstableCount: channels.filter((c) => c.status === 'unstable').length,
    },
  }),

  addChannels: (newChannels) => {
    const existing = get().channels;
    const existingUrls = new Set(existing.map((c) => c.url.toLowerCase()));
    const unique = newChannels.filter((c) => !existingUrls.has(c.url.toLowerCase()));
    const merged = [...existing, ...unique];
    set({
      channels: merged,
      metrics: { ...get().metrics, totalCount: merged.length },
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setLoadError: (loadError) => set({ loadError }),
  setSources: (sources) => set({ sources }),

  // ── Playback actions ──
  setCurrentChannel: (channel) => set({ currentChannel: channel }),
  setPlaybackStatus: (status) => set({ playbackStatus: status }),
  setPlaybackError: (error) => set({ playbackError: error, playbackStatus: 'error' }),
  incrementRetry: () => set({ retryCount: get().retryCount + 1 }),
  resetRetry: () => set({ retryCount: 0 }),
  setMuted: (isMuted) => set({ isMuted }),
  setVolume: (volume) => {
    localStorage.setItem(VOLUME_KEY, String(volume));
    set({ volume });
  },
  setFullscreen: (isFullscreen) => set({ isFullscreen }),

  // ── Status updates ──
  updateChannelStatus: (id, status) => {
    const channels = get().channels.map((c) =>
      c.id === id ? { ...c, status } : c,
    );
    set({
      channels,
      metrics: {
        ...get().metrics,
        onlineCount: channels.filter((c) => c.status === 'online' || c.status === 'unknown').length,
        offlineCount: channels.filter((c) => c.status === 'offline').length,
        unstableCount: channels.filter((c) => c.status === 'unstable').length,
      },
    });
  },

  batchUpdateStatus: (updates) => {
    const map = new Map(updates.map((u) => [u.id, u.status]));
    const channels = get().channels.map((c) =>
      map.has(c.id) ? { ...c, status: map.get(c.id)! } : c,
    );
    set({
      channels,
      metrics: {
        ...get().metrics,
        onlineCount: channels.filter((c) => c.status === 'online' || c.status === 'unknown').length,
        offlineCount: channels.filter((c) => c.status === 'offline').length,
        unstableCount: channels.filter((c) => c.status === 'unstable').length,
      },
    });
  },

  // ── Filter actions ──
  setFilter: (key, value) => set({
    filters: { ...get().filters, [key]: value },
  }),

  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

  // ── Favorites & History ──
  toggleFavorite: (id) => {
    const favs = new Set(get().favorites);
    if (favs.has(id)) favs.delete(id); else favs.add(id);
    saveFavorites(favs);
    set({ favorites: favs });
  },

  addRecent: (channel) => {
    const recents = [channel, ...get().recents.filter((r) => r.id !== channel.id)].slice(0, 30);
    saveRecents(recents);
    set({ recents });
  },

  // ── Metrics ──
  recordLoadTime: (ms) => {
    const m = get().metrics;
    const times = [...m.loadTimes, ms].slice(-50);
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    set({ metrics: { ...m, loadTimes: times, avgLoadTime: Math.round(avg) } });
  },

  recordError: (domain) => {
    const m = get().metrics;
    set({
      metrics: {
        ...m,
        errorsByDomain: {
          ...m.errorsByDomain,
          [domain]: (m.errorsByDomain[domain] || 0) + 1,
        },
      },
    });
  },

  recordWatch: (channelId) => {
    const m = get().metrics;
    set({
      metrics: {
        ...m,
        mostWatched: {
          ...m.mostWatched,
          [channelId]: (m.mostWatched[channelId] || 0) + 1,
        },
      },
    });
  },
}));

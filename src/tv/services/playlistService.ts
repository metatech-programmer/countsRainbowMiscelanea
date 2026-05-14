// ─── Playlist Service ────────────────────────────────────────────────────────
// Centralized M3U/M3U8 playlist fetching, parsing, normalization, and caching.
// Downloads multiple public IPTV lists in parallel, deduplicates, and returns
// a homogeneous Channel array.

import { parse } from 'iptv-playlist-parser';
import { fetchWithProxy } from '../utils/proxyHandler';
import { normalizeChannel, deduplicateChannels } from '../utils/normalizeChannel';
import type { Channel, PlaylistSource } from '../store/tvStore';

// ── Playlist Sources Configuration ──────────────────────────────────────────
// Each source is fetched independently and merged with deduplication.
export const PLAYLIST_SOURCES: PlaylistSource[] = [
  // Countries
  { id: 'co', name: 'Colombia', url: 'https://iptv-org.github.io/iptv/countries/co.m3u', type: 'country' },
  { id: 'mx', name: 'México', url: 'https://iptv-org.github.io/iptv/countries/mx.m3u', type: 'country' },
  { id: 'us', name: 'Estados Unidos', url: 'https://iptv-org.github.io/iptv/countries/us.m3u', type: 'country' },

  // Language
  { id: 'spa', name: 'Español (todos)', url: 'https://iptv-org.github.io/iptv/languages/spa.m3u', type: 'language' },

  // Categories
  { id: 'cat-news', name: 'Noticias', url: 'https://iptv-org.github.io/iptv/categories/news.m3u', type: 'category' },
  { id: 'cat-sports', name: 'Deportes', url: 'https://iptv-org.github.io/iptv/categories/sports.m3u', type: 'category' },
  { id: 'cat-movies', name: 'Películas', url: 'https://iptv-org.github.io/iptv/categories/movies.m3u', type: 'category' },
  { id: 'cat-kids', name: 'Kids', url: 'https://iptv-org.github.io/iptv/categories/kids.m3u', type: 'category' },
  { id: 'cat-music', name: 'Música', url: 'https://iptv-org.github.io/iptv/categories/music.m3u', type: 'category' },
  { id: 'cat-entertainment', name: 'Entretenimiento', url: 'https://iptv-org.github.io/iptv/categories/entertainment.m3u', type: 'category' },
  { id: 'cat-business', name: 'Negocios', url: 'https://iptv-org.github.io/iptv/categories/business.m3u', type: 'category' },
  { id: 'cat-culture', name: 'Cultura', url: 'https://iptv-org.github.io/iptv/categories/culture.m3u', type: 'category' },
  { id: 'cat-documentary', name: 'Documentales', url: 'https://iptv-org.github.io/iptv/categories/documentary.m3u', type: 'category' },
  { id: 'cat-education', name: 'Educación', url: 'https://iptv-org.github.io/iptv/categories/education.m3u', type: 'category' },
  { id: 'cat-lifestyle', name: 'Lifestyle', url: 'https://iptv-org.github.io/iptv/categories/lifestyle.m3u', type: 'category' },
  { id: 'cat-legislative', name: 'Legislativo', url: 'https://iptv-org.github.io/iptv/categories/legislative.m3u', type: 'category' },
  { id: 'cat-series', name: 'Series', url: 'https://iptv-org.github.io/iptv/categories/series.m3u', type: 'category' },
  { id: 'cat-shop', name: 'Compras', url: 'https://iptv-org.github.io/iptv/categories/shop.m3u', type: 'category' },
  { id: 'cat-weather', name: 'Clima', url: 'https://iptv-org.github.io/iptv/categories/weather.m3u', type: 'category' },
  { id: 'cat-religious', name: 'Religión', url: 'https://iptv-org.github.io/iptv/categories/religious.m3u', type: 'category' },
];

// ── Cache Layer ─────────────────────────────────────────────────────────────
const CACHE_KEY = 'iptv_playlist_cache_v2';
const CACHE_TTL = 30 * 60 * 1000; // 30 min

interface CacheEntry {
  channels: Channel[];
  timestamp: number;
  sourceMeta: Array<{ id: string; channelCount: number }>;
}

function getCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return entry;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function setCache(channels: Channel[], sourceMeta: CacheEntry['sourceMeta']) {
  try {
    const entry: CacheEntry = { channels, timestamp: Date.now(), sourceMeta };
    // Only cache if it fits (rough 4MB limit for localStorage)
    const json = JSON.stringify(entry);
    if (json.length < 4_000_000) {
      localStorage.setItem(CACHE_KEY, json);
    }
  } catch { /* quota exceeded — silently skip */ }
}

// ── Single Playlist Fetch ───────────────────────────────────────────────────
async function fetchPlaylist(source: PlaylistSource): Promise<{
  channels: Channel[];
  source: PlaylistSource;
}> {
  try {
    const res = await fetchWithProxy(source.url, {}, 2);
    const text = await res.text();
    const parsed = parse(text);

    const channels = parsed.items
      .filter((item: any) => item.url && item.url.trim().length > 0)
      .map((item: any) => normalizeChannel(item, source.id));

    return {
      channels,
      source: { ...source, channelCount: channels.length, lastFetched: Date.now() },
    };
  } catch (err) {
    console.warn(`[PlaylistService] Failed to fetch ${source.name}:`, err);
    return {
      channels: [],
      source: { ...source, channelCount: 0, error: (err as Error).message },
    };
  }
}

// ── Progress callback type ──────────────────────────────────────────────────
export type ProgressCallback = (loaded: number, total: number, sourceName: string) => void;

// ── Main Fetch All Playlists ────────────────────────────────────────────────
/**
 * Fetches all configured playlist sources in parallel batches,
 * deduplicates, normalizes, and returns the unified channel list.
 *
 * @param onProgress - optional progress callback for UI updates
 * @param forceRefresh - bypass cache
 * @param sources - custom sources (defaults to PLAYLIST_SOURCES)
 */
export async function fetchAllPlaylists(
  onProgress?: ProgressCallback,
  forceRefresh = false,
  sources: PlaylistSource[] = PLAYLIST_SOURCES,
): Promise<{
  channels: Channel[];
  sources: PlaylistSource[];
}> {
  // Check cache first
  if (!forceRefresh) {
    const cached = getCache();
    if (cached) {
      onProgress?.(sources.length, sources.length, 'Cache');
      return {
        channels: cached.channels,
        sources: sources.map((s) => {
          const meta = cached.sourceMeta.find((m) => m.id === s.id);
          return { ...s, channelCount: meta?.channelCount || 0, lastFetched: cached.timestamp };
        }),
      };
    }
  }

  // Fetch in parallel batches of 5 to avoid overwhelming the browser
  const BATCH_SIZE = 5;
  const allChannels: Channel[] = [];
  const updatedSources: PlaylistSource[] = [];
  let loaded = 0;

  for (let i = 0; i < sources.length; i += BATCH_SIZE) {
    const batch = sources.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((s) => fetchPlaylist(s)),
    );

    for (const result of results) {
      loaded++;
      if (result.status === 'fulfilled') {
        allChannels.push(...result.value.channels);
        updatedSources.push(result.value.source);
        onProgress?.(loaded, sources.length, result.value.source.name);
      } else {
        // Even on rejection, track the source
        const failedSource = batch[results.indexOf(result)];
        if (failedSource) {
          updatedSources.push({ ...failedSource, error: 'Fetch failed' });
        }
        onProgress?.(loaded, sources.length, 'Error');
      }
    }
  }

  // Deduplicate by stream URL
  const deduplicated = deduplicateChannels(allChannels);

  // Cache results
  setCache(
    deduplicated,
    updatedSources.map((s) => ({ id: s.id, channelCount: s.channelCount || 0 })),
  );

  return { channels: deduplicated, sources: updatedSources };
}

/**
 * Clear the playlist cache, forcing a fresh fetch on next call.
 */
export function clearPlaylistCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

/**
 * Get the list of all unique categories from a channel set.
 */
export function extractCategories(channels: Channel[]): string[] {
  const cats = new Set(channels.map((c) => c.group));
  return ['all', ...Array.from(cats).sort()];
}

/**
 * Get the list of all unique countries from a channel set.
 */
export function extractCountries(channels: Channel[]): string[] {
  const countries = new Set(channels.map((c) => c.country));
  return ['all', ...Array.from(countries).sort()];
}

/**
 * Get the list of all unique languages from a channel set.
 */
export function extractLanguages(channels: Channel[]): string[] {
  const langs = new Set(channels.map((c) => c.language));
  return ['all', ...Array.from(langs).sort()];
}

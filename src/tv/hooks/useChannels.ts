// ─── useChannels Hook ────────────────────────────────────────────────────────
// Orchestrates playlist fetching, filtering, and memoized channel lists.
// Connects the playlistService to the Zustand store with progress tracking.

import { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { fetchAllPlaylists, clearPlaylistCache, extractCategories, extractCountries, extractLanguages } from '../services/playlistService';
import { useTvStore } from '../store/tvStore';
import type { Channel } from '../store/tvStore';

/** Simple fuzzy match — checks if all query chars appear in order */
function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

export function useChannels() {
  const {
    channels, isLoading, loadError, sources, filters, favorites, recents, validationDone,
    setChannels, setLoading, setLoadError, setSources,
  } = useTvStore();

  const [progress, setProgress] = useState({ loaded: 0, total: 0, current: '' });
  const fetchedRef = useRef(false);

  // ── Initial fetch ──
  useEffect(() => {
    if (fetchedRef.current || channels.length > 0) return;
    fetchedRef.current = true;

    const load = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const result = await fetchAllPlaylists((loaded, total, name) => {
          setProgress({ loaded, total, current: name });
        });
        setChannels(result.channels);
        setSources(result.sources);
      } catch (err) {
        setLoadError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [channels.length, setChannels, setLoading, setLoadError, setSources]);

  // ── Force refresh ──
  const refresh = useCallback(async () => {
    clearPlaylistCache();
    fetchedRef.current = false;
    setLoading(true);
    setLoadError(null);
    try {
      const result = await fetchAllPlaylists((loaded, total, name) => {
        setProgress({ loaded, total, current: name });
      }, true);
      setChannels(result.channels);
      setSources(result.sources);
    } catch (err) {
      setLoadError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [setChannels, setLoading, setLoadError, setSources]);

  // ── Filtered & sorted channels ──
  const filtered = useMemo(() => {
    let result = channels;

    // Hide confirmed-offline channels once validation has run at least once
    if (validationDone) {
      result = result.filter((c) => c.status !== 'offline');
    }

    // Tab filter
    if (filters.tab === 'favs') {
      result = result.filter((c) => favorites.has(c.id));
    } else if (filters.tab === 'recents') {
      const recentIds = new Set(recents.map((r) => r.id));
      result = result.filter((c) => recentIds.has(c.id));
    }

    // Country
    if (filters.country !== 'all') {
      result = result.filter((c) => c.country === filters.country);
    }

    // Category
    if (filters.category !== 'all') {
      result = result.filter((c) => c.group === filters.category);
    }

    // Language
    if (filters.language !== 'all') {
      result = result.filter((c) => c.language === filters.language);
    }

    // Status
    if (filters.status !== 'all') {
      result = result.filter((c) => c.status === filters.status);
    }

    // Search (fuzzy)
    if (filters.search.trim()) {
      const q = filters.search.trim();
      result = result.filter((c) =>
        fuzzyMatch(c.name, q) ||
        fuzzyMatch(c.group, q) ||
        fuzzyMatch(c.country, q) ||
        c.name.toLowerCase().includes(q.toLowerCase()),
      );
    }

    // Sort: online first, then by name
    return result.sort((a, b) => {
      const statusOrder: Record<string, number> = { online: 0, unknown: 1, unstable: 2, offline: 3 };
      const diff = (statusOrder[a.status] || 1) - (statusOrder[b.status] || 1);
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name);
    });
  }, [channels, filters, favorites, recents, validationDone]);

  // ── Dynamic filter options ──
  const categories = useMemo(() => extractCategories(channels), [channels]);
  const countries = useMemo(() => extractCountries(channels), [channels]);
  const languages = useMemo(() => extractLanguages(channels), [channels]);

  return {
    channels: filtered,
    allChannels: channels,
    isLoading,
    loadError,
    sources,
    progress,
    categories,
    countries,
    languages,
    refresh,
    totalCount: channels.length,
    filteredCount: filtered.length,
  };
}

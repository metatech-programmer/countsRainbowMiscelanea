// ─── Channel Normalization ────────────────────────────────────────────────────
// Converts raw M3U playlist items into a homogeneous Channel model
// used across the entire IPTV platform.

import type { Channel, ChannelStatus } from '../store/tvStore';

/** Deterministic hash for dedup — based on stream URL */
function hashUrl(url: string): string {
  let h = 0;
  for (let i = 0; i < url.length; i++) {
    h = ((h << 5) - h + url.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

/** Country code from tvg-country or group-title heuristic */
function extractCountry(raw: any): string {
  if (raw.tvg?.country) return raw.tvg.country.split(';')[0].toUpperCase();
  const group = (raw.group?.title || '').toLowerCase();
  const map: Record<string, string> = {
    colombia: 'CO', méxico: 'MX', mexico: 'MX', argentina: 'AR',
    chile: 'CL', perú: 'PE', peru: 'PE', españa: 'ES', spain: 'ES',
    'united states': 'US', usa: 'US', 'puerto rico': 'PR',
  };
  for (const [k, v] of Object.entries(map)) {
    if (group.includes(k)) return v;
  }
  return raw.tvg?.country?.toUpperCase() || 'INT';
}

/** Map group-title to a normalized category key */
function extractCategory(raw: any): string {
  const group = (raw.group?.title || '').toLowerCase();
  const map: Record<string, string> = {
    news: 'Noticias', noticias: 'Noticias',
    sports: 'Deportes', deportes: 'Deportes',
    movies: 'Películas', películas: 'Películas', cinema: 'Películas', cine: 'Películas',
    kids: 'Kids', infantil: 'Kids', children: 'Kids',
    music: 'Música', música: 'Música',
    entertainment: 'Entretenimiento', entretenimiento: 'Entretenimiento',
    documentary: 'Documentales', documentales: 'Documentales',
    education: 'Educación', educación: 'Educación',
    lifestyle: 'Estilo de vida',
    business: 'Negocios',
    culture: 'Cultura',
    series: 'Series',
    religious: 'Religión', religión: 'Religión',
    weather: 'Clima',
    shop: 'Compras', shopping: 'Compras',
    legislative: 'Legislativo',
    general: 'Generalista',
    animation: 'Anime',
  };
  for (const [k, v] of Object.entries(map)) {
    if (group.includes(k)) return v;
  }
  return raw.group?.title || 'Generalista';
}

/** Pick a brand color based on category for visual consistency */
const CATEGORY_COLORS: Record<string, string> = {
  Noticias: '#3b82f6',
  Deportes: '#16a34a',
  Películas: '#f97316',
  Kids: '#22c55e',
  Música: '#d946ef',
  Entretenimiento: '#06b6d4',
  Documentales: '#ca8a04',
  Generalista: '#dc2626',
  Series: '#7c3aed',
  Anime: '#db2777',
  Educación: '#0891b2',
  Religión: '#9333ea',
  Cultura: '#b45309',
  Clima: '#0369a1',
  Compras: '#ea580c',
  Legislativo: '#1d4ed8',
  'Estilo de vida': '#059669',
  Negocios: '#374151',
};

/** Flags for common country codes */
const FLAGS: Record<string, string> = {
  CO: '🇨🇴', MX: '🇲🇽', AR: '🇦🇷', CL: '🇨🇱', PE: '🇵🇪', ES: '🇪🇸',
  US: '🇺🇸', PR: '🇵🇷', VE: '🇻🇪', EC: '🇪🇨', UY: '🇺🇾', PY: '🇵🇾',
  BO: '🇧🇴', CR: '🇨🇷', PA: '🇵🇦', DO: '🇩🇴', GT: '🇬🇹', HN: '🇭🇳',
  SV: '🇸🇻', NI: '🇳🇮', CU: '🇨🇺', BR: '🇧🇷', FR: '🇫🇷', DE: '🇩🇪',
  GB: '🇬🇧', IT: '🇮🇹', PT: '🇵🇹', JP: '🇯🇵', KR: '🇰🇷', CN: '🇨🇳',
  RU: '🇷🇺', IN: '🇮🇳', CA: '🇨🇦', AU: '🇦🇺', INT: '🌎',
};

/**
 * Normalizes a raw M3U item into our unified Channel model.
 * @param raw - parsed playlist item from iptv-playlist-parser
 * @param source - identifier of the source playlist
 */
export function normalizeChannel(
  raw: any,
  source: string,
): Channel {
  const url = (raw.url || '').trim();
  const name = (raw.name || raw.tvg?.name || 'Canal sin nombre').trim();
  const country = extractCountry(raw);
  const category = extractCategory(raw);
  const language = raw.tvg?.language?.split(';')[0] || 'Español';

  return {
    id: `${source}-${hashUrl(url)}`,
    name,
    logo: raw.tvg?.logo || '',
    group: category,
    country,
    language,
    url,
    status: 'unknown' as ChannelStatus,
    isLive: true,
    source,
    flag: FLAGS[country] || '🌐',
    color: CATEGORY_COLORS[category] || '#6366f1',
  };
}

/**
 * Deduplicate channels by stream URL, keeping the first occurrence.
 * Also filters out channels with empty/invalid URLs.
 */
export function deduplicateChannels(channels: Channel[]): Channel[] {
  const seen = new Set<string>();
  const result: Channel[] = [];

  for (const ch of channels) {
    if (!ch.url || ch.url.length < 10) continue;
    // Normalize URL for dedup (strip trailing slashes, lowercase)
    const key = ch.url.toLowerCase().replace(/\/+$/, '');
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(ch);
  }

  return result;
}

// ─── TVPage (IPTV Platform) ──────────────────────────────────────────────────
// Main page that orchestrates the entire IPTV platform.
// Supports both light and dark mode following the app's theme system.

import { useEffect } from 'react';
import { useChannels } from '../hooks/useChannels';
import { useStreamValidator } from '../hooks/useStreamValidator';
import { useMedia } from '../../components/MediaProvider';
import TVHeader from '../components/TVHeader';
import SearchBar from '../components/SearchBar';
import CategorySidebar from '../components/CategorySidebar';
import ChannelGrid from '../components/ChannelGrid';

// ── Inject TV-specific keyframes once ──
const KF_ID = 'iptv-kf';
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

export default function TVPage() {
  const {
    channels, allChannels, isLoading, loadError,
    progress, categories, countries,
    refresh, totalCount, filteredCount,
  } = useChannels();

  useStreamValidator();
  useEffect(() => { injectKeyframes(); }, []);

  const { setTvSlot } = useMedia();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* ── Header ── */}
      <TVHeader
        totalCount={totalCount}
        isLoading={isLoading}
        progress={progress}
        onRefresh={refresh}
      />

      {/* ── Error banner ── */}
      {loadError && (
        <div className="overflow-hidden rounded-2xl border border-red-200/60 bg-red-50/80 px-4 py-3 dark:border-red-500/10 dark:bg-red-500/[0.05]">
          <div className="flex items-center gap-2 overflow-hidden">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-red-500 dark:text-red-400">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span className="min-w-0 truncate text-sm text-red-700 dark:text-red-300/80">{loadError}</span>
            <button
              onClick={refresh}
              className="ml-auto flex-shrink-0 rounded-lg border border-red-200 bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 transition-all hover:bg-red-200 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* ── Layout ── */}
      <section className="flex flex-col gap-6 lg:flex-row">
        {/* ═══ SIDEBAR ═══ */}
        <div className="lg:w-[300px] xl:w-[320px] lg:flex-shrink-0 overflow-hidden">
          <div className="space-y-3 lg:sticky lg:top-20">
            {/* Player placeholder slot */}
            <div ref={setTvSlot} className="relative w-full overflow-hidden" style={{ minHeight: '260px', aspectRatio: '16/9' }} />
            
            <CategorySidebar
              categories={categories}
              countries={countries}
              allChannels={allChannels}
            />
          </div>
        </div>

        {/* ═══ MAIN CONTENT ═══ */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="mb-4">
            <SearchBar
              totalCount={totalCount}
              filteredCount={filteredCount}
            />
          </div>
          <ChannelGrid
            channels={channels}
            isLoading={isLoading}
          />
        </div>
      </section>
    </div>
  );
}

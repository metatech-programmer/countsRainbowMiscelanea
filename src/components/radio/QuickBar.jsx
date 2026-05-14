import { memo } from 'react';
import { SignalBars } from './StationCard.jsx';

const QuickBar = memo(function QuickBar({ stations, currentId, isPlaying, isOffline, onPlay }) {
  if (!stations.length) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
      {stations.map((station) => {
        const active  = currentId === station.id;
        const offline = isOffline(station);

        return (
          <button
            key={station.id}
            onClick={() => !offline && onPlay(station)}
            disabled={offline}
            title={offline ? 'Sin señal' : station.name}
            className={[
              'flex min-w-[164px] items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-150',
              offline
                ? 'cursor-not-allowed border-slate-100/50 bg-slate-50/50 opacity-40 dark:border-slate-800/40 dark:bg-slate-900/20'
                : active
                ? 'border-brand-400/60 bg-brand-50 dark:border-brand-700/40 dark:bg-brand-900/20'
                : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800',
            ].join(' ')}
          >
            {/* Flag / signal */}
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-base"
              style={{
                background: offline ? '#f1f5f915' : `${station.color}18`,
                border: `1px solid ${offline ? '#e2e8f020' : `${station.color}28`}`,
              }}
            >
              {active && isPlaying && !offline
                ? <SignalBars active color={station.color} size="sm" />
                : <span className={offline ? 'grayscale opacity-50' : ''}>{station.flag}</span>
              }
            </div>

            <div className="min-w-0">
              <span className={`block truncate text-xs font-bold ${offline ? 'text-slate-300 dark:text-slate-700' : active ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-200'}`}>
                {station.name}
              </span>
              <span className={`block truncate text-[10px] ${offline ? 'text-slate-200 dark:text-slate-800' : 'text-slate-400 dark:text-slate-500'}`}>
                {offline ? 'Sin señal' : station.genre}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
});

export default QuickBar;

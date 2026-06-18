import { Grid } from 'lucide-react';

export default function PageGrid({
  activePageList,
  translatedPages,
  currentPageIndex,
  isRangeMode,
  rangeStart,
  rangeEnd,
  totalPages,
  uploadedFile,
  onSelectPage,
}) {
  if (!uploadedFile || activePageList.length === 0) return null;

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-none p-5 shadow-2xl space-y-3 font-mono">
      <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
        <div className="flex items-center space-x-2">
          <Grid className="h-4 w-4 text-yellow-400" />
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">PIPELINE PAGE GRID MAP</h4>
        </div>
        <span className="text-[10px] text-yellow-400 font-bold">
          SCOPE: {isRangeMode ? `${rangeStart}-${rangeEnd}` : `1-${totalPages}`}
        </span>
      </div>
      <p className="text-[10px] text-neutral-500 leading-normal font-sans">
        Select any visual ledger node below to map translation progress. Completed nodes hold verified publication-ready translations.
      </p>
      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-black border border-neutral-900 scrollbar-thin">
        {activePageList.map(p => {
          const status = translatedPages[p]?.status || 'untranslated';
          return (
            <button
              key={p}
              onClick={() => onSelectPage(p)}
              className={`h-7 min-w-7 px-1 text-[10px] font-bold rounded-none border flex items-center justify-center transition-all ${
                currentPageIndex === p
                  ? 'border-yellow-400 text-yellow-400 font-black scale-105'
                  : ''
              } ${
                status === 'completed'
                  ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400'
                  : status === 'translating'
                    ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400 animate-pulse'
                    : status === 'pending'
                      ? 'bg-neutral-900/30 border-neutral-800 text-neutral-500'
                      : status === 'error'
                        ? 'bg-rose-950/20 border-rose-900/30 text-rose-400 font-black animate-pulse'
                        : 'bg-transparent border-neutral-900 text-neutral-700 hover:text-neutral-500'
              }`}
            >
              {String(p).padStart(3, '0')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

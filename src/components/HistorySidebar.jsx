import { Clock } from 'lucide-react';

export default function HistorySidebar({ showHistory, history, onClearHistory }) {
  if (!showHistory) return null;

  return (
    <aside className="lg:col-span-4 bg-neutral-950 border border-neutral-900 rounded-none p-5 shadow-2xl flex flex-col h-fit max-h-[85vh] overflow-y-auto animate-slideLeft font-mono">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-900">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-yellow-400" />
          <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono">Historical Logs</h3>
        </div>
        <button onClick={onClearHistory} className="text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer font-bold">
          Clear History
        </button>
      </div>
      {history.length > 0 ? (
        <div className="space-y-3 divide-y divide-slate-800/40">
          {history.map(item => (
            <div key={item.id} className="pt-3 first:pt-0">
              <div className="flex items-center justify-between text-[9px] text-slate-500 mb-1">
                <span className="font-bold uppercase text-yellow-400">
                  {item.direction === 'RU_TO_EN' ? '🇷🇺 ➔ 🇺🇸' : '🇺🇸 ➔ 🇷🇺'}
                </span>
                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.profile}</span>
              </div>
              <p className="text-slate-300 text-sm font-semibold truncate font-sans">{item.fileName}</p>
              <p className="text-slate-400 text-xs truncate mt-0.5">
                Pages: {item.pagesTranslated} completed &middot; {item.timestamp}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-slate-600 text-xs space-y-2">
          <Clock className="h-8 w-8 text-slate-700 animate-pulse" />
          <span>No historical sessions.</span>
        </div>
      )}
    </aside>
  );
}

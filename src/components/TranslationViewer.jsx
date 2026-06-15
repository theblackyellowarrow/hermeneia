import { ChevronLeft, ChevronRight, Clock, Palette, AlertCircle, RefreshCw, Volume2, Copy, Check, Printer, Download } from 'lucide-react';

export default function TranslationViewer({
  translatedPages = {},
  currentPageIndex = 1,
  totalPages = 0,
  processingStatus = 'idle',
  activeWorkerCount = 0,
  isCopied = false,
  hasCompletedPages = false,
  onPrevPage,
  onNextPage,
  onSpeak,
  onCopy,
  onExport,
  onDownloadReport,
  onRetryPage,
}) {
  const activePageData = translatedPages[currentPageIndex] || null;
  const status = activePageData?.status || 'untranslated';
  const hasPages = Object.keys(translatedPages).length > 0;

  const statusBadgeClasses = {
    completed: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    translating: 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400 animate-pulse',
    error: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    pending: 'bg-neutral-900 border-neutral-800 text-neutral-500',
  };

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-none flex flex-col shadow-2xl relative overflow-hidden">
      <div className="p-4 border-b border-neutral-900 bg-neutral-900/10 flex justify-between items-center">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <span className="h-2 w-2 bg-yellow-400" />
          LINGUISTIC RECONSTRUCTION
        </span>
        {processingStatus === 'translating' && (
          <span className="text-[10px] bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded-none font-mono font-bold uppercase tracking-wider animate-pulse">
            CO-PILOT ACTIVE ({activeWorkerCount})
          </span>
        )}
      </div>

      <div className="w-full h-[410px] p-5 overflow-y-auto leading-relaxed select-text relative scrollbar-thin">
        {hasPages ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-900/60 sticky top-0 bg-neutral-950 z-10 shadow-sm font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={onPrevPage}
                  disabled={currentPageIndex === 1}
                  className="p-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 rounded-none transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">
                  PAGE {currentPageIndex} / {totalPages}
                </span>
                <button
                  onClick={onNextPage}
                  disabled={currentPageIndex === totalPages}
                  className="p-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 rounded-none transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <span className={`text-[9px] border px-2 py-0.5 rounded-none font-mono font-bold uppercase tracking-widest ${statusBadgeClasses[status] || 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                {status}
              </span>
            </div>

            {status === 'completed' ? (
              <div className="space-y-4 font-sans">
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {activePageData.translation}
                </p>
              </div>
            ) : status === 'translating' ? (
              <div className="h-full py-16 flex flex-col items-center justify-center text-slate-500 space-y-3 font-mono">
                <div className="animate-spin rounded-none h-8 w-8 border-2 border-yellow-400 border-t-transparent" />
                <p className="text-xs text-yellow-400 uppercase tracking-widest font-bold">Decoding page {currentPageIndex}...</p>
              </div>
            ) : status === 'error' ? (
              <div className="h-full py-12 flex flex-col items-center justify-center text-slate-400 space-y-4 font-mono">
                <AlertCircle className="h-10 w-10 text-rose-500" />
                <div className="text-center animate-fadeIn">
                  <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">Payload Truncated on Page {currentPageIndex}</p>
                  <p className="text-[11px] text-neutral-500 mt-1 max-w-xs leading-normal font-sans font-medium">Standard rate limits might have restricted this batch. Click manual override index below to resolve.</p>
                </div>
                <button
                  onClick={() => onRetryPage(currentPageIndex)}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-yellow-400 rounded-none text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Retry Page {currentPageIndex}</span>
                </button>
              </div>
            ) : (
              <div className="h-full py-16 flex flex-col items-center justify-center text-slate-500 space-y-2 font-mono">
                <Clock className="h-8 w-8 text-neutral-700 animate-pulse" />
                <p className="text-xs text-neutral-500 uppercase tracking-widest">Page {currentPageIndex} sits in active queue</p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-3 text-center font-mono">
            <Palette className="h-10 w-10 text-neutral-800 animate-pulse" />
            <p className="text-xs max-w-xs leading-relaxed uppercase tracking-widest">Awaiting original document metadata to compile translation matrix.</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900/40 border-t border-neutral-900 flex justify-between items-center font-sans">
        <div className="flex items-center space-x-2">
          <button
            onClick={onSpeak}
            disabled={!activePageData || activePageData.status !== 'completed'}
            className="p-2 text-neutral-500 hover:text-yellow-400 hover:bg-neutral-900 rounded-none border border-neutral-900 disabled:opacity-30 transition-colors"
          >
            <Volume2 className="h-4 w-4" />
          </button>
          <button
            onClick={onCopy}
            disabled={!activePageData || activePageData.status !== 'completed'}
            className="p-2 text-neutral-500 hover:text-yellow-400 hover:bg-neutral-900 rounded-none border border-neutral-900 disabled:opacity-30 transition-colors relative"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-emerald-400 animate-bounce" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>

        {hasCompletedPages && (
          <div className="flex space-x-2">
            <button
              onClick={onExport}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-none text-xs font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Compile PDF</span>
            </button>
            <button
              onClick={onDownloadReport}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-yellow-400 rounded-none text-xs font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 inline mr-1" />
              <span>Download Report</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

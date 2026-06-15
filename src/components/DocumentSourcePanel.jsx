import { Upload, FileText, X, Sliders, Layers, Play, Pause, RotateCcw, AlertCircle, Volume2, Sparkles } from 'lucide-react';

export default function DocumentSourcePanel({
  inputMode,
  pdfjsLoaded,
  pdfjsError,
  uploadedFile,
  totalPages,
  isRangeMode,
  rangeStart,
  rangeEnd,
  concurrency,
  processingStatus,
  ocrMode,
  translatedPages,
  sourceText,
  direction,
  dragActive,
  error,
  fileInputRef,
  isLoading,
  onFileChange,
  onDrag,
  onDrop,
  onSourceTextChange,
  onRangeModeChange,
  onRangeStartChange,
  onRangeEndChange,
  onConcurrencyChange,
  onOcrModeChange,
  onStartQueue,
  onPauseQueue,
  onPurgeCache,
  onClearWorkspace,
  onSpeakSource,
  onTranslateManual,
}) {
  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-none flex flex-col shadow-2xl relative overflow-hidden">
      <div className="p-4 border-b border-neutral-900 bg-neutral-900/10 flex justify-between items-center">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <span className="h-2 w-2 bg-yellow-400" />
          {inputMode === 'document' ? "Active Document Pipeline" : "Raw Source Workspace"}
        </span>
        {uploadedFile && (
          <button 
            onClick={onClearWorkspace}
            className="p-1 hover:bg-neutral-900 rounded-none text-neutral-400 hover:text-yellow-400 transition-colors"
            title="Reset workspace"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {inputMode === 'document' ? (
        <div 
          className={`flex-1 min-h-[410px] p-6 flex flex-col justify-center transition-all ${
            dragActive ? 'bg-neutral-900 border-2 border-dashed border-yellow-400' : 'bg-transparent'
          }`}
          onDragEnter={onDrag}
          onDragOver={onDrag}
          onDragLeave={onDrag}
          onDrop={onDrop}
        >
          {!pdfjsLoaded ? (
            <div className="text-center space-y-3">
              {pdfjsError ? (
                <div className="text-center space-y-3">
                  <AlertCircle className="h-8 w-8 text-rose-500 mx-auto" />
                  <p className="text-xs text-rose-400 font-mono uppercase tracking-widest">PDF engine failed to load</p>
                  <p className="text-[11px] text-neutral-500 font-sans">Check network connectivity or reload the page.</p>
                </div>
              ) : (
                <>
                  <div className="animate-spin rounded-none h-8 w-8 border-2 border-yellow-400 border-t-transparent mx-auto" />
                  <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest">Booting curation OCR module...</p>
                </>
              )}
            </div>
          ) : uploadedFile ? (
            <div className="w-full h-full flex flex-col justify-between space-y-4 font-mono">
              <div className="p-4 bg-black border border-neutral-900 rounded-none flex items-center space-x-4 w-full">
                <div className="bg-neutral-900 p-3 rounded-none text-yellow-400 shrink-0 border border-neutral-800">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate font-sans">{uploadedFile.name}</p>
                  <p className="text-xs text-neutral-500 mt-1">Found <span className="font-bold text-yellow-400">{totalPages} Pages</span> &middot; Size: {uploadedFile.size}</p>
                </div>
              </div>

              <div className="bg-black p-4 rounded-none border border-neutral-900 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  <div className="flex items-center space-x-1">
                    <Sliders className="h-3.5 w-3.5 text-yellow-400" />
                    <span>Queue Scope:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isRangeMode} 
                        onChange={(e) => onRangeModeChange(e.target.checked)} 
                        className="rounded-none bg-neutral-900 border-neutral-800 text-yellow-400 focus:ring-0"
                      />
                      <span className="text-[10px] text-neutral-400 uppercase font-mono font-medium">Custom range</span>
                    </label>
                  </div>
                </div>

                {isRangeMode && (
                  <div className="grid grid-cols-2 gap-2 pt-1 animate-fadeIn">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">From Page</label>
                      <input 
                        type="number" 
                        min={1} 
                        max={totalPages}
                        value={rangeStart}
                        onChange={(e) => onRangeStartChange(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-none text-xs px-2.5 py-1.5 text-slate-100 font-bold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">To Page</label>
                      <input 
                        type="number" 
                        min={rangeStart} 
                        max={totalPages}
                        value={rangeEnd}
                        onChange={(e) => onRangeEndChange(Math.max(rangeStart, Math.min(totalPages, Number(e.target.value))))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-none text-xs px-2.5 py-1.5 text-slate-100 font-bold outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
                  <div className="flex items-center space-x-1 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    <Layers className="h-3.5 w-3.5 text-yellow-400" />
                    <span>Workers:</span>
                  </div>
                  <select 
                    value={concurrency}
                    onChange={(e) => onConcurrencyChange(Number(e.target.value))}
                    className="bg-neutral-900 border border-neutral-800 rounded-none text-xs font-bold text-yellow-400 px-2 py-1 outline-none font-mono"
                  >
                    <option value={1}>1 page (Stable)</option>
                    <option value={3}>3 pages (Parallel)</option>
                    <option value={5}>5 pages (Fast Burst)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs bg-black p-3 rounded-none border border-neutral-900 font-sans">
                <span className="text-neutral-500 font-bold uppercase tracking-wider">OCR Scan:</span>
                <div className="flex bg-neutral-900 p-0.5 rounded-none border border-neutral-800">
                  <button
                    onClick={() => onOcrModeChange('auto')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-none uppercase tracking-wider ${ocrMode === 'auto' ? 'bg-yellow-400 text-black font-black' : 'text-neutral-500'}`}
                  >
                    Auto
                  </button>
                  <button
                    onClick={() => onOcrModeChange('force_ocr')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-none uppercase tracking-wider ${ocrMode === 'force_ocr' ? 'bg-yellow-400 text-black font-black' : 'text-neutral-500'}`}
                  >
                    Force Image OCR
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">
                    Completed: {Object.keys(translatedPages).filter(k => translatedPages[k].status === 'completed').length} / {totalPages} Pages
                  </span>
                </div>

                <div className="flex gap-2">
                  {processingStatus === 'translating' ? (
                    <button
                      onClick={onPauseQueue}
                      className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-yellow-400 rounded-none text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                    >
                      <Pause className="h-3.5 w-3.5" />
                      <span>Halt Queue</span>
                    </button>
                  ) : (
                    <button
                      onClick={onStartQueue}
                      className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-none text-xs font-black uppercase tracking-widest transition-all shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] cursor-pointer animate-pulse"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>{Object.keys(translatedPages).length === 0 ? 'Start Research Queue' : 'Resume Translation'}</span>
                    </button>
                  )}
                  
                  <button
                    onClick={onPurgeCache}
                    className="p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded-none transition-all cursor-pointer"
                    title="Purge Active Cache"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="text-center flex flex-col items-center max-w-sm cursor-pointer group w-full mx-auto" 
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="p-5 bg-neutral-900 border border-neutral-800 group-hover:border-yellow-400 rounded-none text-neutral-500 group-hover:text-yellow-400 transition-all mb-4">
                <Upload className="h-9 w-9" />
              </div>
              <h3 className="font-extrabold uppercase tracking-widest text-white text-sm group-hover:text-yellow-400 transition-colors">Load Document Archetype</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Drag & drop any PDF or Image up to 10MB. Parsing processes page-by-page, preserving dates, centuries, and annotations without semantic drift.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-neutral-950 border border-rose-900/50 rounded-none text-xs text-rose-400 flex items-start space-x-2 font-mono">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        <textarea
          value={sourceText}
          onChange={onSourceTextChange}
          placeholder={direction === 'RU_TO_EN' ? "Вставьте искусствоведческий текст..." : "Type or paste English art history text here..."}
          className="w-full h-[410px] p-5 bg-transparent border-0 outline-none resize-none text-slate-100 placeholder-slate-500 text-base leading-relaxed focus:ring-0"
        />
      )}

      <div className="p-4 bg-slate-900/30 border-t border-neutral-900 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={onSpeakSource}
            disabled={!sourceText || inputMode !== 'text'}
            className="p-2 text-neutral-500 hover:text-yellow-400 hover:bg-neutral-900 rounded-none border border-neutral-900 disabled:opacity-30 transition-colors"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>

        {inputMode === 'text' && (
          <button
            onClick={onTranslateManual}
            disabled={!sourceText.trim() || isLoading}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-none text-xs font-black uppercase tracking-widest transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
          >
            <span>Decode Segment</span>
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

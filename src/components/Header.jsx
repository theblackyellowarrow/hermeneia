export default function Header({ inputMode, showHistory, history, onModeChange, onToggleHistory, onHome }) {
  return (
    <header className="border-b border-neutral-900 bg-black sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <button onClick={onHome} className="text-lg font-black tracking-tight text-white font-mono hover:text-[#18F3F5] transition-colors lowercase">dotai</button>
          <span className="text-[7px] bg-cyan-400/10 text-cyan-400 px-2 py-0.5 rounded-none font-mono border border-cyan-400/20 uppercase tracking-[0.15em] hidden sm:inline">Slovo</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-neutral-950 p-0.5 flex items-center border border-neutral-900">
            <button onClick={() => onModeChange('document')} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${inputMode === 'document' ? 'bg-cyan-400 text-black' : 'text-neutral-500 hover:text-neutral-300'}`}>
              Archive Mode
            </button>
            <button onClick={() => onModeChange('text')} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${inputMode === 'text' ? 'bg-cyan-400 text-black' : 'text-neutral-500 hover:text-neutral-300'}`}>
              Text Segment
            </button>
          </div>
          <button onClick={onToggleHistory} className="p-2 text-neutral-500 hover:text-cyan-400 hover:bg-neutral-900 transition-colors relative border border-neutral-900" title="Recent Sessions">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {history.length > 0 && <span className="absolute top-1 right-1 h-1.5 w-2 bg-cyan-400" />}
          </button>
        </div>
      </div>
    </header>
  );
}

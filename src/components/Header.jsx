export default function Header({ inputMode, showHistory, history, onModeChange, onToggleHistory }) {
  return (
    <header className="border-b border-neutral-900 bg-black sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-white font-mono">Slovo</span>
            <span className="text-[9px] text-neutral-600 uppercase tracking-[0.2em] font-mono mt-0.5">by</span>
            <a href="https://dotai.org" target="_blank" rel="noopener noreferrer" className="text-[9px] text-cyan-400 hover:text-cyan-300 tracking-[0.2em] font-mono font-bold transition-colors lowercase">dotai</a>
          </div>
          <span className="text-[7px] bg-cyan-400/10 text-cyan-400 px-2 py-0.5 rounded-none font-mono border border-cyan-400/20 uppercase tracking-[0.15em] hidden sm:inline">Russian–English Scholarly Translation Studio</span>
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

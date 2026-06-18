import { Clock, Palette } from 'lucide-react';

export default function Header({ inputMode, showHistory, history, onModeChange, onToggleHistory }) {
  return (
    <header className="border-b-2 border-neutral-900 bg-black sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Logo + title + tagline */}
        <div className="flex items-center space-x-4">
          <div className="bg-yellow-400 p-2.5 rounded-none shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center border border-black">
            <Palette className="h-6 w-6 text-black" />
          </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black tracking-tight text-white uppercase" style={{fontFamily: 'Poppins,sans-serif'}}>Hermeneia</h1>
                <span className="text-[10px] bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-none font-mono border border-yellow-400/20 uppercase font-bold">PROTOTYPE</span>
              </div>
              <p className="text-xs text-neutral-400 font-medium tracking-wide uppercase">
                Russian–English Translation &amp; Annotation
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] text-neutral-600 uppercase tracking-widest">Powered by</span>
                <a href="https://dotai.org" target="_blank" rel="noopener noreferrer" className="text-[9px] text-neutral-400 hover:text-yellow-400 font-bold uppercase tracking-wider transition-colors">dotai.org</a>
              </div>
            </div>
        </div>
        {/* Right: Mode toggle + history */}
        <div className="flex items-center space-x-3 font-sans">
          <div className="bg-neutral-950 p-1 rounded-none flex items-center border border-neutral-900">
            <button onClick={() => onModeChange('document')} className={`px-3 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider transition-all ${inputMode === 'document' ? 'bg-yellow-400 text-black font-black' : 'text-neutral-500 hover:text-white'}`}>
              <span>Document Queue</span>
            </button>
            <button onClick={() => onModeChange('text')} className={`px-3 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider transition-all ${inputMode === 'text' ? 'bg-yellow-400 text-black font-black' : 'text-neutral-500 hover:text-white'}`}>
              <span>Text Module</span>
            </button>
          </div>
          <button onClick={onToggleHistory} className="p-2 text-neutral-400 hover:text-yellow-400 hover:bg-neutral-900 rounded-none border border-neutral-900 transition-colors relative" title="Recent Sessions">
            <Clock className="h-5 w-5" />
            {history.length > 0 && <span className="absolute top-1 right-1 h-1.5 w-2 bg-yellow-400 animate-pulse" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default function LandingScreen({ onFileChange, onPasteText, fileInputRef }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-400/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-cyan-400/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-cyan-400/[0.07]">
          <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/[0.02] to-transparent" />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-black tracking-tight text-white font-mono">Slovo</span>
          <span className="text-[9px] text-neutral-600 uppercase tracking-[0.2em] font-mono">by</span>
          <a href="https://dotai.org" target="_blank" rel="noopener noreferrer" className="text-[9px] text-cyan-400 hover:text-cyan-300 uppercase tracking-[0.2em] font-mono font-bold transition-colors">dotai</a>
        </div>
      </div>

      {/* Main content */}
      <div className="text-center z-10 px-4 max-w-lg">
        <div className="mb-2">
          <span className="text-[8px] text-cyan-400/60 uppercase tracking-[0.3em] font-mono font-bold">Russian–English Scholarly Translation Studio</span>
        </div>

        <h1 className="text-6xl font-black text-white tracking-tight font-mono mb-4">Slovo</h1>

        <p className="text-sm text-neutral-400 leading-relaxed font-sans max-w-md mx-auto mb-10">
          Translate archive scans, catalogues, museum texts and academic pages with glossary control, citation detection, and publication-ready export.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs uppercase tracking-[0.1em] transition-all font-mono"
          >
            Load Russian Document
          </button>
          <button
            onClick={onPasteText}
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 font-bold text-xs uppercase tracking-[0.1em] transition-all font-mono"
          >
            Paste Text Segment
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 text-[9px] text-neutral-600 uppercase tracking-[0.15em] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 bg-emerald-500 rounded-none" />
            Glossary locked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 bg-cyan-400 rounded-none" />
            Citation detection
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 bg-neutral-500 rounded-none" />
            Publication export
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center">
        <p className="text-[8px] text-neutral-800 uppercase tracking-[0.3em] font-mono">
          An instrument for scholarly translation &middot; <a href="https://dotai.org" target="_blank" rel="noopener noreferrer" className="text-neutral-700 hover:text-cyan-400 transition-colors">dotai.org</a>
        </p>
      </div>

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={(e) => { if (e.target.files?.[0]) onFileChange(e.target.files[0]); }} accept=".pdf, image/*" className="hidden" />
    </div>
  );
}

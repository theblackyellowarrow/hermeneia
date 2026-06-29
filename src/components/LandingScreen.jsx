export default function LandingScreen({ onFileChange, onPasteText, onEnter, fileInputRef }) {
  return (
    <div className="min-h-screen bg-black text-slate-100">
      {/* Hero section */}
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#18F3F5]/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#18F3F5]/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-[#18F3F5]/[0.07]">
            <div className="absolute inset-0 rounded-full border border-[#18F3F5]/25 animate-pulse" />
          </div>
        </div>

        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
          <a href="https://dotai.org" target="_blank" rel="noopener noreferrer" className="text-lg font-black tracking-tight text-white font-mono hover:text-[#18F3F5] transition-colors lowercase">dotai</a>
        </div>

        <div className="text-center z-10 px-4 max-w-lg">
          <div className="mb-2">
            <span className="text-[8px] text-cyan-400/60 uppercase tracking-[0.3em] font-mono font-bold">Russian–English Scholarly Translation Studio</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tight font-mono mb-4">Slovo</h1>
          <p className="text-sm text-neutral-400 leading-relaxed font-sans max-w-md mx-auto mb-10">
            Translate archive scans, catalogues, museum texts and academic pages with glossary control, citation detection, and publication-ready export.
          </p>
          <button onClick={onEnter} className="px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs uppercase tracking-[0.1em] transition-all font-mono">
            Enter Slovo
          </button>
          <div className="mt-10 flex items-center justify-center gap-6 text-[10px] text-neutral-500 uppercase tracking-[0.15em] font-mono">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-emerald-500" />
              Glossary locked
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-cyan-400" />
              Citation detection
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neutral-400" />
              Publication export
            </span>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="h-4 w-6 border border-neutral-800 rounded-full flex items-start justify-center p-0.5">
            <div className="h-1 w-1 bg-cyan-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Pipeline section */}
      <div className="max-w-3xl mx-auto px-4 pb-24 space-y-24">
        <section className="text-center space-y-4">
          <h2 className="text-[10px] text-cyan-400/60 uppercase tracking-[0.3em] font-mono font-bold">How Slovo Works</h2>
          <p className="text-sm text-neutral-400 leading-relaxed font-sans max-w-lg mx-auto">
            Slovo is a six-stage pipeline that takes Russian archival material from raw document to publication-ready English — with the researcher in control at every step.
          </p>
        </section>

        <section className="space-y-12">
          <div className="border-l border-neutral-900 pl-6 space-y-2">
            <span className="text-[8px] text-cyan-400 uppercase tracking-[0.2em] font-mono font-bold">Stage 01</span>
            <h3 className="text-lg font-bold text-white font-mono tracking-tight">Archive</h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-sans">Upload PDFs or images up to 10 MB. PDF.js extracts text natively from digital documents. For scanned or image-only pages, the OCR pipeline renders each page to canvas and sends it through vision extraction. Page ordering is preserved exactly as in the source.</p>
          </div>

          <div className="border-l border-neutral-900 pl-6 space-y-2">
            <span className="text-[8px] text-cyan-400 uppercase tracking-[0.2em] font-mono font-bold">Stage 02</span>
            <h3 className="text-lg font-bold text-white font-mono tracking-tight">OCR</h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-sans">When PDF text extraction yields insufficient characters or the user enables force OCR, each page is rendered at 1.5× resolution and analysed by GPT-4o vision. The model preserves Cyrillic characters, diacritics, catalogue numbers, and bibliographic references with high fidelity. For text-rich PDFs, OCR is never called — extraction is instant and free.</p>
          </div>

          <div className="border-l border-cyan-400/30 pl-6 space-y-2">
            <span className="text-[8px] text-cyan-400 uppercase tracking-[0.2em] font-mono font-bold">Stage 03</span>
            <h3 className="text-lg font-bold text-white font-mono tracking-tight">Translation</h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-sans">DeepSeek Chat handles the primary translation pass — context-aware, glossary-locked, and cost-effective. For pages containing specialised scholarly content that triggers model safety filters, OpenAI provides a fallback translation path. The researcher selects from Art History, Humanities, Literary Prose, or Legal profiles, each with its own domain-specific translation directives.</p>
          </div>

          <div className="border-l border-neutral-900 pl-6 space-y-2">
            <span className="text-[8px] text-cyan-400 uppercase tracking-[0.2em] font-mono font-bold">Stage 04</span>
            <h3 className="text-lg font-bold text-white font-mono tracking-tight">Terminology</h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-sans">Every translated page produces a vocabulary index of difficult academic terms, institutional names, and material-culture terminology. Researchers can lock glossary entries — once a term is locked, all subsequent pages honour that translation. The cumulative lexicon appears as an appendix in every export.</p>
          </div>

          <div className="border-l border-neutral-900 pl-6 space-y-2">
            <span className="text-[8px] text-cyan-400 uppercase tracking-[0.2em] font-mono font-bold">Stage 05</span>
            <h3 className="text-lg font-bold text-white font-mono tracking-tight">Annotation</h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-sans">Add researcher notes to any term with confidence scores, bibliographic sources, and curatorial commentary. The citation engine automatically detects book titles, museum names, artist names, dates, and catalogue references from the source text. Everything is searchable and compiled into the export dossier.</p>
          </div>

          <div className="border-l border-neutral-900 pl-6 space-y-2">
            <span className="text-[8px] text-cyan-400 uppercase tracking-[0.2em] font-mono font-bold">Stage 06</span>
            <h3 className="text-lg font-bold text-white font-mono tracking-tight">Publication</h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-sans">Export completed translations as a plaintext report or a print-ready HTML dossier. The dossier includes a cover page, page-by-page translations with headers, a cumulative vocabulary appendix, researcher annotations, and detected citations — designed to resemble a scholarly publication, not an app printout.</p>
          </div>
        </section>

        {/* Enter CTA */}
        <div className="text-center space-y-6 pt-8">
          <p className="text-sm text-neutral-500 font-sans">Ready to begin?</p>
          <button onClick={onEnter} className="px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs uppercase tracking-[0.1em] transition-all font-mono">
            Enter Slovo
          </button>
          <p className="text-[10px] text-neutral-700 font-mono mt-4">
            <a href="https://dotai.org" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors lowercase">dotai.org</a>
          </p>
        </div>
      </div>
    </div>
  );
}

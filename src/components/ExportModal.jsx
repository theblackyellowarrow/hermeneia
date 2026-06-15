import { X, Printer } from 'lucide-react';

export default function ExportModal({ show, exportTitle, exportAuthor, includeCover, includeLexicon, exportFont, onClose, onTitleChange, onAuthorChange, onCoverChange, onLexiconChange, onFontChange, onGenerate }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-950 border-2 border-neutral-900 p-6 max-w-md w-full shadow-2xl relative space-y-5 font-mono">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-yellow-400 transition-colors">
          <X className="h-5 w-5" />
        </button>
        <div className="border-b-2 border-neutral-900 pb-3 flex items-center gap-2">
          <Printer className="h-5 w-5 text-yellow-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">PDF Publication Compiler</h3>
        </div>
        <p className="text-xs text-neutral-400 font-sans leading-normal">
          Compile your translated page buffers into a structured, print-ready catalogue format. Standardizes layouts, headers, and appends cumulative lexicons as appendix elements.
        </p>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-neutral-400 uppercase font-black block mb-1">Dossier Title</label>
            <input type="text" value={exportTitle} onChange={e => onTitleChange(e.target.value)} className="w-full bg-black border border-neutral-900 rounded-none px-3 py-2 text-xs font-bold text-white outline-none focus:border-yellow-400" placeholder="Enter publication name" />
          </div>
          <div>
            <label className="text-[10px] text-neutral-400 uppercase font-black block mb-1">Author / Institution</label>
            <input type="text" value={exportAuthor} onChange={e => onAuthorChange(e.target.value)} className="w-full bg-black border border-neutral-900 rounded-none px-3 py-2 text-xs font-bold text-white outline-none focus:border-yellow-400" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 font-sans">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeCover} onChange={e => onCoverChange(e.target.checked)} className="rounded-none bg-black border-neutral-900 text-yellow-400 focus:ring-0 focus:ring-offset-0" />
              <span className="text-[11px] font-bold text-neutral-300 uppercase">Cover Page</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeLexicon} onChange={e => onLexiconChange(e.target.checked)} className="rounded-none bg-black border-neutral-900 text-yellow-400 focus:ring-0 focus:ring-offset-0" />
              <span className="text-[11px] font-bold text-neutral-300 uppercase">Lexicon Locks</span>
            </label>
          </div>
          <div className="pt-2">
            <label className="text-[10px] text-neutral-400 uppercase font-black block mb-1.5">Document Font-Face</label>
            <div className="flex bg-neutral-900 p-0.5 rounded-none border border-neutral-800">
              <button onClick={() => onFontChange('serif')} className={`flex-1 py-1.5 text-xs font-black uppercase rounded-none transition-all ${exportFont === 'serif' ? 'bg-yellow-400 text-black' : 'text-neutral-500 hover:text-neutral-300'}`}>Georgia (Serif)</button>
              <button onClick={() => onFontChange('sans')} className={`flex-1 py-1.5 text-xs font-black uppercase rounded-none transition-all ${exportFont === 'sans' ? 'bg-yellow-400 text-black' : 'text-neutral-500 hover:text-neutral-300'}`}>Inter (Sans)</button>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-neutral-900 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-black text-xs uppercase tracking-wider cursor-pointer">Close</button>
          <button onClick={() => { onClose(); onGenerate(); }} className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] cursor-pointer">Generate PDF</button>
        </div>
      </div>
    </div>
  );
}

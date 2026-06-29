import { Sparkle, BookmarkPlus } from 'lucide-react';
import { ART_HISTORY_PRESETS } from '../utils/constants';

export default function GlossaryPanel({ customGlossary, newGlossaryTerm, onNewTermChange, onAddTerm, onRemoveTerm, onInsertPreset }) {
  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-none p-6 shadow-2xl space-y-4 font-mono">
      <div>
        <h3 className="font-black text-sm text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkle className="h-4 w-4 text-yellow-400" />
          Epistemic Glossary Locks
        </h3>
        <p className="text-[11px] text-neutral-500 mt-1 leading-normal font-sans">
          Protect core terminology, proper nouns, and institutional names from general model translation drift. Click any curatorial preset below to append instantly.
        </p>
      </div>

      <div className="bg-black p-3 rounded-none border border-neutral-900">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-mono">Preset Curatorial Locks:</span>
        <div className="flex flex-wrap gap-1.5">
          {ART_HISTORY_PRESETS.map((preset, idx) => (
            <button key={idx} type="button" onClick={() => onInsertPreset(preset)} className="text-[10px] bg-neutral-900 hover:bg-cyan-400 border border-neutral-800 text-neutral-400 hover:text-black px-2.5 py-1 transition-all flex items-center gap-1 cursor-pointer font-bold tracking-wider">
              <span>+ {preset.meaning}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onAddTerm(); }} className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Cyrillic Term (e.g., оклад)" value={newGlossaryTerm.word} onChange={e => onNewTermChange({ ...newGlossaryTerm, word: e.target.value })} className="flex-1 bg-black border border-neutral-900 rounded-none px-4 py-2.5 text-xs text-slate-200 placeholder-neutral-600 outline-none focus:border-yellow-400 font-bold" />
        <input type="text" placeholder="English Lock (e.g., cover / binding)" value={newGlossaryTerm.meaning} onChange={e => onNewTermChange({ ...newGlossaryTerm, meaning: e.target.value })} className="flex-1 bg-black border border-neutral-900 rounded-none px-4 py-2.5 text-xs text-slate-200 placeholder-neutral-600 outline-none focus:border-yellow-400 font-bold" />
        <button type="submit" className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black rounded-none text-xs font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center gap-1.5 cursor-pointer">
          <BookmarkPlus className="h-3.5 w-3.5" />
          <span>Add Lock</span>
        </button>
      </form>

      {customGlossary.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1 font-sans">
          {customGlossary.map((g, idx) => (
            <span key={idx} className="bg-yellow-400/5 border border-yellow-400/25 text-yellow-400 text-xs px-3 py-1 flex items-center gap-2 font-bold font-mono">
              <span>{g.word.toUpperCase()} ➔ {g.meaning.toUpperCase()}</span>
              <button type="button" onClick={() => onRemoveTerm(idx)} className="text-yellow-400 hover:text-white font-black transition-colors">×</button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-neutral-700 text-xs italic font-sans">No glossary locks active. Standard translation vocabulary rules apply.</p>
      )}
    </div>
  );
}

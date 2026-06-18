import { X, Key, Zap } from 'lucide-react';

export default function ApiKeyPanel({ show, onClose, userOpenaiKey, onSave, onClear, usageCount, freeRemaining, isFreeTier, hasUserKey, freeLimit }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-950 border-2 border-neutral-900 p-6 max-w-md w-full shadow-2xl relative space-y-5 font-mono">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-yellow-400 transition-colors">
          <X className="h-5 w-5" />
        </button>

        <div className="border-b-2 border-neutral-900 pb-3 flex items-center gap-2">
          <Key className="h-5 w-5 text-yellow-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">API Key Configuration</h3>
        </div>

        <div className="bg-black border border-neutral-900 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-bold uppercase">DeepSeek</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Zap className="h-3 w-3" />
              Always free
            </span>
          </div>
          <p className="text-[10px] text-neutral-500 leading-relaxed font-sans">DeepSeek handles most pages at no cost. Some scholarly content may require OpenAI fallback.</p>
        </div>

        <div className="bg-black border border-neutral-900 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-bold uppercase">OpenAI</span>
            {isFreeTier ? (
              <span className="text-yellow-400 font-bold text-[10px]">
                {freeRemaining} free pages remaining
              </span>
            ) : hasUserKey ? (
              <span className="text-emerald-400 font-bold text-[10px]">Your key active</span>
            ) : (
              <span className="text-rose-400 font-bold text-[10px]">Required for OCR + fallback</span>
            )}
          </div>
          <p className="text-[10px] text-neutral-500 leading-relaxed font-sans">
            Used for image OCR (scanned PDFs) and as fallback when DeepSeek cannot process a page. Your key is stored in your browser only.
          </p>
          {!isFreeTier && (
            <div className="space-y-2 pt-1">
              <input
                type="password"
                value={userOpenaiKey}
                onChange={e => onSave(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs text-slate-200 placeholder-neutral-600 outline-none focus:border-yellow-400 font-mono"
              />
              {hasUserKey && (
                <button onClick={onClear} className="text-[10px] text-rose-400 hover:text-rose-300 font-bold uppercase cursor-pointer">Remove key</button>
              )}
              <p className="text-[9px] text-neutral-600 leading-relaxed font-sans">
                Get a key at platform.openai.com → API keys. Keys are stored locally in your browser.
              </p>
            </div>
          )}
        </div>

        <div className="bg-neutral-900 p-3 border border-neutral-800">
          <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
            <strong className="text-yellow-400">Free tier:</strong> {freeLimit} pages with shared OpenAI key for OCR and translation fallback. After that, bring your own OpenAI key. DeepSeek runs free always.
          </p>
        </div>

        <button onClick={onClose} className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs uppercase tracking-wider cursor-pointer">
          Done
        </button>
      </div>
    </div>
  );
}

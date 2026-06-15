import { Languages, BookOpen, BookOpenCheck, MessageSquare, Quote, Sparkles, Search, X, Star, BookmarkPlus } from 'lucide-react';
import { CITATION_LABELS } from '../utils/constants';

export default function WorkspaceTabs({
  activeTab,
  hasPages,
  compiledVocabulary,
  compiledCitations,
  filteredVocabulary,
  vocabSearch,
  activePageData,
  currentPageIndex,
  annotations,
  annotationSearch,
  newAnnotation,
  filteredAnnotations,
  onTabChange,
  onVocabSearchChange,
  onAnnotationSearchChange,
  onNewAnnotationChange,
  onAddAnnotation,
  onRemoveAnnotation,
}) {
  if (!hasPages) return null;

  const TABS = [
    { key: 'translation', icon: Languages, label: 'Pipeline' },
    { key: 'vocabulary', icon: BookOpen, label: 'Lexicon', count: compiledVocabulary.length },
    { key: 'scholarlyNotes', icon: BookOpenCheck, label: 'Critique Annotations' },
    { key: 'annotations', icon: MessageSquare, label: 'Annotations', count: annotations.length },
    { key: 'citations', icon: Quote, label: 'Citations', count: compiledCitations.length },
  ];

  const confidenceBadge = (level) => {
    const map = {
      high: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      medium: 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400',
      low: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    };
    return map[level] || map.medium;
  };

  const starFill = (level) => {
    if (level === 'high') return 'fill-emerald-400';
    if (level === 'low') return 'fill-rose-400';
    return 'fill-yellow-400';
  };

  const groupedCitations = compiledCitations.reduce((acc, c) => {
    const key = c.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-none overflow-hidden shadow-2xl">
      <div className="flex border-b border-neutral-900 bg-neutral-950 overflow-x-auto scrollbar-none font-mono">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex-1 py-4 px-4 text-xs font-bold transition-all border-b-2 outline-none uppercase tracking-widest flex items-center justify-center space-x-2 shrink-0 ${
                isActive
                  ? 'border-yellow-400 text-yellow-400 bg-yellow-400/5'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-yellow-400/10 text-yellow-400 text-[10px] px-1.5 py-0.5 border border-yellow-400/20">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-6 bg-neutral-950">
        {activeTab === 'translation' && (
          <div className="space-y-4 font-sans leading-relaxed">
            <div className="flex items-start space-x-3 bg-neutral-900 border border-neutral-800 p-4 rounded-none">
              <Sparkles className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm uppercase tracking-wider font-mono">Structural Museology Engine</h4>
                <p className="text-neutral-400 text-xs mt-1 leading-normal font-sans">
                  Hermeneia reads publications through deep archival and museological context. It preserves dates, centuries, publication indices (*Печ. л.*, *Изд. №*), curatorial annotations, and structural bibliography references without generic pattern-matching or terminological drift.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vocabulary' && (
          <div className="space-y-4 font-mono">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                value={vocabSearch}
                onChange={(e) => onVocabSearchChange(e.target.value)}
                placeholder="Filter cumulative terminology index..."
                className="w-full bg-black border border-neutral-900 rounded-none py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-neutral-600 outline-none focus:border-yellow-400 transition-all font-bold"
              />
            </div>

            {filteredVocabulary.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                {filteredVocabulary.map((vocab, idx) => (
                  <div key={idx} className="bg-black p-4 rounded-none border border-neutral-900 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1 font-mono">
                        <span className="font-extrabold text-white text-sm uppercase tracking-wider">{vocab.word}</span>
                        <span className="text-[9px] bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 font-bold px-2 py-0.5 rounded-none">
                          P. {vocab.pageNum} &middot; {vocab.grammar || "Term"}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-xs mt-2 leading-relaxed">{vocab.meaning}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-500 text-sm py-4 text-center">No cumulative terminology found matching criteria.</div>
            )}
          </div>
        )}

        {activeTab === 'scholarlyNotes' && (
          <div className="space-y-3 font-sans">
            {activePageData?.explanation ? (
              <div className="bg-black p-5 rounded-none border border-neutral-900 leading-relaxed text-sm text-slate-300">
                <span className="text-[10px] bg-yellow-400/10 text-yellow-400 border border-yellow-400/25 px-2 py-0.5 font-mono font-bold block w-fit mb-3 uppercase tracking-wider">
                  PAGE {currentPageIndex} CRITICAL READ
                </span>
                <div className="whitespace-pre-wrap text-xs leading-relaxed text-neutral-400">{activePageData.explanation}</div>
              </div>
            ) : (
              <p className="text-neutral-500 text-xs py-4 text-center font-mono uppercase tracking-wider">No specific annotation data compiled for the active canvas node.</p>
            )}
          </div>
        )}

        {activeTab === 'annotations' && (
          <div className="space-y-4 font-sans">
            <form onSubmit={onAddAnnotation} className="bg-black border border-neutral-900 p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="h-4 w-4 text-yellow-400" />
                <span className="text-xs font-black text-neutral-400 uppercase tracking-wider font-mono">
                  New Annotation &middot; Page {currentPageIndex}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">Term</label>
                  <input
                    type="text"
                    value={newAnnotation.term}
                    onChange={(e) => onNewAnnotationChange({ ...newAnnotation, term: e.target.value })}
                    placeholder="Original term (e.g., складень)"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs text-slate-200 placeholder-neutral-600 outline-none focus:border-yellow-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">Translation</label>
                  <input
                    type="text"
                    value={newAnnotation.translation}
                    onChange={(e) => onNewAnnotationChange({ ...newAnnotation, translation: e.target.value })}
                    placeholder="Translation (e.g., folding triptych)"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs text-slate-200 placeholder-neutral-600 outline-none focus:border-yellow-400 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">Note</label>
                <textarea
                  value={newAnnotation.note}
                  onChange={(e) => onNewAnnotationChange({ ...newAnnotation, note: e.target.value })}
                  placeholder="Scholarly note, usage context, or curatorial commentary..."
                  rows={2}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs text-slate-200 placeholder-neutral-600 outline-none focus:border-yellow-400 font-bold resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">Source</label>
                  <input
                    type="text"
                    value={newAnnotation.source}
                    onChange={(e) => onNewAnnotationChange({ ...newAnnotation, source: e.target.value })}
                    placeholder="Bibliographic ref..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs text-slate-200 placeholder-neutral-600 outline-none focus:border-yellow-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">Confidence</label>
                  <select
                    value={newAnnotation.confidence}
                    onChange={(e) => onNewAnnotationChange({ ...newAnnotation, confidence: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-none px-3 py-2 text-xs text-yellow-400 font-bold outline-none"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-none text-xs font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] cursor-pointer"
                  >
                    <BookmarkPlus className="h-3.5 w-3.5 inline mr-1" />
                    Add
                  </button>
                </div>
              </div>
            </form>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                value={annotationSearch}
                onChange={(e) => onAnnotationSearchChange(e.target.value)}
                placeholder="Search annotations by term, translation, note, or source..."
                className="w-full bg-black border border-neutral-900 rounded-none py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-neutral-600 outline-none focus:border-yellow-400 transition-all font-bold"
              />
            </div>

            {filteredAnnotations.length > 0 ? (
              <div className="space-y-3">
                {filteredAnnotations.map((a) => (
                  <div key={a.id} className="bg-black p-4 rounded-none border border-neutral-900">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-extrabold text-white text-sm uppercase tracking-wider">{a.term}</span>
                        <span className="text-neutral-600 text-xs">&rarr;</span>
                        <span className="font-bold text-yellow-400 text-sm">{a.translation}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] px-2 py-0.5 rounded-none border font-bold uppercase font-mono ${confidenceBadge(a.confidence)}`}>
                          {a.confidence}
                          <Star className={`h-2.5 w-2.5 inline ml-0.5 ${starFill(a.confidence)}`} />
                        </span>
                        <span className="text-[9px] bg-neutral-900 text-neutral-400 font-mono px-1.5 py-0.5 rounded-none border border-neutral-800">
                          P. {a.pageNum}
                        </span>
                        <button
                          onClick={() => onRemoveAnnotation(a.id)}
                          className="text-neutral-500 hover:text-rose-400 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {a.note && (
                      <p className="text-neutral-400 text-xs leading-relaxed mt-2 border-l-2 border-yellow-400/30 pl-3">{a.note}</p>
                    )}
                    {a.source && (
                      <p className="text-[10px] text-neutral-500 font-mono mt-2 uppercase tracking-wider">
                        Source: {a.source}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-600 text-xs py-8 text-center font-mono uppercase tracking-wider">
                {annotations.length === 0
                  ? 'No annotations yet. Add terms above to build your research layer.'
                  : 'No annotations match the current search.'}
              </div>
            )}
          </div>
        )}

        {activeTab === 'citations' && (
          <div className="space-y-4 font-sans">
            {compiledCitations.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs text-neutral-500 font-mono uppercase tracking-wider">
                  {compiledCitations.length} citation{compiledCitations.length !== 1 ? 's' : ''} detected across completed pages
                </div>
                {Object.entries(groupedCitations).map(([type, items]) => (
                  <div key={type} className="bg-black border border-neutral-900 overflow-hidden">
                    <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center gap-2">
                      <Quote className="h-3.5 w-3.5 text-yellow-400" />
                      <span className="text-[10px] font-black text-yellow-400 uppercase tracking-wider font-mono">
                        {CITATION_LABELS[type] || type}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono ml-auto">
                        {items.length}
                      </span>
                    </div>
                    <div className="divide-y divide-neutral-900">
                      {items.map((c, idx) => (
                        <div key={idx} className="px-4 py-2.5 flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-200 font-medium leading-relaxed">{c.text}</span>
                          <span className="text-[9px] bg-neutral-900 text-neutral-400 font-mono px-1.5 py-0.5 rounded-none border border-neutral-800 shrink-0">
                            P. {c.pageNum}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-600 text-xs py-8 text-center font-mono uppercase tracking-wider">
                No citations detected yet. Citations are extracted automatically during translation.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

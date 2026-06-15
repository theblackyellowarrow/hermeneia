import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import SettingsBar from './components/SettingsBar';
import DocumentSourcePanel from './components/DocumentSourcePanel';
import TranslationViewer from './components/TranslationViewer';
import PageGrid from './components/PageGrid';
import WorkspaceTabs from './components/WorkspaceTabs';
import GlossaryPanel from './components/GlossaryPanel';
import HistorySidebar from './components/HistorySidebar';
import ExportModal from './components/ExportModal';
import { useDocumentSource, useDragDrop } from './hooks/useDocumentSource';
import { useAnnotations } from './hooks/useAnnotations';
import { translatePage, translateText } from './services/translatorRouter';
import { getPageSourceData as parsePage } from './services/documentParser';
import { generatePlaintextReport, generatePrintHTML } from './services/exportService';
import { copyToClipboard, speakText } from './utils/helpers';
import { HISTORY_STORAGE_KEY, DEFAULT_GLOSSARY } from './utils/constants';

const apiKeys = {
  openai: import.meta.env.VITE_OPENAI_API_KEY || '',
  deepseek: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
};

export default function App() {
  const [inputMode, setInputMode] = useState('document');
  const [sourceText, setSourceText] = useState('');
  const [direction, setDirection] = useState('RU_TO_EN');
  const [profile, setProfile] = useState('art_history');
  const [isLoading, setIsLoading] = useState(false);

  const [pdfDocument, setPdfDocument] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const [processingStatus, setProcessingStatus] = useState('idle');
  const [ocrMode, setOcrMode] = useState('auto');
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(10);
  const [concurrency, setConcurrency] = useState(3);
  const [activePageList, setActivePageList] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [translatedPages, setTranslatedPages] = useState({});

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTitle, setExportTitle] = useState('');
  const [exportAuthor, setExportAuthor] = useState('Hermeneia Translation Suite');
  const [includeCover, setIncludeCover] = useState(true);
  const [includeLexicon, setIncludeLexicon] = useState(true);
  const [exportFont, setExportFont] = useState('serif');

  const [vocabSearch, setVocabSearch] = useState('');
  const [customGlossary, setCustomGlossary] = useState(DEFAULT_GLOSSARY);
  const [newGlossaryTerm, setNewGlossaryTerm] = useState({ word: '', meaning: '' });
  const [activeTab, setActiveTab] = useState('translation');
  const [isCopied, setIsCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [activeWorkerCount, setActiveWorkerCount] = useState(0);

  const queuePagesRef = useRef([]);
  const activeWorkersCountRef = useRef(0);
  const isTranslatingRef = useRef(false);
  const abortControllersRef = useRef({});

  const { pdfjsLoaded, pdfjsError, fileInputRef } = useDocumentSource();
  const { dragActive, handleDragOver, handleDrop } = useDragDrop();
  const {
    annotations, annotationSearch, setAnnotationSearch,
    newAnnotation, setNewAnnotation, addAnnotation: addAnnot,
    removeAnnotation, filteredAnnotations,
  } = useAnnotations();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) { console.error('Failed to load history', e); }
  }, []);

  useEffect(() => {
    if (processingStatus === 'translating') {
      isTranslatingRef.current = true;
      startConcurrentQueue();
    } else {
      isTranslatingRef.current = false;
    }
  }, [processingStatus]);

  useEffect(() => () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  const cancelAllActiveRequests = () => {
    Object.keys(abortControllersRef.current).forEach(key => {
      if (abortControllersRef.current[key]) abortControllersRef.current[key].abort();
    });
    abortControllersRef.current = {};
  };

  const clearCurrentWorkspace = () => {
    cancelAllActiveRequests();
    setPdfDocument(null);
    setUploadedFile(null);
    setTotalPages(0);
    setCurrentPageIndex(1);
    setProcessingStatus('idle');
    setTranslatedPages({});
    setSourceText('');
    setError(null);
    queuePagesRef.current = [];
    activeWorkersCountRef.current = 0;
    setActiveWorkerCount(0);
  };

  const handleFileChange = (file) => {
    if (!file) return;
    const maxLimit = 10 * 1024 * 1024;
    if (file.size > maxLimit) { setError('File exceeds the 10MB limit.'); return; }
    if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
      setError('Unsupported format. Upload a PDF or standard image asset.');
      return;
    }

    cancelAllActiveRequests();
    clearCurrentWorkspace();
    const titleDefault = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    setExportTitle(titleDefault);

    const isPdf = file.type === 'application/pdf';
    const reader = new FileReader();

    if (isPdf) {
      reader.onload = async (e) => {
        try {
          const pdf = await window.pdfjsLib.getDocument({ data: e.target.result }).promise;
          setPdfDocument(pdf);
          setUploadedFile({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(2) + ' MB', type: file.type });
          setTotalPages(pdf.numPages);
          setCurrentPageIndex(1);
          setRangeEnd(pdf.numPages);
          setActivePageList(Array.from({ length: pdf.numPages }, (_, i) => i + 1));
          setProcessingStatus('paused');
        } catch (err) {
          console.error('Critical error reading PDF:', err);
          setError('Error setting up PDF library engine. Retry uploading file.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (e) => {
        setUploadedFile({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(2) + ' MB', type: file.type, base64: e.target.result.split(',')[1] });
        setTotalPages(1);
        setCurrentPageIndex(1);
        setRangeEnd(1);
        setActivePageList([1]);
        setProcessingStatus('paused');
      };
      reader.readAsDataURL(file);
    }
  };

  const logCompletedSession = () => {
    const item = {
      id: Date.now(),
      fileName: uploadedFile?.name || 'Manual Text Segment',
      direction,
      pagesTranslated: Object.keys(translatedPages).filter(k => translatedPages[k].status === 'completed').length,
      profile,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setHistory(prev => {
      const updated = [item, ...prev.slice(0, 19)];
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const startConcurrentQueue = () => {
    if (queuePagesRef.current.length === 0) {
      const start = isRangeMode ? Math.max(1, rangeStart) : 1;
      const end = isRangeMode ? Math.min(totalPages, rangeEnd) : totalPages;
      const pendingList = [];
      for (let p = start; p <= end; p++) {
        if (!translatedPages[p] || translatedPages[p].status !== 'completed') {
          pendingList.push(p);
          setTranslatedPages(prev => ({ ...prev, [p]: { ...(prev[p] || {}), status: 'pending' } }));
        }
      }
      queuePagesRef.current = pendingList;
    }
    const maxWorkers = Math.min(concurrency, queuePagesRef.current.length);
    while (activeWorkersCountRef.current < maxWorkers && isTranslatingRef.current) {
      spawnWorker();
    }
  };

  const spawnWorker = async () => {
    if (!isTranslatingRef.current || queuePagesRef.current.length === 0) {
      if (activeWorkersCountRef.current === 0 && queuePagesRef.current.length === 0) {
        setProcessingStatus('completed');
        logCompletedSession();
      }
      return;
    }
    const pageNum = queuePagesRef.current.shift();
    activeWorkersCountRef.current += 1;
    setActiveWorkerCount(activeWorkersCountRef.current);
    setTranslatedPages(prev => ({ ...prev, [pageNum]: { ...(prev[pageNum] || {}), status: 'translating' } }));
    try {
      await translateSpecificPage(pageNum);
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error(`Worker failed on page ${pageNum}`, e);
        const errMsg = e.message || String(e);
        setTranslatedPages(prev => ({ ...prev, [pageNum]: { ...(prev[pageNum] || {}), status: 'error', error: errMsg } }));
      }
    } finally {
      activeWorkersCountRef.current -= 1;
      setActiveWorkerCount(activeWorkersCountRef.current);
      spawnWorker();
    }
  };

  const translateSpecificPage = async (pageNum) => {
    if (abortControllersRef.current[pageNum]) abortControllersRef.current[pageNum].abort();
    const controller = new AbortController();
    abortControllersRef.current[pageNum] = controller;

    try {
      const pageData = await parsePage(pdfDocument, pageNum, ocrMode);
      if (!pageData) throw new Error(`Unable to fetch content data from page ${pageNum}`);

      const parsed = await translatePage({
        pageData,
        direction,
        profile,
        customGlossary,
        apiKeys,
        signal: controller.signal,
      });

      setTranslatedPages(prev => ({ ...prev, [pageNum]: { ...parsed, status: 'completed' } }));
      setCurrentPageIndex(pageNum);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log(`Page ${pageNum} translation aborted.`);
      } else {
        throw err;
      }
    } finally {
      delete abortControllersRef.current[pageNum];
    }
  };

  const handleTranslateManualText = async () => {
    if (!sourceText.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const parsed = await translateText({
        sourceText,
        direction,
        profile,
        customGlossary,
        apiKeys,
      });
      setTranslatedPages({ 1: { ...parsed, status: 'completed' } });
      setTotalPages(1);
      setCurrentPageIndex(1);
    } catch (err) {
      console.error(err);
      setError('Manual text translation failed. Verify spelling or connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  const retrySinglePage = (pageNum) => {
    if (processingStatus === 'translating') {
      if (!queuePagesRef.current.includes(pageNum)) queuePagesRef.current.push(pageNum);
    } else {
      setTranslatedPages(prev => ({ ...prev, [pageNum]: { ...(prev[pageNum] || {}), status: 'pending' } }));
      setProcessingStatus('translating');
      queuePagesRef.current = [pageNum];
    }
  };

  const downloadReport = () => {
    const content = generatePlaintextReport(translatedPages, totalPages, uploadedFile, profile, direction, annotations);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Hermeneia_Translation_${uploadedFile?.name?.replace(/\.[^/.]+$/, '') || 'Dossier'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const compileAndPrintPDF = () => {
    const html = generatePrintHTML(translatedPages, totalPages, direction, exportTitle, exportAuthor, exportFont, includeCover, includeLexicon, annotations);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Hermeneia_Printable_${exportTitle?.replace(/\s+/g, '_') || 'Book'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const addGlossaryTerm = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newGlossaryTerm.word || !newGlossaryTerm.meaning) return;
    if (customGlossary.some(item => item.word.toLowerCase() === newGlossaryTerm.word.toLowerCase())) {
      setNewGlossaryTerm({ word: '', meaning: '' });
      return;
    }
    setCustomGlossary(prev => [...prev, newGlossaryTerm]);
    setNewGlossaryTerm({ word: '', meaning: '' });
  };

  const insertPresetTerm = (preset) => {
    if (customGlossary.some(item => item.word.toLowerCase() === preset.word.toLowerCase())) return;
    setCustomGlossary(prev => [...prev, preset]);
  };

  const removeGlossaryTerm = (index) => {
    setCustomGlossary(prev => prev.filter((_, idx) => idx !== index));
  };

  const activePageData = translatedPages[currentPageIndex] || null;

  const compiledVocabulary = Object.keys(translatedPages)
    .filter(p => translatedPages[p].status === 'completed')
    .flatMap(p => (translatedPages[p].vocabulary || []).map(v => ({ ...v, pageNum: p })));

  const filteredVocab = compiledVocabulary.filter(v =>
    v.word.toLowerCase().includes(vocabSearch.toLowerCase()) ||
    v.meaning.toLowerCase().includes(vocabSearch.toLowerCase()) ||
    (v.grammar && v.grammar.toLowerCase().includes(vocabSearch.toLowerCase()))
  );

  const compiledCitations = Object.keys(translatedPages)
    .filter(p => translatedPages[p].status === 'completed')
    .flatMap(p => (translatedPages[p].citations || []).map(c => ({ ...c, pageNum: Number(p) })));

  const hasCompletedPages = Object.keys(translatedPages).filter(k => translatedPages[k].status === 'completed').length > 0;

  const handleSpeakSource = () => speakText(sourceText, direction === 'RU_TO_EN' ? 'ru-RU' : 'en-US');
  const handleSpeakTarget = () => speakText(activePageData?.translation || '', direction === 'RU_TO_EN' ? 'en-US' : 'ru-RU');
  const handleCopy = () => {
    copyToClipboard(activePageData?.translation || '');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  const handleClearCopiedAndPage = (pageNum) => { setIsCopied(false); setCurrentPageIndex(pageNum); };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans flex flex-col selection:bg-yellow-400 selection:text-black">
      <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files?.[0])} accept=".pdf, image/*" className="hidden" />

      <Header
        inputMode={inputMode}
        showHistory={showHistory}
        history={history}
        onModeChange={(mode) => { setInputMode(mode); clearCurrentWorkspace(); setError(null); }}
        onToggleHistory={() => setShowHistory(!showHistory)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className={`flex flex-col gap-6 ${showHistory ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all duration-300`}>
          <SettingsBar
            direction={direction}
            profile={profile}
            onToggleDirection={() => setDirection(direction === 'RU_TO_EN' ? 'EN_TO_RU' : 'RU_TO_EN')}
            onProfileChange={setProfile}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DocumentSourcePanel
              inputMode={inputMode}
              pdfjsLoaded={pdfjsLoaded}
              pdfjsError={pdfjsError}
              uploadedFile={uploadedFile}
              totalPages={totalPages}
              isRangeMode={isRangeMode}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              concurrency={concurrency}
              processingStatus={processingStatus}
              ocrMode={ocrMode}
              translatedPages={translatedPages}
              sourceText={sourceText}
              direction={direction}
              dragActive={dragActive}
              error={error}
              fileInputRef={fileInputRef}
              isLoading={isLoading}
              onFileChange={(e) => handleFileChange(e.target.files?.[0])}
              onDrag={handleDragOver}
              onDrop={(e) => handleDrop(e, handleFileChange)}
              onSourceTextChange={(e) => setSourceText(e.target.value)}
              onRangeModeChange={setIsRangeMode}
              onRangeStartChange={(v) => setRangeStart(Math.max(1, Math.min(totalPages, Number(v))))}
              onRangeEndChange={(v) => setRangeEnd(Math.max(rangeStart, Math.min(totalPages, Number(v))))}
              onConcurrencyChange={(v) => setConcurrency(Number(v))}
              onOcrModeChange={setOcrMode}
              onStartQueue={() => setProcessingStatus('translating')}
              onPauseQueue={() => setProcessingStatus('paused')}
              onPurgeCache={() => { setProcessingStatus('idle'); setTranslatedPages({}); queuePagesRef.current = []; }}
              onClearWorkspace={clearCurrentWorkspace}
              onSpeakSource={handleSpeakSource}
              onTranslateManual={handleTranslateManualText}
            />

            <TranslationViewer
              translatedPages={translatedPages}
              currentPageIndex={currentPageIndex}
              totalPages={totalPages}
              processingStatus={processingStatus}
              activeWorkerCount={activeWorkerCount}
              isCopied={isCopied}
              hasCompletedPages={hasCompletedPages}
              onPrevPage={() => handleClearCopiedAndPage(Math.max(1, currentPageIndex - 1))}
              onNextPage={() => handleClearCopiedAndPage(Math.min(totalPages, currentPageIndex + 1))}
              onSpeak={handleSpeakTarget}
              onCopy={handleCopy}
              onExport={() => setShowExportModal(true)}
              onDownloadReport={downloadReport}
              onRetryPage={retrySinglePage}
            />
          </div>

          <PageGrid
            activePageList={activePageList}
            translatedPages={translatedPages}
            currentPageIndex={currentPageIndex}
            isRangeMode={isRangeMode}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            totalPages={totalPages}
            uploadedFile={uploadedFile}
            onSelectPage={handleClearCopiedAndPage}
          />

          <WorkspaceTabs
            activeTab={activeTab}
            hasPages={Object.keys(translatedPages).length > 0}
            compiledVocabulary={compiledVocabulary}
            compiledCitations={compiledCitations}
            filteredVocabulary={filteredVocab}
            vocabSearch={vocabSearch}
            activePageData={activePageData}
            currentPageIndex={currentPageIndex}
            annotations={annotations}
            annotationSearch={annotationSearch}
            newAnnotation={newAnnotation}
            filteredAnnotations={filteredAnnotations}
            onTabChange={setActiveTab}
            onVocabSearchChange={setVocabSearch}
            onAnnotationSearchChange={setAnnotationSearch}
            onNewAnnotationChange={setNewAnnotation}
            onAddAnnotation={(e) => addAnnot(e, currentPageIndex)}
            onRemoveAnnotation={removeAnnotation}
          />

          <GlossaryPanel
            customGlossary={customGlossary}
            newGlossaryTerm={newGlossaryTerm}
            onNewTermChange={setNewGlossaryTerm}
            onAddTerm={addGlossaryTerm}
            onRemoveTerm={removeGlossaryTerm}
            onInsertPreset={insertPresetTerm}
          />
        </section>

        <HistorySidebar showHistory={showHistory} history={history} onClearHistory={() => { setHistory([]); localStorage.removeItem(HISTORY_STORAGE_KEY); }} />
      </main>

      <ExportModal
        show={showExportModal}
        exportTitle={exportTitle}
        exportAuthor={exportAuthor}
        includeCover={includeCover}
        includeLexicon={includeLexicon}
        exportFont={exportFont}
        onClose={() => setShowExportModal(false)}
        onTitleChange={setExportTitle}
        onAuthorChange={setExportAuthor}
        onCoverChange={setIncludeCover}
        onLexiconChange={setIncludeLexicon}
        onFontChange={setExportFont}
        onGenerate={compileAndPrintPDF}
      />

      <footer className="border-t-2 border-neutral-900 bg-neutral-950 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest font-mono">
            Hermeneia / Russian–English translation and annotation for art, design, museum and archive research
          </p>
          <p className="text-xs text-neutral-600 font-sans">
            Supporting high-fidelity, context-aware analysis of Central, South, and East Asian material archives, prints, manuscripts, and museological documentation.
          </p>
        </div>
      </footer>
    </div>
  );
}

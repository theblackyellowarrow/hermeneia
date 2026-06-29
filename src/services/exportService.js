import { escapeHtml } from '../utils/helpers';
import { CITATION_LABELS } from '../utils/constants';

export function generatePlaintextReport(translatedPages, totalPages, uploadedFile, profile, direction, annotations) {
  const completedPages = getCompletedPages(translatedPages);

  let content = `========================================================\nSLOVO TRANSLATION DOSSIER\nRussian–English Scholarly Translation Studio\ndotai.org\n========================================================\nOriginal File: ${uploadedFile?.name || 'Manual Text Segment'}\nProfile Match: ${profile.toUpperCase()}\nDirection: ${direction === 'RU_TO_EN' ? 'Russian to English' : 'English to Russian'}\n========================================================\n\n`;

  completedPages.forEach(p => {
    content += `--- PAGE ${p} of ${totalPages} ---\n\n${translatedPages[p].translation}\n\n`;
  });

  const vocab = compileVocabulary(completedPages, translatedPages);
  if (vocab.length > 0) {
    content += `\n\n========================================================\nCUMULATIVE LEXICON INDEX\n========================================================\n`;
    vocab.forEach((v, i) => {
      content += `${i + 1}. [${v.grammar || 'Term'}] ${v.word} → ${v.meaning}\n`;
    });
  }

  if (annotations.length > 0) {
    content += `\n\n========================================================\nRESEARCHER ANNOTATIONS\n========================================================\n`;
    annotations.forEach((a, i) => {
      content += `${i + 1}. [${a.confidence.toUpperCase()}] ${a.term} → ${a.translation}\n`;
      if (a.note) content += `   Note: ${a.note}\n`;
      if (a.source) content += `   Source: ${a.source}\n`;
      content += `   Page: ${a.pageNum}\n`;
    });
  }

  const citations = compileCitations(completedPages, translatedPages);
  if (citations.length > 0) {
    content += `\n\n========================================================\nDETECTED CITATIONS\n========================================================\n`;
    citations.forEach((c, i) => {
      content += `${i + 1}. [${c.type}] ${c.text} (Page ${c.pageNum})\n`;
    });
  }

  return content;
}

export function generatePrintHTML(translatedPages, totalPages, direction, exportTitle, exportAuthor, exportFont, includeCover, includeLexicon, annotations) {
  const completedPages = getCompletedPages(translatedPages);

  let html = `<!DOCTYPE html><html><head><title>${escapeHtml(exportTitle) || 'Slovo Publication'}</title><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=IBM+Plex+Mono:wght@400;600;700&display=swap');@page{size:A4;margin:20mm 15mm}body{margin:0;color:#111;background:#fff;font-family:'Georgia','Times New Roman',serif;line-height:1.7;font-size:11pt;-webkit-print-color-adjust:exact;print-color-adjust:exact}.cover-page{height:100vh;page-break-after:always;display:flex;flex-direction:column;justify-content:space-between;padding:40px 10px;box-sizing:border-box;background:#000;color:#f2f2f2}.cover-top{font-family:'IBM Plex Mono',monospace;font-size:10pt;text-transform:uppercase;letter-spacing:3px;font-weight:700;color:#18F3F5;display:flex;align-items:center;gap:8px}.cover-indicator{width:12px;height:12px;background:#18F3F5;border:2px solid #18F3F5}.cover-middle{margin:auto 0}.cover-title{font-family:'Georgia',serif;font-size:28pt;font-weight:400;line-height:1.15;margin:0 0 12px;color:#f2f2f2;border-left:6px solid #00d8cf;padding-left:20px}.cover-subtitle{font-family:'Inter',sans-serif;font-size:9pt;text-transform:uppercase;letter-spacing:2px;font-weight:600;color:#8a8a8a;margin-top:8px}.cover-bottom{font-family:'IBM Plex Mono',monospace;font-size:8pt;text-transform:uppercase;letter-spacing:1px;color:#6d6d6d;border-top:1px solid #1a1a1a;padding-top:16px}.page-container{page-break-after:always;padding-top:15px;box-sizing:border-box}.page-header{font-family:'IBM Plex Mono',monospace;font-size:7pt;text-transform:uppercase;letter-spacing:2px;color:#999;border-bottom:1px solid #e5e7eb;padding-bottom:8px;margin-bottom:25px;display:flex;justify-content:space-between}.page-content{white-space:pre-wrap;text-align:justify;font-family:'Georgia',serif}.appendix-title{font-family:'Inter',sans-serif;font-size:16pt;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:16px}.lexicon-grid{width:100%;border-collapse:collapse;margin-top:12px;font-family:'IBM Plex Mono',monospace}.lexicon-grid th,.lexicon-grid td{border:1px solid #e5e7eb;padding:8px 10px;font-size:8.5pt;text-align:left}.lexicon-grid th{background:#f9fafb;text-transform:uppercase;letter-spacing:1px;font-size:7pt;font-weight:700}.lexicon-word{font-weight:700;color:#000}.lexicon-grammar{font-size:7pt;background:#f3f4f6;padding:2px 6px;border-radius:2px;font-weight:700;text-transform:uppercase}</style></head><body>`;

  if (includeCover) {
    html += `<div class="cover-page"><div class="cover-top"><span class="cover-indicator"></span><span>SLOVO</span></div><div class="cover-middle"><h1 class="cover-title">${escapeHtml(exportTitle) || 'Untranslated Dossier'}</h1><div class="cover-subtitle">Russian–English Scholarly Translation Studio</div></div><div class="cover-bottom"><div><strong>Profile:</strong> ${profile.toUpperCase()}</div><div style="margin-top:4px"><strong>Direction:</strong> ${direction === 'RU_TO_EN' ? 'Russian → English' : 'English → Russian'}</div><div style="margin-top:8px;color:#18F3F5">dotai.org</div></div></div>`;
  }

  completedPages.forEach(p => {
    html += `<div class="page-container"><div class="page-header"><span>${escapeHtml(exportTitle) || 'TRANSLATION DOSSIER'}</span><span>Page ${p} of ${totalPages}</span></div><div class="page-content">${translatedPages[p].translation}</div></div>`;
  });

  if (includeLexicon) {
    const vocab = compileVocabulary(completedPages, translatedPages);
    if (vocab.length > 0) {
      html += `<div class="page-container"><div class="page-header"><span>APPENDIX: LEXICON</span><span>INDEX</span></div><h2 class="appendix-title">LEXICON</h2><table class="lexicon-grid"><thead><tr><th>Original Term</th><th>Grammar Detail</th><th>Target Equivalents</th></tr></thead><tbody>`;
      vocab.forEach(v => {
        html += `<tr><td class="lexicon-word">${escapeHtml(v.word)}</td><td><span class="lexicon-grammar">${escapeHtml(v.grammar) || 'Term'}</span></td><td>${escapeHtml(v.meaning)}</td></tr>`;
      });
      html += `</tbody></table></div>`;
    }
  }

  if (annotations.length > 0) {
    html += `<div class="page-container"><div class="page-header"><span>APPENDIX: RESEARCHER ANNOTATIONS</span><span>INDEX</span></div><h2 class="appendix-title">ANNOTATION LAYER</h2><table class="lexicon-grid"><thead><tr><th>Term</th><th>Translation</th><th>Confidence</th><th>Note / Source</th></tr></thead><tbody>`;
    annotations.forEach(a => {
      const detail = [];
      if (a.note) detail.push(escapeHtml(a.note));
      if (a.source) detail.push(`Source: ${escapeHtml(a.source)}`);
      html += `<tr><td class="lexicon-word">${escapeHtml(a.term)}</td><td>${escapeHtml(a.translation)}</td><td><span class="lexicon-grammar">${a.confidence.toUpperCase()} · P. ${a.pageNum}</span></td><td>${detail.join('<br/>') || '—'}</td></tr>`;
    });
    html += `</tbody></table></div>`;
  }

  const citations = compileCitations(completedPages, translatedPages);
  if (citations.length > 0) {
    html += `<div class="page-container"><div class="page-header"><span>APPENDIX: DETECTED CITATIONS</span><span>INDEX</span></div><h2 class="appendix-title">CITATION REGISTER</h2><table class="lexicon-grid"><thead><tr><th>Type</th><th>Citation Text</th><th>Page</th></tr></thead><tbody>`;
    citations.forEach(c => {
      html += `<tr><td><span class="lexicon-grammar">${escapeHtml(CITATION_LABELS[c.type] || c.type)}</span></td><td class="lexicon-word">${escapeHtml(c.text)}</td><td>${c.pageNum}</td></tr>`;
    });
    html += `</tbody></table></div>`;
  }

  html += `<script>window.onload=function(){setTimeout(function(){window.print()},600)}</script></body></html>`;
  return html;
}

function getCompletedPages(translatedPages) {
  return Object.keys(translatedPages).filter(k => translatedPages[k].status === 'completed').sort((a, b) => Number(a) - Number(b));
}

function compileVocabulary(completedPages, translatedPages) {
  return completedPages.flatMap(p => (translatedPages[p].vocabulary || []).map(v => ({ ...v, pageNum: p })));
}

function compileCitations(completedPages, translatedPages) {
  return completedPages.flatMap(p => (translatedPages[p].citations || []).map(c => ({ ...c, pageNum: p })));
}

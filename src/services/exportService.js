import { escapeHtml } from '../utils/helpers';
import { CITATION_LABELS } from '../utils/constants';

export function generatePlaintextReport(translatedPages, totalPages, uploadedFile, profile, direction, annotations) {
  const completedPages = getCompletedPages(translatedPages);

  let content = `========================================================\nHERMENEIA TRANSLATION DOSSIER\n========================================================\nOriginal File: ${uploadedFile?.name || 'Manual Text Segment'}\nProfile Match: ${profile.toUpperCase()}\nDirection: ${direction === 'RU_TO_EN' ? 'Russian to English' : 'English to Russian'}\n========================================================\n\n`;

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

  const fontStyle = exportFont === 'serif'
    ? "font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.7;"
    : "font-family: 'Inter', -apple-system, sans-serif; line-height: 1.6;";

  let html = `<!DOCTYPE html><html><head><title>${escapeHtml(exportTitle) || 'Hermeneia Publication'}</title><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');@page{size:A4;margin:20mm 15mm}body{margin:0;color:#111;background:#fff;${fontStyle}font-size:11pt;-webkit-print-color-adjust:exact;print-color-adjust:exact}.cover-page{height:100vh;page-break-after:always;display:flex;flex-direction:column;justify-content:space-between;padding:40px 10px;box-sizing:border-box}.cover-top{font-family:'Inter',sans-serif;font-size:10pt;text-transform:uppercase;letter-spacing:2px;font-weight:800;color:#000;display:flex;align-items:center;gap:8px}.cover-indicator{width:12px;height:12px;background:#FFE500;border:2px solid #000}.cover-middle{margin:auto 0}.cover-title{font-family:'Inter',sans-serif;font-size:32pt;font-weight:900;text-transform:uppercase;line-height:1.1;margin:0 0 15px;color:#000;letter-spacing:-1px;border-left:8px solid #FFE500;padding-left:20px}.cover-subtitle{font-family:'Inter',sans-serif;font-size:11pt;text-transform:uppercase;letter-spacing:1px;font-weight:600;color:#666;margin-top:10px}.cover-bottom{font-family:'Inter',sans-serif;font-size:9pt;text-transform:uppercase;letter-spacing:1px;color:#444;border-top:2px solid #222;padding-top:20px}.page-container{page-break-after:always;padding-top:15px;box-sizing:border-box}.page-header{font-family:'Inter',sans-serif;font-size:8pt;text-transform:uppercase;letter-spacing:1.5px;color:#888;border-bottom:1px solid #e5e7eb;padding-bottom:8px;margin-bottom:25px;display:flex;justify-content:space-between}.page-content{white-space:pre-wrap;text-align:justify}.appendix-title{font-family:'Inter',sans-serif;font-size:20pt;font-weight:900;text-transform:uppercase;letter-spacing:-.5px;border-bottom:3px solid #000;padding-bottom:8px;margin-bottom:20px}.lexicon-grid{width:100%;border-collapse:collapse;margin-top:15px}.lexicon-grid th,.lexicon-grid td{border:1px solid #e5e7eb;padding:10px 12px;font-size:9.5pt;text-align:left}.lexicon-grid th{font-family:'Inter',sans-serif;background:#f9fafb;text-transform:uppercase;letter-spacing:1px;font-size:8pt;font-weight:800}.lexicon-word{font-weight:bold;color:#000}.lexicon-grammar{font-family:'Inter',sans-serif;font-size:7.5pt;background:#f3f4f6;padding:2px 6px;border-radius:3px;font-weight:bold;text-transform:uppercase}</style></head><body>`;

  if (includeCover) {
    html += `<div class="cover-page"><div class="cover-top"><span class="cover-indicator"></span><span>HERMENEIA EXPORT</span></div><div class="cover-middle"><h1 class="cover-title">${escapeHtml(exportTitle) || 'Untranslated Publication Dossier'}</h1><div class="cover-subtitle">Translation & Annotation Dossier for Art, Design, Museum & Archive Research</div></div><div class="cover-bottom"><div><strong>Compiler:</strong> ${escapeHtml(exportAuthor) || 'Hermeneia Suite'}</div><div style="margin-top:4px"><strong>Methodology:</strong> OpenAI + DeepSeek Multi-Worker Pipeline</div><div style="margin-top:4px"><strong>Translation Scope:</strong> ${direction === 'RU_TO_EN' ? 'Russian to English' : 'English to Russian'}</div></div></div>`;
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

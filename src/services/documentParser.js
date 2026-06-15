export async function getPageSourceData(pdfDocument, pageNum, ocrMode) {
  if (!pdfDocument) return null;

  const page = await pdfDocument.getPage(pageNum);

  let extractedText = '';
  if (ocrMode === 'auto') {
    const textContent = await page.getTextContent();
    let lastY = null;
    const lineSegments = [];

    textContent.items.forEach(item => {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 2) {
        lineSegments.push('\n');
      } else if (lineSegments.length > 0 && !lineSegments[lineSegments.length - 1].endsWith(' ') && !item.str.startsWith(' ')) {
        lineSegments.push(' ');
      }
      lineSegments.push(item.str);
      lastY = item.transform[5];
    });

    extractedText = lineSegments.join('');
  }

  if (extractedText.trim().length > 50 && ocrMode !== 'force_ocr') {
    return { type: 'text', content: extractedText };
  }

  const viewport = page.getViewport({ scale: 2.0 });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';

  await page.render({ canvasContext: context, viewport }).promise;
  const base64Image = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];

  return { type: 'image', content: base64Image };
}

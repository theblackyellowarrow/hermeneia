export async function getPageSourceData(pdfDocument, pageNum, ocrMode) {
  if (!pdfDocument) return null;

  const page = await pdfDocument.getPage(pageNum);

  let extractedText = '';

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

  const hasText = extractedText.trim().length > 10;

  if (ocrMode === 'force_ocr' || !hasText) {
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'medium';

    await page.render({ canvasContext: context, viewport }).promise;
    const base64Image = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];

    return { type: 'image', content: base64Image };
  }

  return { type: 'text', content: extractedText };
}

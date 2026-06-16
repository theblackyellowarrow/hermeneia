import { openaiOcr } from './openaiClient';
import { deepseekTranslate } from './deepseekClient';
import { buildSystemPrompt } from './promptBuilder';

function cleanAndParse(raw) {
  let text = raw.trim();
  if (text.startsWith('```json')) text = text.substring(7);
  if (text.startsWith('```')) text = text.substring(3);
  if (text.endsWith('```')) text = text.substring(0, text.length - 3);
  text = text.trim();
  return JSON.parse(text);
}

async function translateRoute(sourceText, direction, profile, customGlossary, apiKeys, signal) {
  const sourceLang = direction === 'RU_TO_EN' ? 'Russian' : 'English';
  const targetLang = direction === 'RU_TO_EN' ? 'English' : 'Russian';
  const systemPrompt = buildSystemPrompt(sourceLang, targetLang, profile, customGlossary);

  const raw = await deepseekTranslate(sourceText, systemPrompt, apiKeys.deepseek, signal);
  if (!raw) throw new Error('DeepSeek translation returned empty result.');

  return cleanAndParse(raw);
}

export async function translatePage({ pageData, direction, profile, customGlossary, apiKeys, signal }) {
  let sourceText;
  if (pageData.type === 'image') {
    sourceText = await openaiOcr(pageData.content, apiKeys.openai, signal);
    if (!sourceText) throw new Error('OpenAI OCR returned empty result.');
  } else {
    sourceText = pageData.content;
  }

  return translateRoute(sourceText, direction, profile, customGlossary, apiKeys, signal);
}

export async function translateText({ sourceText, direction, profile, customGlossary, apiKeys, signal }) {
  return translateRoute(sourceText, direction, profile, customGlossary, apiKeys, signal);
}

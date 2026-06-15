import { openaiOcr, openaiPolish } from './openaiClient';
import { deepseekTranslate } from './deepseekClient';
import { buildSystemPrompt } from './promptBuilder';

export async function translatorRouter({ task, payload, apiKeys, signal }) {
  switch (task) {
    case 'ocr':
      return ocrRoute(payload.imageBase64, apiKeys.openai, signal);
    case 'translate':
      return translateRoute(payload.sourceText, payload.direction, payload.profile, payload.customGlossary, apiKeys, signal);
    case 'polish':
      return polishRoute(payload.rawJson, apiKeys.openai, signal);
    default:
      throw new Error(`Unknown translator task: ${task}`);
  }
}

async function ocrRoute(imageBase64, apiKey, signal) {
  const text = await openaiOcr(imageBase64, apiKey, signal);
  if (!text) throw new Error('OpenAI OCR returned empty result.');
  return text;
}

async function translateRoute(sourceText, direction, profile, customGlossary, apiKeys, signal) {
  const sourceLang = direction === 'RU_TO_EN' ? 'Russian' : 'English';
  const targetLang = direction === 'RU_TO_EN' ? 'English' : 'Russian';
  const systemPrompt = buildSystemPrompt(sourceLang, targetLang, profile, customGlossary);

  const raw = await deepseekTranslate(sourceText, systemPrompt, apiKeys.deepseek, signal);
  if (!raw) throw new Error('DeepSeek translation returned empty result.');

  return raw;
}

async function polishRoute(rawJson, apiKey, signal) {
  const parsed = await openaiPolish(rawJson, apiKey, signal);
  return parsed;
}

export async function translatePage({ pageData, direction, profile, customGlossary, apiKeys, signal }) {
  let sourceText;
  if (pageData.type === 'image') {
    sourceText = await translatorRouter({
      task: 'ocr',
      payload: { imageBase64: pageData.content },
      apiKeys,
      signal,
    });
  } else {
    sourceText = pageData.content;
  }

  const rawTranslation = await translatorRouter({
    task: 'translate',
    payload: { sourceText, direction, profile, customGlossary },
    apiKeys,
    signal,
  });

  return translatorRouter({
    task: 'polish',
    payload: { rawJson: rawTranslation },
    apiKeys,
    signal,
  });
}

export async function translateText({ sourceText, direction, profile, customGlossary, apiKeys, signal }) {
  const rawTranslation = await translatorRouter({
    task: 'translate',
    payload: { sourceText, direction, profile, customGlossary },
    apiKeys,
    signal,
  });

  return translatorRouter({
    task: 'polish',
    payload: { rawJson: rawTranslation },
    apiKeys,
    signal,
  });
}

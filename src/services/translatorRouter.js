import { openaiOcr, openaiChat } from './openaiClient';
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

function isRefusal(text) {
  if (!text) return true;
  const lower = text.toLowerCase().trim();
  return lower.startsWith("i'm sorry") || lower.startsWith("i cannot") || lower.startsWith("i can't");
}

async function translateWithOpenAI(sourceText, direction, profile, customGlossary, apiKey, signal) {
  const sourceLang = direction === 'RU_TO_EN' ? 'Russian' : 'English';
  const targetLang = direction === 'RU_TO_EN' ? 'English' : 'Russian';
  const systemPrompt = buildSystemPrompt(sourceLang, targetLang, profile, customGlossary);

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Translate the following text according to the system instructions:\n\n${sourceText}` },
  ];

  const raw = await openaiChat(messages, { apiKey, model: 'gpt-4o-mini', temperature: 0.1, signal });
  if (!raw || isRefusal(raw)) throw new Error('OpenAI refused this content.');
  return cleanAndParse(raw);
}

export async function translatePage({ pageData, direction, profile, customGlossary, apiKeys, signal }) {
  let sourceText;
  if (pageData.type === 'image') {
    if (!apiKeys.openai) throw new Error('OCR requires an OpenAI API key. Add yours in Settings.');
    sourceText = await openaiOcr(pageData.content, apiKeys.openai, signal);
    if (!sourceText) throw new Error('OpenAI OCR returned empty result.');
  } else {
    sourceText = pageData.content;
  }

  const sourceLang = direction === 'RU_TO_EN' ? 'Russian' : 'English';
  const targetLang = direction === 'RU_TO_EN' ? 'English' : 'Russian';
  const systemPrompt = buildSystemPrompt(sourceLang, targetLang, profile, customGlossary);

  const raw = await deepseekTranslate(sourceText, systemPrompt, apiKeys.deepseek, signal);
  if (raw && !isRefusal(raw)) return cleanAndParse(raw);

  if (apiKeys.openai) {
    return translateWithOpenAI(sourceText, direction, profile, customGlossary, apiKeys.openai, signal);
  }

  throw new Error('DeepSeek refused this content. Add your OpenAI key in Settings for unrestricted translation.');
}

export async function translateText({ sourceText, direction, profile, customGlossary, apiKeys, signal }) {
  const sourceLang = direction === 'RU_TO_EN' ? 'Russian' : 'English';
  const targetLang = direction === 'RU_TO_EN' ? 'English' : 'Russian';
  const systemPrompt = buildSystemPrompt(sourceLang, targetLang, profile, customGlossary);

  const raw = await deepseekTranslate(sourceText, systemPrompt, apiKeys.deepseek, signal);
  if (raw && !isRefusal(raw)) return cleanAndParse(raw);

  if (apiKeys.openai) {
    return translateWithOpenAI(sourceText, direction, profile, customGlossary, apiKeys.openai, signal);
  }

  throw new Error('DeepSeek refused this content. Add your OpenAI key in Settings for unrestricted translation.');
}

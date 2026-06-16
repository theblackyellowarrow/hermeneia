import { openaiOcr, openaiChat } from './openaiClient';
import { buildSystemPrompt } from './promptBuilder';

function cleanAndParse(raw) {
  let text = raw.trim();
  if (text.startsWith('```json')) text = text.substring(7);
  if (text.startsWith('```')) text = text.substring(3);
  if (text.endsWith('```')) text = text.substring(0, text.length - 3);
  text = text.trim();
  return JSON.parse(text);
}

async function translateWithOpenAI(sourceText, direction, profile, customGlossary, apiKey, signal) {
  const sourceLang = direction === 'RU_TO_EN' ? 'Russian' : 'English';
  const targetLang = direction === 'RU_TO_EN' ? 'English' : 'Russian';
  const systemPrompt = buildSystemPrompt(sourceLang, targetLang, profile, customGlossary);

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Translate the following text according to the system instructions:\n\n${sourceText}` },
  ];

  const raw = await openaiChat(messages, { apiKey, model: 'gpt-4o', temperature: 0.1, signal });
  if (!raw) throw new Error('OpenAI translation returned empty result.');

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

  return translateWithOpenAI(sourceText, direction, profile, customGlossary, apiKeys.openai, signal);
}

export async function translateText({ sourceText, direction, profile, customGlossary, apiKeys, signal }) {
  return translateWithOpenAI(sourceText, direction, profile, customGlossary, apiKeys.openai, signal);
}

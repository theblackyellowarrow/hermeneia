import { fetchWithTimeout } from '../utils/fetchHelpers';

const DEEPSEEK_BASE = 'https://api.deepseek.com/chat/completions';

export async function deepseekTranslate(sourceText, systemPrompt, apiKey, signal) {
  const body = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Translate the following text according to the system instructions:\n\n${sourceText}` },
    ],
    temperature: 0.1,
    max_tokens: 8192,
  };

  const res = await fetchWithTimeout(DEEPSEEK_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`DeepSeek error ${res.status}: ${err.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

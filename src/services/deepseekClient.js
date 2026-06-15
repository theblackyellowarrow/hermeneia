const DEEPSEEK_BASE = 'https://api.deepseek.com/chat/completions';

async function fetchWithTimeout(url, options, timeoutMs = 120000) {
  const controller = new AbortController();
  const existingSignal = options.signal;
  if (existingSignal) existingSignal.addEventListener('abort', () => controller.abort());
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

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

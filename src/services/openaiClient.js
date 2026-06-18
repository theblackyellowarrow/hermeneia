import { fetchWithTimeout } from '../utils/fetchHelpers';

const OPENAI_BASE = 'https://api.openai.com/v1/chat/completions';

async function fetchWithRetry(url, options, retries = 2, delay = 2000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, options);
      if (res.ok || (res.status >= 400 && res.status < 500)) return res;
      if (attempt < retries) { await new Promise(r => setTimeout(r, delay)); continue; }
      throw new Error(`OpenAI error ${res.status}: ${res.statusText}`);
    } catch (err) {
      if (err.name === 'AbortError' && options.signal?.aborted) throw err;
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

export async function openaiChat(messages, options = {}) {
  const {
    apiKey,
    model = 'gpt-4o',
    temperature = 0.2,
    responseFormat,
    signal,
  } = options;

  const body = {
    model,
    messages,
    temperature,
  };

  if (responseFormat) {
    body.response_format = responseFormat;
  }

  const res = await fetchWithRetry(OPENAI_BASE, {
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
    throw new Error(`OpenAI error ${res.status}: ${err.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

export async function openaiOcr(imageBase64, apiKey, signal) {
  const text = await openaiChat(
    [
      {
        role: 'system',
        content: `You are a high-fidelity OCR engine specialised in Russian and English academic, art-history, and museological texts. Extract ALL text from the provided image. Preserve line breaks, paragraph structure, Cyrillic characters, diacritics, catalogue numbers, inventory codes, and bibliographic references exactly as they appear. Output only the extracted text — no commentary, no corrections.`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extract all text from this page image with maximum fidelity.',
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
              detail: 'high',
            },
          },
        ],
      },
    ],
    { apiKey, model: 'gpt-4o-mini', temperature: 0, signal }
  );

  return text;
}

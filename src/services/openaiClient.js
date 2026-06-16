const OPENAI_BASE = 'https://api.openai.com/v1/chat/completions';

async function fetchWithTimeout(url, options, timeoutMs = 120000) {
  const controller = new AbortController();
  const existingSignal = options.signal;
  if (existingSignal) existingSignal.addEventListener('abort', () => controller.abort());
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithRetry(url, options, retries = 2, delay = 2000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, options);
      if (res.ok || res.status >= 400 && res.status < 500) return res;
      if (attempt < retries) await new Promise(r => setTimeout(r, delay));
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

export async function openaiPolish(rawJson, apiKey, signal) {
  const text = await openaiChat(
    [
      {
        role: 'system',
        content: `You are a JSON validation and formatting engine. Take the provided text — which may contain markdown wrappers, malformed JSON, or minor structural issues — and return clean, valid JSON matching this schema:

{
  "translation": "string (the translated text)",
  "vocabulary": [{"word": "string", "meaning": "string", "grammar": "string"}],
  "explanation": "string",
  "citations": [{"type": "string", "text": "string"}]
}

Rules:
- Strip any markdown fences (e.g. \`\`\`json ... \`\`\`).
- Do NOT change the content of translations, vocabulary, or citations — only fix structural JSON issues.
- Ensure all required fields are present.
- Return ONLY the valid JSON object, no other text.`,
      },
      {
        role: 'user',
        content: `Polish this output into clean JSON:\n\n${rawJson}`,
      },
    ],
    {
      apiKey,
      model: 'gpt-4o-mini',
      temperature: 0,
      responseFormat: {
        type: 'json_schema',
        json_schema: {
          name: 'translation_output',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              translation: { type: 'string' },
              vocabulary: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    word: { type: 'string' },
                    meaning: { type: 'string' },
                    grammar: { type: 'string' },
                  },
                   required: ['word', 'meaning', 'grammar'],
                  additionalProperties: false,
                },
              },
              explanation: { type: 'string' },
              citations: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    text: { type: 'string' },
                  },
                  required: ['type', 'text'],
                  additionalProperties: false,
                },
              },
            },
            required: ['translation', 'vocabulary', 'explanation', 'citations'],
            additionalProperties: false,
          },
        },
      },
      signal,
    }
  );

  return JSON.parse(text);
}

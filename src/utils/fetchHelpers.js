export async function fetchWithTimeout(url, options, timeoutMs = 120000) {
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

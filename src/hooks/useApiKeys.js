import { useState, useEffect } from 'react';

const FREE_LIMIT = 10;
const STORAGE_KEY = 'hermeneia_user_keys';
const USAGE_KEY = 'hermeneia_usage_count';

export function useApiKeys() {
  const [userOpenaiKey, setUserOpenaiKey] = useState('');
  const [usageCount, setUsageCount] = useState(0);
  const [showKeyPanel, setShowKeyPanel] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserOpenaiKey(parsed.openai || '');
      }
      const count = localStorage.getItem(USAGE_KEY);
      if (count) setUsageCount(parseInt(count, 10));
    } catch { /* ignore */ }
  }, []);

  const incrementUsage = () => {
    const next = usageCount + 1;
    setUsageCount(next);
    localStorage.setItem(USAGE_KEY, String(next));
  };

  const saveUserKey = (key) => {
    setUserOpenaiKey(key.trim());
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ openai: key.trim() }));
  };

  const clearUserKey = () => {
    setUserOpenaiKey('');
    localStorage.removeItem(STORAGE_KEY);
  };

  const isFreeTier = usageCount < FREE_LIMIT;
  const hasUserKey = userOpenaiKey.length > 30;

  const openaiKey = hasUserKey ? userOpenaiKey : (isFreeTier ? import.meta.env.VITE_OPENAI_API_KEY || '' : '');

  const apiKeys = {
    openai: openaiKey,
    deepseek: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
  };

  const freeRemaining = Math.max(0, FREE_LIMIT - usageCount);
  const needsKey = !isFreeTier && !hasUserKey;

  return {
    apiKeys,
    usageCount,
    freeRemaining,
    isFreeTier,
    hasUserKey,
    needsKey,
    showKeyPanel,
    setShowKeyPanel,
    userOpenaiKey,
    saveUserKey,
    clearUserKey,
    incrementUsage,
    FREE_LIMIT,
  };
}

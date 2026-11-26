import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial; // corrupt or unavailable storage: fall back to defaults
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // quota exceeded or storage disabled: keep working in memory
    }
  }, [key, value]);

  return [value, setValue] as const;
}

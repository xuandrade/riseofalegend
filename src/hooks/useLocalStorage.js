import { useCallback, useEffect, useRef, useState } from 'react';
import { loadKey, saveKey } from '../utils/storage.js';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = loadKey(key);
    return stored !== null ? stored : initialValue;
  });

  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveKey(key, value);
    }, 150);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [key, value]);

  const update = useCallback((updater) => {
    setValue((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  return [value, update];
}

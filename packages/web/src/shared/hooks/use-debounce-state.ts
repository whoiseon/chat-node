'use client';

import { useState, useEffect } from 'react';

export function useDebounceState<T>(initialValue: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(initialValue);
    }, delay);

    return () => clearTimeout(timeout);
  }, [initialValue, delay]);

  return debouncedValue;
}

'use client';

import { useCallback } from 'react';

export function useScroll() {
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    if (!document.body || window === undefined) return;
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: behavior,
    });
  }, []);

  return { scrollToBottom };
}

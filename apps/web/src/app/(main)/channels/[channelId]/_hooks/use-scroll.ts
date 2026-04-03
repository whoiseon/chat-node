'use client';

import { useCallback, useEffect, useRef } from 'react';

export function useScroll() {
  const isBottomRef = useRef(true);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 1;
      isBottomRef.current =
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - threshold;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior,
    });
  }, []);

  const isAtBottom = useCallback(() => isBottomRef.current, []);

  return { scrollToBottom, isAtBottom };
}

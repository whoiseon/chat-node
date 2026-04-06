'use client';

import { RefObject, useCallback, useEffect, useRef } from 'react';

export function useScroll(containerRef: RefObject<HTMLElement | null>) {
  const isBottomRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const threshold = 1;
      isBottomRef.current =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - threshold;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'auto') => {
      const container = containerRef.current;
      if (!container) return;
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    },
    [containerRef],
  );

  const isAtBottom = useCallback(() => isBottomRef.current, []);

  return { scrollToBottom, isAtBottom };
}

'use client';

import { Button } from '@repo/ui/components/ui/button';
import { useEffect, useEffectEvent, useState } from 'react';

import { NewMessage } from '@/store/channel/channel.type';

interface NewMessageToastProps {
  message: NewMessage | null | undefined;
  onPress: () => void;
}

export function NewMessageToast({ message, onPress }: NewMessageToastProps) {
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  const setRenderEffect = useEffectEvent(() => {
    if (message) {
      setRendered(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  });

  useEffect(() => {
    setRenderEffect();
  }, [message]);

  const handleTransitionEnd = () => {
    if (!visible) setRendered(false);
  };

  if (!rendered) return null;

  return (
    <Button
      className="absolute justify-start -top-13 bg-card/90 -z-1 h-11 hover:bg-stone-100/90 dark:hover:bg-stone-700/70 rounded-md w-[calc(100%-15px)] px-4 dark:shadow-none shadow-[0_0_20px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
      }}
      onTransitionEnd={handleTransitionEnd}
      onClick={onPress}
    >
      <div className="flex items-center flex-1 max-w-full h-full">
        <div className="flex items-center gap-x-2 text-sm min-w-0">
          <span className="text-muted-foreground whitespace-nowrap">
            {message?.sender}
          </span>
          <div className="min-w-0 truncate">{message?.content}</div>
        </div>
      </div>
    </Button>
  );
}

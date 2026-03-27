'use client';

import { createContext, PropsWithChildren, useContext } from 'react';

type ChannelIdContext = {
  channelId: string;
};

export const ChannelIdContext = createContext<ChannelIdContext | null>(null);

export function ChannelIdProvider({
  children,
  channelId,
}: PropsWithChildren & { channelId: string }) {
  return (
    <ChannelIdContext.Provider value={{ channelId }}>
      {children}
    </ChannelIdContext.Provider>
  );
}

export function useChannelId() {
  const context = useContext(ChannelIdContext);
  if (!context) {
    throw new Error('useChannelId must be used within a ChannelIdProvider');
  }
  return context;
}

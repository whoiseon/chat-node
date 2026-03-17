'use client';

import { createContext } from 'react';

type ChannelContextState = {
  searchMode: boolean;
  channelId: string;
};

export const ChannelContext = createContext<ChannelContextState>({
  channelId: '',
  searchMode: false,
});

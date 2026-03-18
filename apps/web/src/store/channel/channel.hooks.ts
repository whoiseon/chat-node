import { useObservable } from '@legendapp/state/react';

import { channelState } from './channel.state';

export function useChannelState() {
  const channel = useObservable(channelState);
  return {
    searchMode: channel.searchMode.get(),
  };
}

export function useChannelActions() {
  return {
    setSearchMode: (payload: boolean) => {
      channelState.searchMode.set(payload);
    },
  };
}

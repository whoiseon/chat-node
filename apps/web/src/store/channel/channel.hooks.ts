import { useValue } from '@legendapp/state/react';

import { channelState } from './channel.state';
import { NewMessage } from './channel.type';

export function useChannelNewMessage() {
  return useValue(channelState).newMessage;
}

export function useChannelActions() {
  return {
    setNewMessage: (payload: NewMessage | null) => {
      channelState.newMessage.set(payload);
    },
  };
}

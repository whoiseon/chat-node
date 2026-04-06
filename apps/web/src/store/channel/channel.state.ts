import { observable } from '@legendapp/state';

import { ChannelState } from './channel.type';

export const channelState = observable<ChannelState>({
  searchMode: false,
  newMessage: null,
});

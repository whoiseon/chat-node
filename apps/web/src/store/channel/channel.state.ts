import { observable } from '@legendapp/state';

export type ChannelState = {
  searchMode: boolean;
};

export const channelState = observable<ChannelState>({
  searchMode: false,
});

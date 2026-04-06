export type NewMessage = {
  sender: string;
  content: string;
};

export type ChannelState = {
  searchMode: boolean;
  newMessage?: NewMessage | null;
};

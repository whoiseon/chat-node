export type SendMessageType = 'message' | 'join' | 'leave' | 'notice';

export interface OnJoinChannelPayload {
  channelId: string;
}

export interface OnLeaveChannelPayload extends OnJoinChannelPayload {}

export interface OnSendMessagePayload {
  channelId: string;
  content?: string;
  type?: SendMessageType;
}

export interface OnNewMessagePayload {
  id: string;
  channelId: string;
  type: 'message' | 'notice' | 'system';
  content: string;
  sender: {
    userId: string;
    username: string;
    displayName: string;
    profileImageUrl: string | null;
  } | null;
  createdAt: string;
}

export interface EmitSendMessagePayload {}

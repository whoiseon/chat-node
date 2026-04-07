import { SendMessageType } from './channel.types';

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
  deletedAt: string | null;
  unreadCount: number;
}

export interface OnReadMessagePayload {
  channelId: string;
  lastReadAt: string; // ISO 8601 timestamp
}

export interface OnReadStatusUpdatedPayload {
  channelId: string;
  userId: string;
  lastReadAt: string; // ISO 8601 timestamp
  prevLastReadAt: string | null; // 이전 읽은 시각 (null이면 처음 읽는 것)
}

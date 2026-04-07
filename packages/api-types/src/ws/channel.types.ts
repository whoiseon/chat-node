export type SendMessageType = 'message' | 'join' | 'leave' | 'notice';

export interface OnJoinChannelPayload {
  channelId: string;
}

export interface OnLeaveChannelPayload extends OnJoinChannelPayload {}

export interface EmitSendMessagePayload {}

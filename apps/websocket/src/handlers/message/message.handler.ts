import { OnNewMessagePayload, OnSendMessagePayload } from '@repo/api-types';
import { Server, Socket } from 'socket.io';

import { Logger } from '@/common/configs';
import { messageQueue } from '@/common/queue';
import { SocketCachedChannelMe } from '@/handlers/channel/channel.types';

import { randomUUID } from 'crypto';

export class MessageHandler {
  private logger = new Logger('MessageHandler');
  constructor(private io: Server) {}

  public register(socket: Socket) {
    socket.on('send_message', (payload: OnSendMessagePayload) => {
      this.logger.info(
        `ws:send_message channel:${payload.channelId} content:${payload.content}`,
      );
      const channelInfo: SocketCachedChannelMe =
        socket.data.channels?.[payload.channelId];

      if (!channelInfo) {
        this.logger.error(`Channel info not found: ${payload.channelId}`);
        return;
      }

      const message: OnNewMessagePayload = this.generateMessage(
        payload,
        channelInfo,
      );

      this.io.to(`channel:${payload.channelId}`).emit('new_message', message);

      messageQueue.add('save', {
        id: message.id,
        channelId: message.channelId,
        userId: message.sender?.userId ?? null,
        type: message.type,
        content: message.content,
      });
    });
  }

  private generateMessage(
    payload: OnSendMessagePayload,
    channelInfo: SocketCachedChannelMe,
  ): OnNewMessagePayload {
    const defaultPayload: Pick<
      OnNewMessagePayload,
      'id' | 'channelId' | 'createdAt'
    > = {
      id: randomUUID(),
      channelId: payload.channelId,
      createdAt: new Date().toISOString(),
    };

    if (payload.type === 'join') {
      return {
        ...defaultPayload,
        type: 'system',
        content: `${channelInfo.displayName}(${channelInfo.username})님이 입장하셨습니다.`,
        sender: null,
      };
    }

    if (payload.type === 'leave') {
      return {
        ...defaultPayload,
        type: 'system',
        content: `${channelInfo.displayName}(${channelInfo.username})님이 퇴장하셨습니다.`,
        sender: null,
      };
    }

    if (payload.type === 'notice') {
      return {
        ...defaultPayload,
        type: 'notice',
        content: payload.content || '',
        sender: {
          userId: channelInfo.userId,
          username: channelInfo.username,
          displayName: channelInfo.displayName,
          profileImageUrl: channelInfo.profileImageUrl,
        },
      };
    }

    return {
      ...defaultPayload,
      type: 'message',
      content: payload.content || '',
      sender: {
        userId: channelInfo.userId,
        username: channelInfo.username,
        displayName: channelInfo.displayName,
        profileImageUrl: channelInfo.profileImageUrl,
      },
    };
  }
}

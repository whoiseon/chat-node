import {
  OnNewMessagePayload,
  OnReadMessagePayload,
  OnReadStatusUpdatedPayload,
  OnSendMessagePayload,
} from '@repo/api-types';
import { Server, Socket } from 'socket.io';

import { redis } from '@/common/cache';
import { Logger } from '@/common/configs';
import { messageQueue } from '@/common/queue';
import { SocketCachedChannelMe } from '@/handlers/channel/channel.types';

import { randomUUID } from 'crypto';

export class MessageHandler {
  private logger = new Logger('MessageHandler');
  constructor(private io: Server) {}

  public register(socket: Socket) {
    socket.on('send_message', async (payload: OnSendMessagePayload) => {
      this.logger.info(
        `ws:send_message channel:${payload.channelId} content:${payload.content}`,
      );
      const channelInfo: SocketCachedChannelMe =
        socket.data.channels?.[payload.channelId];

      if (!channelInfo) {
        this.logger.error(`Channel info not found: ${payload.channelId}`);
        return;
      }

      const memberCount = Number(
        (await redis.get(`channel:${payload.channelId}:member_count`)) ?? 0,
      );

      const message: OnNewMessagePayload = this.generateMessage(
        payload,
        channelInfo,
        memberCount,
      );

      this.io.to(`channel:${payload.channelId}`).emit('new_message', message);

      // 보낸 사람의 lastReadAt을 현재 시각으로 갱신
      if (message.sender) {
        await redis.hset(
          `channel:${payload.channelId}:last_read_at`,
          message.sender.userId,
          message.createdAt,
        );
      }

      messageQueue.add('save', {
        id: message.id,
        channelId: message.channelId,
        userId: message.sender?.userId ?? null,
        type: message.type,
        content: message.content,
      });
    });

    socket.on(
      'read_message',
      async (
        payload: OnReadMessagePayload,
        ack?: (res: { ok: boolean }) => void,
      ) => {
        this.logger.info(
          `ws:read_message channel:${payload.channelId} lastReadAt:${payload.lastReadAt}`,
        );

        const channelInfo: SocketCachedChannelMe =
          socket.data.channels?.[payload.channelId];

        if (!channelInfo) {
          this.logger.error(`Channel info not found: ${payload.channelId}`);
          ack?.({ ok: false });
          return;
        }

        const hashKey = `channel:${payload.channelId}:last_read_at`;

        // 이전 lastReadAt 조회 후 갱신 (없으면 joinedAt을 기준으로 사용)
        const prevLastReadAt =
          (await redis.hget(hashKey, channelInfo.userId)) ??
          channelInfo.joinedAt;

        await redis.hset(hashKey, channelInfo.userId, payload.lastReadAt);

        // 채널의 모든 멤버에게 읽음 상태 업데이트 브로드캐스트
        const event: OnReadStatusUpdatedPayload = {
          channelId: payload.channelId,
          userId: channelInfo.userId,
          lastReadAt: payload.lastReadAt,
          prevLastReadAt,
        };

        this.io
          .to(`channel:${payload.channelId}`)
          .emit('read_status_updated', event);

        ack?.({ ok: true });
      },
    );
  }

  private generateMessage(
    payload: OnSendMessagePayload,
    channelInfo: SocketCachedChannelMe,
    memberCount: number,
  ): OnNewMessagePayload {
    const unreadCount = Math.max(0, memberCount - 1);

    const defaultPayload: Pick<
      OnNewMessagePayload,
      'id' | 'channelId' | 'createdAt' | 'deletedAt' | 'unreadCount'
    > = {
      id: randomUUID(),
      channelId: payload.channelId,
      createdAt: new Date().toISOString(),
      deletedAt: null,
      unreadCount,
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

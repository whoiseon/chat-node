import { OnJoinChannelPayload, OnLeaveChannelPayload } from '@repo/api-types';
import { Server, Socket } from 'socket.io';

import { Logger } from '@/common/configs';
import { env } from '@/common/utils';

export class ChannelHandler {
  private logger = new Logger('ChannelHandler');
  constructor(private io: Server) {}

  public register(socket: Socket) {
    socket.on(
      'join_channel',
      async (
        payload: OnJoinChannelPayload,
        ack?: (res: { ok: boolean }) => void,
      ) => {
        const { channelId } = payload;

        try {
          const res = await fetch(
            `${env.API_URL}/api/v1/channels/${channelId}/me`,
            { headers: { Authorization: `Bearer ${socket.data.token}` } },
          );
          const { payload: mePayload } = await res.json();

          if (mePayload) {
            socket.data.channels[channelId] = {
              userId: mePayload.userId,
              username: mePayload.username,
              displayName: mePayload.displayName,
              profileImageUrl: mePayload.profileImageUrl ?? null,
            };
          }
        } catch (err) {
          this.logger.error(`Failed to fetch channel member: ${err}`);
          ack?.({ ok: false });
          return;
        }

        socket.join(`channel:${channelId}`);
        this.logger.info(`ws:join_channel:${channelId}`);
        ack?.({ ok: true });
      },
    );

    socket.on('leave_channel', (payload: OnLeaveChannelPayload) => {
      const { channelId } = payload;
      delete socket.data.channels[channelId];
      socket.leave(`channel:${channelId}`);
      this.logger.info(`ws:leave_channel:${channelId}`);
    });
  }
}

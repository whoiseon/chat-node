import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

import { Logger } from '@/common/configs';
import { env } from '@/common/utils';
import { ChannelHandler } from '@/handlers/channel/channel.handler';
import { MessageHandler } from '@/handlers/message/message.handler';

import * as http from 'http';

export class Bootstrap {
  private readonly httpServer: http.Server = http.createServer();
  private readonly io: Server;
  private logger = new Logger('BootstrapClass');

  constructor() {
    this.io = new Server(this.httpServer, {
      cors: { origin: env.ALLOWED_ORIGINS },
    });
  }

  private registerMiddlewares() {
    this.io.use(async (socket, next) => {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error('인증 토큰이 없습니다.'));
      }

      try {
        const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as {
          type: string;
          userId: string;
        };

        if (payload.type !== 'access_token') {
          return next(new Error('유효하지 않은 토큰입니다.'));
        }

        socket.data.userId = payload.userId;
        socket.data.token = token;
        socket.data.channels = {};
        next();
      } catch {
        return next(new Error('만료된 토큰입니다.'));
      }
    });
  }

  private registerHandlers() {
    const channelHandler = new ChannelHandler(this.io);
    const messageHandler = new MessageHandler(this.io);

    this.io.on('connection', (socket) => {
      this.logger.info(`Client connected: ${socket.id}`);

      channelHandler.register(socket);
      messageHandler.register(socket);

      socket.on('disconnect', () => {
        this.logger.info(`Client disconnected: ${socket.id}`);
        socket.data.channels = {};
      });
    });
  }

  public listen(port: number, callback?: () => void) {
    this.registerMiddlewares();
    this.registerHandlers();

    this.httpServer.listen(port, () => {
      callback?.();
    });
  }
}

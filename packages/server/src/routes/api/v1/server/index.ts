import Router from '@koa/router';

import { generateResponseBody, validateBody } from '@/lib/utils';

import { ServerService } from '@/services/server.service';

import { serverCreateSchema } from './server.schema';
import {
  ServerCreateInput,
  ServerCreateResponse,
  ServerListResponse,
} from './server.types';
import { requireAuth } from '@/lib/middlewares/auth';

const server = new Router();
const serverService = new ServerService();

/**
 * 서버 생성
 */
server.post('/create', requireAuth, async (ctx) => {
  if (!validateBody(ctx, serverCreateSchema)) return;

  const userId = ctx.state.userId;

  const input = ctx.request.body as ServerCreateInput;

  const createdServer = await serverService.createServer(userId, input);

  ctx.body = generateResponseBody<ServerCreateResponse>(true, '', {
    serverId: createdServer.serverId,
    slug: createdServer.slug,
  });
});

/**
 * 전체 서버 목록 조회
 */
server.get('/list', async (ctx) => {
  const serverList = await serverService.getServerList();

  ctx.body = generateResponseBody<ServerListResponse>(true, '', {
    rows: serverList.map((server) => ({
      id: server.id,
      name: server.name,
      slug: server.slug ?? '',
      tags: server.tags.map((tagRelation) => (tagRelation as any).tag.name),
      imageUrl: server.imageUrl ?? '',
      description: server.description ?? '',
      createdAt: server.createdAt,
      manager: {
        id: server.manager.id,
        username: server.manager.username,
        mainNodeConId: server.manager.mainNodeConId ?? '',
      },
      memberCount: server._count.members,
      favoriteCount: server._count.favorites,
    })),
    totalCount: serverList.length,
  });
});

export default server;

import Router from '@koa/router';
import { Prisma, ServerJoinType } from 'generated/prisma';

import { generateResponseBody, validateBody } from '@/lib/utils';

import { ServerService } from './server.service';

import { serverCreateSchema, serverFavoriteAddSchema } from './server.schema';
import {
  ServerCreateInput,
  ServerCreateResponse,
  ServerListResponse,
  ServerTagListResponse,
  ServerFavoriteAddInput,
  ServerFavoriteAddResponse,
  ServerFavoriteRemoveResponse,
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
  type ServerListQuery = {
    tags?: string;
    search?: string;
    search_target?: 'name' | 'manager';
  };

  const { tags, search, search_target } = ctx.request.query as ServerListQuery;

  const where: Prisma.ServerWhereInput = {
    deletedAt: null,
    settings: {
      some: {
        joinType: {
          not: ServerJoinType.PRIVATE,
        },
      },
    },
  };

  // 검색 태그 존재
  if (tags) {
    const tagList = tags?.split(',');
    where.tags = {
      some: {
        tag: {
          name: { in: tagList },
        },
      },
    };
  }

  // 검색어와 검색타겟이 존재
  if (search && search_target) {
    switch (search_target) {
      // 타겟: 서버 매니저
      case 'manager': {
        where.manager = {
          username: {
            contains: search,
          },
        };
        break;
      }
      // 타겟: 서버 이름
      default: {
        where.name = {
          contains: search,
          mode: 'insensitive',
        };
        break;
      }
    }
  }

  const serverList = await serverService.getServerList({
    where,
  });

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

/**
 * 가입된 서버 목록 조회
 */
server.get('/my-servers', requireAuth, async (ctx) => {
  const userId = ctx.state.userId;

  const serverList = await serverService.getJoinedServerList(userId);

  ctx.body = generateResponseBody<ServerListResponse>(true, '', {
    rows: serverList.map((server) => ({
      id: server.id,
      name: server.name,
      slug: server.slug ?? '',
      createdAt: server.createdAt,
    })),
    totalCount: serverList.length,
  });
});

/**
 * 즐겨찾기 서버 목록 조회
 */
server.get('/favorites', requireAuth, async (ctx) => {
  const userId = ctx.state.userId;

  const serverList = await serverService.getFavoriteServerList(userId);

  ctx.body = generateResponseBody<ServerListResponse>(true, '', {
    rows: serverList.map((server) => ({
      id: server.id,
      name: server.name,
      slug: server.slug ?? '',
      createdAt: server.createdAt,
    })),
    totalCount: serverList.length,
  });
});

/**
 * 즐겨찾기 추가
 */
server.post('/favorites', requireAuth, async (ctx) => {
  if (!validateBody(ctx, serverFavoriteAddSchema)) return;

  const userId = ctx.state.userId;
  const { serverId } = ctx.request.body as ServerFavoriteAddInput;

  const result = await serverService.addFavorite(userId, serverId);

  ctx.body = generateResponseBody<ServerFavoriteAddResponse>(true, '', result);
});

/**
 * 즐겨찾기 해제
 */
server.delete('/favorites/:serverId', requireAuth, async (ctx) => {
  const userId = ctx.state.userId;
  const { serverId } = ctx.params;

  if (!serverId) {
    ctx.status = 200;
    ctx.body = generateResponseBody<ServerFavoriteRemoveResponse>(
      false,
      '서버 ID가 필요합니다',
      { serverId: '' }
    );
    return;
  }

  const result = await serverService.removeFavorite(userId, serverId);

  ctx.body = generateResponseBody<ServerFavoriteRemoveResponse>(
    true,
    '',
    result
  );
});

/**
 * 서버 전체 태그 목록 조회
 */
server.get('/tags', async (ctx) => {
  const tagList = await serverService.getServerTagList();

  ctx.body = generateResponseBody<ServerTagListResponse>(true, '', {
    rows: tagList.map((tag) => ({
      name: tag.tag.name,
      totalCount: tag.tag._count.serverTags,
    })),
    totalCount: tagList.length,
  });
});

export default server;

import { Prisma, ServerJoinType, ServerMemberRole } from 'generated/prisma';

import { prisma } from '@/database';
import { BusinessError } from '@/lib/middlewares/error';

import { ServerCreateInput } from '@/routes/api/v1/server/server.types';

export class ServerService {
  /**
   * 서버 생성
   */
  async createServer(userId: string, input: ServerCreateInput) {
    const { name, description, slug, tags, joinType } = input;

    // 트랜잭션으로 원자성 보장
    return await prisma.$transaction(async (tx) => {
      try {
        // 서버 생성
        const newServer = await tx.server.create({
          data: {
            name,
            description,
            slug,
            managerId: userId,
            imageUrl: process.env.DEFAULT_SERVER_IMAGE_URL ?? '',
            tags: {
              create: tags.map((tag) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tag },
                    create: { name: tag },
                  },
                },
              })),
            },
            settings: {
              create: {
                joinType,
              },
            },
            members: {
              create: {
                userId,
                role: ServerMemberRole.MANAGER,
              },
            },
          },
        });

        return {
          serverId: newServer.id,
          slug: newServer.slug ?? '',
        };
      } catch (error) {
        // BusinessError는 그대로 전파
        if (error instanceof BusinessError) {
          throw error;
        }

        // Prisma unique constraint violation 처리
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          const prismaError = error as Prisma.PrismaClientKnownRequestError;
          if (prismaError.code === 'P2002') {
            const target = prismaError.meta.driverAdapterError.cause.constraint
              .fields as string[] | undefined;

            if (target?.includes('name')) {
              throw new BusinessError('이미 존재하는 서버 이름입니다');
            }
            if (target?.includes('slug')) {
              throw new BusinessError('이미 존재하는 서버 주소입니다');
            }

            throw new BusinessError('중복된 값이 존재합니다');
          }

          // 다른 Prisma 에러
          console.error('Prisma error:', error);
          throw new BusinessError(
            '서버 생성 중 데이터베이스 오류가 발생했습니다'
          );
        }

        // 예상치 못한 에러
        console.error('Unexpected error in createServer:', error);
        throw new BusinessError('서버 생성 중 오류가 발생했습니다');
      }
    });
  }

  /**
   * 전체 서버 목록 조회
   */
  async getServerList({
    where,
    select,
  }: {
    where?: Prisma.ServerWhereInput;
    select?: Prisma.ServerSelect;
  } = {}) {
    const defaultWhere: Prisma.ServerWhereInput = {
      deletedAt: null,
      settings: {
        some: {
          joinType: {
            not: ServerJoinType.PRIVATE,
          },
        },
      },
      ...(where ?? {}),
    };

    const defaultSelect: Prisma.ServerSelect = {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      tags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      description: true,
      createdAt: true,
      manager: {
        select: {
          id: true,
          username: true,
          mainNodeConId: true,
        },
      },
      _count: {
        select: {
          members: true,
          favorites: true,
        },
      },
      ...(select ?? {}),
    };

    try {
      return await prisma.server.findMany({
        where: defaultWhere,
        select: defaultSelect,
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }

      console.error(
        '[ServerService.getServerList] ❌ 서버 목록 조회 중 오류 발생:',
        error
      );

      throw new BusinessError('서버 목록 조회 중 오류가 발생했습니다');
    }
  }

  /**
   * 가입된 서버 목록 조회
   */
  async getJoinedServerList(userId: string) {
    const defaultSelect: Prisma.ServerSelect = {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
    };

    try {
      return await prisma.server.findMany({
        where: {
          deletedAt: null,
          members: {
            some: {
              userId,
            },
          },
        },
        select: defaultSelect,
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }

      console.error(
        '[ServerService.getJoinedServerList] ❌ 가입된 서버 목록 조회 중 오류 발생:',
        error
      );

      throw new BusinessError('가입된 서버 목록 조회 중 오류가 발생했습니다');
    }
  }

  /**
   * 서버 전체 태그 목록 조회
   */
  async getServerTagList() {
    try {
      return await prisma.serverTagRelation.findMany({
        select: {
          tag: {
            select: {
              name: true,
              _count: {
                select: {
                  serverTags: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }

      console.error(
        '[ServerService.getServerTagList] ❌ 서버 태그 목록 조회 중 오류 발생:',
        error
      );
      throw new BusinessError('서버 태그 목록 조회 중 오류가 발생했습니다');
    }
  }

  async existsServerName(name: string) {
    try {
      const server = await prisma.server.findUnique({
        where: { name },
        select: { id: true },
      });
      return !!server;
    } catch (error) {
      console.error('Error checking server name:', error);
      return false;
    }
  }

  async existsServerSlug(slug: string) {
    try {
      const server = await prisma.server.findUnique({
        where: { slug },
        select: { id: true },
      });
      return !!server;
    } catch (error) {
      console.error('Error checking server slug:', error);
      return false;
    }
  }

  /**
   * 즐겨찾기 목록 조회
   */
  async getFavoriteServerList(userId: string) {
    try {
      // ServerFavorite를 통해 조회하여 createdAt으로 정렬
      const favorites = await prisma.serverFavorite.findMany({
        where: {
          userId,
          server: {
            deletedAt: null,
          },
        },
        select: {
          createdAt: true,
          server: {
            select: {
              id: true,
              name: true,
              slug: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return favorites.map((favorite) => favorite.server);
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }

      console.error(
        '[ServerService.getFavoriteServerList] ❌ 즐겨찾기 서버 목록 조회 중 오류 발생:',
        error
      );

      throw new BusinessError('즐겨찾기 서버 목록 조회 중 오류가 발생했습니다');
    }
  }

  /**
   * 즐겨찾기 추가
   */
  async addFavorite(userId: string, serverId: string) {
    try {
      // 서버 존재 여부 확인
      const server = await prisma.server.findUnique({
        where: { id: serverId },
        select: { id: true, deletedAt: true },
      });

      if (!server) {
        throw new BusinessError('존재하지 않는 서버입니다');
      }

      if (server.deletedAt) {
        throw new BusinessError('삭제된 서버입니다');
      }

      // 즐겨찾기 추가 (중복 시 에러 발생)
      await prisma.serverFavorite.create({
        data: {
          userId,
          serverId,
        },
      });

      return { serverId };
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }

      // Prisma unique constraint violation 처리 (이미 즐겨찾기한 경우)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaError = error as Prisma.PrismaClientKnownRequestError;
        if (prismaError.code === 'P2002') {
          throw new BusinessError('이미 즐겨찾기에 추가된 서버입니다');
        }
      }

      console.error(
        '[ServerService.addFavorite] ❌ 즐겨찾기 추가 중 오류 발생:',
        error
      );

      throw new BusinessError('즐겨찾기 추가 중 오류가 발생했습니다');
    }
  }

  /**
   * 즐겨찾기 해제
   */
  async removeFavorite(userId: string, serverId: string) {
    try {
      // 즐겨찾기 존재 여부 확인 및 삭제
      const favorite = await prisma.serverFavorite.findUnique({
        where: {
          serverId_userId: {
            serverId,
            userId,
          },
        },
        select: { id: true },
      });

      if (!favorite) {
        throw new BusinessError('즐겨찾기에 등록되지 않은 서버입니다');
      }

      await prisma.serverFavorite.delete({
        where: {
          serverId_userId: {
            serverId,
            userId,
          },
        },
      });

      return { serverId };
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }

      console.error(
        '[ServerService.removeFavorite] ❌ 즐겨찾기 해제 중 오류 발생:',
        error
      );

      throw new BusinessError('즐겨찾기 해제 중 오류가 발생했습니다');
    }
  }
}

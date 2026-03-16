import { ServerListParams } from '@/features/server/types/server.types';

export const queryKey = {
  auth: {
    all: ['auth'] as const,
  },
  user: {
    all: ['user'] as const,
    me: () => [...queryKey.user.all, 'me'] as const,
  },
  server: {
    all: ['server'] as const,
    list: (params: Partial<ServerListParams>) =>
      [...queryKey.server.all, 'list', params] as const,
    tags: () => [...queryKey.server.all, 'tags'] as const,
    myServers: () => [...queryKey.server.all, 'my-servers'] as const,
    favoriteList: () => [...queryKey.server.all, 'favorite-list'] as const,
  },
  np: {
    all: ['np'] as const,
    my_np: () => [...queryKey.np.all, 'my-np']
  }
} as const;

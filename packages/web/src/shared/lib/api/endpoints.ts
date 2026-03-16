import { ServerListParams } from '@/features/server/types/server.types';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USER: {
    ME: '/user/me',
  },
  SERVER: {
    CREATE: '/server/create',
    LIST: (params: Partial<ServerListParams>) => {
      return `/server/list?${new URLSearchParams(params)}`;
    },
    TAGS: '/server/tags',
    MY_SERVERS: '/server/my-servers',
  },
  FAVORITE: {
    LIST: '/favorites',
    ADD: '/favorites',
    REMOVE: (serverId: string) => `/favorites/${serverId}`,
  },
  NP: {
    MY_NP: '/np',
  },
};

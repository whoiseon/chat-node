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
    list: () => [...queryKey.server.all, 'list'] as const,
  },
} as const;

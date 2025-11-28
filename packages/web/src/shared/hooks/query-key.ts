export const queryKey = {
  auth: {
    all: ['auth'] as const,
  },
  user: {
    all: ['user'] as const,
    me: () => [...queryKey.user.all, 'me'] as const,
  },
} as const;

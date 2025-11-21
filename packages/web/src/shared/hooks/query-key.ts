export const queryKey = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKey.auth.all, 'me'] as const,
  },
} as const;

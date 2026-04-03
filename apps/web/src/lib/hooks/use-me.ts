'use client';

import { MeUser } from '@repo/api-types';
import { useQuery } from '@tanstack/react-query';

import { authApi, authKeys } from '@/lib/api/services/auth.api';

export function useMe() {
  const { data, ...rest } = useQuery({
    queryKey: authKeys.me,
    queryFn: () => authApi.getMe(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const user: MeUser | null = data?.payload?.user ?? null;
  const isAuthenticated = !!user;

  return { user, isAuthenticated, ...rest };
}

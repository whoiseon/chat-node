'use client';

import { useQuery } from '@tanstack/react-query';

import { authApi, authKeys } from '@/lib/api/services/auth.api';

import type { MeUser } from '@/lib/api/services/auth.api';

export function useMe() {
  const { data, ...rest } = useQuery({
    queryKey: authKeys.me,
    queryFn: () => authApi.getMe(),
    retry: false,
  });

  const user: MeUser | null = data?.payload?.user ?? null;

  return { user, ...rest };
}

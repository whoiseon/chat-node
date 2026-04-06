'use client';

import { MeUser } from '@repo/api-types';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';

import { apiClient } from '@/lib/api/client';
import { authApi, authKeys } from '@/lib/api/services/auth.api';

export function useMe() {
  const wasAuthenticated = useRef(false);

  const { data, ...rest } = useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      const result = await authApi.getMe();
      const user = result?.payload?.user ?? null;

      // 이전에 로그인 상태였는데 user가 null이면 토큰 만료 가능성
      // refresh 시도 후 재조회
      if (!user && wasAuthenticated.current) {
        try {
          await apiClient.post('/auth/refresh');
          return authApi.getMe();
        } catch {
          // refresh 실패 → 진짜 로그아웃 상태
        }
      }

      return result;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const user: MeUser | null = data?.payload?.user ?? null;
  const isAuthenticated = !!user;
  wasAuthenticated.current = isAuthenticated;

  return { user, isAuthenticated, ...rest };
}

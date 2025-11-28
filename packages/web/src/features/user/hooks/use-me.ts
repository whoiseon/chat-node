'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/shared/hooks/query-key';

import { getMe } from '@/features/user/services/user-service';

export function useMe(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey.user.me(),
    queryFn: getMe,
    enabled,
    retry: false, // 401 에러 시 1회 재시도 (새로운 쿠키로)
  });
}

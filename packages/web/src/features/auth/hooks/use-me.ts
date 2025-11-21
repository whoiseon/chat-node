'use client';

import { getMe } from '@/shared/lib/api/auth';
import { useQuery } from '@tanstack/react-query';
import { queryKey } from '../../../shared/hooks/query-key';

export function useMe(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKey.auth.me(),
    queryFn: () => getMe(),
    enabled,
    retry: false, // 401 에러 시 재시도 안함
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분 (이전 cacheTime)
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/shared/hooks/query-key';
import { getMe } from '@/features/auth/services/auth-service';

export function useMe(enabled: boolean = false) {
  return useQuery({
    queryKey: queryKey.auth.me(),
    queryFn: getMe,
    enabled, // 캐시만 사용
    retry: 1, // 401 에러 시 1회 재시도 (새로운 쿠키로)
    placeholderData: (previousData) => previousData, // 재시도 중 이전 데이터 유지
  });
}

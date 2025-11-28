'use client';

import { logout } from '@/features/auth/services/auth-service';
import { queryKey } from '@/shared/hooks/query-key';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useLogOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      if (!data.success) {
        console.log(data.message);
        return;
      }

      // 모든 쿼리 캐시 초기화
      queryClient.setQueryData(queryKey.user.me(), null);
      queryClient.invalidateQueries({ queryKey: queryKey.user.me() });
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // 에러가 발생해도 로그아웃 처리
      queryClient.setQueryData(queryKey.user.me(), null);
      queryClient.invalidateQueries({ queryKey: queryKey.user.me() });
    },
  });
}

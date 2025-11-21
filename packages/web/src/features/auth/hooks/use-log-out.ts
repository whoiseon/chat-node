'use client';

import { logout } from '@/shared/lib/api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useLogOut() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 모든 쿼리 캐시 초기화
      queryClient.clear();

      // 로그인 페이지로 이동
      router.push('/auth/login');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // 에러가 발생해도 로그아웃 처리
      queryClient.clear();
      router.push('/auth/login');
    },
  });
}

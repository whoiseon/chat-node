'use client';

import { login } from '@/shared/lib/api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKey } from '../../../shared/hooks/query-key';
import { useRouter } from 'next/navigation';

export function useLogIn() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (!data.success) {
        console.log(data.message);
        return;
      }

      if (data.payload) {
        queryClient.setQueryData(queryKey.auth.me(), {
          success: true,
          message: '',
          payload: {
            userId: data.payload.userId,
            username: data.payload.username,
          },
        });

        router.push('/');
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

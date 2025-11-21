'use client';

import { login, signUp } from '@/shared/lib/api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { queryKey } from '../../../shared/hooks/query-key';

export function useSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
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

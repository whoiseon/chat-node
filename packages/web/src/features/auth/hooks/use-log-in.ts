'use client';

import { login } from '@/features/auth/services/auth-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKey } from '@/shared/hooks/query-key';
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
          userId: data.payload.userId,
          username: data.payload.username,
        });

        router.push('/');
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

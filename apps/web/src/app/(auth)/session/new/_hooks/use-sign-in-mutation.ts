'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { authApi, authKeys } from '@/lib/api/services/auth.api';

export function useSignInMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.signIn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
      router.refresh();
    },
  });
}

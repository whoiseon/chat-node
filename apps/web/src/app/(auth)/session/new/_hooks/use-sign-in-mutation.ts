'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { extractError } from '@/lib/api';
import { authApi, authKeys } from '@/lib/api/services/auth.api';

import type { SignInRequest } from '@/lib/api/services/auth.api';

export function useSignInMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignInRequest) => authApi.signIn(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
      router.refresh();
    },
    onError: (error) => {
      const apiError = extractError(error);
      console.error('[signIn]', apiError.error?.message);
    },
  });
}

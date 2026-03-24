'use client';

import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/lib/api/services/auth.api';
import { extractError } from '@/lib/api';

export function useCheckUsername() {
  return useMutation({
    mutationFn: (username: string) => authApi.checkUsername(username),
    onError: (error) => {
      const apiError = extractError(error);
      console.error('[checkUsername]', apiError.error?.message);
    },
  });
}

'use client';

import { useMutation } from '@tanstack/react-query';

import { extractError } from '@/lib/api';
import { authApi } from '@/lib/api/services/auth.api';

export function useCheckUsername() {
  return useMutation({
    mutationFn: (username: string) => authApi.checkUsername(username),
  });
}

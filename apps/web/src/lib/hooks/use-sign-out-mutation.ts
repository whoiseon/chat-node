'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { authApi } from '@/lib/api/services/auth.api';
import { resetSocket } from '@/lib/socket';

export function useSignOutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.signOut,
    onSuccess: async () => {
      resetSocket();
      queryClient.clear();
      router.refresh();
    },
  });
}

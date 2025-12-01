'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { queryKey } from '@/shared/hooks/query-key';
import { useToast } from '@/shared/hooks/useToast';

import { signUp } from '@/features/auth/services/auth-service';
import { npMessage } from '@/shared/lib/constant/message/np';

export function useSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: signUp,
    onSuccess: async (data) => {
      if (!data.success) {
        toast({
          type: 'error',
          message: data.message,
        });
        return;
      }

      if (data.payload?.dailyLoginBonus.isGiven) {
        toast({
          type: 'np',
          message: npMessage.given(data.payload?.dailyLoginBonus.amount),
          options: {
            description: npMessage.dailyLoginBonusDescription,
          },
        });
      }

      await queryClient.invalidateQueries({ queryKey: queryKey.user.me() });
      router.push('/');
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

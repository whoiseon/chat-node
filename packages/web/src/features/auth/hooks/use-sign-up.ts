'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { toastOptions } from '@/shared/lib/constant/toast-options';
import { queryKey } from '@/shared/hooks/query-key';

import { signUp } from '@/features/auth/services/auth-service';

export function useSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: async (data) => {
      if (!data.success) {
        toast.error(data.message, toastOptions.error);
        return;
      }

      if (data.payload?.dailyLoginBonus.isGiven) {
        toast.success(
          `${data.payload?.dailyLoginBonus.amount.toLocaleString()} NP를 지급받았습니다.`,
          toastOptions.dailyLoginBonus
        );
      }

      await queryClient.invalidateQueries({ queryKey: queryKey.user.me() });
      router.push('/');
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

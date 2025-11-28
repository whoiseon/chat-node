'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { login } from '@/features/auth/services/auth-service';

import { queryKey } from '@/shared/hooks/query-key';
import { toastOptions } from '@/shared/lib/constant/toast-options';

export function useLogIn() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
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
      toast.error(error.message);
    },
  });
}

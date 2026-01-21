'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/shared/hooks/use-toast';

import { createServer } from '../services/server-service';

export function useCreateServer() {
  const router = useRouter();
  const toast = useToast();

  return useMutation({
    mutationFn: createServer,
    onSuccess: (data) => {
      if (!data.success) {
        toast({
          type: 'error',
          message: data.message,
        });
        return;
      }

      toast({
        type: 'success',
        message: '서버 생성이 완료되었습니다. 서버 페이지로 이동합니다.',
      });

      router.push(`/server/${data.payload?.slug}`);
    },
    onError: (error) => {
      toast({
        type: 'error',
        message: error.message,
      });
    },
  });
}

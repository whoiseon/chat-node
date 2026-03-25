'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { channelApi, channelKeys } from '@/lib/api/services/channel.api';

export function useCreateChannelMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: channelApi.createChannel,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: channelKeys.listAll });
      router.push(`/channels/${data.payload.channelId}`);
    },
  });
}

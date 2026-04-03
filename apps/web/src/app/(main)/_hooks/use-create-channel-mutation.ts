'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { channelsApi, channelKeys } from '@/lib/api/services/channels.api';

export function useCreateChannelMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: channelsApi.createChannel,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: channelKeys.listAll });
      router.push(`/channels/${data.payload.channelId}`);
    },
  });
}

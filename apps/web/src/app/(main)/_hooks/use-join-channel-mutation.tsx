'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { channelsApi, channelKeys } from '@/lib/api/services/channels.api';

export function useJoinChannelMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: channelsApi.joinChannel,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: channelKeys.listAll });
      if (!data.error) {
        router.push(`/channels/${data.payload.channelId}`);
      }
    },
  });
}

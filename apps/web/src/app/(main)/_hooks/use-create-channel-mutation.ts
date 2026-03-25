'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { channelApi } from '@/lib/api/services/channel.api';

export function useCreateChannelMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: channelApi.createChannel,
    onSuccess: (data) => {
      router.push(`/channels/${data.payload.channelId}`);
    },
  });
}

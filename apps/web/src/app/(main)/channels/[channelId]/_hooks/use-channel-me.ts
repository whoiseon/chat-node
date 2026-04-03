'use client';

import { ChannelMe } from '@repo/api-types';
import { useQuery } from '@tanstack/react-query';

import { channelKeys, channelsApi } from '@/lib/api/services/channels.api';

export function useChannelMe(channelId: string) {
  const { data, ...rest } = useQuery({
    queryKey: channelKeys.me(channelId),
    queryFn: () => channelsApi.getChannelMe(channelId),
    retry: false,
  });

  const user: ChannelMe | null = data?.payload.user ?? null;
  return { user, ...rest };
}

'use client';

import { useQuery } from '@tanstack/react-query';

import { channelsApi, channelKeys } from '@/lib/api/services/channels.api';

export function useChannel(channelId: string) {
  const { data, ...rest } = useQuery({
    queryKey: channelKeys.detail(channelId),
    queryFn: () => channelsApi.getChannel(channelId),
    meta: { skipGlobalErrorHandler: true },
  });

  return { channel: data?.payload ?? null, ...rest };
}

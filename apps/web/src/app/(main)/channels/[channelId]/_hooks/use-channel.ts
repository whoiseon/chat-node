'use client';

import { useQuery } from '@tanstack/react-query';

import { channelApi, channelKeys } from '@/lib/api/services/channel.api';

export function useChannel(channelId: string) {
  const { data, ...rest } = useQuery({
    queryKey: channelKeys.detail(channelId),
    queryFn: () => channelApi.getChannel(channelId),
    meta: { skipGlobalErrorHandler: true },
  });

  return { channel: data?.payload ?? null, ...rest };
}

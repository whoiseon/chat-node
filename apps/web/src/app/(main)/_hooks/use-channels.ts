'use client';

import { GetChannelsQueryDto } from '@repo/api-types';
import { useInfiniteQuery } from '@tanstack/react-query';

import { channelsApi, channelKeys } from '@/lib/api/services/channels.api';

export function useChannels(query: GetChannelsQueryDto = {}) {
  return useInfiniteQuery({
    queryKey: channelKeys.list(query),
    queryFn: ({ pageParam }) =>
      channelsApi.getChannels({ ...query, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.payload.nextCursor ?? undefined,
  });
}

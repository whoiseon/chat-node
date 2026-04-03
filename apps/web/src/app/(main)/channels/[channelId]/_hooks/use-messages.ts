'use client';

import { GetMessagesQueryDto } from '@repo/api-types';
import { useInfiniteQuery } from '@tanstack/react-query';

import { messageKeys, messagesApi } from '@/lib/api/services/messages.api';

export function useMessages(query: GetMessagesQueryDto) {
  return useInfiniteQuery({
    queryKey: messageKeys.list(query),
    queryFn: ({ pageParam }) =>
      messagesApi.getMessages({ ...query, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.payload.nextCursor ?? undefined,
  });
}

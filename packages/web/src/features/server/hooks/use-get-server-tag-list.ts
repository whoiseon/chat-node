'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKey } from '@/shared/hooks/query-key';
import { getServerTagList } from '../services/server-service';

export function useGetServerTagList() {
  return useQuery({
    queryKey: queryKey.server.tags(),
    queryFn: getServerTagList,
  });
}

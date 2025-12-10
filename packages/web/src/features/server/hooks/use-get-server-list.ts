'use client';

import { queryKey } from '@/shared/hooks/query-key';
import { useQuery } from '@tanstack/react-query';
import { getServerList } from '../services/server-service';

export function useGetServerList() {
  return useQuery({
    queryKey: queryKey.server.list(),
    queryFn: getServerList,
  });
}

'use client';

import { queryKey } from '@/shared/hooks/query-key';
import { useQuery } from '@tanstack/react-query';
import { getMyServerList } from '../services/server-service';

export function useGetMyServerList() {
  return useQuery({
    queryKey: queryKey.server.myServers(),
    queryFn: getMyServerList,
  });
}

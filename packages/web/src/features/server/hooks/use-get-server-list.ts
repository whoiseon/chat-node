'use client';

import { queryKey } from '@/shared/hooks/query-key';
import { useQuery } from '@tanstack/react-query';
import { getServerList } from '../services/server-service';
import { ServerListParams } from '../types/server.types';

export function useGetServerList(params: Partial<ServerListParams>) {
  return useQuery({
    queryKey: queryKey.server.list(params),
    queryFn: () => getServerList(params),
  });
}

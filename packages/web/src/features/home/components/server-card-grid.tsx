'use client';

import {
  ServerCard,
  ServerCardSkeleton,
} from '@/features/home/components/server-card';
import { useGetServerList } from '@/features/server/hooks/use-get-server-list';

export function ServerCardGrid() {
  const { data, isLoading } = useGetServerList();

  if (isLoading) {
    return (
      <ul className="grid grid-cols-5 max-[1919px]:grid-cols-4 m-0 p-0 gap-8">
        {Array.from({ length: 10 }).map((_, index) => (
          <ServerCardSkeleton key={index} />
        ))}
      </ul>
    );
  }

  if (!data) return null;

  return (
    <ul className="grid grid-cols-5 max-[1919px]:grid-cols-4 m-0 p-0 gap-8">
      {data.payload?.rows.map((server) => (
        <ServerCard key={server.id} server={server} />
      ))}
    </ul>
  );
}

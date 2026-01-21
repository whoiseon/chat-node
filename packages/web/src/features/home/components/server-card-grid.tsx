'use client';

import {
  ServerCard,
  ServerCardSkeleton,
} from '@/features/home/components/server-card';
import { useGetServerList } from '@/features/server/hooks/use-get-server-list';
import { useServerFilter } from '../contexts/server-filter-context';
import { ServerEmpty } from './feedback/server-empty';

export function ServerCardGrid() {
  const { selectedTags, type, search, searchTarget } = useServerFilter();

  const { data, isLoading } = useGetServerList({
    tags: selectedTags.join(','),
    search,
    search_target: searchTarget,
  });

  if (isLoading) {
    return (
      <ul className="grid grid-cols-5 max-[1919px]:grid-cols-4 m-0 p-0 gap-8">
        {Array.from({ length: 10 }).map((_, index) => (
          <ServerCardSkeleton key={index} />
        ))}
      </ul>
    );
  }

  if (!data?.payload || data.payload?.totalCount === 0) return <ServerEmpty />;

  return (
    <div className="flex flex-col gap-y-4">
      {search && data.payload?.totalCount > 0 && (
        <span className="text-sm font-semibold text-muted-foreground">
          총 {data.payload?.totalCount.toLocaleString()}개의 검색 결과가
          있습니다.
        </span>
      )}
      <ul className="grid grid-cols-5 max-[1919px]:grid-cols-4 m-0 p-0 gap-8">
        {data.payload?.rows.map((server) => (
          <ServerCard
            key={server.id}
            server={server}
            visibleTags={type === 'tag'}
            search={search}
            searchTarget={searchTarget}
          />
        ))}
      </ul>
    </div>
  );
}

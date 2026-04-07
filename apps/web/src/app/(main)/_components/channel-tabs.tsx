'use client';

import { Icons } from '@repo/ui/components/ui/icons';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs';
import { cn } from '@repo/ui/lib/utils';
import { Input } from '@repo/ui/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { AllChannelList } from '@/app/(main)/_components/all-channel-list';
import { MyChannelList } from '@/app/(main)/_components/my-channel-list';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useMe } from '@/lib/hooks/use-me';

export function ChannelTabs() {
  const { isAuthenticated } = useMe();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get('tab') ?? 'all';

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'all') {
      params.delete('tab');
    } else {
      params.set('tab', value);
    }

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="flex-1 flex flex-col pt-6">
      <div className="relative px-4 mb-6">
        <Icons.Search className="absolute size-4 text-muted-foreground -translate-y-1/2 top-1/2 left-7" />
        <Input
          className="bg-background! h-10 pl-9"
          placeholder="채널 이름"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="bg-transparent p-0 gap-2 px-4">
          <TabsTrigger value="all">전체</TabsTrigger>
          {isAuthenticated && <TabsTrigger value="my">내 채팅</TabsTrigger>}
        </TabsList>
        <TabsContent value="all">
          <AllChannelList search={debouncedSearch} />
        </TabsContent>
        {isAuthenticated && (
          <TabsContent value="my">
            <MyChannelList search={debouncedSearch} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export function ChannelCardSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="px-4 py-3 flex items-center gap-4 rounded-xl">
          <div
            className={cn(
              'relative z-0 flex items-center justify-center overflow-hidden aspect-square rounded-xl w-14',
            )}
          >
            <Skeleton className="size-full" />
          </div>
          <div className="flex-1 min-w-0 flex justify-between">
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1 gap-4">
                <h3 className="font-semibold truncate flex items-center min-w-0">
                  <Skeleton className="h-5 w-30" />
                </h3>
                <div className="inline-flex">
                  <div className="text-xs whitespace-nowrap flex items-center mr-0.5 text-muted-foreground">
                    <Skeleton className="h-4 w-9" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

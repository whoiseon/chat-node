'use client';

import { ChannelItemDto } from '@repo/api-types';
import { Thumbnail } from '@repo/ui/components/system/thumbnail';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { Icons } from '@repo/ui/components/ui/icons';
import { Input } from '@repo/ui/components/ui/input';
import { cn } from '@repo/ui/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';

import { useChannels } from '@/app/(main)/_hooks/use-channels';
import { useMe } from '@/lib/hooks/use-me';

export function ChannelList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useChannels();

  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0,
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [handleObserver]);

  const channels = data?.pages.flatMap((page) => page.payload.channels) ?? [];

  return (
    <div className="flex-1 flex flex-col pt-6">
      <div className="relative px-4 mb-4">
        <Icons.Search className="absolute size-4 text-muted-foreground -translate-y-1/2 top-1/2 left-7" />
        <Input className="bg-background! h-10 pl-9" placeholder="채널 이름" />
      </div>
      <div className="flex flex-col gap-1">
        {channels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
        <div ref={observerRef} className="h-1" />
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Icons.Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}

interface ChannelCardProps {
  channel: ChannelItemDto;
}

function ChannelCard({ channel }: ChannelCardProps) {
  const { isAuthenticated } = useMe();

  const time = channel.lastMessage
    ? channel.lastMessage.createdAt
    : channel.createdAt;
  const timeAgo = formatDistanceToNow(new Date(time), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <Link
      href={`/channels/${channel.id}`}
      className="p-4 flex items-center gap-4 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded-xl transition-colors"
    >
      <div
        className={cn(
          'relative z-0 flex items-center justify-center overflow-hidden aspect-square rounded-xl w-14',
        )}
      >
        <Thumbnail src={channel.profileImageUrl ?? ''} alt={channel.name} />
      </div>
      <div className="flex-1 min-w-0 flex justify-between">
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1 gap-4">
            <h3 className="font-semibold truncate flex items-center min-w-0">
              {channel.isPrivate && (
                <Icons.Lock className="inline size-3.5 mr-2 shrink-0 text-muted-foreground" />
              )}
              <span className="truncate">{channel.name}</span>
            </h3>
            <div className="inline-flex">
              <div className="text-xs whitespace-nowrap flex items-center mr-0.5 text-muted-foreground">
                {timeAgo}
              </div>
              <ChannelMoreDropdown />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground truncate flex-1">
              {channel.lastMessage
                ? channel.lastMessage.content
                : channel.description}
            </p>
            {isAuthenticated && channel.unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="text-xs mr-2 bg-red-500 dark:bg-red-400 text-white font-semibold"
              >
                {channel.unreadCount.toLocaleString()}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ChannelMoreDropdown() {
  return (
    <div
      onClick={(e) => e.preventDefault()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground focus:ring-0 focus:outline-none hover:bg-transparent"
          >
            <Icons.More />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="left" className="bg-card">
          <DropdownMenuGroup>
            <ChannelMoreItem>읽음</ChannelMoreItem>
            <ChannelMoreItem>나가기</ChannelMoreItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ChannelMoreItem({ children }: PropsWithChildren) {
  return (
    <DropdownMenuItem className="cursor-pointer">{children}</DropdownMenuItem>
  );
}

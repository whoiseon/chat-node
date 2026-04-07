'use client';

import {
  ChannelItemDto,
  GetChannelsResponseDto,
  OnNewMessagePayload,
} from '@repo/api-types';
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
import { cn } from '@repo/ui/lib/utils';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';

import { ChannelCardSkeleton } from '@/app/(main)/_components/channel-tabs';
import { useChannels } from '@/app/(main)/_hooks/use-channels';
import { useSocket } from '@/components/provider/socket-provider';
import { channelKeys } from '@/lib/api/services/channels.api';

interface MyChannelListProps {
  search?: string;
}

export function MyChannelList({ search }: MyChannelListProps) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useChannels({ joined: true, search: search || undefined });

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

  // 소켓: new_message 수신 시 lastMessage + unreadCount 업데이트
  useEffect(() => {
    const handleNewMessage = (message: OnNewMessagePayload) => {
      const queryKey = channelKeys.list({
        joined: true,
        search: search || undefined,
      });

      queryClient.setQueryData<InfiniteData<GetChannelsResponseDto>>(
        queryKey,
        (old) => {
          if (!old) return old;

          // 모든 페이지에서 해당 채널을 찾아 제거
          let updatedChannel: ChannelItemDto | null = null;

          const pagesWithoutChannel = old.pages.map((page) => ({
            ...page,
            payload: {
              ...page.payload,
              channels: page.payload.channels.filter((ch) => {
                if (ch.id !== message.channelId || !ch.joinedAt) return true;
                updatedChannel = {
                  ...ch,
                  lastMessage: {
                    content: message.content,
                    senderName: message.sender?.displayName ?? '알 수 없음',
                    createdAt: message.createdAt,
                  },
                  unreadCount: ch.unreadCount + 1,
                };
                return false;
              }),
            },
          }));

          if (!updatedChannel) return old;

          // 첫 페이지 맨 앞에 삽입 (최신 메시지 순)
          const firstPage = pagesWithoutChannel[0];
          if (!firstPage) return old;

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                payload: {
                  ...firstPage.payload,
                  channels: [updatedChannel, ...firstPage.payload.channels],
                },
              },
              ...pagesWithoutChannel.slice(1),
            ],
          };
        },
      );
    };

    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, queryClient, search]);

  const channels = data?.pages.flatMap((page) => page.payload.channels) ?? [];

  if (isLoading) return <ChannelCardSkeleton />;

  return (
    <div className="flex flex-col">
      {channels.map((channel) => (
        <MyChannelCard key={channel.id} channel={channel} />
      ))}
      <div ref={observerRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Icons.Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

function MyChannelCard({ channel }: { channel: ChannelItemDto }) {
  const time = channel.lastMessage
    ? channel.lastMessage.createdAt
    : channel.createdAt;
  const timeAgo = formatDistanceToNow(new Date(time), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <Link href={`/channels/${channel.id}`} className="cursor-pointer">
      <div className="cursor-pointer px-4 py-3 flex items-center gap-4 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
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
              <p
                className={cn(
                  'text-sm text-muted-foreground line-clamp-2 flex-1 wrap-break-word',
                )}
              >
                {channel.lastMessage ? channel.lastMessage.content : '-'}
              </p>
              {channel.unreadCount > 0 && (
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

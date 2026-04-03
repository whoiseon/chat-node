'use client';

import { Icons } from '@repo/ui/components/ui/icons';
import { useCallback, useEffect, useRef } from 'react';

import {
  type ChatGroupProps,
  ChatGroup,
} from '@/app/(main)/channels/[channelId]/_components/chat';
import { useChannelId } from '@/app/(main)/channels/[channelId]/_context/channel-id.context';
import { useMessages } from '@/app/(main)/channels/[channelId]/_hooks/use-messages';
import { useScroll } from '@/app/(main)/channels/[channelId]/_hooks/use-scroll';

export function ChatListContainer() {
  const { channelId } = useChannelId();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useMessages({
      channelId,
    });

  const { scrollToBottom } = useScroll();

  const observerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  const handleObserve = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        // 스크롤 위치 기억
        const container = scrollContainerRef.current;
        const prevScrollHeight = container?.scrollHeight ?? 0;

        fetchNextPage().then(() => {
          // 이전 메시지 로드 후 스크롤 위치 복원
          requestAnimationFrame(() => {
            if (container) {
              const newScrollHeight = container.scrollHeight;
              container.scrollTop += newScrollHeight - prevScrollHeight;
            }
          });
        });
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleObserve, {
      threshold: 0,
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [handleObserve]);

  // 초기 로드 완료 시 스크롤 최하단
  useEffect(() => {
    if (!isLoading && data && isInitialLoad.current) {
      isInitialLoad.current = false;
      scrollToBottom();
    }
  }, [isLoading, data, scrollToBottom]);

  const groups: ChatGroupProps[] =
    data?.pages.flatMap((page) =>
      page.payload.rows.map((group) => ({
        date: group.date,
        messages: group.messages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          type: msg.type as ChatGroupProps['messages'][number]['type'],
          sender: msg.sender
            ? {
                id: msg.sender.userId,
                username: msg.sender.displayName,
                displayName: msg.sender.displayName,
              }
            : { id: 'system', username: 'system', displayName: '시스템' },
          createdAt: msg.createdAt,
        })),
      })),
    ) ?? [];

  if (groups.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/60">
        <Icons.MessageSquareX className="size-12 mb-4" />
        <h2 className="text-base">아직 대화가 없습니다..</h2>
      </div>
    );
  }

  return (
    <div ref={scrollContainerRef} className="flex-1">
      <div ref={observerRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Icons.Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
      {groups.map((group) => (
        <ChatGroup
          key={group.date}
          date={group.date}
          messages={group.messages}
        />
      ))}
    </div>
  );
}

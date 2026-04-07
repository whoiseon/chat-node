'use client';

import { Icons } from '@repo/ui/components/ui/icons';
import {
  RefObject,
  useCallback,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  type ChatGroupProps,
  ChatGroup,
} from '@/app/(main)/channels/[channelId]/_components/chat';
import { useChannelId } from '@/app/(main)/channels/[channelId]/_context/channel-id.context';
import { useMessages } from '@/app/(main)/channels/[channelId]/_hooks/use-messages';
import { useMe } from '@/lib/hooks/use-me';
import { useChannelActions, useChannelNewMessage } from '@/store/channel';

interface ChatListContainerProps {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}

export function ChatListContainer({
  scrollContainerRef,
}: ChatListContainerProps) {
  const { user } = useMe();
  const { channelId } = useChannelId();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useMessages({
      channelId,
    });

  const newMessage = useChannelNewMessage();
  const { setNewMessage } = useChannelActions();

  const observerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number | null>(null);
  const isInitialLoad = useRef(true);
  const [isReady, setIsReady] = useState(false);

  const handleObserve = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const container = scrollContainerRef.current;
      if (
        entry?.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        container
      ) {
        prevScrollHeightRef.current = container.scrollHeight;
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, scrollContainerRef],
  );

  useEffect(() => {
    const el = observerRef.current;
    const container = scrollContainerRef.current;
    if (!el || !container) return;

    const observer = new IntersectionObserver(handleObserve, {
      root: container,
      threshold: 0,
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [handleObserve, scrollContainerRef]);

  // 이전 메시지 로드 후 스크롤 위치 복원 (페인트 전에 실행)
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || prevScrollHeightRef.current === null) return;

    const prevScrollHeight = prevScrollHeightRef.current;
    prevScrollHeightRef.current = null;

    const newScrollHeight = container.scrollHeight;
    container.scrollTop += newScrollHeight - prevScrollHeight;
  }, [data, scrollContainerRef]);

  const scrollBottomEffectEvent = useEffectEvent(() => {
    const container = scrollContainerRef.current;
    if (!isLoading && data && isInitialLoad.current && container) {
      isInitialLoad.current = false;
      container.scrollTop = container.scrollHeight;
      setIsReady(true);
    }
  });

  // 초기 로드 시 스크롤 최하단 (페인트 전에 실행하여 깜빡임 방지)
  useLayoutEffect(() => {
    scrollBottomEffectEvent();
  }, [isLoading, data, scrollContainerRef]);

  useEffect(
    function clearNewMessageEffect() {
      if (!newMessage) return;

      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      const handleClear = () => {
        const isScrollBottom =
          scrollContainer.scrollTop + scrollContainer.clientHeight >=
          scrollContainer.scrollHeight;

        if (isScrollBottom) setNewMessage(null);
      };

      scrollContainer.addEventListener('scroll', handleClear);
      return () => scrollContainer.removeEventListener('scroll', handleClear);
    },
    [scrollContainerRef, setNewMessage, newMessage],
  );

  const groups: ChatGroupProps[] = useMemo(() => {
    if (!data) return [];

    const groupMap = new Map<string, ChatGroupProps>();

    for (const page of [...data.pages].reverse()) {
      for (const group of page.payload.rows) {
        const messages = group.messages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          type: msg.type as ChatGroupProps['messages'][number]['type'],
          sender: msg.sender
            ? {
                userId: msg.sender.userId,
                username: msg.sender.displayName,
                displayName: msg.sender.displayName,
                profileImageUrl: msg.sender.profileImageUrl,
              }
            : {
                userId: 'system',
                username: 'system',
                displayName: '시스템',
                profileImageUrl: null,
              },
          createdAt: msg.createdAt,
          deletedAt: msg.deletedAt,
          unreadCount: msg.unreadCount,
        }));

        const existing = groupMap.get(group.date);
        if (existing) {
          existing.messages = [...existing.messages, ...messages];
        } else {
          groupMap.set(group.date, { date: group.date, messages });
        }
      }
    }

    return Array.from(groupMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [data]);

  if (groups.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/60">
        <Icons.MessageSquareX className="size-12 mb-4" />
        <h2 className="text-base">아직 대화가 없습니다..</h2>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto min-h-0"
      style={{
        overflowAnchor: 'none',
        visibility: isReady || !isLoading ? 'visible' : 'hidden',
      }}
    >
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
          sessionUserId={user?.id || ''}
        />
      ))}
    </div>
  );
}

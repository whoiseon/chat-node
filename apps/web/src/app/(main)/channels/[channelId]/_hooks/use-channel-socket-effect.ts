import { OnNewMessagePayload } from '@repo/api-types';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { RefObject, useEffect } from 'react';

import { useScroll } from '@/app/(main)/channels/[channelId]/_hooks/use-scroll';
import { useSocket } from '@/components/provider/socket-provider';
import { messageKeys } from '@/lib/api/services/messages.api';
import { useChannelActions } from '@/store/channel';

import type { GetMessagesResponseDto } from '@repo/api-types';

export function useChannelSocketEffect(
  channelId: string,
  scrollContainerRef: RefObject<HTMLElement | null>,
) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const { scrollToBottom, isAtBottom } = useScroll(scrollContainerRef);
  const { setNewMessage } = useChannelActions();

  useEffect(() => {
    socket.emit('join_channel', { channelId });

    const handleBeforeUnload = () => {
      socket.emit('leave_channel', { channelId });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    socket.on('new_message', (message: OnNewMessagePayload) => {
      queryClient.setQueryData<InfiniteData<GetMessagesResponseDto>>(
        messageKeys.list({ channelId }),
        (old) => {
          if (!old) return old;

          const today = message.createdAt.split('T')[0]!;
          const newItem = {
            id: message.id,
            type: message.type,
            content: message.content,
            sender: message.sender,
            createdAt: message.createdAt,
          };

          const firstPage = old.pages[0];
          if (!firstPage) return old;

          const lastGroup =
            firstPage.payload.rows[firstPage.payload.rows.length - 1];

          // 같은 날짜 그룹이 있으면 거기에 추가, 없으면 새 그룹 생성
          const updatedRows =
            lastGroup && lastGroup.date === today
              ? firstPage.payload.rows.map((group) =>
                  group.date === today
                    ? { ...group, messages: [...group.messages, newItem] }
                    : group,
                )
              : [
                  ...firstPage.payload.rows,
                  { date: today, messages: [newItem] },
                ];

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                payload: { ...firstPage.payload, rows: updatedRows },
              },
              ...old.pages.slice(1),
            ],
          };
        },
      );

      if (isAtBottom()) {
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      } else {
        console.log('최하단 아님');
        setNewMessage({
          sender: message.sender?.displayName || '',
          content: message.content,
        });
      }
    });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      socket.off('new_message');
      socket.emit('leave_channel', { channelId });
    };
  }, [
    socket,
    channelId,
    queryClient,
    scrollToBottom,
    isAtBottom,
    setNewMessage,
  ]);
}

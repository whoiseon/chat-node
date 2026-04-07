'use client';

import { useCallback, useEffect, useRef } from 'react';

import { useSocket } from '@/components/provider/socket-provider';
import { channelsApi } from '@/lib/api/services/channels.api';

export function useChannelReadEffect(channelId: string) {
  const socket = useSocket();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const readChannel = useCallback(() => {
    const now = new Date().toISOString();

    channelsApi.readChannel(channelId);
    socket.emit('read_message', {
      channelId,
      lastReadAt: now,
    });
  }, [channelId, socket]);

  const debouncedReadChannel = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(readChannel, 300);
  }, [readChannel]);

  useEffect(() => {
    // 마운트 시에는 호출하지 않음 (join_channel ack 후 onRead로 호출됨)
    // 마운트 시 REST API를 먼저 호출하면 messages fetch보다 먼저 DB가 갱신되어
    // 이중 차감 문제 발생

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        readChannel();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [channelId, readChannel]);

  return { debouncedReadChannel };
}

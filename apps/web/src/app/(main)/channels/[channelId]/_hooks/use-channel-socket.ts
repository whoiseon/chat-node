'use client';

import { OnSendMessagePayload } from '@repo/api-types';

import { useSocket } from '@/components/provider/socket-provider';
import { SOCKET_SEND_MESSAGE } from '@/lib/constants/socket.constants';

export function useChannelSocket() {
  const socket = useSocket();

  const emitSendMessage = (data: OnSendMessagePayload) => {
    socket.emit(SOCKET_SEND_MESSAGE, data);
  };

  return {
    emitSendMessage,
  };
}

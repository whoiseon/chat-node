'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { Socket } from 'socket.io-client';

import { getSocket } from '@/lib/socket';

import type { PropsWithChildren } from 'react';

const SocketContext = createContext<Socket | null>(null);

export default function SocketProvider({
  children,
  cookie,
}: PropsWithChildren & { cookie: string }) {
  const socket = useMemo(() => getSocket(cookie), [cookie]);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error('useSocket must be used within SocketProvider');
  return socket;
};

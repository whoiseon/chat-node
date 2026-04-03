import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let currentCookie = '';

const extractToken = (cookie: string) =>
  cookie
    .split('; ')
    .find((c) => c.startsWith('access_token='))
    ?.split('=')[1];

export const getSocket = (cookie: string): Socket => {
  const prevToken = extractToken(currentCookie);
  const newToken = extractToken(cookie);

  if (socket && prevToken !== newToken) {
    socket.disconnect();
    socket = null;
  }

  currentCookie = cookie;

  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: (cb) => {
        cb({ token: extractToken(currentCookie) });
      },
      autoConnect: false,
    });
  }

  return socket;
};

export const resetSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  currentCookie = '';
};

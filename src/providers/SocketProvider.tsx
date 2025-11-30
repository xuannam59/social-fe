import { SOCKET_MESSAGE } from '@social/defaults/socket.default';
import { createContext, useContext, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import type { IUser } from '@social/types/user.type';

type SocketBag = {
  socket: Socket;
};

const SocketContext = createContext<SocketBag | null>(null);

export const SocketProvider = ({
  userInfo,
  children,
}: {
  userInfo: IUser | null;
  children: React.ReactNode;
}) => {
  const sockets = useMemo(() => {
    const isDev = import.meta.env.DEV;

    const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH;
    const SOCKET_URL = isDev
      ? import.meta.env.VITE_SOCKET_URL
      : window.location.origin;
    const common = {
      auth: { userInfo },
      transports: ['websocket'],
      reconnection: true,
      autoConnect: Boolean(userInfo && userInfo._id !== ''),
      path: SOCKET_PATH,
    };

    const socket = io(SOCKET_URL, common);
    socket.on(SOCKET_MESSAGE.CONNECT, () => {
      console.log('connected');
    });
    socket.on(SOCKET_MESSAGE.DISCONNECT, data => {
      console.log('disconnected', data);
    });

    return { socket };
  }, [userInfo]);

  return (
    <SocketContext.Provider value={sockets}>{children}</SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSockets = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('SocketProvider is missing');
  return ctx;
};

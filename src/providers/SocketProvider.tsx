import { createContext, useContext, useEffect, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import axiosInstance from '@social/configs/axios/axiosCustom';

type SocketBag = {
  socket: Socket;
};

const SocketContext = createContext<SocketBag | null>(null);

export const SocketProvider = ({
  token,
  children,
}: {
  token: string | null;
  children: React.ReactNode;
}) => {
  const sockets = useMemo(() => {
    const baseURL = import.meta.env.VITE_BACKEND_URL;
    const common = {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      autoConnect: Boolean(token && token !== 'null'),
    };

    const socket = io(`${baseURL}`, common);
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    return { socket };
  }, [token]);

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

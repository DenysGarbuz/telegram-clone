"use client";

import useToken from "@/hooks/useToken";
import { Message } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

interface ClientToServer {
  joining: (chatId: string) => void;
  joined: (chatId: string) => void;
  leaving: (chatId: string) => void;
  "message:add": ({}: any) => void;
  "message:edit": ({}: any) => void;
}
interface MySocket extends Socket<ClientToServer> {
  currentChatId: string;
}

type SocketContextType = {
  socket: MySocket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<MySocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = useToken();

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SERVER_URL as string, {
      query: {
        token,
      },
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("connected!!");
    });

    socketInstance.on("disconnect", () => {
      console.log("disconnected");
      setIsConnected(false);
    });

    setSocket(socketInstance as MySocket);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

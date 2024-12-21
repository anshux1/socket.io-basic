import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(url);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [url]);

  return socket;
};

const useSocketEvent = <T>(socket: Socket | null, event: string, handler: (data: T) => void) => {
  useEffect(() => {
    if (socket) {
      socket.on(event, handler);
      return () => {
        socket.off(event, handler);
      };
    }
  }, [socket, event, handler]);
}

const useSendMessages = <T>(socket: Socket | null) => {
  return (event: string, data: T) => {
    if (socket) {
      socket.emit(event, data);
    }
  }
}

export { useSocket, useSocketEvent, useSendMessages };

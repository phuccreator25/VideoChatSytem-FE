import { io, Socket } from "socket.io-client";
import { CONFIG } from "../config/appConfig";

const BASE_URL =
  CONFIG.MODE === "development" ? "http://localhost:3000" : "";

let socketInstance: Socket | null = null;

export const connectSocket = () => {
  if (!socketInstance) {
    socketInstance = io(BASE_URL, {
      withCredentials: true,
      autoConnect: false,
    });
  }

  if (!socketInstance.connected) {
    socketInstance.connect();
  }

  return socketInstance;
};

export const bindOnlineUsers = (callback: (userIds: string[]) => void) => {
  if (!socketInstance) return;

  socketInstance.off("getOnlineUsers");
  socketInstance.on("getOnlineUsers", callback); // Khi nhận được event thì run function callback được truyền vào
};

export const disconnectSocket = () => {
  if (!socketInstance) return;

  socketInstance.off("getOnlineUsers");
  socketInstance.disconnect();
  socketInstance = null;
};
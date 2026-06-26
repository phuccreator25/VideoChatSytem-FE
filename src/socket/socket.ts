import { io, Socket } from "socket.io-client";
import { CONFIG } from "../config/appConfig";

const BASE_URL =
  CONFIG.MODE === "development" ? "http://localhost:3000" : "";
// const BASE_URL =
//   CONFIG.MODE === "development" ? "http://127.0.0.1:30001" : "";

let socketInstance: Socket | null = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(BASE_URL, {
      withCredentials: true,
      autoConnect: false,
    });
  }

  return socketInstance;
};

export const connectSocket = () => {
  const socket = getSocket();

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (!socketInstance) return;

  socketInstance.disconnect();
  socketInstance = null;
};


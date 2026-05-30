import type { ConversationReadSuccess, MessageReceivedPayload, MessageType } from "../types/chat.type";
import { getSocket } from "./socket";

export const emitConversationRead = (conversationId: string) => {
  if (!conversationId) return;

  const socket = getSocket();

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("messages:read", {
    conversationId,
  });
};

export const bindConversationReadSuccess = (callback: (payload: ConversationReadSuccess) => void) => {
    const socket = getSocket();
    socket.off("messages:read:success", callback);
    socket.on("messages:read:success", callback)
}

export const unbindConversationReadSuccess = (callback: (payload: ConversationReadSuccess) => void) => {
    const socket = getSocket();
    socket.off("messages:read:success", callback);
}

export const bindMessageNew = (callback: (payload: MessageType) => void) => {
    const socket = getSocket();
    socket.off("messages:new", callback);
    socket.on("messages:new", callback)
}

export const unbindMessageNew = (callback: (payload: MessageType) => void) => {
    const socket = getSocket();
    socket.off("messages:new", callback);
}

export const bindReceivedMessages = (callback: (payload: MessageReceivedPayload) => void) => {
    const socket = getSocket();
    socket.off("messages:received", callback);
    socket.on("messages:received", callback)
}

export const unbindReceivedMessages = (callback: (payload: MessageReceivedPayload) => void) => {
    const socket = getSocket();
    socket.off("messages:received", callback);
}
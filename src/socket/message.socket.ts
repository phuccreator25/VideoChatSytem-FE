import type { pinMessages } from "../types/chat/chat.conversation.type";
import type { MessageType } from "../types/chat/chat.model.type";
import type { MessageReceivedPayload } from "../types/chat/chat.payload.type";
import type { ConversationReadSuccess, deletePinMessageSocket, reactEmotionMessageSocket, TypingSocket } from "../types/chat/chat.socket.type";
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

export const emitTypingMesssage = (conversationId: string, isTyping: boolean) => {
  if (!conversationId) return;

  const socket = getSocket();

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("messages:typing", {
    conversationId, isTyping
  });
};

export const bindConversationReadSuccess = (
  callback: (payload: ConversationReadSuccess) => void,
) => {
  const socket = getSocket();
  socket.off("messages:read:success", callback);
  socket.on("messages:read:success", callback);
};

export const unbindConversationReadSuccess = (
  callback: (payload: ConversationReadSuccess) => void,
) => {
  const socket = getSocket();
  socket.off("messages:read:success", callback);
};

export const bindTypingMessageSuccess = (
  callback: (payload: TypingSocket) => void,
) => {
  const socket = getSocket();
  socket.off("messages:typing:success", callback);
  socket.on("messages:typing:success", callback);
};

export const unbindTypingMessageSuccess = (
  callback: (payload: TypingSocket) => void,
) => {
  const socket = getSocket();
  socket.off("messages:typing:success", callback);
};

export const bindMessageNew = (callback: (payload: MessageType) => void) => {
  const socket = getSocket();
  socket.off("messages:new", callback);
  socket.on("messages:new", callback);
};

export const unbindMessageNew = (callback: (payload: MessageType) => void) => {
  const socket = getSocket();
  socket.off("messages:new", callback);
};

export const bindReceivedMessages = (
  callback: (payload: MessageReceivedPayload) => void,
) => {
  const socket = getSocket();
  socket.off("messages:received", callback);
  socket.on("messages:received", callback);
};

export const unbindReceivedMessages = (
  callback: (payload: MessageReceivedPayload) => void,
) => {
  const socket = getSocket();
  socket.off("messages:received", callback);
};

export const bindPinMessage = (
  callback: (payload: pinMessages) => void,
) => {
  const socket = getSocket();
  socket.off("messages:pinMessage", callback);
  socket.on("messages:pinMessage", callback);
};

export const unbindPinMessage = (
  callback: (payload: pinMessages) => void,
) => {
  const socket = getSocket();
  socket.off("messages:pinMessage", callback);
};

export const bindDeletePinMessage = (
  callback: (payload: deletePinMessageSocket) => void,
) => {
  const socket = getSocket();
  socket.off("messages:delete-pinMessage", callback);
  socket.on("messages:delete-pinMessage", callback);
};

export const unbindDeletePinMessage = (
  callback: (payload: deletePinMessageSocket) => void,
) => {
  const socket = getSocket();
  socket.off("messages:delete-pinMessage", callback);
};

export const bindReactEmotionMessage = (
  callback: (payload: reactEmotionMessageSocket) => void,
) => {
  const socket = getSocket();
  socket.off("messages:react-emotion", callback);
  socket.on("messages:react-emotion", callback);
};

export const unbindReactEmotionMessage = (
  callback: (payload: reactEmotionMessageSocket) => void,
) => {
  const socket = getSocket();
  socket.off("messages:react-emotion", callback);
};

export const bindUnReactEmotionMessage = (
  callback: (payload: reactEmotionMessageSocket) => void,
) => {
  const socket = getSocket();
  socket.off("messages:unreact-emotion", callback);
  socket.on("messages:unreact-emotion", callback);
};

export const unbindUnReactEmotionMessage = (
  callback: (payload: reactEmotionMessageSocket) => void,
) => {
  const socket = getSocket();
  socket.off("messages:unreact-emotion", callback);
};

export const bindDeleteMessage = (
  callback: (payload: MessageType) => void,
) => {
  const socket = getSocket();
  socket.off("messages:delete", callback);
  socket.on("messages:delete", callback);
};

export const unbindDeleteMessage = (
  callback: (payload: MessageType) => void,
) => {
  const socket = getSocket();
  socket.off("messages:delete", callback);
};

export const bindRevokeMessage = (
  callback: (payload: MessageType) => void,
) => {
  const socket = getSocket();
  socket.off("messages:revoke", callback);
  socket.on("messages:revoke", callback);
};

export const unbindRevokeMessage = (
  callback: (payload: MessageType) => void,
) => {
  const socket = getSocket();
  socket.off("messages:revoke", callback);
};



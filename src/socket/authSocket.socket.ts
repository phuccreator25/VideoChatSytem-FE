import { getSocket } from "./socket";

export type PresencePayload = {
  userId: string;
  isOnline: boolean;
  lastSeenAt?: string | null;
  name: string;
  avatar: string;
};

export type OnlineUserSocket = {
  userId: string;
  name: string;
  avatar: string;
  isOnline: boolean;
};

const onlineUsersHandlers = new WeakMap<
  (users: OnlineUserSocket[]) => void,
  (users: OnlineUserSocket[]) => void
>();

const presenceChangedHandlers = new WeakMap<
  (payload: PresencePayload) => void,
  (payload: PresencePayload) => void
>();

export type BanSessionPayload = {
  currentUserId: string;
  sessionId: string;
  message: string
};

export const bindOnlineUsers = (
  callback: (users: OnlineUserSocket[]) => void,
) => {
  const socket = getSocket();

  const oldHandler = onlineUsersHandlers.get(callback);
  if (oldHandler) {
    socket.off("presence:online_users", oldHandler);
  }

  const handler = (users: OnlineUserSocket[]) => {
    callback(users);
  };

  onlineUsersHandlers.set(callback, handler);
  socket.on("presence:online_users", handler);
};

export const unbindOnlineUsers = (
  callback: (users: OnlineUserSocket[]) => void,
) => {
  const socket = getSocket();
  const handler = onlineUsersHandlers.get(callback);
  if (!handler) return;

  socket.off("presence:online_users", handler);
  onlineUsersHandlers.delete(callback);
};

export const bindUserPresenceChanged = (
  callback: (payload: PresencePayload) => void,
) => {
  const socket = getSocket();

  const oldHandler = presenceChangedHandlers.get(callback);
  if (oldHandler) {
    socket.off("presence:changed", oldHandler);
  }

  const handler = (payload: PresencePayload) => {
    callback(payload);
  };

  presenceChangedHandlers.set(callback, handler);
  socket.on("presence:changed", handler);
};

export const unbindUserPresenceChanged = (
  callback: (payload: PresencePayload) => void,
) => {
  const socket = getSocket();
  const handler = presenceChangedHandlers.get(callback);
  if (!handler) return;

  socket.off("presence:changed", handler);
  presenceChangedHandlers.delete(callback);
};

export const bindBanSession = (
  callback: (payload: BanSessionPayload) => void,
) => {
  const socket = getSocket();

  socket.off("auth:session_banned", callback);
  socket.on("auth:session_banned", callback);
};

export const unbindBanSession = (
  callback: (payload: BanSessionPayload) => void,
) => {
  const socket = getSocket();

  socket.off("auth:session_banned", callback);
};

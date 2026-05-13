import { getSocket } from "./socket";

export type PresencePayload = {
  userId: string;
  isOnline: boolean;
  lastSeenAt?: string | null;
};

const onlineUsersHandlers = new WeakMap<
  (userIds: string[]) => void,
  (userIds: string[]) => void
>();

const presenceChangedHandlers = new WeakMap<
  (payload: PresencePayload) => void,
  (payload: PresencePayload) => void
>();

export const bindOnlineUsers = (callback: (userIds: string[]) => void) => {
  const socket = getSocket();

  const oldHandler = onlineUsersHandlers.get(callback);
  if (oldHandler) {
    socket.off("presence:online_users", oldHandler);
  }

  const handler = (userIds: string[]) => {
    console.log("presence:online_users", userIds);
    callback(userIds);
  };

  onlineUsersHandlers.set(callback, handler);
  socket.on("presence:online_users", handler);
};

export const unbindOnlineUsers = (callback: (userIds: string[]) => void) => {
  const socket = getSocket();
  const handler = onlineUsersHandlers.get(callback);
  if (!handler) return;

  socket.off("presence:online_users", handler);
  onlineUsersHandlers.delete(callback);
};

export const bindUserPresenceChanged = (
  callback: (payload: PresencePayload) => void
) => {
  const socket = getSocket();

  const oldHandler = presenceChangedHandlers.get(callback);
  if (oldHandler) {
    socket.off("presence:changed", oldHandler);
  }

  const handler = (payload: PresencePayload) => {
    console.log("presence:changed", payload);
    callback(payload);
  };

  presenceChangedHandlers.set(callback, handler);
  socket.on("presence:changed", handler);
};

export const unbindUserPresenceChanged = (
  callback: (payload: PresencePayload) => void
) => {
  const socket = getSocket();
  const handler = presenceChangedHandlers.get(callback);
  if (!handler) return;

  socket.off("presence:changed", handler);
  presenceChangedHandlers.delete(callback);
};

import type {
  InvitationActionSocket,
  InvitationReceived,
} from "../types/invitation/invitation.socket.type";
import { getSocket } from "./socket";

export const bindInvitationCreated = (
  callback: (payload: InvitationReceived) => void,
) => {
  const socket = getSocket();
  socket.off("invitation:received", callback);
  socket.on("invitation:received", callback);
};

export const unbindInvitationCreated = (
  callback: (payload: InvitationReceived) => void,
) => {
  const socket = getSocket();
  socket.off("invitation:received", callback);
};

export const bindInvitationCancel = (callback: (payload: InvitationActionSocket) => void) => {
  const socket = getSocket();
  socket.off("invitation:cancelled", callback);
  socket.on("invitation:cancelled", callback);
};

export const unbindInvitationCancel = (callback: (payload: InvitationActionSocket) => void) => {
  const socket = getSocket();
  socket.off("invitation:cancelled", callback);
};

export const bindInvitationAccept = (callback: (payload: InvitationActionSocket) => void) => {
  const socket = getSocket();
  socket.off("invitation:accepted", callback);
  socket.on("invitation:accepted", callback);
};

export const unbindInvitationAccept = (callback: (payload: InvitationActionSocket) => void) => {
  const socket = getSocket();
  socket.off("invitation:accepted", callback);
};

export const bindInvitationDecline = (callback: (payload: InvitationActionSocket) => void) => {
  const socket = getSocket();
  socket.off("invitation:declined", callback);
  socket.on("invitation:declined", callback);
};

export const unbindInvitationDecline = (callback: (payload: InvitationActionSocket) => void) => {
  const socket = getSocket();
  socket.off("invitation:declined", callback);
};

export const bindInvitationSent = (callback: (payload: InvitationActionSocket) => void) => {
  const socket = getSocket();
  socket.off("invitation:sent", callback);
  socket.on("invitation:sent", callback);
};

export const unbindInvitationSent = (callback: (payload: InvitationActionSocket) => void) => {
  const socket = getSocket();
  socket.off("invitation:sent", callback);
};

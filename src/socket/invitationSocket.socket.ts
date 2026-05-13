import { getSocket } from "./socket";

export const bindInvitationCreated = (
  callback: (payload: any) => void
) => {
  const socket = getSocket();
  socket.off("invitation:received", callback);
  socket.on("invitation:received", callback);
};

export const unbindInvitationCreated = (
  callback: (payload: any) => void
) => {
  const socket = getSocket();
  socket.off("invitation:received", callback);
};

export const bindInvitationCancel = (callback: (payload: any) => void) => {
    const socket = getSocket();
    socket.off("invitation:cancelled", callback);
    socket.on("invitation:cancelled", callback)
}

export const unbindInvitationCancel = (callback: (payload: any) => void) => {
    const socket = getSocket();
    socket.off("invitation:cancelled", callback);
}

export const bindInvitationAccept = (callback: (payload: any) => void) => {
    const socket = getSocket();
    socket.off("invitation:accepted", callback);
    socket.on("invitation:accepted", callback)
}

export const unbindInvitationAccept = (callback: (payload: any) => void) => {
    const socket = getSocket();
    socket.off("invitation:accepted", callback);
}

export const bindInvitationDecline = (callback: (payload: any) => void) => {
    const socket = getSocket();
    socket.off("invitation:declined", callback);
    socket.on("invitation:declined", callback)
}

export const unbindInvitationDecline = (callback: (payload: any) => void) => {
    const socket = getSocket();
    socket.off("invitation:declined", callback);
}
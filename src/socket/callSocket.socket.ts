import { getSocket } from "./socket";
import type { CallEndPayload } from "../types/call/call.type";

export type CallOfferSuccessPayload = {
  offer: RTCSessionDescriptionInit;
  callerId: string;
  calleeId: string;
  type: string;
  callId: string;
  callerInfo: {
    userId: string;
    avatar: string;
    fullname: string;
    nickname: string | null;
    isOnline: string;
  };
};

export const emitCallOffer = (data: {
  conversationId: string;
  callerId: string;
  calleeId: string;
  type: string;
  offer: RTCSessionDescriptionInit;
}) => {
  const socket = getSocket();

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("call:offer", data);
};

export const emitIceCandidate = (
  currentUserId: string,
  conversationId: string,
  candidate: RTCIceCandidate,
) => {
  if (!conversationId) return;

  const socket = getSocket();

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("call:ice-candidate", {
    currentUserId,
    conversationId,
    candidate,
  });
};

export const emitCallAnswer = (
  conversationId: string,
  callerId: string,
  answer: RTCSessionDescriptionInit,
) => {
  const socket = getSocket();

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("call:answer", {
    conversationId,
    callerId,
    answer,
  });
};

export const bindCallAnswer = (callback: (payload: any) => void) => {
  const socket = getSocket();
  socket.off("call:answer", callback);
  socket.on("call:answer", callback);
};

export const unbindCallAnswer = (callback: (payload: any) => void) => {
  const socket = getSocket();
  socket.off("call:answer", callback);
};

//Callee
export const bindCallOfferSuccess = (
  callback: (payload: CallOfferSuccessPayload) => void,
) => {
  const socket = getSocket();
  socket.off("call:offer:success", callback);
  socket.on("call:offer:success", callback);
};

export const unbindCallOfferSuccess = (
  callback: (payload: CallOfferSuccessPayload) => void,
) => {
  const socket = getSocket();
  socket.off("call:offer:success", callback);
};

//Caller
export const bindCallInitiated = (
  callback: (payload: { callId: string }) => void,
) => {
  const socket = getSocket();
  socket.off("call:initiated", callback);
  socket.on("call:initiated", callback);
};

export const unbindCallInitiated = (
  callback: (payload: { callId: string }) => void,
) => {
  const socket = getSocket();
  socket.off("call:initiated", callback);
};

//Call End
export const bindCallEnd = (callback: (payload: CallEndPayload) => void) => {
  const socket = getSocket();
  socket.off("call:end", callback);
  socket.on("call:end", callback);
};

export const unbindCallEnd = (callback: (payload: CallEndPayload) => void) => {
  const socket = getSocket();
  socket.off("call:end", callback);
};

//ICE candidate
export const bindCallCandidate = (callback: (payload: any) => void) => {
  const socket = getSocket();
  socket.off("call:ice-candidate", callback);
  socket.on("call:ice-candidate", callback);
};

export const unbindCallCandidate = (callback: (payload: any) => void) => {
  const socket = getSocket();
  socket.off("call:ice-candidate", callback);
};

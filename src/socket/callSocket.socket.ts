import { getSocket } from "./socket";
import type { CallEndPayload } from "../types/call/call.type";
import type {
  AcceptCallPayload,
  CallOfferSuccessPayload,
} from "../types/call/callSocket.type";

// ==========================================
// I. EMITTERS (TÍN HIỆU PHÁT ĐI)
// ==========================================

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

export const emitCloseVideoCall = (callId: string, currentUserId: string) => {
  const socket = getSocket();

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("call:close-video", {
    callId,
    currentUserId,
  });
};

export const emitCloseAudioCall = (callId: string, currentUserId: string) => {
  const socket = getSocket();

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("call:close-audio", {
    callId,
    currentUserId,
  });
};

// ==========================================
// II. BINDERS & UNBINDERS (TÍN HIỆU LẮNG NGHE)
// ==========================================

// --- 1. Thiết lập cuộc gọi (Offer / Answer / Candidate) ---

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

export const bindCallAnswer = (callback: (payload: any) => void) => {
  const socket = getSocket();
  socket.off("call:answer", callback);
  socket.on("call:answer", callback);
};

export const unbindCallAnswer = (callback: (payload: any) => void) => {
  const socket = getSocket();
  socket.off("call:answer", callback);
};

export const bindCallCandidate = (callback: (payload: any) => void) => {
  const socket = getSocket();
  socket.off("call:ice-candidate", callback);
  socket.on("call:ice-candidate", callback);
};

export const unbindCallCandidate = (callback: (payload: any) => void) => {
  const socket = getSocket();
  socket.off("call:ice-candidate", callback);
};

export const bindAcceptCall = (
  callback: (payload: AcceptCallPayload) => void,
) => {
  const socket = getSocket();
  socket.off("call:accept", callback);
  socket.on("call:accept", callback);
};

export const unbindAcceptCall = (
  callback: (payload: AcceptCallPayload) => void,
) => {
  const socket = getSocket();
  socket.off("call:accept", callback);
};

// --- 2. Thay đổi trạng thái thiết bị (Audio / Video) ---

export const bindCloseVideoCall = (
  callback: (payload: { callId: string; userIdWhoClose: string }) => void,
) => {
  const socket = getSocket();
  socket.off("call:close-video", callback);
  socket.on("call:close-video", callback);
};

export const unbindCloseVideoCall = (
  callback: (payload: { callId: string; userIdWhoClose: string }) => void,
) => {
  const socket = getSocket();
  socket.off("call:close-video", callback);
};

export const bindCloseAudioCall = (
  callback: (payload: { callId: string; userIdWhoClose: string }) => void,
) => {
  const socket = getSocket();
  socket.off("call:close-audio", callback);
  socket.on("call:close-audio", callback);
};

export const unbindCloseAudioCall = (
  callback: (payload: { callId: string; userIdWhoClose: string }) => void,
) => {
  const socket = getSocket();
  socket.off("call:close-audio", callback);
};

// --- 3. Kết thúc cuộc gọi ---

export const bindCallEnd = (callback: (payload: CallEndPayload) => void) => {
  const socket = getSocket();
  socket.off("call:end", callback);
  socket.on("call:end", callback);
};

export const unbindCallEnd = (callback: (payload: CallEndPayload) => void) => {
  const socket = getSocket();
  socket.off("call:end", callback);
};

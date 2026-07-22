import { getSocket } from "./socket";
import type { CallEndPayload, CallTranscriptSocketPayload } from "../types/call/call.type";
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

export const emitToggleMedia = (payload: {
  callId: string;
  currentUserId: string;
  mediaType: "audio" | "video" | "screen";
  enabled: boolean;
}) => {
  const socket = getSocket();

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("call:toggle-media", payload);
};

export const emitSpeedToText = (payload: CallTranscriptSocketPayload) => {
  const socket = getSocket();

  if (!socket.connected) {
    socket.connect();
  }
  
  socket.emit("call:speed-to-text", payload);
}

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

// --- 4.Người dùng ngoại tuyến ---
export const bindCallOffline = (
  callback: (payload: { callId: string }) => void,
) => {
  const socket = getSocket();
  socket.off("call:offline", callback);
  socket.on("call:offline", callback);
};

export const unbindCallOffline = (
  callback: (payload: { callId: string }) => void,
) => {
  const socket = getSocket();
  socket.off("call:offline", callback);
};

// --- 5. Cuộc gọi đang đổ chuông ---
export const bindCallRinging = (
  callback: (payload: { callId: string }) => void,
) => {
  const socket = getSocket();
  socket.off("call:ringing", callback);
  socket.on("call:ringing", callback);
};

export const unbindCallRinging = (
  callback: (payload: { callId: string }) => void,
) => {
  const socket = getSocket();
  socket.off("call:ringing", callback);
};

export const bindCallToggleMedia = (
  callback: (payload: {
    callId: string;
    userIdWhoToggled: string;
    mediaType: "audio" | "video" | "screen";
    enabled: boolean;
  }) => void,
) => {
  const socket = getSocket();
  socket.off("call:toggle-media", callback);
  socket.on("call:toggle-media", callback);
};

export const unbindCallToggleMedia = (
  callback: (payload: {
    callId: string;
    userIdWhoToggled: string;
    mediaType: "audio" | "video" | "screen";
    enabled: boolean;
  }) => void,
) => {
  const socket = getSocket();
  socket.off("call:toggle-media", callback);
};

export const bindCallToggleMediaError = (
  callback: (payload: { message: string; mediaType?: string }) => void,
) => {
  const socket = getSocket();
  socket.off("call:toggle-media:error", callback);
  socket.on("call:toggle-media:error", callback);
};

export const unbindCallToggleMediaError = (
  callback: (payload: { message: string; mediaType?: string }) => void,
) => {
  const socket = getSocket();
  socket.off("call:toggle-media:error", callback);
};

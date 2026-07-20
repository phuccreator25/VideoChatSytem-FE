import type { ConversationUserInfo } from "../chat.type";

export type CallType = "voice" | "video";
export type CallStatus = "ringing" | "completed" | "rejected" | "missed";
export type ParticipantRole = "caller" | "callee";
export type ParticipantStatus = "pending" | "accepted" | "rejected" | "missed";

export interface CallParticipant {
  userId: string;
  role: ParticipantRole;
  joinStatus: ParticipantStatus;
  joinedAt: string | Date | null;
  leftAt: string | Date | null;
}

export interface CallModel {
  _id?: string;
  conversationId: string;
  type: CallType;
  status: CallStatus;
  startedAt: string | Date | null;
  endedAt: string | Date | null;
  participants: CallParticipant[];
  createdAt: string | Date;
  updatedAt: string | Date | null;
}

export interface CallEndPayload {
  callId: string;
  userIdWhoLeft: string;
  shouldCloseUI: boolean;
  updatedCall: CallModel;
  reason?: "ended" | "rejected" | "cancelled";
}

//Redux
export type incomingType = {
  isOpen: boolean;
  userData: ConversationUserInfo | null;
  type: CallType | null;
  callId: string | null;
  callerId: string | null;
  offer: RTCSessionDescriptionInit | null;
  conversationId: string | null;
};

export type initialType = {
  incomingCall: incomingType;
  callInfo: string | null;
  isCallModalOpen: {
    isOpen: boolean;
    type: CallType; // Khai báo union type chuẩn ở đây
  };
  iceCandidates: RTCIceCandidate[];
};

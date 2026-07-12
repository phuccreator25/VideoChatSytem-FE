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


export type CallParticipant = {
  userId: string;
  fullname: string;
  email: string;
  username: string;
  avatar?: string;
  role: "caller" | "callee";
  joinStatus?: "pending" | "accepted" | "rejected" | "missed";
  joinedAt?: string | null;
  leftAt?: string | null;
  leaveReason?: string | null;
};

export type CallItem = {
  _id: string;
  conversationId: string;
  type: "video" | "voice";
  status: "ringing" | "active" | "completed" | "rejected" | "missed" | "cancelled";
  duration: number; // in seconds
  endReason?: "normal" | "network_lost" | "timeout" | string | null;
  startedAt: string;
  endedAt?: string | null;
  createdAt: string;
  participants: CallParticipant[];
  timeline?: {
    initiatedAt?: string;
    ringingAt?: string;
    connectedAt?: string;
    endedAt?: string;
  };
};

export type typeQueryCallAdmin = {
  search?: string;
  status?: string;
  type?: string;
  endReason?: string;
  startDate?: string;
  endDate?: string;
};


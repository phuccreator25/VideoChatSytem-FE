export type ReportTargetType = "message" | "account";

export type ReportMessageReason =
  | "spam"
  | "harassment"
  | "fraud"
  | "hate_speech"
  | "inappropriate_media"
  | "other";

export type ReportAccountReason =
  | "fake_identity"
  | "scam_account"
  | "bot_spam"
  | "harassment_behavior"
  | "other";

export type ReportReason = ReportMessageReason | ReportAccountReason;

export type IReportTargetUser = {
  userId: string;
  fullname: string;
  username: string | null;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
};

export type IReportTargetMessage = {
  messageId: string;
  conversationId: string;
  content?: string;
  mediaThumbnailUrl?: string;
  sentAt: string;
  sender?: IReportTargetUser;
  messageType?: "text" | "file" | "image" | string;
  fileName?: string;
  fileExtension?: string;
  fileSize?: number | string;
};

export type ICreateReportMessagePayload = {
  targetType: "message";
  targetUserId: string;
  messageId: string;
  conversationId: string;
  reason: ReportMessageReason;
  description?: string; // Tối đa 300 ký tự
  reportedMessageSnapshot: {
    content?: string;
    mediaUrl?: string;
    messageType?: string;
    sentAt?: string;
  };
};

export type ICreateReportAccountPayload = {
  targetType: "account";
  targetUserId: string;
  reason: ReportAccountReason;
  description?: string; // Tối đa 500 ký tự
  uploadSessionId: string;
  evidenceAttachments?: string[]; // Danh sách URL ảnh chứng từ (tối đa 3 ảnh)
};



export type queryReports = {
  search?: string;
  targetType?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export type TicketPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ReportStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

export type ITargetUserSnapshot = {
  id: string;
  fullname: string;
  email: string;
  avatar?: string;
}

export type IReportedMessageSnapshot = {
  content?: string;
  mediaUrl?: string;
  messageType?: 'text' | 'file' | 'image' | string;
  sentAt?: string;
}

export type IReportTicket = {
  id: string;
  targetType: ReportTargetType;
  status: ReportStatus;
  createdAt: string;
  assignedAt?: string | null;
  resolvedAt?: string | null;

  targetUser: ITargetUserSnapshot;

  conversationId?: string;
  messageId?: string;
  reportedMessageSnapshot?: IReportedMessageSnapshot;
  evidenceAttachments?: string[];

  reason: string;
  description?: string;
  resolutionActions?: string[];
  feedbackToReporter?: string;
}

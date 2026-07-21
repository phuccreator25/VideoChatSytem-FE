export const ChatItemTypes = {
  TEXT: "text",
  FILE: "file",
  GIF: "gif",
  CALL: "call",
} as const;

export type ChatItemType = (typeof ChatItemTypes)[keyof typeof ChatItemTypes];

export type MessageStatus =
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | string;

export type AttachmentStatus =
  | "sending"
  | "uploading"
  | "done"
  | "failed"
  | string;

export type MessageDelivery = {
  id: string;
  messageId: string;
  userId: string;
  deliveredAt?: string | null;
  readAt?: string | null;
  conversationId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type MessageAttachment = {
  tempAttachmentId?: string;
  attachmentId?: string;
  fileUrl?: string | null;
  publicId?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  resourceType?: string | null;
  width?: number | null;
  height?: number | null;
  status?: AttachmentStatus;
  createdAt?: string;
  updatedAt?: string;
  previewUrl?: string | null;
  file?: File | null;
  recordDuration?: number | null;
};

export type PreviewType = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  domain?: string;
};

export const callStatuses = {
  RINGING: "ringing",
  COMPLETED: "completed",
  REJECTED: "rejected",
  ACTIVE: "active",
  MISSED: "missed",
  CANCELLED: "cancelled",
} as const;

export type CallStatus = (typeof callStatuses)[keyof typeof callStatuses];

export type CallInfoType = {
  callId?: string;
  callType?: "video" | "audio" | string;
  status?: CallStatus | string;
  duration?: number | null;
  hasTranscript?: boolean;
  aiSummary?: {
    summary?: string;
    keyPoints?: string[];
    actionItems?: string[];
    createdAt?: string;
  } | null;
};

export type MessageType = {
  id: string;
  tempMessageId?: string;
  conversationId: string;
  senderId: string;
  status?: MessageStatus;
  type: ChatItemType;
  messageType?: string;
  callInfo?: CallInfoType;
  content?: string | null;
  attachments?: MessageAttachment[];
  preview?: PreviewType;
  replyMessage?: MessageType | null;
  gifUrl?: string | null;
  replyToMessageId?: string | null;
  isEdited?: boolean;
  editedAt?: string | null;
  deletedBy?: string[];
  isRevoked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  sendStatus?: "sent" | "failed" | string;
  deliveries?: MessageDelivery[];
  reactions?: reactionMessage[];
};

export type reactionMessage = {
  userId: string;
  name: string;
  emotion: "LIKE" | "HAHA" | "SAD" | "WOW" | "LOVE" | "ANGRY";
  createAt: string;
};

export type SelectedGif = {
  provider: "giphy";
  providerId: string;
  title: string;
  url: string;
  previewUrl: string;
  width: number;
  height: number;
};

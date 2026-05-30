export const ChatItemTypes = {
  TEXT: "text",
  FILE: "file",
  IMAGE: "image",
  GALLERY: "gallery",
} as const;

export type ChatItemType =
  typeof ChatItemTypes[keyof typeof ChatItemTypes];

export type MessageDelivery = {
  id: string;
  messageId: string;
  userId: string;
  deliveredAt?: string | null;
  readAt?: string | null;
  conversationId?: string | null;
  createdAt?: string;
  updatedAt?: string
};

export type MessageReceivedPayload = {
  conversationId: string;
  deliveredAt?: string | null;
};

export type MessageType = {
  id: string;
  conversationId: string;
  senderId: string;
  type: ChatItemType;
  content?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: string | null;
  replyToMessageId?: string | null;
  isEdited?: boolean;
  editedAt?: string | null;
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deliveries?: MessageDelivery[];
  status?:string
};

export type ConversationReadSuccess = {
    conversationId: string,
    readerUserId: string,
    readtAt: string,
    updatedCount: number,
    messageIds: [],
    senderId: string
};

export type ConversationUserInfo = {
  userId: string;
  avatar: string;
  fullname: string;
  nickname?: string | null;
  isOnline: string;
  lastSeenAt?: string | null;
  isBlocked?: boolean;
  invitationId?: string | null;
  relationStatus?: "none" | "add" | "received" | "sent";
};

export type ConversationReadPayload = {
  conversationId: string;
  readerUserId?: string;
  readAt?: string | null;
  messageIds?: string[];
  messageId?: string;
  senderId: string;
};

export type ChatHeaderUser = ConversationUserInfo & {
  conversationId: string;
};

export type ConversationDetail = {
  id: string;
  user: ChatHeaderUser;
  messages: MessageType[];
};

export type ConversationSummary = ConversationUserInfo & {
  id: string;
  lastMessage?: MessageType;
  unreadCount: number;
};

export type UserData = {
  _id: string;
  avatar: string;
  fullname: string;
  nickname?: string | null;
  isOnline?: boolean;
  lastSeenAt?: string | null;
};

export type SendMessagePayload =
  | {
      conversationId: string;
      type: "text";
      content: string;
    }
  | {
      conversationId: string;
      type: "file";
      file: File;
      content?: string;
    }
  | {
      conversationId: string;
      type: "image";
      file: File;
      content?: string;
    }
  | {
      conversationId: string;
      type: "gallery";
      files: File[];
      content?: string;
    };

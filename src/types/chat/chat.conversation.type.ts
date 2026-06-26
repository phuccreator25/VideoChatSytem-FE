import type { MessageAttachment, MessageType } from "./chat.model.type";

export type ConversationRelationStatus = "none" | "add" | "received" | "sent";

export type ConversationUserInfo = {
  userId: string;
  avatar: string;
  fullname: string;
  nickname?: string | null;
  isOnline: string;
  lastSeenAt?: string | null;
  isBlocked?: boolean;
  invitationId?: string | null;
  relationStatus?: ConversationRelationStatus;
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

export type pinMessages = {
  id: string;
  conversationId: string;
  attachmentId: string | null;
  senderId: string;
  type: "text" | "file" | "gif";
  content: string | null;
  gifUrl: string | null;
  attachments: MessageAttachment[];
  pinnedBy: string;
  pinnedAt: string;
};


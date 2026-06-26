import type { reactionMessage } from "./chat.model.type";

export type ConversationReadSuccess = {
  conversationId: string;
  readerUserId: string;
  readAt: string;
  updatedCount: number;
  messageIds: [];
  senderId: string;
};

export type TypingSocket = {
  conversationId: string;
  isTyping: boolean;
  targetUserId: string;
};

export type deletePinMessageSocket = {
  conversationId: string;
  messageId: string;
  attachmentId: string | null;
};

export type reactEmotionMessageSocket = {
  messageId: string;
  reactions: reactionMessage[]
};

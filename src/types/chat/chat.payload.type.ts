import type { MessageType } from "./chat.model.type";

export type MessageReceivedPayload = {
  conversationId: string;
  deliveredAt?: string | null;
};

export type MessageUpdatePayload = MessageType;

export type ConversationReadPayload = {
  conversationId: string;
  readerUserId?: string;
  readAt?: string | null;
  messageIds?: string[];
  messageId?: string;
  senderId: string;
};

export type LinkPreviewData = {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  domain?: string;
};

export type SendMessagePayload =
  | {
    tempMessageId: string;
    conversationId: string;
    type: "text";
    content: string;
    preview: LinkPreviewData | null;
    replyToMessageId: string | null;
    tempAttachmentIds?: string[];
  }
  | {
    messageId?: string;
    tempMessageId: string;
    conversationId: string;
    type: "file";
    content?: string;
    replyToMessageId?: string | null;
    tempAttachmentIds?: string[];
    attachments?: {
      tempAttachmentId: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      resourceType: string;
      recordDuration?: number | null;
    }[];
    file?: File;
  }
  | {
    tempMessageId: string;
    conversationId: string;
    type: "gif";
    gifUrl: string | null;
    replyToMessageId?: string | null;
  };

export type emotionPayload = {
  emotion: "LIKE" | "HAHA" | "SAD" | "WOW" | "LOVE" | "ANGRY" | string;
};

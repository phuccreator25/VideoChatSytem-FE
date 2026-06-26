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

export type SendMessagePayload =
  | {
      tempMessageId: string;
      conversationId: string;
      type: "text";
      content: string;
      replyToMessageId: string | null
    }
  | {
      tempMessageId: string;
      conversationId: string;
      type: "file";
      file: File;
      content?: string;
    }
  | {
    tempMessageId: string;
      conversationId: string;
      type: "gif";
      gifUrl: string | null;
  }

export type emotionPayload = {
  emotion: "LIKE" | "HAHA" | "SAD" | "WOW" | "LOVE" | "ANGRY" | string;
}

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ConversationsAPI from "../api/Conversation.api";
import type { Conversation } from "../types/conversation/conversation.preview.type";
import type { MessageType } from "../types/chat/chat.model.type";
import type { pinMessages } from "../types/chat/chat.conversation.type";

type ConversationState = {
  conversations: Conversation[];
  pinnedMessageIdsByConversation: Record<string, pinMessages[]>;
  isLoading: boolean;
};

type PinMessagePayload = {
  conversationId: string;
  messageId: string;
  attachmentId?: string | null;
};

const initialState: ConversationState = {
  conversations: [],
  pinnedMessageIdsByConversation: {},
  isLoading: false,
};

const getPreviewByMessage = (message: MessageType) => {
  if (message.isRevoked) return "This message has been revoked";

  if (message.type === "file") {
    const resourceType = message.attachments?.[0]?.resourceType;

    switch (resourceType) {
      case "audio":
        return "Sent a voice";

      case "video":
        return "Sent a video";

      case "raw":
        return "Sent a file";

      case "image":
        return "Sent a image";

      default:
        return "Sent a file";
    }
  }

  if (message.type === "gif") {
    return "Sent a GIF";
  }

  return message.content || "";
};

const formatTime = (date?: string) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const onGetConversations = createAsyncThunk(
  "conversation/fetchConversations",
  async () => {
    const res = await ConversationsAPI.getListConversations();
    return (res.data.data || []) as Conversation[];
  },
);

export const onPinMessageConversation = createAsyncThunk(
  "conversation/pinMessage",
  async ({
    conversationId,
    messageId,
    attachmentId = null,
  }: PinMessagePayload) => {
    const res = await ConversationsAPI.pinMessagesConversations(
      conversationId,
      messageId,
      attachmentId,
    );
    return res.data.data || [];
  },
);

export const onDeletePinMessageConversation = createAsyncThunk(
  "conversation/deletePinMessage",
  async ({
    conversationId,
    messageId,
    attachmentId = null,
  }: PinMessagePayload) => {
    const res = await ConversationsAPI.deletePinMessagesConversations(
      conversationId,
      messageId,
      attachmentId,
    );

    return res.data.data || [];
  },
);

export const onGetPinMessageConversation = createAsyncThunk(
  "conversation/getPinMessage",
  async (conversationId: string) => {
    const res =
      await ConversationsAPI.getPinMessageByConversation(conversationId);

    return res.data.data as {
      conversationId: string;
      pinMessages: pinMessages[];
    };
  },
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    updateConversationByMessage(state, action) {
      if (!Array.isArray(state.conversations)) {
        state.conversations = [];
      }

      const { message, currentUserId, openingConversationId } = action.payload;

      const index = state.conversations.findIndex(
        // Lấy vị trí của conversation tương ứng với message mới
        (conversation) =>
          String(conversation.id) === String(message.conversationId),
      );

      if (index === -1) return;

      const conversation = state.conversations[index];

      const isMyMessage = String(message.senderId) === String(currentUserId);

      const isActiveConversation =
        String(openingConversationId) === String(message.conversationId);

      const conversationType: Conversation["type"] = message.type;

      const updatedConversation: Conversation = {
        ...conversation,
        preview: getPreviewByMessage(message),
        time: formatTime(message.createdAt),
        type: conversationType,
        unread:
          !isMyMessage && !isActiveConversation
            ? (conversation.unread || 0) + 1
            : conversation.unread || 0,
      };

      state.conversations.splice(index, 1); // Xóa conversation cũ
      state.conversations.unshift(updatedConversation); // đưa conversation mới được update lên đầu
    },

    resetUnread(state, action) {
      if (!Array.isArray(state.conversations)) {
        state.conversations = [];
      }

      const { conversationId } = action.payload;

      state.conversations = state.conversations.map((conversation) => {
        if (String(conversation.id) !== String(conversationId)) {
          return conversation;
        }

        return {
          ...conversation,
          unread: 0,
        };
      });
    },

    updateStatusUsers(state, action) {
      if (!Array.isArray(state.conversations)) {
        state.conversations = [];
      }

      const { userId, isOnline } = action.payload;

      state.conversations = state.conversations.map((conversation) => {
        if (String(conversation.userId) !== String(userId)) return conversation;

        const status = isOnline ? "online" : "offline";

        return {
          ...conversation,
          status,
        };
      });
    },

    ConversationsPresence(state, action) {
      if (!Array.isArray(state.conversations)) {
        state.conversations = [];
      }

      const onlineUserIds = new Set(
        (action.payload || []).map((u: any) => String(typeof u === "string" ? u : u.userId))
      );

      state.conversations = state.conversations.map((conversation) => ({
        ...conversation,
        status: onlineUserIds.has(String(conversation.userId)) ? "online" : "offline",
      }));
    },

    setPinnedMessage(state, action) {
      const pinnedMessage = action.payload;
      const conversationId = pinnedMessage.conversationId;

      const currentPinnedMessages =
        state.pinnedMessageIdsByConversation[conversationId] || [];

      const existedMessage = currentPinnedMessages.some((item) => {
        const currentAttachmentId = item.attachmentId?.trim() || null;
        const newAttachmentId = pinnedMessage.attachmentId?.trim() || null;

        return (
          String(item.id) === String(pinnedMessage.id) &&
          currentAttachmentId === newAttachmentId
        );
      });

      if (!existedMessage) {
        state.pinnedMessageIdsByConversation[conversationId] = [
          pinnedMessage,
          ...currentPinnedMessages,
        ];
      }
    },

    deletePinnedMessage(state, action) {
      const { conversationId, messageId, attachmentId } = action.payload;

      const currentPinnedMessages =
        state.pinnedMessageIdsByConversation[conversationId] || [];

      const normalizedAttachmentId =
        !attachmentId || attachmentId === "null" || attachmentId === "undefined"
          ? null
          : attachmentId;

      state.pinnedMessageIdsByConversation[conversationId] =
        currentPinnedMessages.filter((item) => {
          const sameMessage = String(item.id) === String(messageId);

          const currentAttachmentId =
            !item.attachmentId ||
              item.attachmentId === "null" ||
              item.attachmentId === "undefined"
              ? null
              : item.attachmentId;

          const sameAttachment =
            attachmentId === undefined ||
            currentAttachmentId === normalizedAttachmentId;

          return !(sameMessage && sameAttachment);
        });
    },

    setAllPinnedMessagesByConversation(state, action) {
      const { conversationId, pinMessages } = action.payload;
      state.pinnedMessageIdsByConversation[conversationId] = pinMessages;
    },

    updateNickNameConversation(state, action) {
      const { userId, nickname } = action.payload;

      state.conversations = state.conversations.map((conversation) => {
        if (conversation.userId !== userId) return conversation;

        return {
          ...conversation,
          name: nickname,
        };
      });
    },

    deleteConversation(state, action) {
      const { conversationId } = action.payload;
      state.conversations = state.conversations.filter(
        (conversation) => String(conversation.id) !== String(conversationId),
      );
      delete state.pinnedMessageIdsByConversation[conversationId];
    },
  },

  extraReducers: (builder) => {
    builder.addCase(onGetConversations.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(onGetConversations.fulfilled, (state, action) => {
      state.conversations = action.payload;
      state.isLoading = false;
    });
    builder.addCase(onGetConversations.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(onGetPinMessageConversation.fulfilled, (state, action) => {
      const { conversationId, pinMessages } = action.payload;
      state.pinnedMessageIdsByConversation[conversationId] = pinMessages;
    });
  },
});

export const {
  updateConversationByMessage,
  resetUnread,
  updateStatusUsers,
  ConversationsPresence,
  setPinnedMessage,
  deletePinnedMessage,
  setAllPinnedMessagesByConversation,
  updateNickNameConversation,
  deleteConversation
} = conversationSlice.actions;

export const conversationReducer = conversationSlice.reducer;

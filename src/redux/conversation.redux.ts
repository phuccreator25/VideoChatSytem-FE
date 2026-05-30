import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ConversationsAPI from "../api/Conversation.api";
import type { Conversation } from "../types/data.type";
import type { MessageType } from "../types/chat.type";

type ConversationState = {
  conversations: Conversation[];
};

const initialState: ConversationState = {
  conversations: [],
};

const getPreviewByMessage = (message: MessageType) => {
  if (message.type === "image") return "Đã gửi một hình ảnh";
  if (message.type === "file") return message.fileName || "Đã gửi một tệp";
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
  },
  
  extraReducers: (builder) => {
    builder.addCase(onGetConversations.fulfilled, (state, action) => {
      state.conversations = action.payload;
    });
  },
});

export const {
  updateConversationByMessage,
  resetUnread,
  updateStatusUsers,
} = conversationSlice.actions;

export const conversationReducer = conversationSlice.reducer;

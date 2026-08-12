import { createSlice } from "@reduxjs/toolkit";
import type { ConversationUserInfo } from "../types/chat/chat.conversation.type";

type ContactRelation = "add" | "received" | "sent" | "none";

type ChatState = {
  userData: ConversationUserInfo | null;
  contactRelation: ContactRelation;
  currentConversationId: string | null;
  typingByConversation: Record<string, boolean>;
};

const initialState: ChatState = {
  userData: null,
  contactRelation: "none",
  currentConversationId: null,
  typingByConversation: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    setIsTyping: (state, action) => {

      const { conversationId, isTyping } = action.payload;

      if (!conversationId) return;

      state.typingByConversation[conversationId] = isTyping;

    },

    updateNickNameUser: (state, action) => {
      const { userId, nickname } = action.payload;

      if (state.userData && state.userData.userId === userId) {
        state.userData.nickname = nickname && nickname.trim() !== ""
          ? nickname
          : (state.userData.fullname ?? "Unknown user");
      }
    },

    updateStatusUser: (state, action) => {
      const { userId, isOnline, lastSeenAt } = action.payload;
      if (state.userData && state.userData.userId === userId) {
        state.userData.isOnline = isOnline ? "online" : "offline";
        state.userData.lastSeenAt = lastSeenAt ?? state.userData.lastSeenAt;
      }
    },

    updateContactRelation: (state, action) => {
      const { userId, relation } = action.payload;

      if (state.userData && state.userData.userId === userId) {
        state.contactRelation = relation;
      }
    },

    updateInvitationId: (state, action) => {
      const { userId, invitationId } = action.payload;

      if (!state.userData) return;
      if (userId && state.userData.userId !== userId) return;

      state.userData.invitationId = invitationId;
    },
  },
});

export const { setUserData, updateNickNameUser, updateStatusUser, updateContactRelation, updateInvitationId, setIsTyping } =
  chatSlice.actions;
export const chatReducer = chatSlice.reducer;

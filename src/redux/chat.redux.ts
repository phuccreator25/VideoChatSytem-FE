import { createSlice } from "@reduxjs/toolkit";
import type { ConversationUserInfo } from "../types/chat.type";

type ContactRelation = "add" | "received" | "sent" | "none";

const initialState = {
  userData: null as ConversationUserInfo | null,
  contactRelation: "none" as ContactRelation,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
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

export const { setUserData, updateNickNameUser, updateStatusUser, updateContactRelation, updateInvitationId } =
  chatSlice.actions;
export const chatReducer = chatSlice.reducer;

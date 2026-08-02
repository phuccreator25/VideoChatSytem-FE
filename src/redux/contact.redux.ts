import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { contacts } from "../types/contact/contact.model.type";
import ContactApi from "../api/Contact.api";
import { onHandleBlockUser, onHandleUnBlockUser, setBlockStatus } from "./block.redux";

type ContactState = {
  contacts: contacts[];
  isLoading: boolean;
  onlineUsers: OnlineUser[];
};

type OnlineUser = {
  userId: string;
  name: string;
  avatar: string;
  isOnline: boolean;
};

const initialState: ContactState = {
  contacts: [],
  isLoading: false,
  onlineUsers: [],
};

export const onGetDataContact = createAsyncThunk(
  "contact/onGetDataContact",
  async () => {
    const res = await ContactApi.onGetContact();

    return (res.data.data || []) as contacts[];
  },
);

export const onGetUserOnlines = createAsyncThunk(
  "contact/onGetUserOnlines",
  async () => {
    const res = await ContactApi.onGetContactsOnlines();

    return (res.data.data || []) as OnlineUser[];
  },
);

const contactSlice = createSlice({
  name: "contact",
  initialState,

  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    updateUserPresence: (state, action) => {
      const { userId, name, avatar, isOnline } = action.payload;
      if (isOnline) {
        const exists = state.onlineUsers.some((u) => u.userId === userId);
        if (!exists && name && avatar) {
          state.onlineUsers.push({ userId, name, avatar, isOnline });
        }
      } else {
        state.onlineUsers = state.onlineUsers.filter(
          (u) => u.userId !== userId,
        );
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(onGetDataContact.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(onGetDataContact.fulfilled, (state, action) => {
      state.contacts = action.payload;
      state.isLoading = false;
    });
    builder.addCase(onGetDataContact.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(onGetUserOnlines.fulfilled, (state, action) => {
      state.onlineUsers = action.payload;
    });

    //Update trạng thái block
    builder.addCase(onHandleBlockUser.fulfilled, (state, action) => {
      const { userId } = action.payload;
      const contact = state.contacts.find((item) => item.userId === userId || item._id === userId);
      if (contact) {
        contact.isBlocked = true;
      }
    })

    builder.addCase(onHandleUnBlockUser.fulfilled, (state, action) => {
      const { userId } = action.payload;
      const contact = state.contacts.find((item) => item.userId === userId || item._id === userId);
      if (contact) {
        contact.isBlocked = false;
      }
    });

    builder.addCase(setBlockStatus, (state, action) => {
      const { userId, isBlockedByMe } = action.payload;
      if (isBlockedByMe !== undefined) {
        const contact = state.contacts.find(
          (item) => item.userId === userId || item._id === userId
        );
        if (contact) {
          contact.isBlocked = isBlockedByMe;
        }
      }
    });

  },
});

export const {
  setOnlineUsers,
  updateUserPresence,
} = contactSlice.actions;

export const contactReducer = contactSlice.reducer;

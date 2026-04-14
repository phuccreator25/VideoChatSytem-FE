import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import InvitationsAPI from "../api/Invitation.api";
import type { InvitationActionStatus, InvitationItem, SentInvitationItem } from "../types/Invitation";

type InvitationState = {
  countReceived: number;
  receivedAllInvitations: InvitationItem[];
  sentInvitations: SentInvitationItem[];
  actionStatusById: Record<string, InvitationActionStatus>;
};

const initialState: InvitationState = {
  countReceived: 0,
  receivedAllInvitations: [],
  sentInvitations: [],
  actionStatusById: {}
};

export const onGetCountReceivedInvitation = createAsyncThunk(
  "invitation/onGetCountReceivedInvitation",
  async () => {
    const res = await InvitationsAPI.onGetCountFriendRequest();
    return res.data.data as number;
  },
);

export const onGetListFriendRequests = createAsyncThunk(
  "invitation/onGetListFriendRequests",
  async ({ pageSize = 3 }: { pageSize?: number }) => {
    const res = await InvitationsAPI.onGetFriendRequest({
      limit: pageSize,
      skip: 0,
    });
    return (res.data.data || []) as InvitationItem[];
  },
);

export const onGetListSentInvitation = createAsyncThunk(
  "invitation/onGetListSentInvitation",
  async ({ pageSize = 3 }: { pageSize?: number }) => {
    const res = await InvitationsAPI.onGetSentInvitation({
      limit: pageSize,
      skip: 0,
    });
    return (res.data.data || []) as SentInvitationItem[];
  },
);

const invitationSlice = createSlice({
  name: "invitation",
  initialState,
  reducers: {
    setInvitationActionStatus( // set trạng thái theo ID, dùng để đồng bộ viewALL và Popover
      state,
      action: {
        payload: {
          id: string;
          status: InvitationActionStatus;
        };
      },
    ) {
      const { id, status } = action.payload;
      state.actionStatusById[id] = status;
    },

    clearInvitationActionStatus(state, action) { // Xóa trạng thái theo ID
      delete state.actionStatusById[action.payload];
    },

    setReceivedAllInvitations(state, action) { // Update danh sách mới
      state.receivedAllInvitations = action.payload || [];
    },

    setSentInvitations(state, action) { // Update danh sách mới
      state.sentInvitations = action.payload || [];
    },

    removeReceivedInvitation(state, action) { //Xóa item đã bị accept hoặc decline đồng bộ ở Popover và View All
      state.receivedAllInvitations = state.receivedAllInvitations.filter(
        (item) => item.id !== action.payload,
      );
    },

    removeSentInvitation(state, action) { //Xóa item đã bị cancelled đồng bộ với Popover và View All
      state.sentInvitations = state.sentInvitations.filter(
        (item) => item.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(onGetCountReceivedInvitation.fulfilled, (state, action) => {
      state.countReceived = action.payload;
    });

    builder.addCase(onGetListFriendRequests.fulfilled, (state, action) => {
      state.receivedAllInvitations = action.payload || [];
    });

    builder.addCase(onGetListSentInvitation.fulfilled, (state, action) => {
      state.sentInvitations = action.payload || [];
    });
  },
});

export const {
  setInvitationActionStatus,
  clearInvitationActionStatus,
  setReceivedAllInvitations,
  setSentInvitations,
  removeReceivedInvitation,
  removeSentInvitation,
} = invitationSlice.actions;

export const invitationReducer = invitationSlice.reducer;

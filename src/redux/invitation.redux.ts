import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import InvitationsAPI from "../api/Invitation.api";
import type { AddContactDataHook } from "../types/invitation/invitation.form.type";
import type {
  InvitationActionStatus,
  InvitationItem,
  SentInvitationItem,
} from "../types/invitation/invitation.model.type";

type InvitationState = {
  countReceived: number;
  receivedAllInvitations: InvitationItem[];
  sentInvitations: SentInvitationItem[];
  actionStatusById: Record<string, InvitationActionStatus>;
  countSent: number;
  isPopoverInvitationOpen: boolean;
};

type InvitationAddContacted = {
  invitationId: string;
  senderId: string,
  receiverId: string,
  message: string,
  status: string
};

const initialState: InvitationState = {
  countReceived: 0,
  receivedAllInvitations: [],
  sentInvitations: [],
  actionStatusById: {},
  countSent: 0,
  isPopoverInvitationOpen: false,
};

export const onGetCountReceivedInvitation = createAsyncThunk(
  "invitation/onGetCountReceivedInvitation",
  async () => {
    const res = await InvitationsAPI.onGetCountFriendRequest();
    return res.data.data as number;
  },
);

export const onGetCountSentInvitation = createAsyncThunk(
  "invitation/onGetCountSentInvitation",
  async () => {
    const res = await InvitationsAPI.onGetCountSentInvitation();
    return res.data.data as number;
  },
);

export const onGetListFriendRequests = createAsyncThunk(
  "invitation/onGetListFriendRequests",
  async ({ pageSize = 3, skip }: { pageSize?: number; skip?: number }) => {
    const res = await InvitationsAPI.onGetFriendRequest({
      limit: pageSize,
      skip: skip || 0,
    });

    return (res.data.data || []) as InvitationItem[];
  },
);

export const onGetListSentInvitation = createAsyncThunk(
  "invitation/onGetListSentInvitation",
  async ({ pageSize = 3, skip }: { pageSize?: number; skip?: number }) => {
    const res = await InvitationsAPI.onGetSentInvitation({
      limit: pageSize,
      skip: skip || 0,
    });
    return (res.data.data || []) as SentInvitationItem[];
  },
);

export const onAcceptInvitation = createAsyncThunk(
  "invitation/onAcceptInvitation",
  async (id: string) => {
    const res = await InvitationsAPI.onAcceptInvitation({id});
    return res.status === 200;
  },
);

export const onDeclineInvitation = createAsyncThunk(
  "invitation/onDeclineInvitation",
  async (id: string) => {
    const res = await InvitationsAPI.onDeclineInvitation({id});
    return res.status === 200;
  },
);

export const onCancelSentInvitation = createAsyncThunk(
  "invitation/onCancelSentInvitation",
  async (id: string) => {
    const res = await InvitationsAPI.onCancelSentInvitation({id});
    return res.status === 200;
  }
);

export const onAddContact = createAsyncThunk(
  "invitation/onAddContact",
  async (payload: AddContactDataHook) => {
    const res = await InvitationsAPI.onAddContacts(payload);
    return res.data.data as InvitationAddContacted;
  }
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

    setIsPopoverInvitationOpen(state, action) {
      state.isPopoverInvitationOpen = action.payload;
    }

  },
  extraReducers: (builder) => {
    builder.addCase(onGetCountReceivedInvitation.fulfilled, (state, action) => {
      state.countReceived = action.payload;
    });

    builder.addCase(onGetCountSentInvitation.fulfilled, (state, action) => {
      state.countSent = action.payload;
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
  setIsPopoverInvitationOpen,
} = invitationSlice.actions;

export const invitationReducer = invitationSlice.reducer;

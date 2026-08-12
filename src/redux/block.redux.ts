import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BlockApi from "../api/Block.api";
import type { userBlocked } from "../types/contact/contact.socket.type";

type BlockState = {
  blockStatusMap: Record<string, {
    isBlockedByMe: boolean;
    isBlockedMe: boolean;
  }>;
  isLoading: boolean;
  blockUsers: userBlocked[];
  unblockedIds: string[];
}

const initialState: BlockState = {
  blockStatusMap: {},
  isLoading: false,
  blockUsers: [],
  unblockedIds: [],
}

export const onHandleBlockUser = createAsyncThunk(
  "contact/onHandleBlockUser",
  async (userId: string) => {
    const res = await BlockApi.onBlock(userId);

    return res.data.data as { userId: string, isBlockedByMe: boolean, isBlockedMe: boolean }
  },
);

export const onHandleUnBlockUser = createAsyncThunk(
  "contact/onHandleUnBlockUser",
  async (userId: string) => {
    const res = await BlockApi.onUnblock(userId);

    return res.data.data as { userId: string, isBlockedByMe: boolean, isBlockedMe: boolean }
  },
);

export const onGetListBlockUser = createAsyncThunk(
  "contact/onGetListBlockUser",
  async () => {
    const res = await BlockApi.onGetListBlockUser();

    return res.data.data as userBlocked[]
  },
);

const blockSlice = createSlice({
  name: "block",
  initialState,
  reducers: {
    setBlockStatus: (state, action) => {
      const { userId, isBlockedByMe, isBlockedMe } = action.payload;

      const currentStatus = state.blockStatusMap[userId];

      state.blockStatusMap[userId] = {
        isBlockedByMe: isBlockedByMe ?? currentStatus?.isBlockedByMe ?? false,
        isBlockedMe: isBlockedMe ?? currentStatus?.isBlockedMe ?? false,
      };
    },

    setUnblockedIds: (state, action) => {
      if (action.payload && !state.unblockedIds.includes(action.payload)) {
        state.unblockedIds.push(action.payload);
      }
    },

    removeUnblockIds: (state, action) => {
      if (action.payload && state.unblockedIds.includes(action.payload)) {
        state.unblockedIds = state.unblockedIds.filter((id) => id !== action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(onHandleBlockUser.fulfilled, (state, action) => {
      const { userId, isBlockedByMe } = action.payload;

      const currentStatus = state.blockStatusMap[userId];

      state.blockStatusMap[userId] = {
        isBlockedByMe: isBlockedByMe ?? currentStatus?.isBlockedByMe ?? false,
        isBlockedMe: currentStatus?.isBlockedMe ?? false,
      };
    });

    builder.addCase(onHandleUnBlockUser.fulfilled, (state, action) => {
      const { userId, isBlockedByMe } = action.payload;

      const currentStatus = state.blockStatusMap[userId];

      state.blockStatusMap[userId] = {
        isBlockedByMe: isBlockedByMe ?? currentStatus?.isBlockedByMe ?? false,
        isBlockedMe: currentStatus?.isBlockedMe ?? false,
      };
    });

    builder.addCase(onGetListBlockUser.fulfilled, (state, action) => {
      state.blockUsers = action.payload;
      state.unblockedIds = []
    });
  },
});
export const { setBlockStatus, setUnblockedIds, removeUnblockIds } = blockSlice.actions
export const blockReducer = blockSlice.reducer;
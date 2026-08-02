import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BlockApi from "../api/Block.api";

type BlockState = {
  blockStatusMap: Record<string, {
    isBlockedByMe: boolean;
    isBlockedMe: boolean;
  }>;
  isLoading: boolean;
}

const initialState : BlockState = {
    blockStatusMap: {},
    isLoading: false,
}

export const onHandleBlockUser = createAsyncThunk(
  "contact/onHandleBlockUser",
  async (userId: string) => {
    const res = await BlockApi.onBlock(userId);
    
    return res.data.data as {userId: string, isBlockedByMe: boolean, isBlockedMe: boolean}
  },
);

export const onHandleUnBlockUser = createAsyncThunk(
  "contact/onHandleUnBlockUser",
  async (userId: string) => {
    const res = await BlockApi.onUnblock(userId);
    
    return res.data.data as {userId: string, isBlockedByMe: boolean, isBlockedMe: boolean}
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
  },
});
export const { setBlockStatus } = blockSlice.actions
export const blockReducer = blockSlice.reducer;
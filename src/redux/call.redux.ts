import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import callApi from "../api/Call.api";

// 1. Thunk chỉ làm nhiệm vụ giao tiếp API và trả về Data
export const onEndCallAction = createAsyncThunk(
  "call/onEndCall",
  async (callId: string) => {
    const res = await callApi.onEndCall(callId);
    return res.data;
  },
);

export const onAcceptCallAction = createAsyncThunk(
  "call/onAcceptCall",
  async (callId: string) => {
    const res = await callApi.onAcceptCall(callId);
    return res.data.data || null;
  },
);

const initialState = {
  incomingCall: {
    isOpen: false,
    userData: null,
    type: null,
    callId: null,
    callerId: null,
    offer: null,
  },
  callInfo: null,
  isCallModalOpen: false,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    // Giữ lại các synchronous reducers phục vụ việc cập nhật nhanh từ Socket lắng nghe
    openIncomingCall: (state, action) => {
      state.incomingCall.isOpen = true;
      state.incomingCall.userData = action.payload.callerInfo;
      state.incomingCall.type = action.payload.type;
      state.incomingCall.callId = action.payload.callId;
      state.incomingCall.callerId = action.payload.callerId;
      state.incomingCall.offer = action.payload.offer;
    },
    // Hàm này vẫn giữ lại đề phòng trường hợp bạn cần hủy chuông nhanh từ phía socket của đối phương
    closeIncomingCall: (state) => {
      state.incomingCall.isOpen = false;
      state.incomingCall.userData = null;
      state.incomingCall.type = null;
      state.incomingCall.callId = null;
      state.incomingCall.callerId = null;
      state.incomingCall.offer = null;
    },
    openCallModal: (state) => {
      state.isCallModalOpen = true;
    },
    closeCallModal: (state) => {
      state.isCallModalOpen = false;
    },
    setCallInfo: (state, action) => {
      state.callInfo = action.payload;
      state.isCallModalOpen = true;
    },
    clearCallInfo: (state) => {
      state.callInfo = null;
      state.isCallModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(onAcceptCallAction.fulfilled, (state, action) => {
      state.callInfo = action.payload;
      state.incomingCall.isOpen = false;
      state.isCallModalOpen = true;
    });

    builder.addCase(onEndCallAction.fulfilled, (state) => {
      state.callInfo = null;
      state.isCallModalOpen = false;
      state.incomingCall.isOpen = false;
      state.incomingCall.userData = null;
      state.incomingCall.type = null;
      state.incomingCall.callId = null;
      state.incomingCall.callerId = null;
      state.incomingCall.offer = null;
    });
  },
});

export const {
  openIncomingCall,
  closeIncomingCall,
  openCallModal,
  closeCallModal,
  setCallInfo,
  clearCallInfo,
} = callSlice.actions;

export const callReducer = callSlice.reducer;

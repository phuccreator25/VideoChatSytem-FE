import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import callApi from "../api/Call.api";
import type { initialType } from "../types/call/call.type";

const initialState: initialType = {
  incomingCall: {
    isOpen: false,
    userData: null,
    type: null,
    callId: null,
    callerId: null,
    offer: null,
    conversationId: null,
  },
  callInfo: null,
  isCallModalOpen: {
    isOpen: false,
    type: "video", // Giá trị mặc định thực tế (ví dụ: "video" hoặc "voice")
  },
  iceCandidates: [],
};

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
      state.incomingCall.conversationId = action.payload.conversationId;
    },
    // Hàm này vẫn giữ lại đề phòng trường hợp bạn cần hủy chuông nhanh từ phía socket của đối phương
    closeIncomingCall: (state) => {
      state.incomingCall.isOpen = false;
      state.incomingCall.userData = null;
      state.incomingCall.type = null;
      state.incomingCall.callId = null;
      state.incomingCall.callerId = null;
      state.incomingCall.offer = null;
      state.incomingCall.conversationId = null;
      state.iceCandidates = [];
    },
    openCallModal: (state, action) => {
      state.isCallModalOpen.isOpen = true;
      state.isCallModalOpen.type = action.payload.type;
    },
    closeCallModal: (state) => {
      state.isCallModalOpen.isOpen = false;
      state.isCallModalOpen.type = "video";
      state.iceCandidates = [];
    },
    setCallInfo: (state, action) => {
      state.callInfo = action.payload;
      state.isCallModalOpen.isOpen = true;
    },
    clearCallInfo: (state) => {
      state.callInfo = null;
      state.isCallModalOpen.isOpen = false;
      state.isCallModalOpen.type = "video";
      state.iceCandidates = [];
    },
    addIceCandidate: (state, action) => {
      state.iceCandidates.push(action.payload);
    },
    clearIceCandidates: (state) => {
      state.iceCandidates = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(onAcceptCallAction.fulfilled, (state, action) => {
      state.callInfo =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?._id || action.meta.arg;
      state.incomingCall.isOpen = false;
      state.isCallModalOpen.isOpen = true;
      state.isCallModalOpen.type = state.incomingCall.type || "video";
    });

    builder.addCase(onEndCallAction.fulfilled, (state) => {
      state.callInfo = null;
      state.isCallModalOpen.isOpen = false;
      state.isCallModalOpen.type = "video";
      state.incomingCall.isOpen = false;
      state.incomingCall.userData = null;
      state.incomingCall.type = null;
      state.incomingCall.callId = null;
      state.incomingCall.callerId = null;
      state.incomingCall.offer = null;
      state.incomingCall.conversationId = null;
      state.iceCandidates = [];
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
  addIceCandidate,
  clearIceCandidates,
} = callSlice.actions;

export const callReducer = callSlice.reducer;

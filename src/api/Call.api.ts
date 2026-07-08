import axiosInterceptor from "../config/axiosInterceptor";

const callApi = {
  onGetTurnCredentials: () => axiosInterceptor.get("/calls/turn-credentials"),

  onEndCall: (callId: string) =>
    axiosInterceptor.post("/calls/end-call", { callId }),

  onAcceptCall: (callId: string) => {
    axiosInterceptor.post("/calls/accept-call", { callId });
  },
};

export default callApi;

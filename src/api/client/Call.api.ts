import axiosInterceptor from "../../config/axiosInterceptor";
import type { ChatBotPayLoad } from "../../types/Chatbot.type";

const callApi = {
  onGetTurnCredentials: () => axiosInterceptor.get("/calls/turn-credentials"),

  onEndCall: ({ callId, endReason }: { callId: string, endReason?: string }) =>
    axiosInterceptor.post("/calls/end-call", { callId, endReason }),

  onAcceptCall: (callId: string) =>
    axiosInterceptor.post("/calls/accept-call", { callId }),

  onGenerateCallAISummary: (callId: string) =>
    axiosInterceptor.post("/calls/generate-summary", { callId }),

  onChatBot: (payload: ChatBotPayLoad) =>
    axiosInterceptor.post("/calls/query-chat", payload),
};

export default callApi;

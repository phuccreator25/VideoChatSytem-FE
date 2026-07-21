import axiosInterceptor from "../config/axiosInterceptor";
import type { SpeechTranscriptItem } from "../types/call/call.type";

const callApi = {
  onGetTurnCredentials: () => axiosInterceptor.get("/calls/turn-credentials"),

  onEndCall: (callId: string) =>
    axiosInterceptor.post("/calls/end-call", { callId }),

  onAcceptCall: (callId: string) =>
    axiosInterceptor.post("/calls/accept-call", { callId }),

  onSpeedToTextCall: (callId: string, transcript: SpeechTranscriptItem[]) =>
    axiosInterceptor.post("/calls/speed-to-text", { callId, transcript }),

  onGenerateCallAISummary: (callId: string) =>
    axiosInterceptor.post("/calls/generate-summary", { callId }),
};

export default callApi;

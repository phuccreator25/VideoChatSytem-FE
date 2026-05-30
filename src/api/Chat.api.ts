import axiosInterceptor from "../config/axiosInterceptor";
import type { SendMessagePayload } from "../types/chat.type";

const ChatAPI = {
    onSendMessage : (payload : SendMessagePayload, conversationId : string) => axiosInterceptor.post(`/chats/${conversationId}/send-message`, payload),
}
export default ChatAPI
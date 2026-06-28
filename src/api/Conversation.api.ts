import axiosInterceptor from "../config/axiosInterceptor";

const ConversationsAPI = {
  getOrCreateConversation: (userId: string) =>
    axiosInterceptor.post("/conversations", { userId }),

  getConversationById: (conversationId: string) =>
    axiosInterceptor.get(`/conversations/${conversationId}`),

  getListConversations: () => axiosInterceptor.get("/conversations"),

  getPinMessageByConversation: (conversationId: string) => axiosInterceptor.get(`/conversations/pin-messages/${conversationId}`),

  pinMessagesConversations: (conversationId: string , messageId: string, attachmentId: string | null) =>
    axiosInterceptor.post("/conversations/pin-messages", { conversationId, messageId, attachmentId }),

  deletePinMessagesConversations: (conversationId: string , messageId: string, attachmentId: string | null) =>
    axiosInterceptor.delete(`/conversations/pin-messages/${conversationId}/${messageId}/${attachmentId}`),

  getMoreMessagesConversations: (conversationId: string, beforeTimestamp: string) =>
    axiosInterceptor.post("/conversations/more-messages", { conversationId, beforeTimestamp }),
};

export default ConversationsAPI;

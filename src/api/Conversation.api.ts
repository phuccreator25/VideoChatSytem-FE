import axiosInterceptor from "../config/axiosInterceptor";

const ConversationsAPI = {
  getOrCreateConversation: (userId: string) =>
    axiosInterceptor.post("/conversations", { userId }),

  getConversationById: (conversationId: string) =>
    axiosInterceptor.get(`/conversations/${conversationId}`),

  getListConversations : () => 
    axiosInterceptor.get('/conversations')
  
};

export default ConversationsAPI;

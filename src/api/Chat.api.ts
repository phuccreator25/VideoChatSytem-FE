import axiosInterceptor from "../config/axiosInterceptor";
import type { emotionPayload, SendMessagePayload } from "../types/chat/chat.payload.type";

const ChatAPI = {
    onSendMessage: (payload: SendMessagePayload | FormData, conversationId: string) => axiosInterceptor.post(`/chats/${conversationId}/send-message`, payload),
    onReactionMessage: (payload: emotionPayload | string, conversationId: string, messageId: string) => axiosInterceptor.post(`/chats/react-emotion/${conversationId}/${messageId}`, payload),
    onUnReactEmotion: (conversationId: string, messageId: string) => axiosInterceptor.delete(`/chats/unreact-emotion/${conversationId}/${messageId}`),
    onForwardMessage: (messageId: string, selectedIds: string[]) => axiosInterceptor.post(`/chats/forward-message/${messageId}`, { selectedIds }),
    onDeleteMessage: (conversationId: string, messageId: string) => axiosInterceptor.delete(`/chats/delete-message/${conversationId}/${messageId}`),
    onRevokeMessage: (conversationId: string, messageId: string) => axiosInterceptor.put(`/chats/revoke-message/${conversationId}/${messageId}`),
    onSearchMessage: (keyword: string, conversationId: string) => axiosInterceptor.post(`/chats/search-message/${conversationId}`, { keyword }),

    onGetShareMedia: (conversationId: string) => axiosInterceptor.get(`/chats/share-media/${conversationId}`),
    onGetShareFiles: (conversationId: string) => axiosInterceptor.get(`/chats/share-files/${conversationId}`),
    onGetShareLinks: (conversationId: string) => axiosInterceptor.get(`/chats/share-links/${conversationId}`),
    onGetLinkPreview: (url: string) => axiosInterceptor.get(`/chats/link-preview`, { params: { url } }),

    onSearchMessageGlobal: (keyword: string) => axiosInterceptor.get(`/chats/search-message-global?keyword=${keyword}`),
}
export default ChatAPI

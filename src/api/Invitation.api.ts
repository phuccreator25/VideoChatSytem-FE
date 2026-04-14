import axiosInterceptor from "../config/axiosInterceptor";

const InvitationsAPI = {
  onAddContacts: (payload: object) =>
    axiosInterceptor.post("/invitations", payload),

  onGetFriendRequest: (params?: { limit?: number; skip?: number }) =>
    axiosInterceptor.get("/invitations/friend-request", { params }),

  onGetSentInvitation: (params?: { limit?: number; skip?: number }) =>
    axiosInterceptor.get("/invitations/sent-invitation", { params }),

  onGetCountFriendRequest: () =>
    axiosInterceptor.get("/invitations/friend-request/count"),

  onAcceptInvitation: (payload: object) =>
    axiosInterceptor.post("/invitations/accept", payload),
  
  onDeclineInvitation: (payload: object) =>
    axiosInterceptor.post("/invitations/decline", payload),

  onCancelSentInvitation: (payload: object) => 
    axiosInterceptor.post("invitations/cancel-sent", payload)
};

export default InvitationsAPI;

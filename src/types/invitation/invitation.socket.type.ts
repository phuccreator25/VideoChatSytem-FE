export type InvitationReceived = {
  invitationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: "pending";
};

export type InvitationActionSocket = {
  invitationId: string;
  senderId?: string;
  receiverId?: string;
  status: "cancelled" | "accepted" | "declined" | "pending";
};

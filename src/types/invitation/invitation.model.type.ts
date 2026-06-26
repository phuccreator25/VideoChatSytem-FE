export type InvitationItem = {
  id: string;
  fullname: string;
  message: string;
  avatar?: string;
  receiveAt: string;
  senderId: string;
};

export type SentInvitationItem = {
  id: string;
  fullname: string;
  message: string;
  sentAt: string;
  avatar?: string;
  receiverId: string;
};

export type InvitationActionStatus =
  | "accepted"
  | "declined"
  | "cancelled"
  | null;

export type RelationStatus =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "accepted";

export type InvitationQuickAction = "accept" | "decline" | "cancel";

export type ReceivedInvitation = {
  id: string;
  type: "received";
  name: string;
  avatar: string;
  mutualText: string;
  message: string;
};

export type SentInvitation = {
  id: string;
  type: "sent";
  name: string;
  avatar: string;
  description: string;
};

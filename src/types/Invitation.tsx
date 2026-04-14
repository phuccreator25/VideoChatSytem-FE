import {type Dispatch, type SetStateAction } from "react";
import type { ContactSection } from "./data.type";

export type InvitationItem = {
    id: string;
    fullname: string;
    message: string;
    avatar?:string;
    receiveAt: string;
};

export type SentInvitationItem = {
    id: string;
    fullname: string;
    message: string;
    sentAt: string;
    avatar?:string
};

export type InvitationPopoverProps = {
    openPopover: boolean;
    anchorEl: HTMLElement | null;
    handleCloseInvitationPopover: () => void;
    handleOpenAddContactModal: () => void;
    receivedInvitations: InvitationItem[];
    setReceivedInvitations: Dispatch<SetStateAction<InvitationItem[]>>;
    handleDeclineInvitation: (id: string) => void;
    handleAcceptInvitation: (id: string) => void;
    sentInvitations: SentInvitationItem[];
    handleCancelSentInvitation: (id: string) => Promise<boolean>;
    handleViewAllRequests: () => void;
    getTimeAgo: (dateString: string) => void;
    handleRemoveReceivedInvitation: (id: string) => void;
    handleRemoveSentInvitation: (id: string) => void;
    setSentInvitations: Dispatch<SetStateAction<SentInvitationItem[]>>;
};

//Friend Request
export type InvitationActionStatus =   | "accepted"
  | "declined"
  | "cancelled"
  | null;

export type FriendRequestsSectionProps = {
  receivedInvitations: InvitationItem[];
  setReceivedInvitations: Dispatch<SetStateAction<InvitationItem[]>>;
  handleDeclineInvitation: (id: string) => Promise<boolean> | void;
  handleAcceptInvitation: (id: string) => Promise<boolean> | void;
  getTimeAgo: (dateString: string) => string | void;
  handleRemoveReceivedInvitation: (id: string) => void
};

//Sentinvitation

export type SentInvitationProps = {
  sentInvitations: SentInvitationItem[];
  handleCancelSentInvitation: (id: string) => Promise<boolean>;
  getTimeAgo: (dateString: string) => string | void;
  handleRemoveSentInvitation: (id: string) => void
  setSentInvitations: Dispatch<SetStateAction<SentInvitationItem[]>>;
};

//Modal Contact
export type RelationStatus =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "accepted";

export type UserOption = {
  id: string;
  fullname: string;
  email: string;
  avatar?: string;
  statusInvitation: RelationStatus;
  invitationId: string
};

export type AddContactModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: { userId: string; invitationMessage: string }) => Promise<void> | void;
  onAcceptRequest?: (invitationId: string) => Promise<boolean> | void;
  onDeclineRequest?: (invitationId: string) => Promise<boolean> | void;
  onCancelInvitation?: (invitationId: string) => Promise<boolean> | void;
};

export type AddContactData = {
  selectedUser: UserOption | null;
  invitationMessage: string;
};

//Contact hook
export type AddContactDataHook = {
  userId: string;
  invitationMessage?: string;
};

export type UserInvitation = {
  contactSections: ContactSection[];
};


//Invitation Views

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

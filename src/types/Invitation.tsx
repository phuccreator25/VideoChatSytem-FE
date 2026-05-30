import type { ContactSection } from "./contact.type";

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
  avatar?: string
  receiverId: string;
};

export type InvitationPopoverGroup = {
  data: {
    receivedInvitations: InvitationItem[];
    sentInvitations: SentInvitationItem[];
  };
  ui: {
    openPopover: boolean;
    anchorEl: HTMLElement | null;
  };
  handlers: {
    handleCloseInvitationPopover: () => void;
    handleOpenAddContactModal: () => void;
    handleViewAllRequests: () => void;
    handleRemoveSentInvitation: (id: string) => void;
    handleRemoveReceivedInvitation: (id: string) => void;
  };
  helpers: {
    getTimeAgo: (dateString: string) => string;
  };
};

//Friend Request
export type InvitationActionStatus = | "accepted"
  | "declined"
  | "cancelled"
  | null;

export type FriendRequestsSectionGroup = {
  data: {
    receivedInvitations: InvitationItem[];
  };
  handlers: {
    handleRemoveReceivedInvitation: (id: string) => void;
  };
  helpers: {
    getTimeAgo: (dateString: string) => string;
  };
};

//Sentinvitation

export type SentInvitationsSectionGroup = {
  data: {
    sentInvitations: SentInvitationItem[];
  };
  helpers: {
    getTimeAgo: (dateString: string) => string;
  };
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

export type AddContactModalGroup = {
  ui: {
    open: boolean;
    actionLoadingId: string
  };
  handlers: {
    onClose: () => void;
    onSubmit: (payload: AddContactDataHook) => boolean | Promise<boolean>;
    handleRemoveSentInvitation: (id: string) => void;
    handleRemoveReceivedInvitation: (id: string) => void;
    handleSearchUser: (searchValue: string) => Promise<UserOption[]>;
    handleQuickAction: (
      action: InvitationQuickAction,
      params: HandleQuickActionParams
    ) => Promise<void>;
    setActionLoadingId: React.Dispatch<React.SetStateAction<string | null>>
  };
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

export type InvitationQuickAction = "accept" | "decline" | "cancel";

export type HandleQuickActionParams = {
  event: React.SyntheticEvent;
  option: UserOption;
  onUpdateOptionStatus?: (
    invitationId: string,
    nextStatus: RelationStatus
  ) => void;
};

export type invitationSeachResult = {
  _id: string;
  fullname: string;
  email: string;
  avatar?: string;
  relationStatus: RelationStatus;
  invitationId: string;
};

//socket
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
}

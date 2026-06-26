import type { Dispatch, SetStateAction } from "react";
import type { InvitationQuickAction } from "./invitation.model.type";
import type {
  AddContactDataHook,
  HandleQuickActionParams,
  UserOption,
} from "./invitation.form.type";
import type {
  InvitationItem,
  SentInvitationItem,
} from "./invitation.model.type";

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

export type SentInvitationsSectionGroup = {
  data: {
    sentInvitations: SentInvitationItem[];
  };
  helpers: {
    getTimeAgo: (dateString: string) => string;
  };
};

export type AddContactModalGroup = {
  ui: {
    open: boolean;
    actionLoadingId: string | null;
  };
  handlers: {
    onClose: () => void;
    onSubmit: (payload: AddContactDataHook) => boolean | Promise<boolean>;
    handleRemoveSentInvitation: (id: string) => void;
    handleRemoveReceivedInvitation: (id: string) => void;
    handleSearchUser: (searchValue: string) => Promise<UserOption[]>;
    handleQuickAction: (
      action: InvitationQuickAction,
      params: HandleQuickActionParams,
    ) => Promise<void>;
    setActionLoadingId: Dispatch<SetStateAction<string | null>>;
  };
};

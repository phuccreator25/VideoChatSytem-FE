import type {
  Dispatch,
  MouseEvent,
  SetStateAction,
} from "react";
import type { Contact } from "./contact.model.type";

export type RowActionProps = {
  data: {
    selectedContact: Contact | null;
  };
  ui: {
    anchorEl: HTMLElement | null;
    openSetNicknameModal: boolean;
    openModalViewInfo: boolean;
    openModalRemove: boolean;
    openModalBlock: boolean;
  };
  handlers: {
    handleClosePopover: () => void;
    handleOpenPopover: (
      event: MouseEvent<HTMLButtonElement>,
    ) => void;
    setOpenSetNicknameModal: Dispatch<SetStateAction<boolean>>;
    onUpdateNickName: (data: Contact) => void;
    setSelectedContact: Dispatch<SetStateAction<Contact | null>>;
    setOpenModalViewInfo: Dispatch<SetStateAction<boolean>>;
    setOpenModalRemove: Dispatch<SetStateAction<boolean>>;
    onRemoveFriend: () => boolean | Promise<boolean>;
    handleBlock: (payload: Contact) => boolean | Promise<boolean>;
    handleUnblock: (payload: Contact) => boolean | Promise<boolean>;
    setOpenModalBlock: Dispatch<SetStateAction<boolean>>;
  };
};

export type SetNicknameModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm?: (data: Contact) => boolean;
  selectedContact: Contact | null;
};

export type ViewUserInfoModalProps = {
  open: boolean;
  onClose: () => void;
  user: {
    userId: string;
    fullname: string;
    email?: string;
    avatar?: string;
    nickname?: string | null;
    isBlocked?: boolean;
  } | null;
  onCall?: (userId: string) => void;
  onMessage?: (userId: string) => void;
  onBlockCommunication?: (userId: string) => void;
  setOpenSetNicknameModal: Dispatch<SetStateAction<boolean>>;
  setOpenModalRemove: Dispatch<SetStateAction<boolean>>;
  setOpenModalBlock: Dispatch<SetStateAction<boolean>>;
};

export type ConfirmRemoveFriendModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => boolean | Promise<boolean>;
  selectedContact: Contact | null;
};

export type ConfirmBlockModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: Contact) => boolean | Promise<boolean>;
  handleUnblock: (payload: Contact) => boolean | Promise<boolean>;
  selectedContact: Contact | null;
};

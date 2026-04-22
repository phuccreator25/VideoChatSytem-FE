export type contacts = {
    userId: string,
    fullname: string,
    nickname: string,
    avatar: string,
    email: string,
    isBlocked: boolean,
    onClick?: () => void;
} 

export type ContactSection = {
  key: string;
  letter: string;
  items: contacts[];
};

export type RowActionProps = {
  data: {
    selectedContact: contacts | null;
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
      event: React.MouseEvent<HTMLButtonElement>
    ) => void;
    setOpenSetNicknameModal: React.Dispatch<React.SetStateAction<boolean>>;
    onUpdateNickName: (data: contacts) => void;
    setSelectedContact: React.Dispatch<React.SetStateAction<contacts | null>>;
    setOpenModalViewInfo: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenModalRemove: React.Dispatch<React.SetStateAction<boolean>>;
    onRemoveFriend: () => void;
    handleBlock: (payload: contacts) => boolean | Promise<boolean>;
    handleUnblock: (payload: contacts) => boolean | Promise<boolean>;
    setOpenModalBlock: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

export type SetNicknameModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm?: (data: contacts) => void;
    selectedContact: contacts | null
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
    setOpenSetNicknameModal: React.Dispatch<React.SetStateAction<boolean>>
    setOpenModalRemove: React.Dispatch<React.SetStateAction<boolean>>
    setOpenModalBlock: React.Dispatch<React.SetStateAction<boolean>>
};

export type ConfirmRemoveFriendModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    selectedContact: contacts | null;
};

export type ConfirmBlockModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: (payload: contacts) => boolean | Promise<boolean>;
    handleUnblock: (payload: contacts) => boolean | Promise<boolean>;
    selectedContact: contacts | null;
};
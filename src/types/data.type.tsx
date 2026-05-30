import type { AlertColor } from "@mui/material";
import type { Dispatch, ReactNode, SetStateAction } from "react";

export type EditableFieldKey = 'fullname' | 'username';

export type ProfileData = {
    _id: string;
    fullname: string;
    username: string;
    avatar: string;
    email: string;
    isActive?: boolean;
};

export type FileItem = {
    key: string;
    name: string;
    size: string;
    type: 'file' | 'image';
};

export type InfoRowProps = {
    label: string;
    fieldKey?: EditableFieldKey;
    value: string;
    editingField: EditableFieldKey | null;
    editValue: string;
    onStartEdit?: (field: EditableFieldKey, value: string) => void;
    onChangeEdit?: (value: string) => void;
    onSaveEdit?: () => void;
    onCancelEdit?: () => void;
    readOnly?: boolean;
};

export type OpenAvatarProps = {
  openAvatarPreview: boolean;
  setOpenAvatarPreview: Dispatch<SetStateAction<boolean>>;
  profile: {
    avatar: string;
    fullname: string;
  } | null;
};

export type GroupItem = {
  key: string;
  name: string;
  initials: string;
  badge?: string;
  onClick?: () => void;
};

export type QuickUser = {
    id: number;
    name: string;
    avatar: string;
    online?: boolean;
};

export type Conversation = {
    id: string;
    name: string;
    avatar?: string;
    initials?: string;
    status?: 'online' | 'offline';
    preview: string;
    time: string;
    type?: 'text' | 'image' | 'typing';
    unread?: number;
    active?: boolean;
    userId?: string
};

export type Message =
  | {
      id: string;
      type: 'text';
      sender: 'left' | 'right';
      name: string;
      avatar: string;
      time: string;
      content: string;
    }
  | {
      id: string;
      type: 'gallery';
      sender: 'left' | 'right';
      name: string;
      avatar: string;
      time: string;
      images: string[];
    }
  | {
      id: string;
      type: 'file';
      sender: 'left' | 'right';
      name: string;
      avatar: string;
      time: string;
      fileName: string;
      fileSize: string;
    }
  | {
      id: string;
      type: 'typing';
      sender: 'left' | 'right';
      name: string;
      avatar: string;
    };

export type SettingItem = {
  key: string;
  label: string;
  icon: ReactNode;
  description?: string;
  danger?: boolean;
  badge?: string;
  onClick?: () => void;
  showArrow?: boolean;
};

export type RailKey = 'profile' | 'messages' | 'groups' | 'contact' | 'settings';

export type RailItemProps = {
  title: string;
  icon: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export type LeftRailProps = {
  activeRail: RailKey;
  onChange: (key: RailKey) => void;
};

export type ToastType = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

import type { Dispatch, SetStateAction } from "react";
import type { EditableFieldKey } from "./profile.model.type";

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

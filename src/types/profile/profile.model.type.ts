export type EditableFieldKey = "fullname" | "username";

export type ProfileData = {
  _id: string;
  fullname: string;
  username: string;
  avatar: string;
  email: string;
  isActive?: boolean;
};

export type FileItem = {
  url: string;
  name: string;
  size: string;
  type: string;
  messageId: string;
  attachmentId: string;
  conversationId: string;
  createdAt: Date;
};

export type ChangePasswordForm = {
  currentPass: string;
  password: string;
  confirmPass: string;
};
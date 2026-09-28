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
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  resourceType?: string;
  messageId: string;
  conversationId: string;
  createdAt: string;
};

export type ShareLinkType = {
  id: string;
  url: string;
  title: string;
  domain: string;
  messageId: string;
  conversationId: string;
  createdAt: string;
};

export type ChangePasswordForm = {
  currentPass: string;
  password: string;
  confirmPass: string;
};
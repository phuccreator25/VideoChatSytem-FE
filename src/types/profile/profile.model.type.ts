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
  key: string;
  name: string;
  size: string;
  type: "file" | "image";
};

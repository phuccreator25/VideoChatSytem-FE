export type QuickUser = {
  userId: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
};

export type Conversation = {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  status?: "online" | "offline";
  preview: string;
  time: string;
  type?: "text" | "image" | "typing";
  unread?: number;
  active?: boolean;
  userId?: string;
};

export type Message =
  | {
      id: string;
      type: "text";
      sender: "left" | "right";
      name: string;
      avatar: string;
      time: string;
      content: string;
    }
  | {
      id: string;
      type: "file";
      sender: "left" | "right";
      name: string;
      avatar: string;
      time: string;
      fileName: string;
      fileSize: string;
    }
  | {
      id: string;
      type: "typing";
      sender: "left" | "right";
      name: string;
      avatar: string;
    };

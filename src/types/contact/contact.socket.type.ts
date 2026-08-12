export type ContactRemoveSocket = {
  senderId: string;
  receiverId: string;
};

export type ContactUpdateNickNameSocket = {
  userId: string;
  nickname: string;
};

//Block
export type userBlocked = {
  blockId: string;
  userId: string;
  name: string;
  avatar: string;
  blockAt: string;
};


export type ContactRemoveSocket = {
  senderId: string;
  receiverId: string;
};

export type ContactUpdateNickNameSocket = {
  userId: string;
  nickname: string;
};

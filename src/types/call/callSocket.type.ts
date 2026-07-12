export type CallOfferSuccessPayload = {
  offer: RTCSessionDescriptionInit;
  callerId: string;
  calleeId: string;
  type: string;
  callId: string;
  callerInfo: {
    userId: string;
    avatar: string;
    fullname: string;
    nickname: string | null;
    isOnline: string;
  };
};

export type AcceptCallPayload = {
  callId: string;
  updatedCall: any;
  userIdWhoAccepted: string;
};

export type RejectCallPayload = {
  callId: string;
  updatedCall: any;
  userIdWhoRejected: string;
};

export type ChatBotPayLoad = {
  question: string;
  userId: string;
};

export type ChatBotData = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  callMeta?: {
    callId: string;
    date: string;
    participants: string[];
  };
  quotes?: string[];
};
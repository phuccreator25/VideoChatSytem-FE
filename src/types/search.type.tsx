export type SearchResultConversationItem = {
  id: string;
  name: string;
  avatar?: string;
  userId?: string;
};

export type SearchResultContactItem = {
  userId: string;
  name: string;
  avatar?: string;
};

export type SearchResultMessageItem = {
  messageId: string;
  conversationId: string;
  senderName: string;
  conversationName?: string;
  content: string;
  createdAt?: string;
};

export type SearchPopoverProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  searchQuery: string;
  isLoading?: boolean;
  recentChats?: SearchResultConversationItem[];
  contacts?: SearchResultContactItem[];
  messages?: SearchResultMessageItem[];
  onClose: () => void;
  onSelectConversation?: (userId: string) => Promise<void> | void;
  onSelectMessage?: (conversationId: string, messageId: string) => Promise<void> | void;
};
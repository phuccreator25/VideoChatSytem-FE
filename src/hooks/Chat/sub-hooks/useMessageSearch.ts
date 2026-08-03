import { useEffect, useState } from "react";
import type { MessageType } from "../../../types/chat/chat.model.type";
import ChatAPI from "../../../api/Chat.api";
import ConversationsAPI from "../../../api/Conversation.api";
import { useSearchParams } from "react-router-dom";

export const useMessageSearch = ({
  conversationId,
  messages,
  setMessages,
}: {
  conversationId?: string;
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}) => {
  const [messagesSearch, setMessagesSearch] = useState<MessageType[]>([]);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);
  const [isHasMoreMessages, setIsHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [prevConversationId, setPrevConversationId] = useState(conversationId);

  //get messageId -> scroll message
  const [searchParams] = useSearchParams();
  const targetMessageId = searchParams.get("targetMessageId")

  useEffect(() => {
    if (!targetMessageId || messages.length === 0) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(`msg-${targetMessageId}`);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        setHighlightedMessageId(targetMessageId);

        setTimeout(() => setHighlightedMessageId(null), 2000);

      }
    }, 300);

    return () => clearTimeout(timer);

  }, [targetMessageId, messages]);

  const navigateToMessage = async (targetMsg: MessageType) => {
    if (!targetMsg || !targetMsg.id) return;

    const element = document.getElementById(`msg-${targetMsg.id}`);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      setHighlightedMessageId(targetMsg.id);

      setTimeout(() => {
        setHighlightedMessageId((prev) =>
          prev === targetMsg.id ? null : prev,
        );
      }, 2000);
    } else {
      await autoFetchUntilFound(targetMsg);
    }
  };

  const navigateToSearchResult = async (index: number) => {
    if (index < 0 || index >= messagesSearch.length) return;

    const targetMsg = messagesSearch[index];

    setCurrentSearchIndex(index);
    await navigateToMessage(targetMsg);
  };

  const autoFetchUntilFound = async (targetMsg: MessageType) => {
    if (!conversationId) return;

    let currentOldestCreatedAt =
      messages[0]?.createdAt || new Date().toISOString();
    let accumulatedMessages: MessageType[] = [];
    let found = false;
    let hasMore = true;

    setIsLoadingMore(true);

    while (!found && hasMore) {
      try {
        const res = await ConversationsAPI.getMoreMessagesConversations(
          conversationId,
          currentOldestCreatedAt,
        );
        const fetched = res.data.data.messages;

        if (fetched.length === 0) {
          hasMore = false;
          break;
        }

        accumulatedMessages = [...fetched, ...accumulatedMessages];

        const isExist = fetched.some((m: MessageType) => m.id === targetMsg.id);
        if (isExist) {
          found = true;
          break;
        }

        currentOldestCreatedAt = fetched[0].createdAt;

        if (fetched.length < 20) {
          hasMore = false;
        }
      } catch (error) {
        console.error("Lỗi tự động tải tin nhắn: ", error);
        hasMore = false;
      }
    }

    if (accumulatedMessages.length > 0) {
      setMessages((prev) => [...accumulatedMessages, ...prev]);
    }

    setIsLoadingMore(false);

    if (found) {
      setTimeout(() => {
        const element = document.getElementById(`msg-${targetMsg.id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          setHighlightedMessageId(targetMsg.id);
          setTimeout(() => {
            setHighlightedMessageId((prev) =>
              prev === targetMsg.id ? null : prev,
            );
          }, 2000);
        }
      }, 150);
    }
  };

  const goToNextSearch = () => {
    if (messagesSearch.length === 0) return;
    const nextIndex =
      currentSearchIndex === -1
        ? messagesSearch.length - 1
        : (currentSearchIndex + 1) % messagesSearch.length;
    navigateToSearchResult(nextIndex);
  };

  const goToPrevSearch = () => {
    if (messagesSearch.length === 0) return;
    const prevIndex =
      currentSearchIndex === -1
        ? messagesSearch.length - 1
        : (currentSearchIndex - 1 + messagesSearch.length) %
        messagesSearch.length;
    navigateToSearchResult(prevIndex);
  };

  const closeSearchDrawer = () => {
    setIsSearchDrawerOpen(false);
    setMessagesSearch([]);
    setSearchKeyword("");
    setCurrentSearchIndex(-1);
    setHighlightedMessageId(null);
  };

  const openProfileDrawer = () => {
    setIsProfileDrawerOpen(true);
    setIsSearchDrawerOpen(false);
  };

  const closeProfileDrawer = () => {
    setIsProfileDrawerOpen(false);
  };

  const handleSearchMessage = async (keyword: string) => {
    try {
      if (!keyword || !conversationId) return;

      setSearchKeyword(keyword);
      const res = await ChatAPI.onSearchMessage(keyword, conversationId);
      const messages = res.data.data;

      setMessagesSearch(messages);
      setIsSearchDrawerOpen(true);
      setIsProfileDrawerOpen(false);

      if (messages && messages.length > 0) {
        const lastIndex = messages.length - 1;

        setCurrentSearchIndex(lastIndex);

        setTimeout(async () => {
          const targetMsg = messages[lastIndex];
          await navigateToMessage(targetMsg);
        }, 150);
      } else {
        setCurrentSearchIndex(-1);
      }
    } catch (error) {
      console.log("ERROE SEARCH: ", error);
    }
  };

  if (conversationId !== prevConversationId) {
    setPrevConversationId(conversationId);
    setIsHasMoreMessages(true);
    setIsLoadingMore(false);
    closeSearchDrawer();
    closeProfileDrawer();
  }

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    if (!conversationId) return;
    const target = e.currentTarget;

    if (target.scrollTop === 0 && isHasMoreMessages && !isLoadingMore) {
      setIsLoadingMore(true);
      const previousScrollHeight = target.scrollHeight;

      const oldestMsg = messages[0];

      if (!oldestMsg) {
        setIsLoadingMore(false);
        return;
      }

      await handleLoadMoreMessages(oldestMsg.createdAt ?? "");

      setTimeout(() => {
        target.scrollTop = target.scrollHeight - previousScrollHeight;
        setIsLoadingMore(false);
      }, 50);
    }
  };

  const handleLoadMoreMessages = async (beforeTimestamp: string) => {
    if (!conversationId) return;

    try {
      const res = await ConversationsAPI.getMoreMessagesConversations(
        conversationId,
        beforeTimestamp,
      );
      const newMessages = res.data.data.messages;

      setMessages((prev) => [...newMessages, ...prev]);

      if (newMessages.length < 20) {
        setIsHasMoreMessages(false);
      }

      setIsLoadingMore(false);
    } catch (error) {
      console.log("ERROE LOAD MORE: ", error);
    }
  };

  return {
    messagesSearch,
    isSearchDrawerOpen,
    isProfileDrawerOpen,
    searchKeyword,
    currentSearchIndex,
    highlightedMessageId,
    isHasMoreMessages,
    isLoadingMore,
    handleSearchMessage,
    closeSearchDrawer,
    navigateToSearchResult,
    navigateToMessage,
    goToNextSearch,
    goToPrevSearch,
    handleScroll,
    openProfileDrawer,
    closeProfileDrawer,
  };
};

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { onGetConversations } from "../../redux/conversation.redux";
import { useState } from "react";
import ContactApi from "../../api/Contact.api";
import ChatAPI from "../../api/Chat.api";
import type { SearchResultContactItem, SearchResultMessageItem } from "../../types/search.type";

export function useConversation() {
  const dispatch = useDispatch<AppDispatch>()
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchAnchorEl, setSearchAnchorEl] = useState<HTMLElement | null>(null);
  const [searchContacts, setSearchContacts] = useState<SearchResultContactItem[]>([]);
  const [searchMessages, setSearchMessages] = useState<SearchResultMessageItem[]>([]);

  const conversations = useSelector(
    (state: RootState) => state.conversation.conversations
  );

  const isLoading = useSelector(
    (state: RootState) => state.conversation.isLoading
  );

  useEffect(() => {
    dispatch(onGetConversations());
  }, [dispatch]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const excludeUserIds = useMemo(() => {
    return filteredConversations
      .map((item) => item.userId || item.id)
      .filter(Boolean);
  }, [filteredConversations]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const [contactsRes, chatRes] = await Promise.all([
          ContactApi.onSearchContacts(searchQuery, excludeUserIds),
          ChatAPI.onSearchMessageGlobal(searchQuery),
        ]);

        setSearchContacts(contactsRes.data.data);
        setSearchMessages(chatRes.data.data);

      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  return {
    ui: {
      isSearching,
      searchAnchorEl
    },
    data: {
      conversations,
      isLoading,
      searchQuery,
      filteredConversations,
      searchContacts,
      searchMessages,
    },
    handlers: {
      setIsSearching,
      setSearchQuery,
      setSearchAnchorEl
    }
  };
}
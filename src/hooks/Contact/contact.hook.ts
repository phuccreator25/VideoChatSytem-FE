import { useCallback, useEffect, useMemo, useState } from "react";
import type { contacts, ContactSection } from "../../types/contact.type";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../redux/store";
import { onGetDataContact } from "../../redux/contact.redux";
import ContactApi from "../../api/Contact.api";
import ConversationsAPI from "../../api/conversation.api";
import { useNavigate } from "react-router-dom";

export function useContact() {
  const contacts = useSelector((state: RootState) => state.contact.contacts);

  const [searchValue, setSearchValue] = useState<string>("");
  const [anchorElRowAction, setAnchorElRowAction] =
    useState<HTMLButtonElement | null>(null);
  const [openSetNicknameModal, setOpenSetNicknameModal] =
    useState<boolean>(false);
  const [openModalViewInfo, setOpenModalViewInfo] = useState<boolean>(false);
  const [openModalRemove, setOpenModalRemove] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<contacts | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchContacts = async () => {
      await dispatch(onGetDataContact());
    };

    fetchContacts();
  }, [dispatch]);

  const filteredContacts = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) return contacts;

    return contacts?.filter((contact: contacts) => {
      const displayName = (
        contact.nickname ||
        contact.fullname ||
        ""
      ).toLowerCase();

      return displayName.includes(keyword);
    });
  }, [contacts, searchValue]);

  const handleOpenConversation = useCallback(
    async (userId: string) => {
      try {
        const res = await ConversationsAPI.getOrCreateConversation(userId);

        if (res.status === 200) {
          const conversationId = res.data.data._id;
          navigate(`/chat/${conversationId}`);
        }
      } catch (error) {
        console.error("Get or create conversation failed:", error);
      }
    },
    [navigate],
  );

  const contactsAfterFilter = useMemo<ContactSection[]>(() => {
    const grouped: Record<string, contacts[]> = {};

    filteredContacts.forEach((contact: contacts) => {
      const displayName = contact.nickname || contact.fullname || "";
      const letter = displayName.charAt(0).toUpperCase() || "#";

      if (!grouped[letter]) {
        grouped[letter] = [];
      }

      grouped[letter].push({
        ...contact,
        onClick: () => handleOpenConversation(contact.userId),
      });
    });

    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b, "vi", { sensitivity: "base" }))
      .map((letter) => ({
        key: letter.toLowerCase(),
        letter,
        items: grouped[letter],
      }));
  }, [filteredContacts, handleOpenConversation]);

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElRowAction(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorElRowAction(null);
  };

  const onUpdateNickName = async (data: contacts) => {
    try {
      if (!data) return false;

      const res = await ContactApi.onUpdateContact(data);

      setSelectedContact((prev) => {
        if (!prev) return prev;
        if (prev.userId !== data.userId) return prev;

        return {
          ...prev,
          nickname: data.nickname,
        };
      });

      return res.status === 201;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const onRemoveFriend = async () => {
    try {
      if (!selectedContact) return false;

      const res = await ContactApi.onRemoveContact(selectedContact.userId);
      return res.status === 201;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return {
    data: {
      contacts,
      filteredContacts,
      contactsAfterFilter,
      selectedContact,
    },
    ui: {
      searchValue,
      anchorElRowAction,
      openSetNicknameModal,
      openModalViewInfo,
      openModalRemove,
    },
    handlers: {
      setSearchValue,
      handleOpenPopover,
      handleClosePopover,
      onUpdateNickName,
      onRemoveFriend,
      setOpenSetNicknameModal,
      setSelectedContact,
      setOpenModalViewInfo,
      setOpenModalRemove,
    },
  };
}

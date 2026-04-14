import { useEffect, useMemo, useState } from "react";
import type { contacts, ContactSection } from "../../types/contact.type";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../redux/store";
import { onGetDataContact } from "../../redux/contact.redux";

export function useContact() {
  const contacts = useSelector((state: RootState) => state.contact.contacts);

  const [searchValue, setSearchValue] = useState<string>("");
  const [anchorElRowAction, setAnchorEl] = useState<HTMLButtonElement | null>(
    null,
  );
  const [openSetNicknameModal, setOpenSetNicknameModal] =
    useState<boolean>(false);

  const [selectedContact, setSelectedContact] = useState<contacts | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchContacts = async () => {
      await dispatch(onGetDataContact());
      console.log(openSetNicknameModal);
    };

    fetchContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) return contacts;

    return contacts?.filter((contact: contacts) => {
      const displayName = (
        contact.nickname ||
        contact.fullname ||
        ""
      ).toLowerCase();
      return displayName.includes(keyword); //Nếu có thì trảvefe true (Giữ lại contacts đó trong mảng mới)
    });
  }, [contacts, searchValue]);

  const contactsAfterFilter = useMemo<ContactSection[]>(() => {
    const grouped: Record<string, contacts[]> = {};

    filteredContacts.forEach((contact: contacts) => {
      // Đây là những contact được lọc ở trên rồi
      const displayName = contact.nickname || contact.fullname || "";
      const letter = displayName.charAt(0).toUpperCase() || "#"; //Lấy ra kí tự đầu tiên trong tên IN HOA lên

      if (!grouped[letter]) {
        grouped[letter] = [];
      }

      grouped[letter].push({
        // Thêm vào mảng với key là Kí tự đầu tiên trong tên
        ...contact,
        onClick: () => {
          console.log("Open contact:", contact.userId);
        },
      });
    });

    return Object.keys(grouped) // Lấy toàn bộ key ra
      .sort((a, b) => a.localeCompare(b, "vi", { sensitivity: "base" })) // Sắp xếp bảng chữ cái
      .map((letter) => ({
        // Map theo ContactSection type
        key: letter.toLowerCase(),
        letter,
        items: grouped[letter], //trả về db phù hợp theo key
      }));
  }, [filteredContacts]);

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const onUpdateNickName = async (data: contacts) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    contacts,
    filteredContacts,
    contactsAfterFilter,
    searchValue,
    setSearchValue,
    anchorElRowAction,
    handleOpenPopover,
    handleClosePopover,
    onUpdateNickName,
    openSetNicknameModal,
    setOpenSetNicknameModal,
    selectedContact,
    setSelectedContact,
  };
}

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";

import { ContactRow } from "../ContactRow/ContactRow.contact";
import type { contacts, ContactSection } from "../../../../types/contact.type";

type AlphabetType = {
  section: ContactSection,
  anchorEl: HTMLElement | null,
  handleClosePopover: () => void,
  handleOpenPopover: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  setOpenSetNicknameModal: React.Dispatch<React.SetStateAction<boolean>>
  openSetNicknameModal:boolean,
  onUpdateNickName: (data: contacts) => void
  selectedContact: contacts | null,
  setSelectedContact: React.Dispatch<React.SetStateAction<contacts | null>>
}

export function AlphabetIndex(
  {
    section,
    anchorEl,
    handleClosePopover,
    handleOpenPopover,
    setOpenSetNicknameModal,
    onUpdateNickName,
    openSetNicknameModal,
    selectedContact,
    setSelectedContact
  }: AlphabetType
) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          px: 1.5,
          pb: 1,
          pt: 1,
          fontSize: 12,
          fontWeight: 800,
          color: '#6f63f6',
          letterSpacing: 0.4,
        }}
      >
        {/* Key được UpCase IN HOA */}
        {section.letter}
      </Typography>

      <List disablePadding>
        {section.items.map((item) => (
          <ContactRow 
          key={item.userId} 
          item={item} 
          anchorEl={anchorEl} 
          handleClosePopover={handleClosePopover} 
          handleOpenPopover={handleOpenPopover} 
          setOpenSetNicknameModal={setOpenSetNicknameModal}
            openSetNicknameModal={openSetNicknameModal}
            onUpdateNickName={onUpdateNickName}
            selectedContact={selectedContact}
            setSelectedContact={setSelectedContact}
          />
        ))}
      </List>
    </Box>
  );
}

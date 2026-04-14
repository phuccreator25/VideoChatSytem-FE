import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";

import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import type { contacts } from "../../../../types/contact.type";
import { ContactActionPopover } from "../ContactActionPopover/ContactActionPopover";

type ContactRowType = {
  item: contacts,
  anchorEl: HTMLElement | null,
  handleClosePopover: () => void,
  handleOpenPopover: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  setOpenSetNicknameModal: React.Dispatch<React.SetStateAction<boolean>>
  openSetNicknameModal: boolean,
  onUpdateNickName: (data: contacts) => void
  selectedContact: contacts | null,
  setSelectedContact: React.Dispatch<React.SetStateAction<contacts | null>>
}

export function ContactRow(
  { item, anchorEl, handleClosePopover, handleOpenPopover, setOpenSetNicknameModal, openSetNicknameModal, onUpdateNickName, selectedContact, setSelectedContact }: ContactRowType
) {
  const displayName = item.nickname ?? item.fullname;
  const avatarLetter = displayName?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      <ListItemButton
        onClick={item.onClick}
        sx={{
          minHeight: 56,
          borderRadius: 3,
          px: 1.5,
          py: 0.75,
          mb: 0.5,
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "rgba(111, 99, 246, 0.08)",
            transform: "translateX(2px)",
          },
        }}
      >
        <Avatar
          src={item.avatar || undefined}
          alt={displayName}
          sx={{
            width: 36,
            height: 36,
            mr: 1.5,
            fontSize: 15,
            fontWeight: 600,
            bgcolor: item.avatar ? undefined : "#e9ecf5",
            color: "#5b647a",
            flexShrink: 0,
          }}
        >
          {avatarLetter}
        </Avatar>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 500,
              color: "#1f2430",
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayName}
          </Typography>

          {item.nickname && (
            <Typography
              sx={{
                mt: 0.25,
                fontSize: 13,
                color: "#7d84a0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.fullname}
            </Typography>
          )}
        </Box>

        <IconButton
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            setSelectedContact(item);
            handleOpenPopover(event);
          }}
          sx={{
            ml: 1,
            color: "#7d84a0",
          }}
        >
          <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </ListItemButton>
      <ContactActionPopover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClosePopover}
        setOpenSetNicknameModal={setOpenSetNicknameModal}
        onUpdateNickName={onUpdateNickName}
        openSetNicknameModal={openSetNicknameModal}
        selectedContact={selectedContact}
      // onViewInfo={}
      // onSetNickname={}
      // onBlockUser={}
      // onRemoveFriend={}
      />
    </>
  );
}
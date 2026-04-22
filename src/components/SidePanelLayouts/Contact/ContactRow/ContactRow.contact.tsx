import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";

import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";

import type { contacts, RowActionProps } from "../../../../types/contact.type";
import { ContactActionPopover } from "../ContactActionPopover/ContactActionPopover";

type ContactRowType = {
  item: contacts;
  rowAction: RowActionProps;
};

export function ContactRow({ item, rowAction }: ContactRowType) {
  const { handlers } = rowAction;

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
        <Box
          sx={{
            position: "relative",
            mr: 1.5,
            flexShrink: 0,
          }}
        >
          <Avatar
            src={item.avatar || undefined}
            alt={displayName}
            sx={{
              width: 36,
              height: 36,
              fontSize: 15,
              fontWeight: 600,
              bgcolor: item.avatar ? undefined : "#e9ecf5",
              color: "#5b647a",
            }}
          >
            {avatarLetter}
          </Avatar>

          {item.isBlocked && (
            <Box
              sx={{
                position: "absolute",
                right: -3,
                bottom: -3,
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "#7c3aed",
                border: "2px solid #ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(124, 58, 237, 0.25)",
              }}
            >
              <BlockRoundedIcon
                sx={{
                  fontSize: 10,
                  color: "#ffffff",
                }}
              />
            </Box>
          )}
        </Box>

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
            handlers.setSelectedContact(item);
            handlers.handleOpenPopover(event);
          }}
          sx={{
            ml: 1,
            color: "#7d84a0",
          }}
        >
          <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </ListItemButton>

      <ContactActionPopover rowAction={rowAction} />
    </>
  );
}
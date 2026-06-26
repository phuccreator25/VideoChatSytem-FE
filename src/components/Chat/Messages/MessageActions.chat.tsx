import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import ReplyIcon from "@mui/icons-material/Reply";
import ForwardIcon from "@mui/icons-material/Shortcut";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import type { MessageType } from "../../../types/chat/chat.model.type";
import {
  MessageMorePopover,
  type MessageMorePopoverVariant,
} from "./PopoverMore.chat";

type Props = {
  msg: MessageType;
  isLeft: boolean;
  variant?: MessageMorePopoverVariant;
  onReply?: (msg: MessageType) => void;
  onShare?: (msg: MessageType) => void;
};

export function MessageActions({
  msg,
  isLeft,
  variant = "text",
  onReply,
  onShare,
}: Props) {
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

  const handleMoreClick = (e: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchor(e.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={0.25}
        alignItems="center"
        className="message-actions"
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          ...(isLeft ? { right: -110 } : { left: -110 }),
          zIndex: 10,
          bgcolor: "background.paper",
          border: "0.5px solid",
          borderColor: "rgba(148,163,184,0.35)",
          borderRadius: "20px",
          px: 0.5,
          py: 0.375,
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.15s ease",
        }}
      >
        <Tooltip title="Reply" placement="top" arrow>
          <IconButton
            size="small"
            onClick={() => onReply?.(msg)}
            sx={{
              width: 30,
              height: 30,
              color: "text.secondary",
              "&:hover": { color: "text.primary", bgcolor: "action.hover" },
            }}
          >
            <ReplyIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Share" placement="top" arrow>
          <IconButton
            size="small"
            onClick={() => onShare?.(msg)}
            sx={{
              width: 30,
              height: 30,
              color: "text.secondary",
              "&:hover": { color: "text.primary", bgcolor: "action.hover" },
            }}
          >
            <ForwardIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="More" placement="top" arrow>
          <IconButton
            size="small"
            onClick={handleMoreClick}
            sx={{
              width: 30,
              height: 30,
              color: Boolean(popoverAnchor) ? "text.primary" : "text.secondary",
              bgcolor: Boolean(popoverAnchor) ? "action.hover" : "transparent",
              "&:hover": { color: "text.primary", bgcolor: "action.hover" },
            }}
          >
            <MoreHorizIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Stack>

      <MessageMorePopover
        anchorEl={popoverAnchor}
        open={Boolean(popoverAnchor)}
        onClose={handlePopoverClose}
        variant={variant}
        message={msg}
      />
    </>
  );
}
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import ReplyIcon from "@mui/icons-material/Reply";
import ForwardIcon from "@mui/icons-material/Shortcut";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import type { MessageType } from "../../../../types/chat/chat.model.type";
import {
  MessageMorePopover,
  type MessageMorePopoverVariant,
} from "./PopoverMore.chat";
import { ReportModal } from "../Dialog/ReportModal";
import { getFileExtension } from "../../../../helpers/client/fileType.helper";
import { formatDate } from "../../../../helpers/formatDate.helper";

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
  const [isReportOpen, setIsReportOpen] = useState(false);

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const chatUserData = useSelector((state: RootState) => state.chat.userData);

  // Không áp dụng báo cáo cho call và gif
  const isReportable = msg.type !== "call" && msg.type !== "gif";

  const handleMoreClick = (e: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchor(e.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  // Xác định người gửi tin nhắn cho REPORT
  const senderUser = isLeft
    ? {
        userId: msg.senderId || chatUserData?.userId || "",
        fullname: chatUserData?.fullname || "User",
        username: chatUserData?.nickname || null,
        avatar: chatUserData?.avatar,
      }
    : {
        userId: currentUser?._id || msg.senderId || "",
        fullname: currentUser?.fullname || "Me",
        username: currentUser?.username || null,
        avatar: currentUser?.avatar,
      };

  const hasAttachments = Boolean(msg.type === "file" && msg.attachments && msg.attachments.length > 0)
  const firstAttachment = hasAttachments ? msg.attachments![0] : undefined;

  const isImageAttachment = hasAttachments && firstAttachment?.resourceType === "image";

  const isFileAttachment = hasAttachments && firstAttachment?.resourceType !== "image";

  const fileExt = isFileAttachment
    ? getFileExtension(firstAttachment?.fileName || "")
    : undefined;

  const targetMessageData = {
    messageId: msg.id || msg.tempMessageId || "",
    conversationId: msg.conversationId || "",
    content: msg.content || undefined,
    mediaThumbnailUrl: firstAttachment?.fileUrl || undefined,
    sentAt: formatDate(msg.createdAt),
    sender: senderUser,
    messageType: isImageAttachment
      ? "image"
      : isFileAttachment
      ? "file"
      : "text",
    fileName: firstAttachment?.fileName || undefined,
    fileExtension: fileExt,
    fileSize: firstAttachment?.fileSize || undefined,
  };

  const offsetDistance = isReportable ? 140 : 110;

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
          ...(isLeft
            ? { right: -offsetDistance }
            : { left: -offsetDistance }),
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

        {(isReportable && isLeft) && (
          <Tooltip title="Report" placement="top" arrow>
            <IconButton
              size="small"
              onClick={() => setIsReportOpen(true)}
              sx={{
                width: 30,
                height: 30,
                color: "text.secondary",
                "&:hover": { color: "#ef4444", bgcolor: "rgba(239, 68, 68, 0.08)" },
              }}
            >
              <FlagOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="More" placement="top" arrow>
          <IconButton
            size="small"
            onClick={handleMoreClick}
            sx={{
              width: 30,
              height: 30,
              color: popoverAnchor ? "text.primary" : "text.secondary",
              bgcolor: popoverAnchor ? "action.hover" : "transparent",
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
        onReport={() => setIsReportOpen(true)}
      />

      {(isReportable && isLeft) && (
        <ReportModal
          open={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          targetType="message"
          targetUser={senderUser}
          targetMessage={targetMessageData}
        />
      )}
    </>
  );
}
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import type { MessageType } from "../../../types/chat.type";
import { ImageFrame } from "../Images/ImageFrame.chat";
import { FileBubble } from "../Files/FileBubble.chat";
import { ChatTime } from "../ChatTime/ChatTime.chat";
import { COLORS } from "../../../utils/Colors";

const parseGalleryImages = (msg: MessageType) => {
  if (msg.type !== "gallery") return [];

  if (Array.isArray(msg.content)) return msg.content as string[];

  if (msg.content) {
    try {
      const parsed = JSON.parse(msg.content);
      if (Array.isArray(parsed)) return parsed as string[];
    } catch {
      // ignore JSON parse errors and fallback to fileUrl
    }
  }

  return msg.fileUrl ? [msg.fileUrl] : [];
};

const MessageStatus = ({ status }: { status?: string }) => {
  if (!status) return null;

  if (status === "sending") {
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <CircularProgress size={11} thickness={5} sx={{ color: "rgba(229, 231, 255, 0.9)" }} />
        <Typography sx={{ fontSize: 11.5, color: "rgba(229, 231, 255, 0.9)", fontWeight: 600 }}>
          Sending
        </Typography>
      </Stack>
    );
  }

  if (status === "failed") {
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <ErrorOutlineIcon sx={{ fontSize: 14, color: "#fecaca" }} />
        <Typography sx={{ fontSize: 11.5, color: "#fecaca", fontWeight: 700 }}>
          Error
        </Typography>
      </Stack>
    );
  }

  if (status === "delivered") {
    return (
      <Stack direction="row" spacing={0.25} alignItems="center">
        <DoneAllIcon sx={{ fontSize: 15, color: "rgba(229, 231, 255, 0.95)" }} />
        <Typography sx={{ fontSize: 11.5, color: "rgba(229, 231, 255, 0.95)", fontWeight: 600 }}>
          Received
        </Typography>
      </Stack>
    );
  }

  if (status === "read") {
    return ('');
  }

  return (
    <Stack direction="row" spacing={0.25} alignItems="center">
      <DoneIcon sx={{ fontSize: 14, color: "rgba(229, 231, 255, 0.9)" }} />
      <Typography sx={{ fontSize: 11.5, color: "rgba(229, 231, 255, 0.9)", fontWeight: 600 }}>
        Sent
      </Typography>
    </Stack>
  );
};

export function MessageItem({
  msg,
  isLeft,
  displayName,
  avatar,
}: {
  msg: MessageType;
  isLeft: boolean;
  displayName: string;
  avatar: string;
}) {
  const galleryImages = parseGalleryImages(msg);
  const isText = msg.type === "text";
  const shouldShowStatus = !isLeft;

  return (
    <Stack
      direction={isLeft ? "row" : "row-reverse"}
      spacing={1.5}
      alignItems="flex-end"
      sx={{ width: "100%" }}
    >
      <Avatar
        src={avatar}
        sx={{
          width: 42,
          height: 42,
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.18)",
          border: "2px solid rgba(255,255,255,0.9)",
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: isLeft ? "flex-start" : "flex-end",
          width: "100%",
        }}
      >
        {isText && (
          <Box
            sx={{
              bgcolor: isLeft ? "#ffffff" : "transparent",
              backgroundImage: isLeft
                ? "none"
                : msg.status === "failed"
                  ? "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)"
                  : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
              border: isLeft ? "1px solid rgba(148, 163, 184, 0.22)" : "none",
              borderRadius: 3,
              px: 2.1,
              py: 1.35,
              minWidth: 140,
              maxWidth: { xs: "90%", sm: "75%" },
              opacity: msg.status === "sending" ? 0.78 : 1,
              boxShadow: isLeft
                ? "0 8px 22px rgba(15, 23, 42, 0.07)"
                : msg.status === "failed"
                  ? "0 12px 30px rgba(239, 68, 68, 0.25)"
                  : "0 12px 30px rgba(79, 70, 229, 0.34)",
            }}
          >
            <Typography
              sx={{
                fontSize: 15,
                lineHeight: 1.62,
                color: isLeft ? COLORS.textMain : "#f8faff",
                textAlign: "left",
                wordBreak: "break-word",
                letterSpacing: 0.1,
              }}
            >
              {msg.content || ""}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: isLeft ? "flex-start" : "flex-end",
                alignItems: "center",
                gap: 1,
                mt: 0.75,
              }}
            >
              {msg.createdAt && (
                <ChatTime
                  createdAt={msg.createdAt}
                  color={isLeft ? COLORS.textMuted : "rgba(229, 231, 255, 0.95)"}
                  dense
                />
              )}

              {shouldShowStatus && <MessageStatus status={msg.status} />}
            </Box>
          </Box>
        )}

        {msg.type === "image" && msg.fileUrl && (
          <ImageFrame images={[msg.fileUrl]} createdAt={msg.createdAt} isLeft={isLeft} />
        )}

        {msg.type === "gallery" && galleryImages.length > 0 && (
          <ImageFrame images={galleryImages} createdAt={msg.createdAt} isLeft={isLeft} />
        )}

        {msg.type === "file" && (
          <FileBubble
            fileName={msg.fileName || "Attachment"}
            fileSize={msg.fileSize || 0}
            createdAt={msg.createdAt}
            isLeft={isLeft}
          />
        )}

        <Typography
          sx={{
            mt: 1,
            px: 0.35,
            fontSize: 12.5,
            color: COLORS.textMuted,
            fontWeight: 600,
            textAlign: isLeft ? "left" : "right",
            letterSpacing: 0.3,
          }}
        >
          {displayName}
        </Typography>
      </Box>
    </Stack>
  );
}
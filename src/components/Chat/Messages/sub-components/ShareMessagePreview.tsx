import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import GifIcon from "@mui/icons-material/Gif";
import type { MessageType } from "../../../../types/chat/chat.model.type";
import { COLORS } from "../../../../utils/Colors";

type ShareMessagePreviewProps = {
  message: MessageType | null;
}

export function ShareMessagePreview({ message }: ShareMessagePreviewProps) {
  if (!message) return null;

  let previewContent = null;
  if (message.type === "text") {
    previewContent = (
      <Typography sx={{ fontSize: 13, color: "text.secondary" }} noWrap>
        {message.content}
      </Typography>
    );
  } else if (message.type === "gif") {
    previewContent = (
      <Stack direction="row" spacing={1} alignItems="center">
        <GifIcon sx={{ color: COLORS.textMuted }} />
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>[GIF]</Typography>
      </Stack>
    );
  } else if (message.type === "file") {
    const attachments = message.attachments || [];
    const isImg = attachments[0]?.resourceType === "image";
    previewContent = (
      <Stack direction="row" spacing={1} alignItems="center">
        {isImg ? (
          <Box
            component="img"
            src={String(attachments[0]?.fileUrl || attachments[0]?.previewUrl || "")}
            alt=""
            sx={{ width: 28, height: 28, borderRadius: 0.5, objectFit: "cover" }}
          />
        ) : (
          <InsertDriveFileOutlinedIcon sx={{ fontSize: 18, color: COLORS.textMuted }} />
        )}
        <Typography sx={{ fontSize: 13, color: "text.secondary" }} noWrap>
          {attachments[0]?.fileName || "Attachment"}
        </Typography>
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        p: 1.5,
        bgcolor: "rgba(241, 245, 249, 0.6)",
        border: "1px solid rgba(148, 163, 184, 0.15)",
        borderRadius: "10px",
        mb: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          color: COLORS.primary,
          mb: 0.5,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Sharing message
      </Typography>
      {previewContent}
    </Box>
  );
}

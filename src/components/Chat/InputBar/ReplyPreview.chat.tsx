import { Box, IconButton, Stack, Typography } from "@mui/material";
import type { MessageType } from "../../../types/chat.type";
import { COLORS } from "../../../utils/Colors";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";

export function ReplyPreview({
  message,
  onRemove,
}: {
  message: MessageType;
  onRemove?: () => void;
}) {
  const getPreviewContent = () => {
    if (message.type === "text") {
      return (
        <Typography
          sx={{
            fontSize: 13,
            color: COLORS.textMuted,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "left",
            display: "block",
            width: "100%",
          }}
        >
          {message.content || ""}
        </Typography>
      );
    }

    if (message.type === "gif") {
      return (
        <Typography
          sx={{
            fontSize: 13,
            color: COLORS.textMuted,
            textAlign: "left",
            display: "block",
            width: "100%",
          }}
        >
          GIF
        </Typography>
      );
    }

    if (message.type === "file") {
      const attachments = message.attachments || [];
      const firstImage = attachments.find(
        (a) =>
          a.resourceType === "image" ||
          String(a.mimeType || "").startsWith("image/"),
      );
      const firstFile = attachments.find(
        (a) =>
          a.resourceType !== "image" &&
          !String(a.mimeType || "").startsWith("image/"),
      );

      if (firstImage) {
        return (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
            {(firstImage.fileUrl || firstImage.previewUrl) && (
              <Box
                component="img"
                src={firstImage.fileUrl || firstImage.previewUrl || ""}
                alt=""
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            )}
            <Typography sx={{ fontSize: 13, color: COLORS.textMuted, textAlign: "left" }}>
              [Image]
            </Typography>
          </Stack>
        );
      }

      if (firstFile) {
        return (
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ width: "100%" }}>
            <InsertDriveFileOutlinedIcon sx={{ fontSize: 15, color: COLORS.textMuted, flexShrink: 0 }} />
            <Typography
              sx={{
                fontSize: 13,
                color: COLORS.textMuted,
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
                width: "100%",
              }}
            >
              [File] {firstFile.fileName || ""}
            </Typography>
          </Stack>
        );
      }

      if (message.content) {
        return (
          <Typography
            sx={{
              fontSize: 13,
              color: COLORS.textMuted,
              textAlign: "left",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
              width: "100%",
            }}
          >
            {message.content}
          </Typography>
        );
      }
    }

    return null;
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",   // 👈 tất cả flex-start
        gap: 1.2,
        mb: 1.2,
        px: 1.4,
        py: 1,
        borderRadius: 2,
        bgcolor: "rgba(241, 245, 249, 0.9)",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          borderRadius: "2px 0 0 2px",
          bgcolor: "#6366f1",
        },
      }}
    >
      <FormatQuoteRoundedIcon
        sx={{ fontSize: 18, color: "#6366f1", flexShrink: 0, ml: 0.5 }}
      />

      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <Typography
          sx={{
            fontSize: 12.5,
            fontWeight: 700,
            color: "#6366f1",
            lineHeight: 1.4,
            mb: 0.25,
            textAlign: "left",
            display: "block",
            width: "100%",
          }}
        >
          Reply
        </Typography>
        {getPreviewContent()}
      </Box>

      <IconButton
        size="small"
        onClick={onRemove}
        sx={{
          width: 26,
          height: 26,
          color: COLORS.textMuted,
          flexShrink: 0,
          ml: "auto",
          "&:hover": { color: COLORS.textMain, bgcolor: "rgba(148,163,184,0.15)" },
        }}
      >
        <CloseRoundedIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}
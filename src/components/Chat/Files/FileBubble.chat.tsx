import Box from "@mui/material/Box";
import { ChatTime } from "../ChatTime/ChatTime.chat";
import { MessageStatus } from "../Status/messageStatus.chat";
import { COLORS } from "../../../utils/Colors";
import type { AbortMultipartParams } from "../../../types/upload.type";

import { FileRow, type FileAttachment } from "./FileRow.chat";
import { StatusChip } from "./StatusChip.chat";
import { FileTypeBadge, FileBadge } from "./FileTypeBadge.chat";

// Re-export sub-modules and types for easy consumption
export type { FileAttachment };
export { StatusChip, FileTypeBadge, FileBadge, FileRow };

export function FileGroupBubble({
  files,
  createdAt,
  isLeft = true,
  status,
  showStatus = false,
  onResend,
  onCancelUpload,
}: {
  files: FileAttachment[];
  createdAt?: string;
  isLeft?: boolean;
  status?: string;
  showStatus?: boolean;
  onResend?: () => void;
  onCancelUpload?: (item: AbortMultipartParams) => void;
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: isLeft ? "flex-start" : "flex-end", width: "100%", mb: 1.5 }}>
      <Box sx={{ maxWidth: { xs: "92vw", sm: 420 }, minWidth: { xs: "60vw", sm: 320 }, width: "100%" }}>
        <Box
          sx={{
            borderRadius: "16px",

            bgcolor: isLeft ? "#ffffff" : "transparent",

            backgroundImage: isLeft
              ? "none"
              : "linear-gradient(145deg, #4f46e5 0%, #3730a3 60%, #312e81 100%)",

            border: isLeft
              ? "1px solid rgba(226,232,240,0.95)"
              : "1px solid rgba(99,102,241,0.35)",

            boxShadow: isLeft
              ? "0 12px 30px rgba(15,23,42,0.08)"
              : "0 20px 48px rgba(55,48,163,0.38), 0 0 0 1px rgba(165,180,252,0.08) inset",

            overflow: "hidden",
            position: "relative",
            width: "100%",

            "&::before": {
              content: '""',
              display: isLeft ? "none" : "block",
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(165,180,252,0.5), transparent)",
            },
          }}
        >
          {files.map((file, index) => (
            <FileRow
              key={`${file.fileName}-${index}`}
              file={file}
              isLast={index === files.length - 1}
              isLeft={isLeft}
              onCancelUpload={onCancelUpload}
            />
          ))}
          <Box
            sx={{
              px: 1.4,
              py: 0.9,
              display: "flex",
              justify: isLeft ? "flex-start" : "flex-end",
              alignItems: "center",
              gap: 1,

              borderTop: isLeft
                ? "1px solid rgba(226,232,240,0.8)"
                : "1px solid rgba(255,255,255,0.08)",

              bgcolor: isLeft
                ? "rgba(248,250,252,0.8)"
                : "rgba(15,23,42,0.08)",
            }}
          >
            <ChatTime
              createdAt={createdAt}
              color={
                isLeft
                  ? COLORS.textMuted
                  : "rgba(229,231,255,0.92)"
              }
              dense
            />

            {!isLeft && showStatus && (
              <MessageStatus
                type="message"
                status={status}
                onResend={onResend}
              />
            )}
          </Box>
        </Box>

      </Box>
    </Box>
  );
}
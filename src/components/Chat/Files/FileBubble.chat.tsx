import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import { ChatTime } from "../ChatTime/ChatTime.chat";
import useDownloadFile from "../../../helpers/downloadFile.helper";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import { onPinMessageConversation } from "../../../redux/conversation.redux";
import { useParams } from "react-router-dom";
import { MessageStatus } from "../Status/messageStatus.chat";
import { COLORS } from "../../../utils/Colors";

// ─── types ────────────────────────────────────────────────────────────────────

export type FileAttachment = {
  attachmentId?: string | null;
  messageId?: string | null;
  fileName: string;
  fileSize: string | number;
  fileUrl?: string | null;
  mimeType?: string | null;
  status?: string;
};

type FileVisualMeta = {
  extension: string;
  label: string;
  accent: string;
  soft: string;
  text: string;
  badgeBg: string;   // badge gradient start
  badgeEnd: string;  // badge gradient end
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function getFileExtension(fileName: string) {
  const segments = fileName.split(".");
  return segments.length < 2 ? "" : segments[segments.length - 1].toLowerCase();
}

function decodeFileName(fileName: string) {
  try { return decodeURIComponent(fileName); } catch { return fileName; }
}

function formatFileSize(value: string | number) {
  if (typeof value === "string") return value;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(2)} MB`;
  return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function getFileVisualMeta(fileName: string, mimeType?: string | null): FileVisualMeta {
  const extension = getFileExtension(fileName);
  const mime = mimeType?.toLowerCase() || "";

  if (mime === "application/pdf" || extension === "pdf")
    return { extension: "PDF", label: "PDF", accent: "#ef4444", soft: "#fee2e2", text: "#b91c1c", badgeBg: "#ff6b6b", badgeEnd: "#dc2626" };
  if (mime.includes("word") || extension === "doc" || extension === "docx")
    return { extension: "DOC", label: "Word", accent: "#3b82f6", soft: "#dbeafe", text: "#1d4ed8", badgeBg: "#60a5fa", badgeEnd: "#2563eb" };
  if (mime.includes("excel") || mime.includes("spreadsheet") || ["xls", "xlsx", "csv"].includes(extension))
    return { extension: "XLS", label: "Excel", accent: "#22c55e", soft: "#dcfce7", text: "#15803d", badgeBg: "#4ade80", badgeEnd: "#16a34a" };
  if (mime.includes("powerpoint") || mime.includes("presentation") || ["ppt", "pptx"].includes(extension))
    return { extension: "PPT", label: "PowerPoint", accent: "#f97316", soft: "#ffedd5", text: "#c2410c", badgeBg: "#fb923c", badgeEnd: "#ea580c" };
  if (mime.startsWith("video/") || ["mp4", "webm", "mov"].includes(extension))
    return { extension: extension.toUpperCase() || "VID", label: "Video", accent: "#a855f7", soft: "#f3e4ff", text: "#7e22ce", badgeBg: "#c084fc", badgeEnd: "#9333ea" };
  if (mime === "application/zip" || ["zip", "rar", "7z"].includes(extension))
    return { extension: "ZIP", label: "Archive", accent: "#8b5cf6", soft: "#ede9fe", text: "#6d28d9", badgeBg: "#a78bfa", badgeEnd: "#7c3aed" };
  if (mime === "text/plain" || extension === "txt")
    return { extension: "TXT", label: "Text", accent: "#eab308", soft: "#fef9c3", text: "#a16207", badgeBg: "#facc15", badgeEnd: "#ca8a04" };

  return { extension: extension.toUpperCase() || "FILE", label: "File", accent: "#94a3b8", soft: "#f1f5f9", text: "#475569", badgeBg: "#cbd5e1", badgeEnd: "#64748b" };
}

// ─── StatusChip (white-friendly) ─────────────────────────────────────────────

function StatusChip({
  status,
  isReady,
  isFailed,
  isLeft,
}: {
  status?: string;
  isReady: boolean;
  isFailed: boolean;
  isLeft: boolean;
}) {
  if (isFailed) {
    return (
      <Stack
        direction="row"
        spacing={0.4}
        alignItems="center"
        sx={{
          px: 1,
          py: 0.25,
          borderRadius: 999,

          bgcolor: isLeft
            ? "#fef2f2"
            : "rgba(255,100,100,0.18)",

          border: isLeft
            ? "1px solid rgba(239,68,68,0.2)"
            : "1px solid rgba(255,120,120,0.35)",
        }}
      >
        <ErrorOutlineRoundedIcon
          sx={{
            fontSize: 12,
            color: isLeft
              ? "#dc2626"
              : "#fca5a5",
          }}
        />

        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 700,
            color: isLeft
              ? "#b91c1c"
              : "#fca5a5",
            letterSpacing: "0.03em",
          }}
        >
          Failed
        </Typography>
      </Stack>
    );
  }

  if (isReady) {
    return (
      <Stack
        direction="row"
        spacing={0.4}
        alignItems="center"
        sx={{
          px: 1,
          py: 0.25,
          borderRadius: 999,

          bgcolor: isLeft
            ? "#f0fdf4"
            : "rgba(74,222,128,0.15)",

          border: isLeft
            ? "1px solid rgba(34,197,94,0.2)"
            : "1px solid rgba(74,222,128,0.3)",
        }}
      >
        <CheckCircleOutlineRoundedIcon
          sx={{
            fontSize: 12,
            color: isLeft
              ? "#22c55e"
              : "#86efac",
          }}
        />

        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 700,
            color: isLeft
              ? "#16a34a"
              : "#86efac",
            letterSpacing: "0.03em",
          }}
        >
          Ready
        </Typography>
      </Stack>
    );
  }

  const isUploading =
    status === "uploading" ||
    status === "sending";

  return (
    <Stack
      direction="row"
      spacing={0.4}
      alignItems="center"
      sx={{
        px: 1,
        py: 0.25,
        borderRadius: 999,

        bgcolor: isLeft
          ? "#eef2ff"
          : "rgba(255,255,255,0.1)",

        border: isLeft
          ? "1px solid rgba(99,102,241,0.18)"
          : "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <ScheduleRoundedIcon
        sx={{
          fontSize: 12,
          color: isLeft
            ? "#4f46e5"
            : "rgba(255,255,255,0.7)",
        }}
      />

      <Typography
        sx={{
          fontSize: 10.5,
          fontWeight: 700,
          color: isLeft
            ? "#4338ca"
            : "rgba(255,255,255,0.7)",
          letterSpacing: "0.03em",
        }}
      >
        {isUploading ? "Uploading…" : "Pending"}
      </Typography>
    </Stack>
  );
}

// ─── FileTypeBadge ────────────────────────────────────────────────────────────

function FileTypeBadge({ meta }: { meta: FileVisualMeta }) {
  return (
    <Box
      sx={{
        width: 50,
        height: 58,
        borderRadius: "10px",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(160deg, ${meta.badgeBg} 0%, ${meta.badgeEnd} 100%)`,
        boxShadow: `0 6px 18px ${meta.badgeEnd}55`,
        flexShrink: 0,
      }}
    >
      {/* folded corner */}
      <Box sx={{
        position: "absolute", top: 0, right: 0,
        width: 14, height: 14,
        bgcolor: "rgba(255,255,255,0.25)",
        clipPath: "polygon(100% 0, 0 0, 100% 100%)",
      }} />
      <Stack sx={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }} spacing={0.3}>
        <InsertDriveFileOutlinedIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.9)" }} />
        <Typography sx={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", color: "#fff", textTransform: "uppercase", lineHeight: 1 }}>
          {meta.extension}
        </Typography>
      </Stack>
    </Box>
  );
}

// ─── FileRow ──────────────────────────────────────────────────────────────────

function FileRow({
  file,
  isLast,
  isPinned,
  isLeft,
}: {
  file: FileAttachment;
  isLast: boolean;
  isPinned?: boolean;
  isLeft: boolean;
}) {
  const { onHandleDownloadFile } = useDownloadFile();
  const dispatch = useDispatch<AppDispatch>();
  const { conversationId } = useParams();

  const displayName = decodeFileName(file.fileName);
  const meta = getFileVisualMeta(displayName, file.mimeType);
  const size = formatFileSize(file.fileSize);

  const isUploading = [
    "pending",
    "uploading",
    "sending",
  ].includes(file.status || "");

  const isFailed = file.status === "failed";

  const isReady =
    Boolean(file.fileUrl) &&
    !isUploading &&
    !isFailed;

  const handlePin = () => {
    if (
      !isReady ||
      !conversationId ||
      !file.messageId
    ) {
      return;
    }

    dispatch(
      onPinMessageConversation({
        conversationId,
        messageId: file.messageId,
        attachmentId: file.attachmentId ?? null,
      }),
    );
  };

  const handleDownload = () => {
    if (!isReady || !file.fileUrl) return;

    onHandleDownloadFile(
      file.fileUrl,
      file.fileName,
    );
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        textAlign="start"
        sx={{
          px: 1.6,
          py: 1.2,
          width: "100%",
          boxSizing: "border-box",
          transition: "background-color 0.15s ease",

          "&:hover": {
            bgcolor: isLeft
              ? "rgba(241,245,249,0.78)"
              : "rgba(255,255,255,0.05)",
          },
        }}
      >
        <FileTypeBadge meta={meta} />

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* File name */}
          <Typography
            title={displayName}
            dir="auto"
            sx={{
              fontSize: 13.5,
              fontWeight: 700,
              color: isLeft
                ? "#0f172a"
                : "#ffffff",
              lineHeight: 1.35,
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              textShadow: isLeft
                ? "none"
                : "0 1px 3px rgba(0,0,0,0.25)",
            }}
          >
            {displayName}
          </Typography>

          {/* Size and file type */}
          <Stack
            direction="row"
            spacing={0.6}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 0.4 }}
          >
            <Typography
              sx={{
                fontSize: 11,
                color: isLeft
                  ? "#64748b"
                  : "rgba(199,210,254,0.85)",
                fontWeight: 500,
              }}
            >
              {size}
            </Typography>

            <Box
              sx={{
                width: 2.5,
                height: 2.5,
                borderRadius: 999,
                bgcolor: isLeft
                  ? "rgba(100,116,139,0.55)"
                  : "rgba(199,210,254,0.4)",
              }}
            />

            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: 700,
                color: isLeft
                  ? meta.text
                  : meta.badgeBg,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {meta.label}
            </Typography>
          </Stack>

          {/* Status and actions */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 0.9 }}
          >
            <StatusChip
              status={file.status}
              isReady={isReady}
              isFailed={isFailed}
              isLeft={isLeft}
            />

            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
            >
              {/* Pin */}
              <Tooltip
                title={
                  !isReady
                    ? "Available after upload"
                    : isPinned
                      ? "Unpin file"
                      : "Pin file"
                }
                placement="top"
                arrow
              >
                <span>
                  <IconButton
                    size="small"
                    disabled={!isReady}
                    onClick={handlePin}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",

                      bgcolor: isPinned
                        ? isLeft
                          ? "rgba(251,191,36,0.12)"
                          : "rgba(251,191,36,0.2)"
                        : isLeft
                          ? "#f8fafc"
                          : "rgba(255,255,255,0.08)",

                      color: isPinned
                        ? "#f59e0b"
                        : isLeft
                          ? "#94a3b8"
                          : "rgba(199,210,254,0.7)",

                      border: `1px solid ${isPinned
                        ? "rgba(251,191,36,0.35)"
                        : isLeft
                          ? "rgba(226,232,240,0.95)"
                          : "rgba(255,255,255,0.12)"
                        }`,

                      "&:hover": {
                        bgcolor: isPinned
                          ? "rgba(251,191,36,0.22)"
                          : isLeft
                            ? "rgba(226,232,240,0.72)"
                            : "rgba(255,255,255,0.15)",

                        color: isPinned
                          ? "#f59e0b"
                          : isLeft
                            ? "#6366f1"
                            : "#ffffff",
                      },

                      "&.Mui-disabled": {
                        bgcolor: isLeft
                          ? "#f8fafc"
                          : "rgba(255,255,255,0.04)",

                        color: isLeft
                          ? "#cbd5e1"
                          : "rgba(199,210,254,0.25)",

                        border: isLeft
                          ? "1px solid rgba(226,232,240,0.95)"
                          : "1px solid rgba(255,255,255,0.07)",
                      },

                      transition:
                        "color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease",
                    }}
                  >
                    <PushPinOutlinedIcon
                      sx={{ fontSize: 15 }}
                    />
                  </IconButton>
                </span>
              </Tooltip>

              {/* Download */}
              <Tooltip
                title={
                  isReady
                    ? "Download"
                    : "Available after upload"
                }
                placement="top"
                arrow
              >
                <span>
                  <IconButton
                    size="small"
                    disabled={!isReady}
                    onClick={handleDownload}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",

                      bgcolor: isLeft
                        ? isReady
                          ? meta.soft
                          : "#f8fafc"
                        : isReady
                          ? `${meta.badgeBg}28`
                          : "rgba(255,255,255,0.05)",

                      color: isLeft
                        ? isReady
                          ? meta.text
                          : "#94a3b8"
                        : isReady
                          ? meta.badgeBg
                          : "rgba(199,210,254,0.35)",

                      border: `1px solid ${isLeft
                        ? isReady
                          ? `${meta.accent}30`
                          : "rgba(226,232,240,0.95)"
                        : isReady
                          ? `${meta.badgeBg}45`
                          : "rgba(255,255,255,0.08)"
                        }`,

                      "&:hover": {
                        bgcolor: isLeft
                          ? isReady
                            ? meta.soft
                            : "#f8fafc"
                          : isReady
                            ? `${meta.badgeBg}42`
                            : undefined,
                      },

                      "&.Mui-disabled": {
                        bgcolor: isLeft
                          ? "#f8fafc"
                          : "rgba(255,255,255,0.04)",

                        color: isLeft
                          ? "#cbd5e1"
                          : "rgba(199,210,254,0.25)",

                        border: isLeft
                          ? "1px solid rgba(226,232,240,0.95)"
                          : "1px solid rgba(255,255,255,0.07)",
                      },

                      transition:
                        "color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease",
                    }}
                  >
                    <DownloadOutlinedIcon
                      sx={{ fontSize: 17 }}
                    />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>
      </Stack>

      {!isLast && (
        <Divider
          sx={{
            mx: 1.6,
            borderColor: isLeft
              ? "rgba(226,232,240,0.85)"
              : "rgba(255,255,255,0.08)",
          }}
        />
      )}
    </>
  );
}
// ─── FileGroupBubble ──────────────────────────────────────────────────────────

export function FileGroupBubble({
  files,
  createdAt,
  isLeft = true,
  status,
  showStatus = false,
  onResend,
  onDeleteFailed,
}: {
  files: FileAttachment[];
  createdAt?: string;
  isLeft?: boolean;
  status?: string;
  showStatus?: boolean;
  onResend?: () => void;
  onDeleteFailed?: () => void;
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
            />
          ))}
          <Box
            sx={{
              px: 1.4,
              py: 0.9,
              display: "flex",
              justifyContent: isLeft ? "flex-start" : "flex-end",
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
                onDeleteFailed={onDeleteFailed}
              />
            )}
          </Box>
        </Box>

      </Box>
    </Box>
  );
}
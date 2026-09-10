import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import useDownloadFile from "../../../helpers/downloadFile.helper";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import { onPinMessageConversation } from "../../../redux/conversation.redux";
import { useParams } from "react-router-dom";

import {
  getFileVisualMeta,
  decodeFileName,
  formatFileSize,
} from "../../../helpers/fileType.helper";
import type { AbortMultipartParams } from "../../../types/upload.type";
import { StatusChip } from "./StatusChip.chat";
import { FileTypeBadge } from "./FileTypeBadge.chat";

export type FileAttachment = {
  attachmentId?: string | null;
  tempAttachmentId?: string;
  messageId?: string | null;
  fileName: string;
  fileSize: string | number;
  fileUrl?: string | null;
  mimeType?: string | null;
  status?: string;
};

export type FileRowProps = {
  file: FileAttachment;
  isLast: boolean;
  isPinned?: boolean;
  isLeft: boolean;
  onCancelUpload?: (item: AbortMultipartParams) => void;
};

export function FileRow({
  file,
  isLast,
  isPinned,
  isLeft,
  onCancelUpload,
}: FileRowProps) {
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
              {/* Cancel Upload */}
              {isUploading && (
                <Tooltip title="Cancel upload" placement="top" arrow>
                  <span>
                    <IconButton
                      size="small"
                      onClick={() =>
                        onCancelUpload?.({ tempAttachmentId: file.tempAttachmentId || "" })}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",

                        bgcolor: isLeft
                          ? "#fef2f2"
                          : "rgba(255,255,255,0.12)",

                        color: isLeft
                          ? "#ef4444"
                          : "#fca5a5",

                        border: `1px solid ${
                          isLeft
                            ? "rgba(239,68,68,0.25)"
                            : "rgba(252,165,165,0.35)"
                        }`,

                        "&:hover": {
                          bgcolor: isLeft
                            ? "#fee2e2"
                            : "rgba(239,68,68,0.25)",

                          color: isLeft
                            ? "#dc2626"
                            : "#ffffff",

                          border: `1px solid ${
                            isLeft
                              ? "rgba(239,68,68,0.45)"
                              : "rgba(252,165,165,0.6)"
                          }`,
                        },

                        transition:
                          "color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease",
                      }}
                    >
                      <CloseRoundedIcon
                        sx={{ fontSize: 16 }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              )}

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

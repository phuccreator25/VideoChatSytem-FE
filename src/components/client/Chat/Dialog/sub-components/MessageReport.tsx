import React, { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CircularProgress from "@mui/material/CircularProgress";

import { customScrollbarSx } from "../../../../../utils/CustomScroll";
import type {
  IReportTargetMessage,
  ICreateReportMessagePayload,
  ReportMessageReason,
} from "../../../../../types/Report.type";
import { MESSAGE_REASONS } from "../../../../../data/Report.data";

type MessageReportProps = {
  onClose: () => void;
  targetMessage?: IReportTargetMessage | null;
  onSubmit?: (payload: ICreateReportMessagePayload) => void;
};

export function MessageReport({
  onClose,
  targetMessage,
  onSubmit,
}: MessageReportProps) {
  const [selectedReason, setSelectedReason] = useState<ReportMessageReason | "">("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const resolvedUser = targetMessage?.sender;

  const isImageMessage = targetMessage?.messageType === "image";
  const isFileMessage = !isImageMessage && targetMessage?.messageType === "file";
  const resolvedFileExtension = targetMessage?.fileExtension || "FILE";

  const handleSubmit = async() => {
    if (!selectedReason || isSubmitting) return;
    
    setIsSubmitting(true);

    const payload: ICreateReportMessagePayload = {
      targetType: "message",
      targetUserId: targetMessage?.sender?.userId || "",
      messageId: targetMessage?.messageId || "",
      conversationId: targetMessage?.conversationId || "",
      reason: selectedReason as ReportMessageReason,
      description: description.trim() || undefined,
      reportedMessageSnapshot: {
        content: targetMessage?.content,
        mediaUrl: targetMessage?.mediaThumbnailUrl,
        messageType: targetMessage?.messageType,
        sentAt: targetMessage?.sentAt,
      }
    };

    await onSubmit?.(payload);

    setIsSubmitting(false);
  };

  return (
    <>
      {/* Header */}
      <DialogTitle
        sx={{
          p: { xs: 2, sm: 2.5 },
          px: { xs: 2.5, sm: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
          bgcolor: "rgba(248, 250, 252, 0.6)",
          gap: 1.5,
        }}
      >
        <Stack
          direction="row"
          spacing={{ xs: 1.5, sm: 1.75 }}
          alignItems="center"
          sx={{ minWidth: 0, flex: 1 }}
        >
          <Box
            sx={{
              width: { xs: 40, sm: 44 },
              height: { xs: 40, sm: 44 },
              borderRadius: 3,
              bgcolor: "rgba(79, 70, 229, 0.08)",
              color: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.12)",
              flexShrink: 0,
            }}
          >
            <ShieldOutlinedIcon sx={{ fontSize: 24 }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: 16, sm: 18 },
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
              }}
            >
              Report Violating Messages
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                color: "#64748b",
                mt: 0.2,
                lineHeight: 1.35,
              }}
            >
              Chat app Safety team will review the content and respond within 24 hours
            </Typography>
          </Box>
        </Stack>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "#64748b",
            "&:hover": {
              bgcolor: "rgba(148, 163, 184, 0.14)",
              color: "#0f172a",
            },
            transition: "all 0.15s ease",
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      {/* Main Content Area */}
      <DialogContent
        sx={{
          p: { xs: 2.25, sm: 3 },
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2.25,
          mt: 2,
          ...customScrollbarSx,
        }}
      >
        {/* Khung Card thông tin tin nhắn bị báo cáo */}
        <Box
          sx={{
            p: 1.75,
            borderRadius: 3,
            bgcolor: "rgba(245, 243, 255, 0.5)",
            border: "1px solid rgba(224, 231, 255, 0.85)",
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Avatar
            src={resolvedUser?.avatar}
            sx={{
              width: 42,
              height: 42,
              bgcolor: "#4f46e5",
              color: "#ffffff",
              fontSize: 17,
              fontWeight: 700,
              boxShadow: "0 3px 10px rgba(79, 70, 229, 0.2)",
              flexShrink: 0,
            }}
          >
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: "13.5px", color: "#1e293b" }}>
              Sender:{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "#0f172a" }}>
                {resolvedUser?.fullname || "User"}
              </Box>{" "}
              {resolvedUser?.username && (
                <Box component="span" sx={{ color: "#4f46e5", fontWeight: 600 }}>
                  (@{resolvedUser.username})
                </Box>
              )}
            </Typography>

            {isImageMessage ? (
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="center"
                sx={{ my: 0.6 }}
              >
                {targetMessage?.mediaThumbnailUrl && (
                  <Box
                    component="img"
                    src={targetMessage.mediaThumbnailUrl}
                    alt={targetMessage.fileName || "Image attachment"}
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "8px",
                      objectFit: "cover",
                      border: "1px solid rgba(148, 163, 184, 0.25)",
                      bgcolor: "#f1f5f9",
                      flexShrink: 0,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    }}
                  />
                )}
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  {targetMessage?.content ? (
                    <Typography
                      sx={{
                        fontSize: "12.5px",
                        color: "#4338ca",
                        fontStyle: "italic",
                        lineHeight: 1.45,
                        wordBreak: "break-word",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      &ldquo; {targetMessage.content} &rdquo;
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#64748b",
                        fontWeight: 600,
                      }}
                    >
                      [Image Attachment]{" "}
                      {targetMessage?.fileName ? `• ${targetMessage.fileName}` : ""}
                    </Typography>
                  )}
                </Box>
              </Stack>
            ) : isFileMessage ? (
              <Box sx={{ my: 0.6 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1.25,
                    p: 0.75,
                    px: 1.25,
                    borderRadius: "8px",
                    bgcolor: "rgba(99, 102, 241, 0.06)",
                    border: "1px solid rgba(99, 102, 241, 0.15)",
                    maxWidth: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "6px",
                      bgcolor: "#6366f1",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <InsertDriveFileOutlinedIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: "#1e293b",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: { xs: 200, sm: 260 },
                      }}
                    >
                      {targetMessage?.fileName || "Attachment File"}
                    </Typography>
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <Typography
                        sx={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#4f46e5",
                          textTransform: "uppercase",
                          bgcolor: "rgba(99, 102, 241, 0.12)",
                          px: 0.6,
                          py: 0.1,
                          borderRadius: "4px",
                        }}
                      >
                        {resolvedFileExtension}
                      </Typography>
                      {targetMessage?.fileSize && (
                        <Typography sx={{ fontSize: "11px", color: "#64748b" }}>
                          {targetMessage.fileSize}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Box>

                {targetMessage?.content && (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#4338ca",
                      fontStyle: "italic",
                      lineHeight: 1.4,
                      mt: 0.5,
                      wordBreak: "break-word",
                    }}
                  >
                    &ldquo; {targetMessage.content} &rdquo;
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography
                sx={{
                  fontSize: "12.5px",
                  color: "#4338ca",
                  fontStyle: "italic",
                  lineHeight: 1.45,
                  my: 0.4,
                  wordBreak: "break-word",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                &ldquo; {targetMessage?.content} &rdquo;
              </Typography>
            )}

            <Typography
              sx={{
                fontSize: "11px",
                color: "#94a3b8",
                fontWeight: 500,
              }}
            >
              Message ID: #{targetMessage?.messageId} • Sent at:{" "}
              {targetMessage?.sentAt}
            </Typography>
          </Box>
        </Box>

        {/* Section: Danh sách lý do vi phạm (BẮT BUỘC) */}
        <Box>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            REASON FOR VIOLATION (MANDATORY):
          </Typography>

          <Stack spacing={0.8}>
            {MESSAGE_REASONS.map((item) => {
              const isSelected = selectedReason === item.id;
              return (
                <Box
                  key={item.id}
                  onClick={() => setSelectedReason(item.id)}
                  sx={{
                    px: 1.75,
                    py: 1.05,
                    borderRadius: 2.5,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: isSelected
                      ? "rgba(79, 70, 229, 0.05)"
                      : "#ffffff",
                    border: isSelected
                      ? "1.5px solid #4f46e5"
                      : "1px solid rgba(226, 232, 240, 0.85)",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: isSelected
                        ? "rgba(79, 70, 229, 0.08)"
                        : "rgba(248, 250, 252, 0.85)",
                      borderColor: isSelected
                        ? "#4f46e5"
                        : "rgba(203, 213, 225, 0.9)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        color: isSelected ? "#4f46e5" : "#64748b",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? "#4338ca" : "#334155",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>

                  {isSelected && (
                    <CheckRoundedIcon
                      sx={{
                        fontSize: 18,
                        color: "#4f46e5",
                        ml: 1,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Section: Mô tả bổ sung (TÙY CHỌN) */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 0.75,
            }}
          >
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#64748b",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              ADDITIONAL DESCRIPTION (OPTIONAL):
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#4f46e5",
              }}
            >
              {description.length} / 300
            </Typography>
          </Box>

          <Box
            component="textarea"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (e.target.value.length <= 300) {
                setDescription(e.target.value);
              }
            }}
            placeholder="This user is constantly sending private messages with links inviting people to join an investment group suspected of financial fraud, disrupting the in-app experience."
            rows={3}
            sx={{
              width: "100%",
              boxSizing: "border-box",
              borderRadius: 2.5,
              border: "1px solid rgba(226, 232, 240, 0.85)",
              bgcolor: "#ffffff",
              p: 1.25,
              fontSize: "13px",
              fontFamily: "inherit",
              color: "#0f172a",
              lineHeight: 1.5,
              resize: "none",
              outline: "none",
              transition: "border-color 0.18s ease, box-shadow 0.18s ease",
              "&:focus": {
                borderColor: "#4f46e5",
                boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.08)",
              },
              "&::placeholder": {
                color: "#94a3b8",
                fontSize: "12.5px",
              },
            }}
          />
        </Box>

        {/* Khung bảo mật danh tính */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2.5,
            bgcolor: "rgba(248, 250, 252, 0.85)",
            border: "1px solid rgba(226, 232, 240, 0.85)",
            display: "flex",
            alignItems: "flex-start",
            gap: 1.25,
          }}
        >
          <LockOutlinedIcon
            sx={{ fontSize: 18, color: "#64748b", mt: 0.15, flexShrink: 0 }}
          />
          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#334155",
                lineHeight: 1.4,
              }}
            >
              Anonymity: The reported user will NOT know who sent this report.
            </Typography>
            <Typography
              sx={{
                fontSize: "11.5px",
                color: "#64748b",
                mt: 0.25,
                lineHeight: 1.4,
              }}
            >
              The message content will be safely stored as evidence for review.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3 },
          py: 1.75,
          borderTop: "1px solid rgba(148, 163, 184, 0.12)",
          bgcolor: "rgba(248, 250, 252, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 1.25,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            px: 2.5,
            py: 0.75,
            fontSize: "13px",
            fontWeight: 600,
            color: "#475569",
            borderColor: "rgba(203, 213, 225, 0.8)",
            bgcolor: "#ffffff",
            "&:hover": {
              bgcolor: "rgba(241, 245, 249, 0.8)",
              borderColor: "#94a3b8",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!selectedReason || isSubmitting}
          onClick={handleSubmit}
          endIcon={!isSubmitting ? <ArrowForwardRoundedIcon sx={{ fontSize: 15 }} /> : <CircularProgress size={16} color="inherit" />}
          sx={{
            textTransform: "uppercase",
            borderRadius: "10px",
            px: 2.75,
            py: 0.75,
            fontSize: "12.5px",
            fontWeight: 700,
            color: "#ffffff",
            bgcolor: "#4f46e5",
            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)",
            "&:hover": {
              bgcolor: "#4338ca",
              boxShadow: "0 6px 16px rgba(79, 70, 229, 0.35)",
            },
            "&.Mui-disabled": {
              bgcolor: "rgba(148, 163, 184, 0.22)",
              color: "rgba(148, 163, 184, 0.75)",
              boxShadow: "none",
            },
          }}
        >
          SUBMIT REPORT
        </Button>
      </DialogActions>
    </>
  );
}

export default MessageReport;

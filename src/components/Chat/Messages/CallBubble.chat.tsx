import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import VideocamIcon from "@mui/icons-material/Videocam";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import CallEndIcon from "@mui/icons-material/CallEnd";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { ChatTime } from "../ChatTime/ChatTime.chat";
import { MessageStatus } from "../Status/messageStatus.chat";
import { COLORS } from "../../../utils/Colors";
import { callStatuses, type CallInfoType, type MessageType } from "../../../types/chat/chat.model.type";
import { useDispatch } from "react-redux";
import { openCallModal } from "../../../redux/call.redux";
import { CallSummaryModal } from "./CallSummaryModal.chat";
import callApi from "../../../api/Call.api";
import { enqueueSnackbar } from "notistack";

interface CallBubbleProps {
  msg: MessageType;
  isLeft: boolean;
  shouldShowStatus?: boolean;
  onReCall?: (type: "video" | "voice") => void;
}

const formatDuration = (seconds?: number | null): string => {
  if (!seconds || seconds <= 0) return "";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const padSecs = secs < 10 ? `0${secs}` : `${secs}`;
  const padMins = mins < 10 ? `0${mins}` : `${mins}`;
  return `${padMins}:${padSecs}`;
};

export const CallBubble = ({ msg, isLeft, shouldShowStatus, onReCall }: CallBubbleProps) => {
  const dispatch = useDispatch();
  const callInfo: CallInfoType = msg.callInfo || {};
  const isVideo = callInfo.callType === "video";
  const callType: "video" | "voice" = isVideo ? "video" : "voice";
  const status = (callInfo.status || callStatuses.COMPLETED).toLowerCase();
  const durationText = formatDuration(callInfo.duration);

  // States cho AI Summary Modal
  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  const [currentAiSummary, setCurrentAiSummary] = useState(callInfo.aiSummary || null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const hasTranscript = Boolean(callInfo.hasTranscript || callInfo.aiSummary);

  const handleReCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReCall) {
      onReCall(callType);
    } else {
      dispatch(openCallModal({ type: callType }));
    }
  };

  const handleOpenAISummary = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenSummaryModal(true);
  };

  const handleGenerateAI = async () => {
    if (!callInfo.callId) return;
    try {
      setIsLoadingAI(true);
      const res = await callApi.onGenerateCallAISummary(callInfo.callId);
      if (res.data?.data) {
        setCurrentAiSummary(res.data.data);
        enqueueSnackbar("Đã tạo tóm tắt cuộc gọi bằng AI thành công!", { variant: "success" });
      }
    } catch (err: any) {
      console.error("Lỗi khi tạo tóm tắt AI:", err);
      enqueueSnackbar(err.response?.data?.message || "Không thể tạo tóm tắt AI vào lúc này.", {
        variant: "error",
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Mặc định cho title, statusText và icon
  let titleText = isVideo ? "Video call" : "Voice call";
  let statusText = "";
  let iconComponent = isVideo ? (
    <VideocamIcon sx={{ fontSize: 22 }} />
  ) : (
    <PhoneIcon sx={{ fontSize: 20 }} />
  );

  let iconBgColor = isLeft ? "rgba(99, 102, 241, 0.12)" : "rgba(255, 255, 255, 0.22)";
  let iconColor = isLeft ? "#4f46e5" : "#ffffff";
  const badgeColor = isLeft ? COLORS.textMuted : "rgba(229, 231, 255, 0.85)";

  if (status === callStatuses.MISSED) {
    titleText = isVideo ? "Missed video call" : "Missed voice call";
    statusText = "No answer";
    iconComponent = <PhoneMissedIcon sx={{ fontSize: 20 }} />;
    iconBgColor = isLeft ? "rgba(239, 68, 68, 0.14)" : "rgba(254, 226, 226, 0.28)";
    iconColor = isLeft ? "#ef4444" : "#fca5a5";
  } else if (status === callStatuses.REJECTED) {
    titleText = isVideo ? "Video call declined" : "Voice call declined";
    statusText = "Declined";
    iconComponent = <PhoneDisabledIcon sx={{ fontSize: 20 }} />;
    iconBgColor = isLeft ? "rgba(245, 158, 11, 0.14)" : "rgba(254, 243, 199, 0.28)";
    iconColor = isLeft ? "#d97706" : "#fde047";
  } else if (status === callStatuses.CANCELLED) {
    titleText = isVideo ? "Cancelled video call" : "Cancelled voice call";
    statusText = "Cancelled";
    iconComponent = <CallEndIcon sx={{ fontSize: 20 }} />;
    iconBgColor = isLeft ? "rgba(100, 116, 139, 0.14)" : "rgba(226, 232, 240, 0.28)";
    iconColor = isLeft ? "#64748b" : "#cbd5e1";
  } else if (status === callStatuses.COMPLETED) {
    titleText = isVideo ? "Video call" : "Voice call";
    statusText = durationText ? `${durationText}` : "Call ended";
  } else if (status === callStatuses.RINGING) {
    titleText = isVideo ? "Video call" : "Voice call";
    statusText = "Ringing...";
  } else if (status === callStatuses.ACTIVE) {
    titleText = isVideo ? "Video call" : "Voice call";
    statusText = "Active call";
  } else {
    titleText = isVideo ? "Video call" : "Voice call";
    statusText = status;
  }

  return (
    <>
      <Box
        onClick={handleReCall}
        sx={{
          position: "relative",
          bgcolor: isLeft ? "#ffffff" : "transparent",
          backgroundImage: isLeft
            ? "none"
            : msg.status === "failed"
              ? "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)"
              : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
          border: isLeft ? "1px solid rgba(148, 163, 184, 0.22)" : "none",
          borderRadius: 3,
          px: 2.2,
          py: 1.5,
          minWidth: 230,
          maxWidth: 300,
          opacity: msg.status === "sending" ? 0.78 : 1,
          boxShadow: isLeft
            ? "0 8px 22px rgba(15, 23, 42, 0.07)"
            : msg.status === "failed"
              ? "0 12px 30px rgba(239, 68, 68, 0.25)"
              : "0 12px 30px rgba(79, 70, 229, 0.34)",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          userSelect: "none",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: isLeft
              ? "0 12px 28px rgba(15, 23, 42, 0.12)"
              : "0 14px 34px rgba(79, 70, 229, 0.45)",
            "& .recall-btn": {
              transform: "scale(1.1)",
              bgcolor: isLeft ? "rgba(99, 102, 241, 0.15)" : "rgba(255, 255, 255, 0.28)",
            },
          },
          "&:active": {
            transform: "translateY(0)",
          },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          {/* Icon cuộc gọi */}
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              bgcolor: iconBgColor,
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s ease-in-out",
            }}
          >
            {iconComponent}
          </Box>

          {/* Thông tin cuộc gọi */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 14.5,
                fontWeight: 600,
                color: isLeft ? COLORS.textMain : "#ffffff",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {titleText}
            </Typography>

            <Typography
              sx={{
                fontSize: 12.5,
                fontWeight: 500,
                color: badgeColor,
                mt: 0.25,
              }}
            >
              {statusText}
            </Typography>
          </Box>

          {/* Nút Gọi lại (ReCall) */}
          <Tooltip title={isVideo ? "Gọi lại (Video)" : "Gọi lại (Thoại)"}>
            <IconButton
              size="small"
              className="recall-btn"
              onClick={handleReCall}
              sx={{
                width: 32,
                height: 32,
                color: isLeft ? "#4f46e5" : "#ffffff",
                bgcolor: isLeft ? "rgba(99, 102, 241, 0.08)" : "rgba(255, 255, 255, 0.18)",
                transition: "all 0.2s ease-in-out",
                flexShrink: 0,
              }}
            >
              {isVideo ? (
                <VideocamIcon sx={{ fontSize: 18 }} />
              ) : (
                <PhoneIcon sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Tooltip>
        </Stack>

        {/* ── HIGH-TECH FUTURISTIC AI SUMMARY CHIP ── */}
        {hasTranscript && (
          <Box sx={{ mt: 1.2 }}>
            <Chip
              icon={
                <AutoAwesomeIcon
                  sx={{
                    fontSize: "15px !important",
                    color: isLeft ? "#9333ea !important" : "#e9d5ff !important",
                    animation: "pulse 1.8s infinite ease-in-out",
                  }}
                />
              }
              label={currentAiSummary ? "Xem Tóm Tắt AI ✨" : "Tạo Tóm Tắt AI ✨"}
              size="small"
              onClick={handleOpenAISummary}
              sx={{
                width: "100%",
                height: 28,
                borderRadius: 2,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 11.5,
                letterSpacing: 0.3,
                transition: "all 0.25s ease-in-out",
                bgcolor: isLeft ? "rgba(147, 51, 234, 0.09)" : "rgba(255, 255, 255, 0.16)",
                color: isLeft ? "#7e22ce" : "#ffffff",
                border: isLeft
                  ? "1px solid rgba(147, 51, 234, 0.25)"
                  : "1px solid rgba(255, 255, 255, 0.28)",
                boxShadow: isLeft
                  ? "0 2px 8px rgba(147, 51, 234, 0.1)"
                  : "0 2px 10px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  transform: "scale(1.02)",
                  bgcolor: isLeft ? "rgba(147, 51, 234, 0.18)" : "rgba(255, 255, 255, 0.28)",
                  boxShadow: isLeft
                    ? "0 4px 14px rgba(147, 51, 234, 0.22)"
                    : "0 4px 16px rgba(255, 255, 255, 0.25)",
                },
              }}
            />
          </Box>
        )}

        {/* Thời gian nhắn & trạng thái đã giao / đã đọc */}
        <Box
          sx={{
            display: "flex",
            justifyContent: isLeft ? "flex-start" : "flex-end",
            alignItems: "center",
            gap: 1,
            mt: 1,
            pt: 0.75,
            borderTop: isLeft
              ? "1px solid rgba(241, 245, 249, 0.8)"
              : "1px solid rgba(255, 255, 255, 0.14)",
          }}
        >
          {msg.createdAt && (
            <ChatTime
              createdAt={msg.createdAt}
              color={isLeft ? COLORS.textMuted : "rgba(229, 231, 255, 0.95)"}
              dense
            />
          )}
          {shouldShowStatus && (
            <MessageStatus type="message" status={msg.status} />
          )}
        </Box>
      </Box>

      {/* ── MODAL HIỂN THỊ TÓM TẮT AI ── */}
      <CallSummaryModal
        open={openSummaryModal}
        onClose={() => setOpenSummaryModal(false)}
        aiSummary={currentAiSummary}
        isLoading={isLoadingAI}
        onGenerateAI={handleGenerateAI}
      />
    </>
  );
};

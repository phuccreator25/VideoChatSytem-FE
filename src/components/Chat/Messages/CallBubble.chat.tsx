import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import VideocamIcon from "@mui/icons-material/Videocam";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { ChatTime } from "../ChatTime/ChatTime.chat";
import { MessageStatus } from "../Status/messageStatus.chat";
import { COLORS } from "../../../utils/Colors";
import { callStatuses, type CallInfoType, type MessageType } from "../../../types/chat/chat.model.type";

interface CallBubbleProps {
  msg: MessageType;
  isLeft: boolean;
  shouldShowStatus?: boolean;
}

const formatDuration = (seconds?: number | null): string => {
  if (!seconds || seconds <= 0) return "";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const padSecs = secs < 10 ? `0${secs}` : `${secs}`;
  const padMins = mins < 10 ? `0${mins}` : `${mins}`;
  return `${padMins}:${padSecs}`;
};

export const CallBubble = ({ msg, isLeft, shouldShowStatus }: CallBubbleProps) => {
  const callInfo: CallInfoType = msg.callInfo || {};
  const isVideo = callInfo.callType === "video" || msg.type === "video";
  const status = (callInfo.status || callStatuses.COMPLETED).toLowerCase();
  const durationText = formatDuration(callInfo.duration);

  // Mặc định cho title, statusText và icon
  let titleText = isVideo ? "Video call" : "Voice call";
  let statusText = "";
  let iconComponent = isVideo ? (
    <VideocamIcon sx={{ fontSize: 22 }} />
  ) : (
    <PhoneIcon sx={{ fontSize: 20 }} />
  );

  // Chỉ đổi màu ICON và NỀN ICON theo trạng thái, giữ nguyên màu nền Bubble tin nhắn chuẩn
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
    <Box
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
        minWidth: 220,
        maxWidth: 290,
        opacity: msg.status === "sending" ? 0.78 : 1,
        boxShadow: isLeft
          ? "0 8px 22px rgba(15, 23, 42, 0.07)"
          : msg.status === "failed"
          ? "0 12px 30px rgba(239, 68, 68, 0.25)"
          : "0 12px 30px rgba(79, 70, 229, 0.34)",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        {/* Icon cuộc gọi với màu sắc theo trạng thái */}
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
      </Stack>

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
  );
};

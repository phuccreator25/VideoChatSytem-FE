import { Box, Typography, Avatar, IconButton, Stack, Tooltip } from "@mui/material";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";
import type { ConversationUserInfo } from "../../../types/chat/chat.conversation.type";

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const VideoCallHeader = ({
  userData,
  displayName,
  ui,
  isMobile,
  isRingingState,
  onToggleFullScreen,
  callType,
}: {
  userData?: ConversationUserInfo | null;
  displayName: string;
  ui: {
    isRemoteAudioMuted: boolean;
    isReconnecting: boolean;
    isAccepted: boolean;
    callDuration: number;
    isFullScreen: boolean;
  };
  isMobile: boolean;
  isRingingState: boolean;
  onToggleFullScreen: () => void;
  callType?: string;
}) => {
  const isAudioCall = callType === "voice";

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(to bottom, rgba(7, 8, 14, 0.95) 0%, rgba(7, 8, 14, 0) 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(4px)",
        zIndex: 2,
      }}
    >
      {/* User Status details */}
      <Stack direction="row" spacing={{ xs: 1.25, sm: 1.75 }} alignItems="center">
        <Avatar
          src={userData?.avatar}
          sx={{
            width: { xs: 36, sm: 44 },
            height: { xs: 36, sm: 44 },
            border: isAudioCall ? "2px solid rgba(16, 185, 129, 0.4)" : "2px solid rgba(99, 102, 241, 0.3)",
            boxShadow: isAudioCall ? "0 4px 12px rgba(16, 185, 129, 0.2)" : "0 4px 12px rgba(99, 102, 241, 0.15)",
          }}
        />
        <Box>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Typography
              sx={{ color: "#ffffff", fontWeight: 700, fontSize: { xs: 14, sm: 16 }, letterSpacing: "-0.01em" }}
            >
              {displayName}
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.2,
                borderRadius: "10px",
                bgcolor: isAudioCall ? "rgba(16, 185, 129, 0.15)" : "rgba(99, 102, 241, 0.15)",
                border: isAudioCall ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(99, 102, 241, 0.3)",
                color: isAudioCall ? "#34d399" : "#818cf8",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {isAudioCall ? "Voice Call" : "Video Call"}
            </Box>
            {ui.isRemoteAudioMuted && (
              <Tooltip title="Muted">
                <MicOffRoundedIcon sx={{ color: "#ef4444", fontSize: { xs: 14, sm: 16 } }} />
              </Tooltip>
            )}
          </Stack>
          <Typography
            component="div"
            sx={{
              color: ui.isReconnecting ? "#ef4444" : ui.isAccepted ? "#10b981" : "#f59e0b",
              fontWeight: 700,
              fontSize: { xs: 9, sm: 11 },
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              mt: 0.25,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                bgcolor: ui.isReconnecting ? "#ef4444" : ui.isAccepted ? "#10b981" : "#f59e0b",
                boxShadow: ui.isReconnecting ? "0 0 10px #ef4444" : ui.isAccepted ? "0 0 10px #10b981" : "0 0 10px #f59e0b",
                animation: "blinkDot 1.5s infinite ease-in-out",
                "@keyframes blinkDot": {
                  "0%, 100%": { opacity: 0.4 },
                  "50%": { opacity: 1 },
                }
              }}
            />
            {ui.isReconnecting
              ? "Reconnecting..."
              : ui.isAccepted
                ? `${isMobile ? "" : "Connected • "}${formatDuration(ui.callDuration)}`
                : isRingingState
                  ? "Ringing..."
                  : "Connecting to callee..."}
          </Typography>
        </Box>
      </Stack>

      {/* Top Actions */}
      <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }}>
        {!isMobile && (
          <Tooltip title="Fullscreen">
            <IconButton
              onClick={onToggleFullScreen}
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                bgcolor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                "&:hover": {
                  color: "#ffffff",
                  bgcolor: "rgba(255, 255, 255, 0.12)",
                  transform: "scale(1.05)",
                },
              }}
            >
              {ui.isFullScreen ? (
                <FullscreenExitRoundedIcon />
              ) : (
                <FullscreenRoundedIcon />
              )}
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
};

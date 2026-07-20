import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import ScreenShareRoundedIcon from "@mui/icons-material/ScreenShareRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

const controlButtonSx = (active: boolean, isEnd: boolean = false) => ({
  width: { xs: 44, sm: 52 },
  height: { xs: 44, sm: 52 },
  borderRadius: "50%",
  bgcolor: isEnd
    ? "rgba(239, 68, 68, 0.15)"
    : active
      ? "rgba(255, 255, 255, 0.95)"
      : "rgba(255, 255, 255, 0.05)",
  color: isEnd ? "#ef4444" : active ? "#0b0c14" : "#ffffff",
  border: isEnd
    ? "1px solid rgba(239, 68, 68, 0.3)"
    : active
      ? "1px solid #ffffff"
      : "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
  "& .MuiSvgIcon-root": {
    fontSize: { xs: 20, sm: 24 },
  },
  "&:hover": {
    bgcolor: isEnd
      ? "#ef4444"
      : active
        ? "#ffffff"
        : "rgba(255, 255, 255, 0.15)",
    color: isEnd ? "#ffffff" : active ? "#0b0c14" : "#ffffff",
    transform: "scale(1.1) translateY(-2px)",
    boxShadow: isEnd
      ? "0 8px 24px rgba(239, 68, 68, 0.35)"
      : active
        ? "0 8px 24px rgba(255, 255, 255, 0.2)"
        : "0 8px 24px rgba(99, 102, 241, 0.15)",
    borderColor: isEnd ? "#ef4444" : active ? "#ffffff" : "rgba(99, 102, 241, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  }
});

export const VideoCallControls = ({
  ui,
  handler,
  handleClose,
  callType,
}: {
  ui: {
    isAudioMuted: boolean;
    isVideoStopped: boolean;
    isScreenSharing: boolean;
  };
  handler: {
    toggleAudio: () => void;
    toggleVideo: () => void;
    toggleShareScreen: () => void;
    setIsScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
    endCall: () => void;
  };
  handleClose: () => void;
  callType?: string;
}) => {
  const isAudioCall = callType === "voice";
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        display: "flex",
        justifyContent: "center",
        background: "linear-gradient(to top, rgba(7, 8, 14, 0.95) 0%, rgba(7, 8, 14, 0) 100%)",
        zIndex: 2,
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 0.75, sm: 1.5, md: 2.5 }}
        alignItems="center"
        sx={{
          px: { xs: 1.25, sm: 2.5, md: 3.5 },
          py: { xs: 1.25, sm: 1.75 },
          borderRadius: "32px",
          bgcolor: "rgba(15, 18, 30, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(30px)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Audio Toggle button */}
        <Tooltip title={ui.isAudioMuted ? "Unmute Mic" : "Mute Mic"}>
          <IconButton
            onClick={handler.toggleAudio}
            sx={controlButtonSx(ui.isAudioMuted)}
          >
            {ui.isAudioMuted ? <MicOffRoundedIcon /> : <MicRoundedIcon />}
          </IconButton>
        </Tooltip>

        {/* Video Camera Toggle button (Chỉ hiển thị khi Video call) */}
        {!isAudioCall && (
          <Tooltip title={ui.isVideoStopped ? "Turn Cam On" : "Turn Cam Off"}>
            <IconButton
              onClick={handler.toggleVideo}
              sx={controlButtonSx(ui.isVideoStopped)}
            >
              {ui.isVideoStopped ? <VideocamOffRoundedIcon /> : <VideocamRoundedIcon />}
            </IconButton>
          </Tooltip>
        )}

        {/* Screen Share toggle button (Chỉ hiển thị khi Video call) */}
        {!isAudioCall && (
          <Tooltip title={ui.isScreenSharing ? "Stop sharing" : "Share screen"}>
            <IconButton
              onClick={handler.toggleShareScreen}
              sx={{
                ...controlButtonSx(ui.isScreenSharing),
                ...(ui.isScreenSharing && {
                  bgcolor: "rgba(168, 85, 247, 0.95)",
                  color: "#ffffff",
                  borderColor: "#a855f7",
                  boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
                }),
              }}
            >
              <ScreenShareRoundedIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* Settings button */}
        <Tooltip title="Device Settings">
          <IconButton sx={controlButtonSx(false)}>
            <SettingsRoundedIcon />
          </IconButton>
        </Tooltip>

        {/* End Call / Cup may */}
        <Tooltip title="End Call">
          <IconButton
            onClick={() => {
              handler.endCall();
              handleClose();
            }}
            sx={controlButtonSx(false, true)}
          >
            <CallEndRoundedIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

import { Box, Typography, Avatar } from "@mui/material";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";

export const LocalVideoPreview = ({
  ui,
  myAvatar,
  localVideoRef,
}: {
  ui: any;
  myAvatar: string;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: { xs: 12, sm: 16 },
        right: { xs: 12, sm: 16 },
        width: { xs: 90, sm: ui.isFullScreen ? 200 : 160, md: ui.isFullScreen ? 240 : 180 },
        height: { xs: 135, sm: ui.isFullScreen ? 150 : 120, md: ui.isFullScreen ? 180 : 135 },
        borderRadius: { xs: "12px", sm: "16px" },
        overflow: "hidden",
        boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(99, 102, 241, 0.1)",
        border: "2px solid rgba(255, 255, 255, 0.12)",
        bgcolor: "#0d0f19",
        transition: "all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
        zIndex: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: ui.isVideoStopped ? "flex" : "none",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#06070a",
          position: "relative",
        }}
      >
        <Avatar
          src={myAvatar}
          alt="You"
          sx={{
            width: { xs: 48, sm: 64 },
            height: { xs: 48, sm: 64 },
            border: "2px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 6,
            right: 6,
            width: 20,
            height: 20,
            borderRadius: "50%",
            bgcolor: "rgba(239, 68, 68, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          <VideocamOffRoundedIcon sx={{ color: "#ffffff", fontSize: 13 }} />
        </Box>
      </Box>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        onContextMenu={(e) => e.preventDefault()}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)", // Mirror effect for webcam
          display: ui.isVideoStopped ? "none" : "block",
          pointerEvents: "none",
        }}
      />
      {/* PIP Badge tag */}
      <Box
        sx={{
          position: "absolute",
          bottom: 8,
          left: 8,
          px: 1.5,
          py: 0.5,
          bgcolor: "rgba(10, 12, 22, 0.75)",
          borderRadius: "8px",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 0.75
        }}
      >
        <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: ui.isVideoStopped ? "#ef4444" : "#10b981" }} />
        <Typography sx={{ color: "#ffffff", fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          You
        </Typography>
        {ui.isAudioMuted && (
          <MicOffRoundedIcon sx={{ color: "#ef4444", fontSize: 12 }} />
        )}
      </Box>
    </Box>
  );
};

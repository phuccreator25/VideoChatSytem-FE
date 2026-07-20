import { Box, Typography, Avatar, Button } from "@mui/material";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import ScreenShareRoundedIcon from "@mui/icons-material/ScreenShareRounded";
import type { ConversationUserInfo } from "../../../types/chat/chat.conversation.type";
import { LocalVideoPreview } from "./LocalVideoPreview";

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const VideoCallMediaView = ({
  ui,
  data,
  handler,
  userData,
  displayName,
  myAvatar,
  localVideoRef,
  isRingingState,
}: {
  ui: any;
  data: any;
  handler: any;
  userData?: ConversationUserInfo | null;
  displayName: string;
  myAvatar: string;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  isRingingState: boolean;
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* 1. Thẻ Audio phát tiếng */}
      {data.remoteStream && (
        <audio
          autoPlay
          muted={!ui.isSpeakerOn}
          ref={(el) => {
            if (el) {
              console.log(
                "🔊 Thẻ Audio đã mount. Stream ID:",
                data?.remoteStream?.id,
                "Tracks:",
                data?.remoteStream?.getTracks().map((t: any) => `${t.kind}: readyState=${t.readyState}, enabled=${t.enabled}`)
              );
              if (el.srcObject !== data.remoteStream) {
                el.srcObject = data.remoteStream;
              }
              el.play()
                .then(() => console.log("🔊 Phát audio từ xa thành công!"))
                .catch((err) =>
                  console.warn("Trình duyệt chặn phát âm thanh tự động:", err)
                );
            } else {
              console.log("🔊 Thẻ Audio bị unmount");
            }
          }}
        />
      )}
      {/* 2. Video nền làm mờ viền */}
      {data.remoteStream && !ui.isRemoteVideoMuted && (
        <video
          autoPlay
          playsInline
          muted
          ref={(el) => {
            if (el && el.srcObject !== data.remoteStream) {
              el.srcObject = data.remoteStream;
            }
          }}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            inset: 0,
            zIndex: 1,
            filter: "blur(30px) brightness(0.4)",
            pointerEvents: "none",
          }}
        />
      )}
      {/* 3. Video chính hiển thị hình ảnh */}
      {data.remoteStream && !ui.isRemoteVideoMuted && (
        <video
          autoPlay
          playsInline
          muted
          ref={(el) => {
            if (el && el.srcObject !== data.remoteStream) {
              el.srcObject = data.remoteStream;
            }
          }}
          onLoadedMetadata={(e) => {
            e.currentTarget.play().catch((err) => console.warn(err));
          }}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            width: "100%",
            height: "100%",
            objectFit: ui.isSharingScreen
              ? "contain"
              : /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
              ? "cover"
              : "contain",
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Floating remote mic-muted indicator on top of video */}
      {data.remoteStream && !ui.isRemoteVideoMuted && ui.isRemoteAudioMuted && (
        <Box
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: "12px",
            bgcolor: "rgba(239, 68, 68, 0.25)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <MicOffRoundedIcon sx={{ color: "#ef4444", fontSize: 18 }} />
          <Typography sx={{ color: "#ffffff", fontSize: 12, fontWeight: 600 }}>
            {displayName} is muted
          </Typography>
        </Box>
      )}

      {/* Floating Local Screen Sharing Badge Overlay */}
      {ui.isScreenSharing && (
        <Box
          sx={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 14,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2.5,
            py: 1,
            borderRadius: "24px",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(168, 85, 247, 0.35) 100%)",
            border: "1px solid rgba(168, 85, 247, 0.5)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          <ScreenShareRoundedIcon sx={{ color: "#a855f7", fontSize: 20, animation: "pulseShare 1.5s infinite ease-in-out", "@keyframes pulseShare": { "0%, 100%": { opacity: 0.6 }, "50%": { opacity: 1 } } }} />
          <Typography sx={{ color: "#ffffff", fontSize: 12, fontWeight: 700, letterSpacing: "0.02em" }}>
            You are sharing your screen
          </Typography>
          <Button
            size="small"
            onClick={handler.toggleShareScreen}
            sx={{
              ml: 0.5,
              px: 1.5,
              py: 0.25,
              fontSize: 10,
              fontWeight: 700,
              borderRadius: "12px",
              bgcolor: "rgba(239, 68, 68, 0.85)",
              color: "#ffffff",
              textTransform: "none",
              minWidth: 0,
              "&:hover": {
                bgcolor: "#ef4444",
              }
            }}
          >
            Stop
          </Button>
        </Box>
      )}

      {/* Floating Remote Screen Sharing Badge Overlay */}
      {ui.isRemoteScreenSharing && (
        <Box
          sx={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 14,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2.5,
            py: 1,
            borderRadius: "24px",
            background: "linear-gradient(135deg, rgba(6, 182, 212, 0.35) 0%, rgba(59, 130, 246, 0.35) 100%)",
            border: "1px solid rgba(6, 182, 212, 0.5)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          <ScreenShareRoundedIcon sx={{ color: "#06b6d4", fontSize: 20, animation: "pulseShare 1.5s infinite ease-in-out", "@keyframes pulseShare": { "0%, 100%": { opacity: 0.6 }, "50%": { opacity: 1 } } }} />
          <Typography sx={{ color: "#ffffff", fontSize: 12, fontWeight: 700, letterSpacing: "0.02em" }}>
            {displayName} is sharing their screen
          </Typography>
        </Box>
      )}

      {/* Floating Reconnecting indicator when network stutters */}
      {ui.isReconnecting && (
        <Box
          sx={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 15,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2.5,
            py: 1,
            borderRadius: "20px",
            bgcolor: "rgba(245, 158, 11, 0.25)",
            border: "1px solid rgba(245, 158, 11, 0.5)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(245, 158, 11, 0.2)",
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#f59e0b",
              boxShadow: "0 0 10px #f59e0b",
              animation: "pulseWarning 1s infinite ease-in-out",
              "@keyframes pulseWarning": {
                "0%, 100%": { opacity: 0.3 },
                "50%": { opacity: 1 },
              }
            }}
          />
          <Typography sx={{ color: "#ffffff", fontSize: 12, fontWeight: 700, letterSpacing: "0.02em" }}>
            {ui.connectionStatusText || "Đang kết nối lại..."}
          </Typography>
        </Box>
      )}

      {/* HIỂN THỊ GIAO DIỆN CONCEPT 1 (GLASSMORPHISM HOLOGRAM) KHI TẮT CAMERA HOẶC CHƯA KẾT NỐI */}
      {(!data.remoteStream || ui.isRemoteVideoMuted) && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 2, sm: 3 },
            zIndex: 2,
            width: "100%",
            px: 3,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                inset: { xs: -15, sm: -25 },
                borderRadius: "50%",
                border: "1.5px dashed rgba(6, 182, 212, 0.4)",
                boxShadow: "0 0 15px rgba(6, 182, 212, 0.2)",
                animation: "spinRadar 25s linear infinite",
                "@keyframes spinRadar": {
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />

            <Box
              sx={{
                position: "absolute",
                inset: { xs: -10, sm: -15 },
                borderRadius: "50%",
                border: "2px solid rgba(99, 102, 241, 0.4)",
                boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
                animation: "pulseGlow 2s ease-in-out infinite",
                "@keyframes pulseGlow": {
                  "0%, 100%": { transform: "scale(0.95)", opacity: 0.6 },
                  "50%": { transform: "scale(1.05)", opacity: 1 },
                },
              }}
            />

            <Avatar
              src={userData?.avatar}
              alt={displayName}
              sx={{
                width: { xs: 96, sm: 140 },
                height: { xs: 96, sm: 140 },
                border: "3px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 25px rgba(99, 102, 241, 0.2)",
                position: "relative",
                zIndex: 1,
              }}
            />

            {ui.isRemoteAudioMuted && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: { xs: 28, sm: 36 },
                  height: { xs: 28, sm: 36 },
                  borderRadius: "50%",
                  bgcolor: "#ef4444",
                  border: "2px solid #07080e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 10px rgba(239, 68, 68, 0.6)",
                  zIndex: 2,
                }}
              >
                <MicOffRoundedIcon sx={{ color: "#ffffff", fontSize: { xs: 16, sm: 20 } }} />
              </Box>
            )}
          </Box>

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography
              sx={{
                color: "#ffffff",
                fontSize: { xs: 20, sm: 24 },
                fontWeight: 800,
                letterSpacing: "-0.02em",
                textShadow: "0 4px 12px rgba(0,0,0,0.8)",
                mb: 1
              }}
            >
              {displayName}
            </Typography>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.5,
                borderRadius: "20px",
                bgcolor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: !ui.isAccepted
                    ? "#f97316"
                    : ui.isRemoteAudioMuted
                      ? "#f97316"
                      : "#10b981",
                  boxShadow: !ui.isAccepted
                    ? "0 0 8px #f97316"
                    : ui.isRemoteAudioMuted
                      ? "0 0 8px #f97316"
                      : "0 0 8px #10b981",
                }}
              />
              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: { xs: 11, sm: 12 },
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                {!ui.isAccepted
                  ? isRingingState
                    ? "Ringing..."
                    : "Connecting to the callee..."
                  : ui.isRemoteVideoMuted
                    ? `Video Paused (${formatDuration(ui.callDuration)})`
                    : formatDuration(ui.callDuration)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Local Video Preview */}
      <LocalVideoPreview ui={ui} myAvatar={myAvatar} localVideoRef={localVideoRef} />
    </Box>
  );
};

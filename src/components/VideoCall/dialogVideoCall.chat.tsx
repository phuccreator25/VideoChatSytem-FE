import { useEffect, useRef, useState } from "react";
import { useVideoCall } from "../../hooks/Call/videoCall.hook";
import {
    Dialog,
    Box,
    Typography,
    Avatar,
    IconButton,
    Stack,
    Tooltip,
} from "@mui/material";

// Icons
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import ScreenShareRoundedIcon from "@mui/icons-material/ScreenShareRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import type { ConversationUserInfo } from "../../types/chat/chat.conversation.type";

export const VideoCallModal = ({
    isOpen,
    handleClose,
    userData,
}: {
    isOpen: boolean;
    handleClose: () => void;
    userData?: ConversationUserInfo | null;
}) => {
    const { startCallSession, localVideoRef, openUserMedia, closeUserMedia, toggleAudio, toggleVideo, endCall, remoteStream, remoteVideoRef, localStream } = useVideoCall();

    // UI States
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);

    // State theo dõi trạng thái bật/tắt thiết bị của đối phương (Mic/Camera)
    const [isRemoteVideoMuted, setIsRemoteVideoMuted] = useState(false);
    const [isRemoteAudioMuted, setIsRemoteAudioMuted] = useState(false);
    const remoteBgVideoRef = useRef<HTMLVideoElement | null>(null);

    // Lắng nghe sự kiện track của đối phương để cập nhật giao diện thời gian thực
    useEffect(() => {
        if (!remoteStream) {
            setIsRemoteVideoMuted(false);
            setIsRemoteAudioMuted(false);
            return;
        }

        // Hàm cập nhật trạng thái thiết bị dựa trên việc track có tồn tại hay không
        const updateTrackStates = () => {
            const videoTrack = remoteStream.getVideoTracks()[0];
            const audioTrack = remoteStream.getAudioTracks()[0];

            // Nếu không có track hoặc track bị tắt/mute thì coi như đối phương đã tắt thiết bị đó
            setIsRemoteVideoMuted(!videoTrack || !videoTrack.enabled || videoTrack.muted);
            setIsRemoteAudioMuted(!audioTrack || !audioTrack.enabled || audioTrack.muted);
        };

        // Khởi chạy cập nhật trạng thái ban đầu ngay khi nhận được remoteStream
        updateTrackStates();

        const videoTrack = remoteStream.getVideoTracks()[0];
        const audioTrack = remoteStream.getAudioTracks()[0];

        // Lắng nghe sự kiện mute/unmute của các track
        const handleVideoMute = () => setIsRemoteVideoMuted(true);
        const handleVideoUnmute = () => setIsRemoteVideoMuted(false);
        const handleAudioMute = () => setIsRemoteAudioMuted(true);
        const handleAudioUnmute = () => setIsRemoteAudioMuted(false);

        if (videoTrack) {
            videoTrack.addEventListener("mute", handleVideoMute);
            videoTrack.addEventListener("unmute", handleVideoUnmute);
        }

        if (audioTrack) {
            audioTrack.addEventListener("mute", handleAudioMute);
            audioTrack.addEventListener("unmute", handleAudioUnmute);
        }

        // Lắng nghe sự kiện stream thay đổi cấu trúc track (đối phương thêm/bớt track camera/mic)
        remoteStream.addEventListener("addtrack", updateTrackStates);
        remoteStream.addEventListener("removetrack", updateTrackStates);

        // Dọn dẹp listener khi unmount hoặc remoteStream thay đổi
        return () => {
            if (videoTrack) {
                videoTrack.removeEventListener("mute", handleVideoMute);
                videoTrack.removeEventListener("unmute", handleVideoUnmute);
            }
            if (audioTrack) {
                audioTrack.removeEventListener("mute", handleAudioMute);
                audioTrack.removeEventListener("unmute", handleAudioUnmute);
            }
            remoteStream.removeEventListener("addtrack", updateTrackStates);
            remoteStream.removeEventListener("removetrack", updateTrackStates);
        };
    }, [remoteStream]);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, isVideoOff]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
        if (remoteBgVideoRef.current && remoteStream) {
            remoteBgVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    useEffect(() => {
        const initCall = async () => {
            if (isOpen) {
                try {
                    const stream = await openUserMedia("video");
                    if (stream) {
                        // Tự động phân tích vai trò và kết nối
                        await startCallSession(stream);
                    }
                } catch (err) {
                    console.error("Failed to initialize call:", err);
                }
            } else {
                closeUserMedia();
            }
        };

        initCall();
    }, [isOpen]);

    const displayName = userData?.nickname ?? userData?.fullname ?? "User";

    // Common Control Button Styling (Futuristic cyber pill button style)
    const controlButtonSx = (active: boolean, isEnd: boolean = false) => ({
        width: { xs: 40, sm: 52 },
        height: { xs: 40, sm: 52 },
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

    return (
        <Dialog
            open={isOpen}
            fullScreen={isFullScreen}
            maxWidth={false}
            PaperProps={{
                sx: {
                    borderRadius: isFullScreen ? 0 : { xs: 0, sm: "24px" },
                    overflow: "hidden",
                    boxShadow: "0 32px 80px rgba(0, 0, 0, 0.6), 0 0 50px rgba(99, 102, 241, 0.05)",
                    border: isFullScreen ? "none" : { xs: "none", sm: "1px solid rgba(255, 255, 255, 0.08)" },
                    bgcolor: "#07080e",
                    width: isFullScreen ? "100vw" : { xs: "100vw", sm: 840 },
                    height: isFullScreen ? "100vh" : { xs: "100dvh", sm: 560 },
                    minWidth: isFullScreen ? "100vw" : { xs: "100vw", sm: 480 },
                    minHeight: isFullScreen ? "100vh" : { xs: "100dvh", sm: 360 },
                    maxWidth: "100vw",
                    maxHeight: "100dvh",
                    resize: isFullScreen ? "none" : "both",
                    transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                },
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    background: "radial-gradient(circle at 50% 50%, #0e111d 0%, #06070b 100%)",
                }}
            >
                {/* Decorative Tech Grid */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
                        backgroundSize: "24px 24px",
                        pointerEvents: "none",
                        opacity: 0.8,
                    }}
                />

                {/* Resize corner indicator (only shown when not fullscreen) */}
                {!isFullScreen && (
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 6,
                            right: 6,
                            width: 14,
                            height: 14,
                            pointerEvents: "none",
                            zIndex: 10,
                            opacity: 0.3,
                            borderRight: "2px solid rgba(255, 255, 255, 0.4)",
                            borderBottom: "2px solid rgba(255, 255, 255, 0.4)",
                            borderBottomRightRadius: "2px",
                        }}
                    />
                )}

                {/* Pulsing radar effect background when waiting */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0.5,
                        zIndex: 0,
                    }}
                >
                    <Box
                        sx={{
                            width: 280,
                            height: 280,
                            borderRadius: "50%",
                            border: "1.5px dashed rgba(99, 102, 241, 0.15)",
                            animation: "spinRadar 40s linear infinite",
                            position: "absolute",
                            "@keyframes spinRadar": {
                                "100%": { transform: "rotate(360deg)" },
                            },
                        }}
                    />
                    <Box
                        sx={{
                            width: 440,
                            height: 440,
                            borderRadius: "50%",
                            border: "1.5px dashed rgba(6, 182, 212, 0.08)",
                            animation: "spinRadarRev 60s linear infinite",
                            position: "absolute",
                            "@keyframes spinRadarRev": {
                                "100%": { transform: "rotate(-360deg)" },
                            },
                        }}
                    />
                </Box>

                {/* Top Header / Bar (Cyberpunk overlay bar) */}
                <Box
                    sx={{
                        p: 3,
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
                    <Stack direction="row" spacing={1.75} alignItems="center">
                        <Avatar
                            src={userData?.avatar}
                            sx={{
                                width: 44,
                                height: 44,
                                border: "2px solid rgba(99, 102, 241, 0.3)",
                                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)",
                            }}
                        />
                        <Box>
                            <Typography
                                sx={{ color: "#ffffff", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}
                            >
                                {displayName}
                            </Typography>
                            <Typography
                                component="div"
                                sx={{
                                    color: "#10b981",
                                    fontWeight: 700,
                                    fontSize: 11,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    mt: 0.25,
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        bgcolor: "#10b981",
                                        boxShadow: "0 0 10px #10b981",
                                        animation: "blinkDot 1.5s infinite ease-in-out",
                                        "@keyframes blinkDot": {
                                            "0%, 100%": { opacity: 0.4 },
                                            "50%": { opacity: 1 },
                                        }
                                    }}
                                />
                                Calling...
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Top Actions */}
                    <Stack direction="row" spacing={1.5}>
                        <Tooltip title="Fullscreen">
                            <IconButton
                                onClick={() => setIsFullScreen((prev) => !prev)}
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
                                {isFullScreen ? (
                                    <FullscreenExitRoundedIcon />
                                ) : (
                                    <FullscreenRoundedIcon />
                                )}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Close View">
                            <IconButton
                                onClick={handleClose}
                                sx={{
                                    color: "#ef4444",
                                    bgcolor: "rgba(239, 68, 68, 0.1)",
                                    border: "1px solid rgba(239, 68, 68, 0.15)",
                                    "&:hover": {
                                        color: "#ffffff",
                                        bgcolor: "#ef4444",
                                        transform: "scale(1.05)",
                                    },
                                }}
                            >
                                <CloseRoundedIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>

                {/* Central Display Area */}
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
                    {/* Background video làm hiệu ứng mờ viền khi đối phương dùng mobile dọc */}
                    <video
                        ref={remoteBgVideoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            position: "absolute",
                            inset: 0,
                            zIndex: 1,
                            filter: "blur(30px) brightness(0.4)", // Hiệu ứng làm mờ và giảm độ sáng làm nền
                            display: (remoteStream && !isRemoteVideoMuted) ? "block" : "none", // Chỉ hiện khi có luồng video
                        }}
                    />

                    {/* Foreground video chính hiển thị đúng tỉ lệ gốc (Portrait/Landscape) không bị cắt xén */}
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        muted={!isSpeakerOn}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain", // Giữ nguyên tỉ lệ tự nhiên của camera đối phương
                            position: "absolute",
                            inset: 0,
                            zIndex: 2, // Đặt đè lên trên lớp video nền blur
                            display: (remoteStream && !isRemoteVideoMuted) ? "block" : "none", // Ẩn video đi nếu đối phương tắt cam
                        }}
                    />

                    {/* HIỂN THỊ GIAO DIỆN CONCEPT 1 (GLASSMORPHISM HOLOGRAM) KHI TẮT CAMERA HOẶC CHƯA KẾT NỐI */}
                    {(!remoteStream || isRemoteVideoMuted) && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: { xs: 2, sm: 3 }, // Khoảng cách co giãn theo màn hình (2 đơn vị cho mobile, 3 đơn vị cho desktop)
                                zIndex: 2,
                                width: "100%",
                                px: 3,
                            }}
                        >
                            <Box sx={{ position: "relative" }}>
                                {/* Vòng tròn Neon màu Cyan phát sáng xoay tròn mờ ảo phía ngoài cùng */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: { xs: -15, sm: -25 }, // Khoảng cách co giãn so với tâm avatar
                                        borderRadius: "50%",
                                        border: "1.5px dashed rgba(6, 182, 212, 0.4)", // Viền nét đứt màu cyan neon
                                        boxShadow: "0 0 15px rgba(6, 182, 212, 0.2)", // Hiệu ứng tỏa sáng nhẹ
                                        animation: "spinRadar 25s linear infinite", // Xoay tròn liên tục
                                        "@keyframes spinRadar": {
                                            "100%": { transform: "rotate(360deg)" },
                                        },
                                    }}
                                />

                                {/* Vòng tròn Neon màu Purple co giãn (Pulsing) tạo hiệu ứng sóng âm ảo */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: { xs: -10, sm: -15 }, // Khoảng cách co giãn so với tâm avatar
                                        borderRadius: "50%",
                                        border: "2px solid rgba(99, 102, 241, 0.4)", // Viền màu purple neon
                                        boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
                                        animation: "pulseGlow 2s ease-in-out infinite", // Hiệu ứng đập theo nhịp thở
                                        "@keyframes pulseGlow": {
                                            "0%, 100%": { transform: "scale(0.95)", opacity: 0.6 },
                                            "50%": { transform: "scale(1.05)", opacity: 1 },
                                        },
                                    }}
                                />

                                {/* Avatar của User đặt ở chính giữa */}
                                <Avatar
                                    src={userData?.avatar}
                                    alt={displayName}
                                    sx={{
                                        width: { xs: 96, sm: 140 }, // Chiều rộng co giãn: 96px trên Mobile, 140px trên Desktop
                                        height: { xs: 96, sm: 140 }, // Chiều cao co giãn
                                        border: "3px solid rgba(255, 255, 255, 0.15)", // Viền trắng mờ tinh tế
                                        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 25px rgba(99, 102, 241, 0.2)", // Bóng đổ có chiều sâu
                                        position: "relative",
                                        zIndex: 1,
                                    }}
                                />

                                {/* Nhãn Mic tắt (Muted badge) màu đỏ hiển thị đè lên góc dưới bên phải Avatar */}
                                {((!remoteStream && isMuted) || (remoteStream && isRemoteAudioMuted)) && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 0,
                                            right: 0,
                                            width: { xs: 28, sm: 36 }, // Kích thước vòng tròn nhỏ
                                            height: { xs: 28, sm: 36 },
                                            borderRadius: "50%",
                                            bgcolor: "#ef4444", // Màu nền đỏ neon cảnh báo tắt mic
                                            border: "2px solid #07080e", // Đường viền tối để tách biệt với avatar chính
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: "0 0 10px rgba(239, 68, 68, 0.6)", // Tỏa sáng đỏ nhẹ
                                            zIndex: 2,
                                        }}
                                    >
                                        <MicOffRoundedIcon sx={{ color: "#ffffff", fontSize: { xs: 16, sm: 20 } }} />
                                    </Box>
                                )}
                            </Box>

                            {/* Tên hiển thị và Nhãn Trạng thái dưới Avatar */}
                            <Box sx={{ textAlign: "center", mt: 1 }}>
                                <Typography
                                    sx={{
                                        color: "#ffffff",
                                        fontSize: { xs: 20, sm: 24 }, // Co giãn tiêu đề: 20px trên mobile, 24px trên desktop
                                        fontWeight: 800,
                                        letterSpacing: "-0.02em",
                                        textShadow: "0 4px 12px rgba(0,0,0,0.8)", // Đổ bóng tạo độ nổi cho chữ
                                        mb: 1
                                    }}
                                >
                                    {displayName}
                                </Typography>

                                {/* Badge trạng thái gương mờ (Glassmorphism status card) */}
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 1,
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: "20px",
                                        bgcolor: "rgba(255, 255, 255, 0.03)", // Nền gương siêu mỏng xuyên thấu
                                        border: "1px solid rgba(255, 255, 255, 0.08)", // Đường viền mảnh màu kính mờ
                                        backdropFilter: "blur(8px)", // Tạo hiệu ứng mờ kính
                                    }}
                                >
                                    {/* Chấm tròn trạng thái hoạt động */}
                                    <Box
                                        sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            // Chấm màu cam khi tắt mic, màu xanh lá cây khi đang kết nối và bật mic
                                            bgcolor: remoteStream
                                                ? (isRemoteAudioMuted ? "#f97316" : "#10b981")
                                                : "#10b981",
                                            boxShadow: remoteStream
                                                ? (isRemoteAudioMuted ? "0 0 8px #f97316" : "0 0 8px #10b981")
                                                : "0 0 8px #10b981",
                                        }}
                                    />
                                    {/* Text thông báo trạng thái */}
                                    <Typography
                                        sx={{
                                            color: "rgba(255, 255, 255, 0.7)",
                                            fontSize: { xs: 11, sm: 12 },
                                            fontWeight: 600,
                                            letterSpacing: "0.05em",
                                        }}
                                    >
                                        {!remoteStream
                                            ? "00:00"
                                            : isRemoteVideoMuted
                                                ? "Video Paused"
                                                : "Connected"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Local Video Preview - Floating PIP Container (Futuristic sharp edge PIP) */}
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 16,
                            right: 16,
                            width: { xs: 90, sm: isFullScreen ? 220 : 180, md: isFullScreen ? 260 : 180 },
                            height: { xs: 135, sm: isFullScreen ? 165 : 135, md: isFullScreen ? 195 : 135 },
                            borderRadius: "16px",
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
                                display: isVideoOff ? "flex" : "none",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "#06070a",
                            }}
                        >
                            <VideocamOffRoundedIcon sx={{ color: "rgba(255,255,255,0.25)", fontSize: 32 }} />
                        </Box>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transform: "scaleX(-1)", // Mirror effect for webcam
                                display: isVideoOff ? "none" : "block",
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
                            <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: isVideoOff ? "#ef4444" : "#10b981" }} />
                            <Typography sx={{ color: "#ffffff", fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                You
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Bottom Glassmorphic Actions Capsule Control Panel */}
                <Box
                    sx={{
                        p: { xs: 2.5, sm: 4 },
                        display: "flex",
                        justifyContent: "center",
                        background: "linear-gradient(to top, rgba(7, 8, 14, 0.95) 0%, rgba(7, 8, 14, 0) 100%)",
                        zIndex: 2,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={{ xs: 1, sm: 2.5 }}
                        alignItems="center"
                        sx={{
                            px: { xs: 1.5, sm: 3.5 },
                            py: 1.75,
                            borderRadius: "32px",
                            bgcolor: "rgba(15, 18, 30, 0.75)",
                            border: "1px solid rgba(255, 255, 255, 0.05)",
                            backdropFilter: "blur(30px)",
                            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                        }}
                    >
                        {/* Audio Toggle button */}
                        <Tooltip title={isMuted ? "Unmute Mic" : "Mute Mic"}>
                            <IconButton
                                onClick={() => {
                                    setIsMuted((prev) => !prev);
                                    toggleAudio();
                                }}
                                sx={controlButtonSx(isMuted)}
                            >
                                {isMuted ? <MicOffRoundedIcon /> : <MicRoundedIcon />}
                            </IconButton>
                        </Tooltip>

                        {/* Video Camera Toggle button */}
                        <Tooltip title={isVideoOff ? "Turn Cam On" : "Turn Cam Off"}>
                            <IconButton
                                onClick={() => {
                                    setIsVideoOff((prev) => !prev);
                                    toggleVideo();
                                }}
                                sx={controlButtonSx(isVideoOff)}
                            >
                                {isVideoOff ? <VideocamOffRoundedIcon /> : <VideocamRoundedIcon />}
                            </IconButton>
                        </Tooltip>

                        {/* Speaker Toggle button */}
                        <Tooltip title={isSpeakerOn ? "Mute Speaker" : "Unmute Speaker"}>
                            <IconButton
                                onClick={() => setIsSpeakerOn((prev) => !prev)}
                                sx={controlButtonSx(!isSpeakerOn)}
                            >
                                {isSpeakerOn ? <VolumeUpRoundedIcon /> : <VolumeOffRoundedIcon />}
                            </IconButton>
                        </Tooltip>

                        {/* Screen Share toggle button */}
                        <Tooltip title={isScreenSharing ? "Stop sharing" : "Share screen"}>
                            <IconButton
                                onClick={() => setIsScreenSharing((prev) => !prev)}
                                sx={controlButtonSx(isScreenSharing)}
                            >
                                <ScreenShareRoundedIcon />
                            </IconButton>
                        </Tooltip>

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
                                    endCall()
                                    handleClose()
                                }}
                                sx={controlButtonSx(false, true)}
                            >
                                <CallEndRoundedIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>
            </Box>
        </Dialog>
    );
};
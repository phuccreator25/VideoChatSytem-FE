import { useEffect } from "react";
import { useVideoCall } from "../../hooks/Call/videoCall.hook";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Dialog, Box, useTheme, useMediaQuery } from "@mui/material";
import type { ConversationUserInfo } from "../../types/chat/chat.conversation.type";
import { VideoCallHeader } from "./components/VideoCallHeader";
import { VideoCallMediaView } from "./components/VideoCallMediaView";
import { VideoCallControls } from "./components/VideoCallControls";
import { useCallAudioTones } from "./components/useCallAudioTones";

export const VideoCallModal = ({
    isOpen,
    handleClose,
    userData,
}: {
    isOpen: boolean;
    handleClose: () => void;
    userData?: ConversationUserInfo | null;
}) => {
    const { ui, data, handler, refs: { localVideoRef } } = useVideoCall();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const myAvatar = currentUser?.avatar || "";
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const initCall = async () => {
            if (isOpen) {
                let localStream: MediaStream | null = null;

                try {
                    localStream = await handler.openUserMedia("video");
                } catch (err) {
                    console.warn("Không lấy được media cá nhân (vẫn tiếp tục kết nối để nhận từ đối phương):", err);
                }

                try {
                    await handler.startCallSession(localStream, userData?.userId);
                } catch (sessionErr) {
                    console.error("Lỗi nghiêm trọng khi thiết lập session cuộc gọi:", sessionErr);
                }

            } else {
                handler.closeUserMedia();
            }
        };

        initCall();
    }, [isOpen]);

    const isTargetOnline = userData?.isOnline === "online";
    const isRingingState = ui.isRinging || isTargetOnline;

    useCallAudioTones({
        isOpen,
        isAccepted: ui.isAccepted,
        isRingingState,
    });

    const displayName = userData?.nickname ?? userData?.fullname ?? "User";

    return (
        <Dialog
            open={isOpen}
            onClose={() => {
                handler.endCall();
                handleClose();
            }}
            fullScreen={ui.isFullScreen || isMobile}
            maxWidth={false}
            PaperProps={{
                sx: {
                    borderRadius: (ui.isFullScreen || isMobile) ? 0 : { xs: 0, sm: "24px" },
                    overflow: "hidden",
                    boxShadow: "0 32px 80px rgba(0, 0, 0, 0.6), 0 0 50px rgba(99, 102, 241, 0.05)",
                    border: (ui.isFullScreen || isMobile) ? "none" : { xs: "none", sm: "1px solid rgba(255, 255, 255, 0.08)" },
                    bgcolor: "#07080e",
                    width: (ui.isFullScreen || isMobile) ? "100vw" : { xs: "100vw", sm: 840 },
                    height: (ui.isFullScreen || isMobile) ? "100vh" : { xs: "100dvh", sm: 560 },
                    minWidth: (ui.isFullScreen || isMobile) ? "100vw" : { xs: "100vw", sm: 480 },
                    minHeight: (ui.isFullScreen || isMobile) ? "100vh" : { xs: "100dvh", sm: 360 },
                    maxWidth: "100vw",
                    maxHeight: "100dvh",
                    resize: (ui.isFullScreen || isMobile) ? "none" : "both",
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
                {!ui.isFullScreen && (
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

                {/* Top Header */}
                <VideoCallHeader
                    userData={userData}
                    displayName={displayName}
                    ui={ui}
                    isMobile={isMobile}
                    isRingingState={isRingingState}
                    onToggleFullScreen={() => handler.setIsFullScreen((prev: boolean) => !prev)}
                />

                {/* Central Display Area & PIP Preview */}
                <VideoCallMediaView
                    ui={ui}
                    data={data}
                    handler={handler}
                    userData={userData}
                    displayName={displayName}
                    myAvatar={myAvatar}
                    localVideoRef={localVideoRef}
                    isRingingState={isRingingState}
                />

                {/* Bottom Control Panel */}
                <VideoCallControls
                    ui={ui}
                    handler={handler}
                    handleClose={handleClose}
                />
            </Box>
        </Dialog>
    );
};
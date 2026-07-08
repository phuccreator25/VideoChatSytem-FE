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
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";

import type { ConversationUserInfo } from "../../types/chat/chat.conversation.type";

interface RingingCallViewProps {
    isOpen: boolean;
    userData?: ConversationUserInfo | null;
    callType?: "video" | "audio";
    onAccept?: () => void;
    onDecline?: () => void;
}

export const RingingCallView = ({
    isOpen,
    userData,
    callType = "audio",
    onAccept,
    onDecline,
}: RingingCallViewProps) => {
    const displayName = userData?.nickname ?? userData?.fullname ?? "User";
    const isVideo = callType === "video";

    // Theme values depending on call type (futuristic neon colorways)
    const themeColor = isVideo ? "#8b5cf6" : "#06b6d4"; // Purple for Video, Cyan for Audio
    const glowShadow = isVideo
        ? "0 0 25px rgba(139, 92, 246, 0.4), inset 0 0 15px rgba(139, 92, 246, 0.3)"
        : "0 0 25px rgba(6, 182, 212, 0.4), inset 0 0 15px rgba(6, 182, 212, 0.3)";

    return (
        <Dialog
            open={isOpen}
            slotProps={{
                backdrop: {
                    sx: {
                        backdropFilter: "blur(18px)",
                        backgroundColor: "rgba(8, 10, 18, 0.6)",
                    }
                }
            }}
            PaperProps={{
                sx: {
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: isVideo
                        ? "0 32px 80px rgba(139, 92, 246, 0.15), 0 0 40px rgba(0, 0, 0, 0.6)"
                        : "0 32px 80px rgba(6, 182, 212, 0.15), 0 0 40px rgba(0, 0, 0, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    bgcolor: "transparent",
                    width: 360,
                    height: 470,
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                },
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 4.5,
                    boxSizing: "border-box",
                    background: "radial-gradient(circle at 50% 35%, rgba(31, 38, 57, 0.4) 0%, rgba(10, 12, 20, 0.96) 100%)",
                    backdropFilter: "blur(25px)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative Cyber Grid Background Grid */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
                        backgroundSize: "20px 20px",
                        pointerEvents: "none",
                        opacity: 0.7,
                    }}
                />

                {/* Animated Pulsing Tech Glow */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "32%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 240,
                        height: 240,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${themeColor} 0%, transparent 60%)`,
                        opacity: 0.12,
                        animation: "breatheGlow 4s ease-in-out infinite",
                        pointerEvents: "none",
                        "@keyframes breatheGlow": {
                            "0%, 100%": { transform: "translate(-50%, -50%) scale(0.9)", opacity: 0.08 },
                            "50%": { transform: "translate(-50%, -50%) scale(1.2)", opacity: 0.16 },
                        }
                    }}
                />

                {/* Spinning futuristic radar scan ring */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "32%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 160,
                        height: 160,
                        borderRadius: "50%",
                        border: `1.5px dashed rgba(${isVideo ? "139, 92, 246" : "6, 182, 212"}, 0.25)`,
                        animation: "rotateRadar 25s linear infinite",
                        pointerEvents: "none",
                        "@keyframes rotateRadar": {
                            "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
                            "100%": { transform: "translate(-50%, -50%) rotate(360deg)" }
                        }
                    }}
                />

                {/* Outer tech pulse ring */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "32%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 130,
                        height: 130,
                        borderRadius: "50%",
                        border: `1px solid ${themeColor}`,
                        opacity: 0.4,
                        animation: "pulseRing 2.2s cubic-bezier(0.165, 0.84, 0.44, 1) infinite",
                        pointerEvents: "none",
                        "@keyframes pulseRing": {
                            "0%": { transform: "translate(-50%, -50%) scale(0.95)", opacity: 0.8 },
                            "100%": { transform: "translate(-50%, -50%) scale(2.0)", opacity: 0 }
                        }
                    }}
                />

                {/* Top header indicator with micro-pill layout */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 0.5,
                        borderRadius: "20px",
                        bgcolor: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                        zIndex: 1
                    }}
                >
                    <Box
                        sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: themeColor,
                            boxShadow: `0 0 8px ${themeColor}`,
                        }}
                    />
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                        Incoming {isVideo ? "Video" : "Audio"} Call
                    </Typography>
                </Box>

                {/* Middle: Caller Profile & Info */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, zIndex: 1, my: "auto" }}>
                    <Box sx={{ position: "relative" }}>
                        <Avatar
                            src={userData?.avatar}
                            alt={displayName}
                            sx={{
                                width: 104,
                                height: 104,
                                border: "3px solid rgba(255, 255, 255, 0.06)",
                                boxShadow: isVideo
                                    ? "0 16px 40px rgba(139, 92, 246, 0.25)"
                                    : "0 16px 40px rgba(6, 182, 212, 0.25)",
                                animation: "neonPulse 3s infinite ease-in-out",
                                "@keyframes neonPulse": {
                                    "0%": { boxShadow: `0 0 16px rgba(${isVideo ? "139, 92, 246" : "6, 182, 212"}, 0.2)` },
                                    "50%": { boxShadow: `0 0 32px rgba(${isVideo ? "139, 92, 246" : "6, 182, 212"}, 0.65)`, borderColor: themeColor },
                                    "100%": { boxShadow: `0 0 16px rgba(${isVideo ? "139, 92, 246" : "6, 182, 212"}, 0.2)` }
                                }
                            }}
                        />
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 2,
                                right: 2,
                                width: 26,
                                height: 26,
                                borderRadius: "50%",
                                bgcolor: themeColor,
                                border: "3px solid #0a0c14",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                boxShadow: `0 2px 10px rgba(0,0,0,0.5)`,
                            }}
                        >
                            {isVideo ? (
                                <VideocamRoundedIcon sx={{ fontSize: 13 }} />
                            ) : (
                                <MicRoundedIcon sx={{ fontSize: 13 }} />
                            )}
                        </Box>
                    </Box>

                    <Box sx={{ textAlign: "center" }}>
                        <Typography
                            sx={{
                                color: "#ffffff",
                                fontSize: 24,
                                fontWeight: 800,
                                mb: 0.75,
                                letterSpacing: "-0.02em",
                                textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                            }}
                        >
                            {displayName}
                        </Typography>
                        <Typography sx={{
                            color: "rgba(255, 255, 255, 0.45)",
                            fontSize: 13,
                            fontWeight: 600,
                            letterSpacing: "0.02em",
                            animation: "pulseText 2.5s infinite ease-in-out",
                            "@keyframes pulseText": {
                                "0%": { opacity: 0.4, transform: "scale(0.97)" },
                                "50%": { opacity: 0.9, transform: "scale(1)" },
                                "100%": { opacity: 0.4, transform: "scale(0.97)" }
                            }
                        }}>
                            is calling you...
                        </Typography>
                    </Box>
                </Box>

                {/* Bottom Action buttons (Sleek Glassmorphic controllers) */}
                <Stack direction="row" spacing={5} sx={{ width: "100%", justifyContent: "center", zIndex: 1, mb: 1.5 }}>
                    {/* Decline button */}
                    <Tooltip title="Decline">
                        <IconButton
                            onClick={onDecline}
                            sx={{
                                width: 62,
                                height: 62,
                                borderRadius: "50%",
                                bgcolor: "rgba(239, 68, 68, 0.08)",
                                color: "#ef4444",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                                "&:hover": {
                                    bgcolor: "#ef4444",
                                    color: "#ffffff",
                                    transform: "scale(1.1) translateY(-2px)",
                                    boxShadow: "0 12px 30px rgba(239, 68, 68, 0.4)",
                                    borderColor: "#ef4444"
                                },
                                "&:active": {
                                    transform: "scale(0.95)"
                                }
                            }}
                        >
                            <CallEndRoundedIcon sx={{ fontSize: 26 }} />
                        </IconButton>
                    </Tooltip>

                    {/* Accept button */}
                    <Tooltip title="Accept">
                        <IconButton
                            onClick={onAccept}
                            sx={{
                                width: 62,
                                height: 62,
                                borderRadius: "50%",
                                bgcolor: `rgba(${isVideo ? "139, 92, 246" : "6, 182, 212"}, 0.08)`,
                                color: themeColor,
                                border: `1px solid rgba(${isVideo ? "139, 92, 246" : "6, 182, 212"}, 0.2)`,
                                transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                                "&:hover": {
                                    bgcolor: themeColor,
                                    color: "#ffffff",
                                    transform: "scale(1.1) translateY(-2px)",
                                    boxShadow: glowShadow,
                                    borderColor: themeColor
                                },
                                "&:active": {
                                    transform: "scale(0.95)"
                                }
                            }}
                        >
                            {isVideo ? (
                                <VideocamRoundedIcon sx={{ fontSize: 26 }} />
                            ) : (
                                <CallRoundedIcon sx={{ fontSize: 26 }} />
                            )}
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
        </Dialog>
    );
};

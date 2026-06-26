import { useRef, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import { ChatTime } from "../ChatTime/ChatTime.chat";
import { MessageStatus } from "../Status/messageStatus.chat";
import { COLORS } from "../../../utils/Colors";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import { onPinMessageConversation } from "../../../redux/conversation.redux";
import { useParams } from "react-router-dom";
import useDownloadFile from "../../../helpers/downloadFile.helper";

// ── Types ─────────────────────────────────────────────────────────────────
export type VideoBubbleProps = {
    messageId: string;
    key: string | null | undefined;
    src?: string | null;
    thumbnailUrl?: string | null;
    fileName?: string;
    fileSize?: string | number | null;
    status?: string;
    createdAt?: string | Date;
    showStatus?: boolean;
    isLeft: boolean;
    isPinned?: boolean;
    onResend?: () => void;
    onDeleteFailed?: () => void;
};

// ── Helpers ───────────────────────────────────────────────────────────────
const formatDuration = (seconds: number): string => {
    if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
};

const formatFileSize = (size?: string | number | null): string => {
    if (!size) return "";
    const bytes = Number(size);
    if (isNaN(bytes)) return String(size);
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};


// ── Main component ────────────────────────────────────────────────────────
export function VideoBubble({
    messageId,
    key,
    src,
    thumbnailUrl,
    fileName,
    fileSize,
    status,
    createdAt,
    showStatus,
    isLeft,
    isPinned = false,
    onResend,
    onDeleteFailed,
}: VideoBubbleProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [loadError, setLoadError] = useState(false);
    const [hovering, setHovering] = useState(false);

    const isFailed = status === "failed";
    // ✅ fix: was `status === "sending" || "pending"` which is always true
    const isSending = status === "sending" || status === "pending";
    const hasVideo = !!src;

    // ── Design tokens — mirrors MessageItem ───────────────────────────────
    const bubbleBg = isLeft ? "#ffffff" : "transparent";
    const bubbleGradient = isLeft ? "none" : isFailed
        ? "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)"
        : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)";
    const bubbleBorder = isLeft ? "1px solid rgba(148,163,184,0.22)" : "none";
    const bubbleShadow = isLeft
        ? "0 8px 22px rgba(15,23,42,0.07)"
        : isFailed
            ? "0 12px 30px rgba(239,68,68,0.25)"
            : "0 12px 30px rgba(79,70,229,0.32)";

    const barBg = isLeft ? "rgba(255,255,255,0.97)" : "transparent";
    const dividerCol = isLeft ? "rgba(148,163,184,0.14)" : "rgba(255,255,255,0.10)";
    const iconCol = isLeft ? COLORS.textMain : "rgba(224,231,255,0.95)";
    const timeCol = isLeft ? COLORS.textMuted : "rgba(199,210,254,0.85)";
    const trackCol = isLeft ? "#c7d2fe" : "rgba(255,255,255,0.20)";
    const thumbCol = isLeft ? "#4f46e5" : "rgba(255,255,255,0.90)";

    // ── Playback ──────────────────────────────────────────────────────────
    const togglePlay = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;
        if (playing) { v.pause(); setPlaying(false); }
        else { v.play().catch(() => { }); setPlaying(true); }
    }, [playing]);

    const handleTimeUpdate = () => {
        const v = videoRef.current;
        if (!v) return;
        setCurrentTime(v.currentTime);
        setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
    };

    const handleSeek = (_: Event, val: number | number[]) => {
        const v = videoRef.current;
        if (!v || !v.duration) return;
        v.currentTime = ((val as number) / 100) * v.duration;
        setCurrentTime(v.currentTime);
        setProgress(val as number);
    };

    const toggleMute = () => {
        const v = videoRef.current;
        if (!v) return;
        v.muted = !muted;
        setMuted(!muted);
    };

    const openFullscreen = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.requestFullscreen) v.requestFullscreen();
    };

    const dispatch = useDispatch<AppDispatch>();
    const { conversationId } = useParams()
    const { onHandleDownloadFile } = useDownloadFile()

    if (!hasVideo) return null;

    return (
        <Box
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            sx={{
                maxWidth: { xs: 260, sm: 340 },
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: bubbleBg,
                backgroundImage: bubbleGradient,
                border: bubbleBorder,
                boxShadow: bubbleShadow,
                opacity: isSending ? 0.78 : 1,
                transition: "opacity 0.2s",
            }}
        >
            {/* ── Video area ── */}
            <Box sx={{ position: "relative", width: "100%", bgcolor: "#0f0f0f" }}>
                {loadError ? (
                    <Box sx={{ height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
                        <ErrorOutlineRoundedIcon sx={{ fontSize: 32, color: "#f87171" }} />
                        <Typography sx={{ fontSize: 12.5, color: "#fca5a5", fontWeight: 500 }}>
                            Failed to load video
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        component="video"
                        ref={videoRef}
                        src={src}
                        poster={thumbnailUrl || undefined}
                        preload="metadata"
                        playsInline
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                        onEnded={() => setPlaying(false)}
                        onError={() => setLoadError(true)}
                        onClick={togglePlay}
                        sx={{ display: "block", width: "100%", maxHeight: 260, objectFit: "cover", cursor: "pointer" }}
                    />
                )}

                {/* Centre play/pause overlay */}
                {!loadError && (
                    <Box
                        onClick={togglePlay}
                        sx={{
                            position: "absolute", inset: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer",
                            opacity: !playing || hovering ? 1 : 0,
                            transition: "opacity 0.2s",
                            background: "rgba(0,0,0,0.16)",
                        }}
                    >
                        <Box sx={{
                            width: 46, height: 46, borderRadius: "50%",
                            bgcolor: "rgba(255,255,255,0.20)",
                            backdropFilter: "blur(6px)",
                            border: "1.5px solid rgba(255,255,255,0.42)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "transform 0.15s",
                            "&:hover": { transform: "scale(1.1)" },
                        }}>
                            {playing
                                ? <PauseRoundedIcon sx={{ fontSize: 24, color: "#fff" }} />
                                : <PlayArrowRoundedIcon sx={{ fontSize: 26, color: "#fff" }} />}
                        </Box>
                    </Box>
                )}

                {/* ── Pin + Download overlay (top-right, visible on hover) ── */}
                <Box
                    sx={{
                        position: "absolute", top: 7, right: 7,
                        display: "flex", gap: 0.5,
                        opacity: hovering || isPinned ? 1 : 0,
                        transition: "opacity 0.18s",
                        pointerEvents: hovering || isPinned ? "auto" : "none",
                    }}
                >
                    {/* Download */}
                    <Tooltip title="Download" placement="top" arrow>
                        <IconButton
                            size="small"
                            onClick={() => {
                                if (!src) return
                                onHandleDownloadFile(src, fileName)
                            }}
                            sx={{
                                p: 0.55,
                                bgcolor: "rgba(15,15,15,0.55)",
                                backdropFilter: "blur(6px)",
                                border: "1px solid rgba(255,255,255,0.14)",
                                color: "#fff",
                                "&:hover": { bgcolor: "rgba(15,15,15,0.78)" },
                            }}
                        >
                            <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>

                    {/* Pin */}
                    <Tooltip title={isPinned ? "Unpin" : "Pin"} placement="top" arrow>
                        <IconButton
                            size="small"
                            onClick={() => {
                                if (!conversationId) return;
                                dispatch(onPinMessageConversation({ conversationId, messageId, attachmentId: key }))
                            }}
                            sx={{
                                p: 0.55,
                                bgcolor: isPinned
                                    ? "rgba(79,70,229,0.82)"
                                    : "rgba(15,15,15,0.55)",
                                backdropFilter: "blur(6px)",
                                border: isPinned
                                    ? "1px solid rgba(165,180,252,0.5)"
                                    : "1px solid rgba(255,255,255,0.14)",
                                color: "#fff",
                                transition: "background 0.18s, border 0.18s",
                                "&:hover": {
                                    bgcolor: isPinned
                                        ? "rgba(79,70,229,1)"
                                        : "rgba(15,15,15,0.78)",
                                },
                            }}
                        >
                            {isPinned
                                ? <PushPinIcon sx={{ fontSize: 15 }} />
                                : <PushPinOutlinedIcon sx={{ fontSize: 15 }} />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* ── Control bar ── */}
            {!loadError && (
                <Box sx={{ px: 1.25, pt: 0.9, pb: 0.6, bgcolor: barBg }}>
                    <Slider
                        size="small"
                        value={progress}
                        onChange={handleSeek}
                        aria-label="Video progress"
                        sx={{
                            py: 0, mb: 0.2, height: 3, color: thumbCol,
                            "& .MuiSlider-rail": { bgcolor: trackCol, opacity: 1 },
                            "& .MuiSlider-track": { bgcolor: thumbCol, border: "none" },
                            "& .MuiSlider-thumb": {
                                width: 10, height: 10, bgcolor: thumbCol, boxShadow: "none",
                                "&:hover, &.Mui-focusVisible": {
                                    boxShadow: `0 0 0 6px ${isLeft ? "#4f46e526" : "rgba(255,255,255,0.15)"}`,
                                },
                            },
                        }}
                    />

                    <Stack direction="row" alignItems="center" spacing={0.25}>
                        <IconButton size="small" onClick={togglePlay} sx={{ p: 0.3 }}>
                            {playing
                                ? <PauseRoundedIcon sx={{ fontSize: 18, color: iconCol }} />
                                : <PlayArrowRoundedIcon sx={{ fontSize: 18, color: iconCol }} />}
                        </IconButton>

                        <Typography sx={{ fontSize: 11, color: timeCol, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                            {formatDuration(currentTime)} / {formatDuration(duration)}
                        </Typography>

                        <Box sx={{ flex: 1 }} />

                        <IconButton size="small" onClick={toggleMute} sx={{ p: 0.3 }}>
                            {muted
                                ? <VolumeOffRoundedIcon sx={{ fontSize: 16, color: iconCol }} />
                                : <VolumeUpRoundedIcon sx={{ fontSize: 16, color: iconCol }} />}
                        </IconButton>

                        <IconButton size="small" onClick={openFullscreen} sx={{ p: 0.3 }}>
                            <FullscreenRoundedIcon sx={{ fontSize: 17, color: iconCol }} />
                        </IconButton>
                    </Stack>
                </Box>
            )}

            {/* ── Footer: filename · size | pin indicator · time · status ── */}
            <Box
                sx={{
                    px: 1.4, py: 0.85,
                    bgcolor: barBg,
                    borderTop: `1px solid ${dividerCol}`,
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1,
                }}
            >
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ minWidth: 0 }}>
                    <VideocamOutlinedIcon sx={{ fontSize: 13, flexShrink: 0, color: timeCol }} />
                    <Typography noWrap sx={{ fontSize: 11.5, color: timeCol, fontWeight: 500 }}>
                        {fileName || "Video"}
                    </Typography>
                    {fileSize && (
                        <Typography sx={{ fontSize: 11, color: timeCol, flexShrink: 0, opacity: 0.8 }}>
                            · {formatFileSize(fileSize)}
                        </Typography>
                    )}
                </Stack>

                <Stack direction="row" alignItems="center" spacing={0.6} sx={{ flexShrink: 0 }}>
                    {/* Pinned badge in footer */}
                    {isPinned && (
                        <Stack direction="row" alignItems="center" spacing={0.3}
                            sx={{
                                px: 0.8, py: 0.2, borderRadius: 99,
                                bgcolor: isLeft ? "rgba(99,102,241,0.10)" : "rgba(255,255,255,0.12)",
                                border: isLeft ? "1px solid rgba(99,102,241,0.2)" : "1px solid rgba(255,255,255,0.18)",
                            }}
                        >
                            <PushPinIcon sx={{ fontSize: 10, color: isLeft ? "#4f46e5" : "rgba(199,210,254,0.9)" }} />
                            <Typography sx={{ fontSize: 10, color: isLeft ? "#4f46e5" : "rgba(199,210,254,0.9)", fontWeight: 600, lineHeight: 1 }}>
                                Pinned
                            </Typography>
                        </Stack>
                    )}

                    {createdAt && <ChatTime createdAt={createdAt} color={timeCol} dense />}
                    {showStatus && (
                        <MessageStatus
                            type="message"
                            status={status}
                            onResend={onResend}
                            onDeleteFailed={onDeleteFailed}
                        />
                    )}
                </Stack>
            </Box>
        </Box>
    );
}
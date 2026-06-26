import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import type { pinMessages } from "../../../types/chat/chat.conversation.type";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";

function getInitials(name: string) {
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function ContentPreview({ pin }: { pin: pinMessages }) {
    const { type, content, attachments } = pin;

    // Xử lý text
    if (type !== "file" || !attachments?.length) {
        return (
            <Typography noWrap sx={{ fontSize: 12, color: "text.primary" }}>
                {content}
            </Typography>
        );
    }

    const first = attachments[0];
    const remaining = attachments.length - 1;
    const isImage = first.resourceType === "image" || first.mimeType?.startsWith("image/");
    const isVideo = first.resourceType === "video" || first.mimeType?.startsWith("video/");

    if (attachments.length === 1) {
        if (isImage) {
            return (
                <Box sx={{ display: "flex", alignItems: "center", gap: "5px", minWidth: 0 }}>
                    <Box
                        component="img"
                        src={first.fileUrl}
                        alt={first.fileName}
                        sx={{ width: 28, height: 28, borderRadius: 1, objectFit: "cover", flexShrink: 0 }}
                    />
                    <Typography noWrap sx={{ fontSize: 12, color: "text.primary" }}>
                        {first.fileName}
                    </Typography>
                </Box>
            );
        }

        if (isVideo) {
            return (
                <Box sx={{ display: "flex", alignItems: "center", gap: "5px", minWidth: 0 }}>
                    <VideocamOutlinedIcon sx={{ fontSize: 12, color: "text.disabled", flexShrink: 0 }} />
                    <Typography noWrap sx={{ fontSize: 12, color: "text.primary" }}>
                        {first.fileName}
                    </Typography>
                </Box>
            );
        }

        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: "5px", minWidth: 0 }}>
                <AttachFileIcon sx={{ fontSize: 12, color: "text.disabled", flexShrink: 0 }} />
                <Typography
                    noWrap
                    sx={{ fontSize: 12, color: "text.primary", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}
                >
                    {first.fileName}
                </Typography>
            </Box>
        );
    }

    // Nhiều image
    if (isImage) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: "5px", minWidth: 0 }}>
                <Box sx={{ position: "relative", flexShrink: 0 }}>
                    <Box
                        component="img"
                        src={first.fileUrl}
                        alt={first.fileName}
                        sx={{ width: 28, height: 28, borderRadius: 1, objectFit: "cover", display: "block" }}
                    />
                    {remaining > 0 && (
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: 1,
                                bgcolor: "rgba(0,0,0,0.52)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                                +{remaining}
                            </Typography>
                        </Box>
                    )}
                </Box>
                <Typography noWrap sx={{ fontSize: 12, color: "text.primary" }}>
                    {attachments.length} images
                </Typography>
            </Box>
        );
    }

    // Nhiều file  type raw
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "5px", minWidth: 0 }}>
            <AttachFileIcon sx={{ fontSize: 12, color: "text.disabled", flexShrink: 0 }} />
            <Typography noWrap sx={{ fontSize: 12, color: "text.primary" }}>
                {attachments.length} file
            </Typography>
        </Box>
    );
}


export function PinRow({
    pin,
    avatar,
    name,
    isUnpinning,
    onUnpin,
}: {
    pin: pinMessages;
    avatar: string | undefined;
    name: string;
    isUnpinning: boolean;
    onUnpin: (messageId: string,
        attachmentId: string | null) => void;
}) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                py: "4px",
                opacity: isUnpinning ? 0.45 : 1,
                transition: "opacity 0.15s",
            }}
        >
            <Avatar
                src={avatar}
                sx={{ width: 24, height: 24, fontSize: 9, fontWeight: 600, flexShrink: 0 }}
            >
                {!avatar && getInitials(name)}
            </Avatar>

            <Box sx={{ minWidth: 0, flex: 1, display: "flex", alignItems: "center", gap: "5px", overflow: "hidden" }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", flexShrink: 0 }}>
                    {name}:
                </Typography>
                <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                    <ContentPreview pin={pin} />
                </Box>
            </Box>

            <Tooltip title="Unpin" placement="left" arrow>
                <span>
                    <IconButton
                        size="small"
                        disabled={isUnpinning}
                        onClick={() => onUnpin(pin.id, pin.attachmentId)}
                        sx={{
                            width: 20,
                            height: 20,
                            flexShrink: 0,
                            color: "text.disabled",
                            "&:hover": { color: "error.main", bgcolor: "error.light" },
                            transition: "color 0.12s, background 0.12s",
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                </span>
            </Tooltip>
        </Box>
    );
}

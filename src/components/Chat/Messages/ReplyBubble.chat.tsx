import { Box, Stack, Typography } from "@mui/material";
import type { MessageType } from "../../../types/chat.type";
import { COLORS } from "../../../utils/Colors";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

export function ReplyQuoteBubble({
    replyMsg,
    isLeft,
    onClick,
}: {
    replyMsg: MessageType;
    isLeft: boolean;
    onClick?: () => void;
}) {
    const attachments = replyMsg.attachments || [];

    const firstImage = attachments.find(
        (a) =>
            a.resourceType === "image" ||
            String(a.mimeType || "").startsWith("image/"),
    );

    const firstFile = attachments.find(
        (a) =>
            a.resourceType !== "image" &&
            !String(a.mimeType || "").startsWith("image/"),
    );

    const textColor = isLeft ? COLORS.textMuted : "rgba(199, 210, 254, 0.85)";
    const accentColor = isLeft ? "#6366f1" : "rgba(165, 180, 252, 0.9)";

    const renderContent = () => {

        if (replyMsg.type === "text") {
            return (
                <Typography
                    sx={{
                        fontSize: 12.5,
                        color: textColor,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.5,
                        textAlign: "left",
                    }}
                >
                    {replyMsg.content || ""}
                </Typography>
            );
        }

        if (replyMsg.type === "gif") {
            return (
                <Typography sx={{ fontSize: 12.5, color: textColor, textAlign: "left" }}>
                    GIF
                </Typography>
            );
        }

        if (replyMsg.type === "file") {
            if (firstImage) {
                return (
                    <Stack direction="row" spacing={1} alignItems="center">
                        {(firstImage.fileUrl || firstImage.previewUrl) && (
                            <Box
                                component="img"
                                src={String(firstImage.fileUrl || firstImage.previewUrl)}
                                alt=""
                                sx={{ width: 36, height: 36, borderRadius: 1, objectFit: "cover", flexShrink: 0 }}
                            />
                        )}
                        <Typography sx={{ fontSize: 12.5, color: textColor }}>[Image]</Typography>
                    </Stack>
                );
            }

            if (firstFile) {
                return (
                    <Stack direction="row" spacing={0.75} alignItems="center">
                        <InsertDriveFileOutlinedIcon sx={{ fontSize: 15, flexShrink: 0, color: textColor }} />
                        <Typography
                            noWrap
                            sx={{ fontSize: 12.5, color: textColor, textAlign: "left" }}
                        >
                            [File] {firstFile.fileName || ""}
                        </Typography>
                    </Stack>
                );
            }

            if (replyMsg.content) {
                return (
                    <Typography sx={{ fontSize: 12.5, color: textColor, textAlign: "left" }}>
                        {replyMsg.content}
                    </Typography>
                );
            }
        }

        return null;
    };

    return (
        <Box
            onClick={onClick}
            sx={{
                display: "flex",
                alignItems: "stretch",
                mb: 0.5,
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                bgcolor: isLeft ? "rgba(241, 245, 249, 0.85)" : "rgba(55, 48, 163, 0.45)",
                border: isLeft
                    ? "1px solid rgba(148, 163, 184, 0.2)"
                    : "1px solid rgba(99, 102, 241, 0.25)",
                opacity: 0.92,
                "&:hover": { opacity: 1 },
                transition: "opacity 0.15s",
            }}
        >
            {/* border trái tím */}
            <Box sx={{ width: 3, flexShrink: 0, bgcolor: accentColor }} />

            <Stack
                direction="row"
                spacing={0.75}
                alignItems="center"
                sx={{ px: 1, py: 0.75, flex: 1, minWidth: 0 }}
            >
                <FormatQuoteRoundedIcon sx={{ fontSize: 15, flexShrink: 0, color: accentColor }} />

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: accentColor,
                            lineHeight: 1.4,
                            mb: 0.2,
                        }}
                    >
                        {"Reply"}
                    </Typography>
                    {renderContent()}
                </Box>
            </Stack>
        </Box>
    );
}

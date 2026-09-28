import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined";

import type { FileItem } from "../../../../../types/profile/profile.model.type";
import useDownloadFile from "../../../../../helpers/client/downloadFile.helper";
import { getFileVisualMeta, formatFileSize, getFileExtension } from "../../../../../helpers/client/fileType.helper";
import { formatDate } from "../../../../../helpers/formatDate.helper";

export function AttachedFileRow({ item }: { item: FileItem }) {
    const { onHandleDownloadFile } = useDownloadFile();
    const meta = getFileVisualMeta(item.fileName, item.mimeType);

    const ext = getFileExtension(item.fileName);
    const isImage =
        item.mimeType?.startsWith("image/") ||
        ["jpg", "jpeg", "png", "gif", "webp", "svg", "heic", "bmp"].includes(ext);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 1.5,
                borderRadius: 4,
                border: "1px solid rgba(255, 255, 255, 0.5)",
                bgcolor: "rgba(255, 255, 255, 0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.25,
                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.85)",
                    borderColor: "rgba(99, 102, 241, 0.25)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
                },
            }}
        >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                <Avatar
                    src={isImage && item.fileUrl ? item.fileUrl : undefined}
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: meta.soft,
                        color: meta.text,
                        border: `1px solid ${meta.accent}20`,
                        fontSize: 10,
                        fontWeight: 800,
                        "& img": {
                            objectFit: "cover",
                        },
                    }}
                >
                    {meta.extension}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1, textAlign: "left" }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 700,
                            color: "#334155",
                            fontSize: "13px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {item.fileName}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#94a3b8",
                            display: "block",
                            fontSize: "11px",
                            fontWeight: 500,
                        }}
                    >
                        {formatFileSize(item.fileSize)} • {formatDate(item.createdAt)}
                    </Typography>
                </Box>
            </Stack>
            <IconButton
                size="small"
                onClick={() => onHandleDownloadFile(item.fileUrl, item.fileName)}
                sx={{
                    color: "#64748b",
                    "&:hover": { color: "#4f46e5", bgcolor: "rgba(79,70,229,0.05)" },
                    transition: "all 0.2s ease",
                }}
            >
                <DownloadForOfflineOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
        </Paper>
    );
}


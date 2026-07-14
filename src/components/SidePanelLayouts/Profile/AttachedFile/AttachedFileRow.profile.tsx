import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { FileItem } from "../../../../types/profile/profile.model.type";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

export function AttachedFileRow({ item }: { item: FileItem }) {
    const isImage = item.type === 'image';
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.75,
                p: 1.5,
                border: '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: "14px",
                bgcolor: '#ffffff',
                mb: 1.5,
                transition: 'all 0.22s ease',
                '&:hover': {
                    borderColor: 'rgba(99, 102, 241, 0.25)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
                }
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "10px",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isImage ? 'rgba(16, 185, 129, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                    color: isImage ? '#10b981' : '#4f46e5',
                    flexShrink: 0,
                }}
            >
                {isImage ? (
                    <ImageRoundedIcon sx={{ fontSize: 22 }} />
                ) : (
                    <InsertDriveFileRoundedIcon sx={{ fontSize: 22 }} />
                )}
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {item.name}
                </Typography>
                <Typography
                    sx={{
                        mt: 0.25,
                        fontSize: 12,
                        color: '#64748b',
                        fontWeight: 500,
                    }}
                >
                    {item.size}
                </Typography>
            </Box>

            <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                <IconButton
                    size="small"
                    onClick={() => {
                        console.log('download', item.key);
                    }}
                    sx={{
                        color: '#64748b',
                        transition: 'all 0.18s ease',
                        '&:hover': { color: '#4f46e5', bgcolor: 'rgba(79,70,229,0.06)' }
                    }}
                >
                    <DownloadRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>

                <IconButton
                    size="small"
                    onClick={() => {
                        console.log('more', item.key);
                    }}
                    sx={{
                        color: '#64748b',
                        transition: 'all 0.18s ease',
                        '&:hover': { color: '#4f46e5', bgcolor: 'rgba(79,70,229,0.06)' }
                    }}
                >
                    <MoreHorizRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </Stack>
        </Box>
    );
}

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { FileItem } from "../../../../types/data.type";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

export function AttachedFileRow({ item }: { item: FileItem }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                border: '1px solid #ececf3',
                borderRadius: 2.5,
                bgcolor: '#ffffff',
                mb: 1.25,
            }}
        >
            <Box
                sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(111, 99, 246, 0.16)',
                    color: '#6f63f6',
                    flexShrink: 0,
                }}
            >
                {item.type === 'image' ? (
                    <ImageRoundedIcon sx={{ fontSize: 26 }} />
                ) : (
                    <InsertDriveFileRoundedIcon sx={{ fontSize: 26 }} />
                )}
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    sx={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#1f2430',
                        lineHeight: 1.2,
                    }}
                >
                    {item.name}
                </Typography>
                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: 14,
                        color: '#7b8190',
                    }}
                >
                    {item.size}
                </Typography>
            </Box>

            <Stack direction="row" spacing={0.5}>
                <IconButton
                    size="small"
                    onClick={() => {
                        console.log('download', item.key);
                    }}
                    sx={{ color: '#7d84a0' }}
                >
                    <DownloadRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>

                <IconButton
                    size="small"
                    onClick={() => {
                        console.log('more', item.key);
                    }}
                    sx={{ color: '#7d84a0' }}
                >
                    <MoreHorizRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
            </Stack>
        </Box>
    );
}
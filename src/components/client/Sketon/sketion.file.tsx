import { Box, Paper, Skeleton, Stack } from '@mui/material';

export default function AttachedFileSkeletonRow() {
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
            }}
        >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                <Skeleton variant="circular" width={36} height={36} sx={{ flexShrink: 0 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Skeleton variant="text" width="60%" height={18} sx={{ borderRadius: "4px" }} />
                    <Skeleton variant="text" width="40%" height={14} sx={{ mt: 0.25, borderRadius: "4px" }} />
                </Box>
            </Stack>
            <Skeleton variant="circular" width={28} height={28} sx={{ flexShrink: 0 }} />
        </Paper>
    );
}
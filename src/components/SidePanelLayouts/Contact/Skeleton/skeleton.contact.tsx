import { Box, Skeleton } from "@mui/material";

export function ContactRowSkeleton() {
    return (
        <Box
            sx={{
                minHeight: 56,
                borderRadius: 3,
                px: 1.5,
                py: 0.75,
                mb: 0.5,
                display: "flex",
                alignItems: "center",
                bgcolor: "rgba(255, 255, 255, 0.4)",
                border: "1px solid rgba(148, 163, 184, 0.08)",
                opacity: 0.8,
            }}
        >
            <Skeleton
                variant="circular"
                width={36}
                height={36}
                animation="wave"
                sx={{ mr: 1.5, flexShrink: 0, bgcolor: "rgba(0, 0, 0, 0.06)" }}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton
                    variant="text"
                    width="60%"
                    height={16}
                    animation="wave"
                    sx={{ bgcolor: "rgba(0, 0, 0, 0.08)" }}
                />
                <Skeleton
                    variant="text"
                    width="40%"
                    height={12}
                    animation="wave"
                    sx={{ mt: 0.5, bgcolor: "rgba(0, 0, 0, 0.05)" }}
                />
            </Box>

            <Skeleton
                variant="circular"
                width={24}
                height={24}
                animation="wave"
                sx={{ ml: 1, bgcolor: "rgba(0, 0, 0, 0.05)" }}
            />
        </Box>
    );
}
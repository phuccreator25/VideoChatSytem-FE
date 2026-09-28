import { Box, Skeleton, Stack } from "@mui/material";

export function ConversationItemSkeleton() {
    return (
        <Box
            sx={{
                position: 'relative',
                px: 1.5,
                py: 1.6,
                borderRadius: '18px',
                bgcolor: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(148,163,184,0.18)',
                boxShadow: 'none',
                opacity: 0.8,
            }}
        >
            <Stack direction="row" spacing={1.75} alignItems="center">
                <Skeleton
                    variant="circular"
                    width={42}
                    height={42}
                    animation="wave"
                    sx={{ bgcolor: 'rgba(0, 0, 0, 0.06)', flexShrink: 0 }}
                />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1.5}
                    >
                        <Box sx={{ minWidth: 0, flex: 1, justifyItems: 'start' }}>
                            {/* Name skeleton */}
                            <Skeleton
                                variant="text"
                                width="55%"
                                height={16}
                                animation="wave"
                                sx={{ bgcolor: 'rgba(0, 0, 0, 0.08)' }}
                            />

                            {/* Preview text skeleton */}
                            <Skeleton
                                variant="text"
                                width="75%"
                                height={14}
                                animation="wave"
                                sx={{ bgcolor: 'rgba(0, 0, 0, 0.06)', mt: 1 }}
                            />
                        </Box>

                        <Stack alignItems="flex-end" spacing={1}>
                            {/* Time skeleton */}
                            <Skeleton
                                variant="text"
                                width={36}
                                height={12}
                                animation="wave"
                                sx={{ bgcolor: 'rgba(0, 0, 0, 0.06)' }}
                            />
                            <Box sx={{ height: 24 }} />
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}
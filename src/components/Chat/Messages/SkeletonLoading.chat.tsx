import { Box, Skeleton, Stack } from "@mui/material";

export function MessageItemSkeleton({ isLeft }: { isLeft: boolean }) {
    return (
        <Stack
            direction={isLeft ? "row" : "row-reverse"}
            spacing={1.5}
            alignItems="flex-end"
            sx={{ width: "100%", opacity: 0.7 }}
        >
            <Skeleton
                variant="circular"
                width={42}
                height={42}
                animation="wave"
                sx={{
                    bgcolor: isLeft ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.15)",
                    flexShrink: 0,
                }}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isLeft ? "flex-start" : "flex-end",
                    maxWidth: { xs: "75%", sm: "60%" },
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        borderRadius: 3,
                        px: 2.1,
                        py: 1.35,
                        width: "100%",
                        bgcolor: isLeft ? "#ffffff" : "transparent",
                        backgroundImage: isLeft
                            ? "none"
                            : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                        border: isLeft ? "1px solid rgba(148, 163, 184, 0.22)" : "none",
                        boxShadow: isLeft
                            ? "0 8px 22px rgba(15, 23, 42, 0.07)"
                            : "0 12px 30px rgba(79, 70, 229, 0.34)",
                    }}
                >
                    {/* Skeleton lines for text content */}
                    <Skeleton
                        variant="text"
                        width="90%"
                        height={20}
                        animation="wave"
                        sx={{
                            bgcolor: isLeft ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.25)",
                        }}
                    />
                    <Skeleton
                        variant="text"
                        width="65%"
                        height={20}
                        animation="wave"
                        sx={{
                            bgcolor: isLeft ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.25)",
                            mt: 0.5,
                        }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: isLeft ? "flex-start" : "flex-end",
                            mt: 1,
                        }}
                    >
                        <Skeleton
                            variant="text"
                            width={40}
                            height={14}
                            animation="wave"
                            sx={{
                                bgcolor: isLeft ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.2)",
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Stack>
    );
}
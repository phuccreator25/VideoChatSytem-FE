import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Pagination from "@mui/material/Pagination";

import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";

import type { FileItem } from "../../../../types/profile/profile.model.type";
import { AttachedFileRow } from "./AttachedFileRow.profile";

type AttachedFilesSectionProps = {
    files: FileItem[];
    expanded?: boolean;
    page: number;
    totalPage: number;
    loading?: boolean;
    onChange: (newPage: number) => void;
};

function AttachedFileSkeletonRow() {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.75,
                p: 1.5,
                border: "1px solid rgba(148, 163, 184, 0.15)",
                borderRadius: "14px",
                bgcolor: "#ffffff",
                mb: 1.5,
            }}
        >
            <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: "10px", flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton variant="text" width="55%" height={20} sx={{ borderRadius: "4px" }} />
                <Skeleton variant="text" width="25%" height={16} sx={{ mt: 0.5, borderRadius: "4px" }} />
            </Box>
            <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="circular" width={28} height={28} />
            </Stack>
        </Box>
    );
}

export function AttachedFilesSection({
    files,
    page,
    totalPage,
    loading = false,
    onChange
}: AttachedFilesSectionProps) {
    return (
        <Box
            sx={{
                mb: 1.5,
                border: "1px solid rgba(148, 163, 184, 0.15)",
                borderRadius: "16px",
                overflow: "hidden",
                bgcolor: "#ffffff",
                boxShadow: "0 8px 32px rgba(15, 23, 42, 0.02)",
            }}
        >
            <Box
                sx={{
                    minHeight: 52,
                    px: 2.5,
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
                    bgcolor: "rgba(248, 250, 252, 0.5)",
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1.25}>
                    <AttachmentOutlinedIcon sx={{ fontSize: 20, color: "#4f46e5" }} />
                    <Typography
                        sx={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#0f172a",
                        }}
                    >
                        Attached Files
                    </Typography>
                </Stack>
            </Box>

            <Box
                sx={{
                    px: 2.5,
                    pb: 2.5,
                    pt: 2,
                    bgcolor: "#ffffff",
                }}
            >
                {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <AttachedFileSkeletonRow key={index} />
                    ))
                ) : files.length > 0 ? (
                    files.map((item) => (
                        <AttachedFileRow key={item.attachmentId} item={item} />
                    ))
                ) : (
                    <Typography
                        sx={{
                            textAlign: "center",
                            color: "#64748b",
                            fontSize: 14,
                            py: 3,
                        }}
                    >
                        No attached files found
                    </Typography>
                )}
            </Box>
            {totalPage > 1 && (
                <Box
                    sx={{
                        py: 2,
                        px: 2.5,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderTop: "1px solid rgba(148, 163, 184, 0.12)",
                        bgcolor: "rgba(248, 250, 252, 0.3)",
                    }}
                >
                    <Pagination
                        count={totalPage}
                        page={page}
                        onChange={(_event, value) => onChange(value)}
                        shape="rounded"
                        size="medium"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                color: "#475569",
                                borderRadius: "10px",
                                border: "1px solid transparent",
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                    bgcolor: "rgba(79, 70, 229, 0.08)",
                                    color: "#4f46e5",
                                    borderColor: "rgba(79, 70, 229, 0.2)",
                                },
                            },
                            "& .MuiPaginationItem-root.Mui-selected": {
                                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                                color: "#ffffff",
                                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                                },
                            },
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}

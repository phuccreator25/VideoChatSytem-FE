import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";

import type { FileItem } from "../../../../types/profile/profile.model.type";
import { AttachedFileRow } from "./AttachedFileRow.profile";

type AttachedFilesSectionProps = {
    files: FileItem[];
    expanded: boolean;
    onChange: (_event: any, isExpanded: boolean) => void;
};

export function AttachedFilesSection({
    files,
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
                {files.map((item) => (
                    <AttachedFileRow key={item.key} item={item} />
                ))}
            </Box>
        </Box>
    );
}

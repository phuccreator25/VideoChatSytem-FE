import type { SyntheticEvent } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";

import type { FileItem } from "../../../../types/data.type";
import { AttachedFileRow } from "./AttachedFileRow.profile";

type AttachedFilesSectionProps = {
    files: FileItem[];
    expanded: boolean;
    onChange: (_event: SyntheticEvent, isExpanded: boolean) => void;
};

export function AttachedFilesSection({
    files,
    expanded,
    onChange,
}: AttachedFilesSectionProps) {
    return (
        <Accordion
            expanded={expanded}
            onChange={onChange}
            elevation={0}
            disableGutters
            sx={{
                border: "1px solid #ebecef",
                borderRadius: "12px !important",
                overflow: "hidden",
                bgcolor: "#ffffff",
                "&:before": {
                    display: "none",
                },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreRoundedIcon sx={{ color: "#1f2430" }} />}
                sx={{
                    minHeight: 56,
                    px: 2,
                    bgcolor: "#ffffff",
                    "& .MuiAccordionSummary-content": {
                        my: 0,
                    },
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1.25} sx={{ margin: "auto" }}>
                    <AttachmentOutlinedIcon sx={{ fontSize: 20, color: "#1f2430" }} />
                    <Typography
                        sx={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#1f2430",
                        }}
                    >
                        Attached Files
                    </Typography>
                </Stack>
            </AccordionSummary>

            <AccordionDetails
                sx={{
                    px: 2,
                    pb: 2,
                    pt: 1,
                    bgcolor: "#fafbff",
                }}
            >
                {files.map((item) => (
                    <AttachedFileRow key={item.key} item={item} />
                ))}
            </AccordionDetails>
        </Accordion>
    );
}
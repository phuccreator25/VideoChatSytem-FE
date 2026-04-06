import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import styled from "@emotion/styled";

import { customScrollbarSx } from "../../../utils/CustomScroll";
import type { FileItem } from "../../../types/data.type";
import { OpenAvatar } from "./OpenAvatar/OpenAvatar.profile";
import { AboutSection } from "./About/AboutSection.profile";
import { AttachedFilesSection } from "./AttachedFile/AttachedSection.profile";
import { useProfile } from "../../../hooks/Profile/profile.hook";

const attachedFiles: FileItem[] = [
    {
        key: "admin-a",
        name: "Admin-A.zip",
        size: "12.5 MB",
        type: "file",
    },
    {
        key: "image-1",
        name: "Image-1.jpg",
        size: "4.2 MB",
        type: "image",
    },
    {
        key: "image-2",
        name: "Image-2.jpg",
        size: "3.1 MB",
        type: "image",
    },
    {
        key: "landing-a",
        name: "Landing-A.zip",
        size: "6.7 MB",
        type: "file",
    },
];

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

type ExpandedPanel = "about" | "files" | false;

export function MyProfile() {

    const { initialProfile, handleUpdateUser } = useProfile();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [expandedPanel, setExpandedPanel] = useState<ExpandedPanel>(false);
    const [openAvatarReview, setOpenAvatarReview] = useState(false);

    const handleAccordionChange =
        (panel: "about" | "files") =>
        (_event: SyntheticEvent, isExpanded: boolean) => {
            setExpandedPanel(isExpanded ? panel : false);
        };

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        console.log("avatar-file", file);
    };

    return (
        <>
            <Box
                sx={{
                    height: "100%",
                    minHeight: 0,
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        height: "100%",
                        borderRadius: { xs: 0, sm: 4 },
                        bgcolor: "#ffffff",
                        border: { xs: "none", sm: "1px solid #ebecef" },
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box
                        sx={{
                            px: { xs: 2, sm: 3 },
                            pt: { xs: 2, sm: 3 },
                            pb: 2.5,
                            borderBottom: "1px solid #f0f1f4",
                        }}
                    >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography
                                sx={{
                                    fontSize: { xs: 22, sm: 26 },
                                    fontWeight: 700,
                                    color: "#1f2430",
                                    lineHeight: 1.1,
                                }}
                            >
                                My Profile
                            </Typography>
                        </Stack>

                        <Box
                            sx={{
                                pt: 3,
                                pb: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    position: "relative",
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                    "&:hover .avatar-overlay": {
                                        opacity: 1,
                                    },
                                }}
                            >
                                <Avatar
                                    src={initialProfile.avatar}
                                    alt={initialProfile.fullname}
                                    onClick={() => setOpenAvatarReview(true)}
                                    sx={{
                                        width: 96,
                                        height: 96,
                                        border: "3px solid #f2eaf0",
                                        boxShadow: "0 0 0 3px #f8f5f7 inset",
                                    }}
                                />
                            </Box>

                            <OpenAvatar
                                openAvatarPreview={openAvatarReview}
                                setOpenAvatarPreview={setOpenAvatarReview}
                                profile={initialProfile}
                            />

                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload files
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleAvatarChange}
                                    multiple
                                />
                            </Button>

                            <Typography
                                sx={{
                                    mt: 2.25,
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: "#1f2430",
                                    textAlign: "left",
                                }}
                            >
                                {initialProfile.fullname}
                            </Typography>

                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.75 }}>
                                <Box
                                    sx={{
                                        width: 9,
                                        height: 9,
                                        borderRadius: "50%",
                                        bgcolor: "#12c48b",
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        color: "#7b8190",
                                        fontWeight: 500,
                                    }}
                                >
                                    {initialProfile.isActive ? "Active" : "Inactive"}
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            overflowY: "auto",
                            px: { xs: 1.5, sm: 2 },
                            py: { xs: 1.5, sm: 2 },
                            bgcolor: "#fafbff",
                            ...customScrollbarSx,
                        }}
                    >
                        <Typography
                            sx={{
                                px: 1,
                                mb: 2,
                                fontSize: 16,
                                lineHeight: 1.7,
                                color: "#7b8198",
                                textAlign: "center",
                            }}
                        >
                            Update your profile information, manage your avatar, and change your password to better protect your account.
                        </Typography>

                        <AboutSection
                            profile={initialProfile}
                            expanded={expandedPanel === "about"}
                            onChange={handleAccordionChange("about")}
                            onUpdate={handleUpdateUser}
                        />

                        <AttachedFilesSection
                            files={attachedFiles}
                            expanded={expandedPanel === "files"}
                            onChange={handleAccordionChange("files")}
                        />

                        {isMobile && <Box sx={{ height: 12 }} />}
                    </Box>
                </Paper>
            </Box>
        </>
    );
}
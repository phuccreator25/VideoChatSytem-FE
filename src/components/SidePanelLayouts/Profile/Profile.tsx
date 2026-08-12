import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { customScrollbarSx } from "../../../utils/CustomScroll";
import type { FileItem } from "../../../types/profile/profile.model.type";
import { AboutSection } from "./About/AboutSection.profile";
import { AttachedFilesSection } from "./AttachedFile/AttachedSection.profile";
import { useProfile } from "../../../hooks/Profile/profile.hook";
import OpenAvatar from "./OpenAvatar/OpenAvatar.profile";

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

export function MyProfile() {
    const { initialProfile, handleUpdateUser, handleAvatarChange, messageFile, showAlert } = useProfile();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [activeTab, setActiveTab] = useState<number>(0);
    const [openAvatarReview, setOpenAvatarReview] = useState(false);

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
                        border: { xs: "none", sm: "1px solid rgba(148, 163, 184, 0.18)" },
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            px: 3,
                            py: 2.5,
                            borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "18px",
                                fontWeight: 800,
                                color: "#0f172a",
                            }}
                        >
                            My Profile
                        </Typography>
                    </Box>

                    {/* Cover Gradient & Avatar Area */}
                    <Box sx={{ position: "relative" }}>
                        <Box
                            sx={{
                                height: 110,
                                background: "radial-gradient(at 0% 0%, #6366f1 0px, transparent 55%), radial-gradient(at 50% 0%, #a855f7 0px, transparent 55%), radial-gradient(at 100% 0%, #ec4899 0px, transparent 55%)",
                                bgcolor: "#4f46e5",
                            }}
                        />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                pb: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    position: "relative",
                                    mt: -6,
                                    display: "inline-flex",
                                }}
                            >
                                <Avatar
                                    src={initialProfile?.avatar}
                                    alt={initialProfile?.fullname}
                                    onClick={() => setOpenAvatarReview(true)}
                                    sx={{
                                        width: 96,
                                        height: 96,
                                        border: "4px solid #ffffff",
                                        outline: "2.5px solid rgba(79, 70, 229, 0.12)",
                                        boxShadow: "0 8px 28px rgba(15, 23, 42, 0.15)",
                                        cursor: "pointer",
                                        transition: "all 0.25s ease",
                                        "&:hover": {
                                            transform: "scale(1.04)",
                                            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.2)",
                                            outlineColor: "rgba(79, 70, 229, 0.25)",
                                        }
                                    }}
                                />
                                <IconButton
                                    component="label"
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        width: 30,
                                        height: 30,
                                        bgcolor: "#4f46e5",
                                        color: "#ffffff",
                                        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.35)",
                                        border: "2px solid #ffffff",
                                        "&:hover": {
                                            bgcolor: "#4338ca",
                                        },
                                    }}
                                >
                                    <CloudUploadIcon sx={{ fontSize: 13 }} />
                                    <input
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                </IconButton>
                            </Box>

                            <OpenAvatar
                                openAvatarPreview={openAvatarReview}
                                setOpenAvatarPreview={setOpenAvatarReview}
                                profile={initialProfile}
                            />

                            {showAlert && (
                                <Alert sx={{ mb: 1, mt: 2, borderRadius: 2.5 }} severity="warning">
                                    {messageFile}
                                </Alert>
                            )}

                            <Typography
                                sx={{
                                    mt: 2,
                                    fontSize: 18,
                                    fontWeight: 800,
                                    color: "#0f172a",
                                }}
                            >
                                {initialProfile?.fullname}
                            </Typography>

                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        bgcolor: initialProfile?.isActive ? "#22c55e" : "#94a3b8",
                                        boxShadow: initialProfile?.isActive ? "0 0 10px #22c55e" : "none",
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color: initialProfile?.isActive ? "#16a34a" : "#64748b",
                                        fontWeight: 700,
                                    }}
                                >
                                    {initialProfile?.isActive ? "Active" : "Inactive"}
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>

                    {/* Scrollable Content Area */}
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            overflowY: "auto",
                            px: 2.5,
                            py: 2,
                            bgcolor: "#f8fafc",
                            ...customScrollbarSx,
                        }}
                    >
                        <Typography
                            sx={{
                                mb: 2.5,
                                fontSize: 13,
                                lineHeight: 1.6,
                                color: "#64748b",
                                textAlign: "center",
                                fontWeight: 500,
                            }}
                        >
                            Update your profile information, manage your avatar, and change your password to better protect your account.
                        </Typography>

                        {/* Pill Segment Tabs */}
                        <Tabs
                            value={activeTab}
                            onChange={(e, val) => setActiveTab(val)}
                            variant="fullWidth"
                            sx={{
                                minHeight: 38,
                                height: 38,
                                bgcolor: "rgba(15, 23, 42, 0.04)",
                                borderRadius: "19px",
                                p: 0.5,
                                mb: 2.5,
                                "& .MuiTabs-indicator": {
                                    height: "100%",
                                    borderRadius: "15px",
                                    bgcolor: "#ffffff",
                                    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.06)",
                                    zIndex: 0,
                                },
                                "& .MuiTab-root": {
                                    minHeight: 28,
                                    height: 28,
                                    borderRadius: "15px",
                                    zIndex: 1,
                                    transition: "all 0.22s ease",
                                    color: "#64748b",
                                    fontWeight: 700,
                                    fontSize: "13px",
                                    textTransform: "none",
                                    p: 0,
                                    "&.Mui-selected": {
                                        color: "#4f46e5 !important",
                                    },
                                },
                            }}
                        >
                            <Tab label="About" />
                            <Tab label="Attached Files" />
                        </Tabs>

                        {activeTab === 0 ? (
                            <AboutSection
                                profile={initialProfile}
                                expanded={true}
                                onChange={() => {}}
                                onUpdate={handleUpdateUser}
                            />
                        ) : (
                            <AttachedFilesSection
                                files={attachedFiles}
                                expanded={true}
                                onChange={() => {}}
                            />
                        )}

                        {isMobile && <Box sx={{ height: 12 }} />}
                    </Box>
                </Paper>
            </Box>
        </>
    );
}

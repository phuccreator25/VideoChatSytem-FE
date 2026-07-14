import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CallRoundedIcon from "@mui/icons-material/CallRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { IconButton } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Zoom from "@mui/material/Zoom";
import type { ViewUserInfoModalProps } from "../../../../types/contact/contact.ui.type";

const scrollSx = {
    "&::-webkit-scrollbar": {
        width: 8,
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: "#f5f3ff",
        borderRadius: 999,
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#c4b5fd",
        borderRadius: 999,
        border: "2px solid #f5f3ff",
    },
    "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "#a78bfa",
    },
    scrollbarWidth: "thin",
    scrollbarColor: "#c4b5fd #f5f3ff",
};

export function ViewUserInfoModal({
    open,
    onClose,
    user,
    onCall,
    onMessage,
    setOpenSetNicknameModal,
    setOpenModalRemove,
    setOpenModalBlock
}: ViewUserInfoModalProps) {
    const displayName = user?.nickname ?? user?.fullname ?? "";
    const avatarLetter = displayName.charAt(0).toUpperCase() || "?";

    const handleCall = () => {
        if (!user) return;
        onCall?.(user.userId);
    };

    const handleMessage = () => {
        if (!user) return;
        onMessage?.(user.userId);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            hideBackdrop
            TransitionComponent={Zoom}
            transitionDuration={250}
            PaperProps={{
                sx: {
                    borderRadius: "24px",
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(148, 163, 184, 0.15)",
                    boxShadow: "none",
                    overflow: "hidden",
                    m: 0,
                },
            }}
        >
            <DialogTitle
                sx={{
                    px: 3.5,
                    pt: 3,
                    pb: 2,
                    fontSize: 20,
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
                }}
            >
                Account information
            </DialogTitle>

            <DialogContent
                sx={{
                    px: 3.5,
                    py: 3,
                    backgroundColor: "transparent",
                    maxHeight: 560,
                    ...scrollSx,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            mb: 2.5,
                        }}
                    >
                        <Avatar
                            src={user?.avatar || undefined}
                            alt={displayName}
                            sx={{
                                width: 92,
                                height: 92,
                                fontSize: 32,
                                fontWeight: 800,
                                bgcolor: user?.avatar ? undefined : "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)",
                                color: "#4f46e5",
                                border: "3px solid #ffffff",
                                boxShadow: "0 8px 24px rgba(79, 70, 229, 0.12)",
                            }}
                        >
                            {avatarLetter}
                        </Avatar>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                            mb: 0.5,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 24,
                                fontWeight: 800,
                                color: "#0f172a",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {displayName}
                        </Typography>

                        <IconButton
                            size="small"
                            onClick={() => setOpenSetNicknameModal(true)}
                            sx={{
                                color: "#4f46e5",
                                p: 0.75,
                                bgcolor: "rgba(79, 70, 229, 0.05)",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    backgroundColor: "rgba(79, 70, 229, 0.12)",
                                    transform: "scale(1.08)",
                                },
                            }}
                        >
                            <EditRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Box>

                    {user?.nickname && (
                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 14,
                                color: "#64748b",
                                fontWeight: 500,
                            }}
                        >
                            {user.fullname}
                        </Typography>
                    )}

                    {user?.isBlocked ? (
                        <Typography
                            sx={{
                                mt: 2,
                                fontSize: 14,
                                color: "#ef4444",
                                fontWeight: 600,
                                mb: 1.5,
                                px: 2,
                                py: 1,
                                bgcolor: "rgba(239, 68, 68, 0.06)",
                                border: "1px solid rgba(239, 68, 68, 0.15)",
                                borderRadius: "12px",
                            }}
                        >
                            Unblock this person to send messages and make calls.
                        </Typography>
                    ) : (
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                mt: 3,
                                mb: 3.5,
                                width: "100%",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                variant="contained"
                                startIcon={<CallRoundedIcon />}
                                onClick={handleCall}
                                sx={{
                                    flex: 1,
                                    maxWidth: 140,
                                    height: 44,
                                    textTransform: "none",
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: "#ffffff",
                                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                                    boxShadow: "0 8px 20px rgba(79, 70, 229, 0.25)",
                                    borderRadius: "14px",
                                    transition: "all 0.22s ease",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                                        boxShadow: "0 10px 24px rgba(79, 70, 229, 0.35)",
                                        transform: "translateY(-1.5px)",
                                    },
                                }}
                            >
                                Call
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<ChatBubbleRoundedIcon />}
                                onClick={handleMessage}
                                sx={{
                                    flex: 1,
                                    maxWidth: 140,
                                    height: 44,
                                    textTransform: "none",
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: "#4f46e5",
                                    borderColor: "rgba(79, 70, 229, 0.28)",
                                    bgcolor: "rgba(79, 70, 229, 0.02)",
                                    borderRadius: "14px",
                                    transition: "all 0.22s ease",
                                    "&:hover": {
                                        borderColor: "#4f46e5",
                                        backgroundColor: "rgba(79, 70, 229, 0.06)",
                                        transform: "translateY(-1.5px)",
                                    },
                                }}
                            >
                                Message
                            </Button>
                        </Stack>
                    )}

                    <Box
                        sx={{
                            width: "100%",
                            border: "1px solid rgba(148, 163, 184, 0.12)",
                            borderRadius: "18px",
                            overflow: "hidden",
                            mb: 3,
                            bgcolor: "rgba(248, 250, 252, 0.55)",
                        }}
                    >
                        <Box
                            sx={{
                                px: 2.5,
                                py: 1.75,
                                backgroundColor: "rgba(111, 99, 246, 0.03)",
                                borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 800,
                                    color: "#4f46e5",
                                    textAlign: "left",
                                    letterSpacing: "0.02em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Personal information
                            </Typography>
                        </Box>

                        <Box sx={{ px: 2.5, py: 1.75 }}>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: "#94a3b8",
                                    mb: 0.5,
                                    textAlign: "left",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                }}
                            >
                                Full name
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: "#1e293b",
                                    textAlign: "left",
                                }}
                            >
                                {user?.fullname || "--"}
                            </Typography>
                        </Box>

                        <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.08)" }} />

                        <Box sx={{ px: 2.5, py: 1.75 }}>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: "#94a3b8",
                                    mb: 0.5,
                                    textAlign: "left",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                }}
                            >
                                Email
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: "#1e293b",
                                    textAlign: "left",
                                    wordBreak: "break-word",
                                }}
                            >
                                {user?.email || "--"}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            width: "100%",
                            border: "1px solid rgba(148, 163, 184, 0.12)",
                            borderRadius: "18px",
                            overflow: "hidden",
                            bgcolor: "#ffffff",
                        }}
                    >
                        <Button
                            fullWidth
                            onClick={() => {
                                setOpenModalBlock(true);
                                onClose();
                            }}
                            startIcon={<BlockRoundedIcon />}
                            sx={{
                                justifyContent: "flex-start",
                                px: 2.5,
                                py: 1.75,
                                textTransform: "none",
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#4f46e5",
                                borderRadius: 0,
                                transition: "all 0.18s ease",
                                "&:hover": {
                                    backgroundColor: "rgba(79, 70, 229, 0.04)",
                                    color: "#3730a3",
                                },
                            }}
                        >
                            {user?.isBlocked ? "Unblock messages and calls" : "Block messages and calls"}
                        </Button>

                        <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.08)" }} />

                        <Button
                            fullWidth
                            onClick={() => {
                                setOpenModalRemove(true);
                                onClose();
                            }}
                            startIcon={<DeleteOutlineRoundedIcon />}
                            sx={{
                                justifyContent: "flex-start",
                                px: 2.5,
                                py: 1.75,
                                textTransform: "none",
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#ef4444",
                                borderRadius: 0,
                                transition: "all 0.18s ease",
                                "&:hover": {
                                    backgroundColor: "rgba(239, 68, 68, 0.04)",
                                    color: "#b91c1c",
                                },
                            }}
                        >
                            Remove from friends
                        </Button>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3.5,
                    py: 2.5,
                    borderTop: "1px solid rgba(148, 163, 184, 0.08)",
                    justifyContent: "flex-end",
                    bgcolor: "rgba(248, 250, 252, 0.4)",
                }}
            >
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        minWidth: 92,
                        height: 38,
                        textTransform: "none",
                        fontSize: 14.5,
                        fontWeight: 700,
                        color: "#475569",
                        backgroundColor: "#f1f5f9",
                        boxShadow: "none",
                        borderRadius: "12px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            backgroundColor: "#e2e8f0",
                            color: "#1e293b",
                            boxShadow: "none",
                            transform: "translateY(-1px)",
                        },
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

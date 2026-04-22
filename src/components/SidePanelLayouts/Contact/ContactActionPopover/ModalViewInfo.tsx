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
import type { ViewUserInfoModalProps } from "../../../../types/contact.type";

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
            transitionDuration={220}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    backgroundColor: "#ffffff",
                    border: "1px solid #ede9fe",
                    boxShadow: "none",
                    overflow: "hidden",
                    m: 0
                },
            }}
        >
            <DialogTitle
                sx={{
                    px: 3,
                    py: 2.25,
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#6f63f6",
                    borderBottom: "1px solid #f3e8ff",
                }}
            >
                Account information
            </DialogTitle>

            <DialogContent
                sx={{
                    px: 3,
                    py: 3,
                    backgroundColor: "#ffffff",
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
                    <Avatar
                        src={user?.avatar || undefined}
                        alt={displayName}
                        sx={{
                            width: 88,
                            height: 88,
                            mb: 2,
                            mt: 0.5,
                            fontSize: 30,
                            fontWeight: 700,
                            bgcolor: user?.avatar ? undefined : "#ede9fe",
                            color: "#6f63f6",
                            border: "2px solid #ddd6fe",
                        }}
                    >
                        {avatarLetter}
                    </Avatar>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.75,
                            mb: 0.5,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 27,
                                fontWeight: 700,
                                color: "#111827",
                                lineHeight: 1.2,
                            }}
                        >
                            {displayName}
                        </Typography>

                        <IconButton
                            size="small"
                            onClick={() => setOpenSetNicknameModal(true)}
                            sx={{
                                color: "#6f63f6",
                                p: 0.5,
                                "&:hover": {
                                    backgroundColor: "#f5f3ff",
                                },
                            }}
                        >
                            <EditRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Box>

                    {user?.nickname && (
                        <Typography
                            sx={{
                                mt: 0.75,
                                fontSize: 15,
                                color: "#7d84a0",
                                lineHeight: 1.4,
                            }}
                        >
                            {user.fullname}
                        </Typography>
                    )}

                    {user?.isBlocked ? (
                        <Typography
                            sx={{
                                mt: 0.75,
                                fontSize: 15,
                                color: "#dc2626",
                                lineHeight: 1.4,
                                fontWeight: 600,
                                mb: 1.5
                            }}
                        >
                            Unblock this person to send messages and make calls.
                        </Typography>
                    ) : ( <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                            mt: 2.5,
                            mb: 3,
                            width: "100%",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<CallRoundedIcon />}
                            onClick={handleCall}
                            sx={{
                                minWidth: 132,
                                height: 46,
                                textTransform: "none",
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#ffffff",
                                backgroundColor: "#6f63f6",
                                boxShadow: "none",
                                borderRadius: 3,
                                "&:hover": {
                                    backgroundColor: "#5b50eb",
                                    boxShadow: "none",
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
                                minWidth: 132,
                                height: 46,
                                textTransform: "none",
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#6f63f6",
                                borderColor: "#c4b5fd",
                                borderRadius: 3,
                                "&:hover": {
                                    borderColor: "#a78bfa",
                                    backgroundColor: "#f5f3ff",
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
                            border: "1px solid #ede9fe",
                            borderRadius: 3,
                            overflow: "hidden",
                            mb: 2.5,
                        }}
                    >
                        <Box
                            sx={{
                                px: 2,
                                py: 1.5,
                                backgroundColor: "#faf7ff",
                                borderBottom: "1px solid #f3e8ff",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 15,
                                    fontWeight: 800,
                                    color: "#6f63f6",
                                    textAlign: "left",
                                }}
                            >
                                Personal information
                            </Typography>
                        </Box>

                        <Box sx={{ px: 2, py: 1.75 }}>
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: "#8b5cf6",
                                    mb: 0.5,
                                    textAlign: "left",
                                }}
                            >
                                Full name
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: "#111827",
                                    textAlign: "left",
                                }}
                            >
                                {user?.fullname || "--"}
                            </Typography>
                        </Box>

                        <Divider sx={{ borderColor: "#f3e8ff" }} />

                        <Box sx={{ px: 2, py: 1.75 }}>
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: "#8b5cf6",
                                    mb: 0.5,
                                    textAlign: "left",
                                }}
                            >
                                Email
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: "#111827",
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
                            border: "1px solid #f3e8ff",
                            borderRadius: 3,
                            overflow: "hidden",
                        }}
                    >
                        <Button
                            fullWidth
                            onClick={() => {
                                setOpenModalBlock(true)
                                onClose()
                            }}
                            startIcon={<BlockRoundedIcon />}
                            sx={{
                                justifyContent: "flex-start",
                                px: 2,
                                py: 1.6,
                                textTransform: "none",
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#7c3aed",
                                borderRadius: 0,
                                "&:hover": {
                                    backgroundColor: "#faf5ff",
                                },
                            }}
                        >
                            {user?.isBlocked ? "Unblock messages and calls" : "Block messages and calls"}
                        </Button>

                        <Divider sx={{ borderColor: "#f3e8ff" }} />

                        <Button
                            fullWidth
                            onClick={() => {
                                setOpenModalRemove(true)
                                onClose()
                            }}
                            startIcon={<DeleteOutlineRoundedIcon />}
                            sx={{
                                justifyContent: "flex-start",
                                px: 2,
                                py: 1.6,
                                textTransform: "none",
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#dc2626",
                                borderRadius: 0,
                                "&:hover": {
                                    backgroundColor: "#fef2f2",
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
                    px: 3,
                    py: 2,
                    borderTop: "1px solid #f3e8ff",
                    justifyContent: "flex-end",
                }}
            >
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        minWidth: 104,
                        height: 42,
                        textTransform: "none",
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#5b647a",
                        backgroundColor: "#eef2f7",
                        boxShadow: "none",
                        borderRadius: 2.5,
                        "&:hover": {
                            backgroundColor: "#e2e8f0",
                            boxShadow: "none",
                        },
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
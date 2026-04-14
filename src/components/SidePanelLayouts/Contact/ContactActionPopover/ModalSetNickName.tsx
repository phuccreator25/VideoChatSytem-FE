import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { contacts } from "../../../../types/contact.type";

type SetNicknameModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm?: (data: contacts) => void;
    selectedContact: contacts | null
};

export function SetNicknameModal({
    open,
    onClose,
    onConfirm,
    selectedContact,
}: SetNicknameModalProps) {
    const [nickname, setNickname] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setNickname(selectedContact?.nickname || selectedContact?.fullname || "");
        }
    }, [open, selectedContact]);

    const handleConfirm = async () => {
        try {
            if (!selectedContact) return;
            setIsSubmitting(true)
            await onConfirm?.({ ...selectedContact, nickname });
            // onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xs"
                fullWidth
                hideBackdrop
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
                        py: 2,
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#6f63f6",
                        borderBottom: "1px solid #f3e8ff",
                        backgroundColor: "#ffffff"
                    }}
                >
                    Give it a memorable name
                </DialogTitle>

                <DialogContent sx={{
                    px: 3,
                    pt: 3,
                    pb: 2.5,
                    backgroundColor: "#ffffff"
                }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                        }}
                    >
                        <Avatar
                            src={selectedContact?.avatar || 'https://static.vecteezy.com/system/resources/previews/013/360/247/non_2x/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg'}
                            alt={selectedContact?.fullname}
                            sx={{
                                width: 84,
                                height: 84,
                                mb: 2.5,
                                mt: 2,
                                fontSize: 30,
                                fontWeight: 700,
                                bgcolor: selectedContact?.avatar ? undefined : "#ede9fe",
                                color: "#6f63f6",
                                border: "2px solid #e9d5ff",
                            }}
                        >
                            {selectedContact?.fullname}
                        </Avatar>

                        <Typography
                            sx={{
                                fontSize: 14,
                                color: "#1f2430",
                                lineHeight: 1.5,
                                mb: 0.5,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            Set a memorable name for{" "}
                            <Box
                                component="span"
                                sx={{
                                    fontWeight: 550,
                                    fontSize: 14,
                                }}
                            >
                                {selectedContact?.nickname ?? selectedContact?.fullname}
                            </Box>
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 14,
                                color: "#1f2430",
                                lineHeight: 1.5,
                                mb: 2.5,
                                maxWidth: 320,
                            }}
                        >
                            Note: This nickname will only be visible to you.
                        </Typography>

                        <TextField
                            fullWidth
                            placeholder="Enter nickname"
                            value={nickname}
                            onChange={(event) => setNickname(event.target.value)}
                            autoFocus
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    backgroundColor: "#ffffff",
                                    color: "#1f2430",
                                    "& fieldset": {
                                        borderColor: "#d8b4fe",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#a78bfa",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#6f63f6",
                                    },
                                },
                                "& .MuiInputBase-input": {
                                    fontSize: 16,
                                    py: 1.6,
                                },
                            }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2.5,
                        pt: 0.5,
                        justifyContent: "flex-end",
                        gap: 1.5,
                    }}
                >
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            minWidth: 96,
                            height: 44,
                            textTransform: "none",
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#5b647a",
                            backgroundColor: "#eef2f7",
                            boxShadow: "none",
                            borderRadius: 2,
                            "&:hover": {
                                backgroundColor: "#e2e8f0",
                                boxShadow: "none",
                            },
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleConfirm}
                        variant="contained"
                        disabled={!nickname.trim() || isSubmitting}
                        sx={{
                            minWidth: 110,
                            height: 44,
                            textTransform: "none",
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#ffffff",
                            backgroundColor: "#6f63f6",
                            boxShadow: "none",
                            borderRadius: 2,
                            "&:hover": {
                                backgroundColor: "#5b50eb",
                                boxShadow: "none",
                            },
                        }}
                    >
                        {isSubmitting ? "Saving..." : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
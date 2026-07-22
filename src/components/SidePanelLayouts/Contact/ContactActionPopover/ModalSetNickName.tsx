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
import type { SetNicknameModalProps } from "../../../../types/contact/contact.ui.type";
import { enqueueSnackbar } from "notistack";
import Zoom from "@mui/material/Zoom";

export function SetNicknameModal({
    open,
    onClose,
    onConfirm,
    selectedContact,
}: SetNicknameModalProps) {
    const [nickname, setNickname] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setNickname(selectedContact?.nickname ?? "");
    }, [selectedContact]);

    const handleConfirm = async () => {
        try {
            if (!selectedContact) return;
            setIsSubmitting(true);
            const result = await onConfirm?.({ ...selectedContact, nickname });
            
            if (result) {
                enqueueSnackbar("Đã cập nhật biệt danh thành công", {
                    variant: 'success'
                });
                onClose();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
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
                    pt: 3.5,
                    pb: 2,
                    fontSize: 20,
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
                }}
            >
                Give it a memorable name
            </DialogTitle>

            <DialogContent
                sx={{
                    px: 3.5,
                    pt: 3,
                    pb: 2.5,
                    backgroundColor: "transparent",
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
                            src={selectedContact?.avatar || 'https://static.vecteezy.com/system/resources/previews/013/360/247/non_2x/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg'}
                            alt={selectedContact?.fullname}
                            sx={{
                                width: 84,
                                height: 84,
                                fontSize: 30,
                                fontWeight: 800,
                                bgcolor: selectedContact?.avatar ? undefined : "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)",
                                color: "#4f46e5",
                                border: "3px solid #ffffff",
                                boxShadow: "0 8px 24px rgba(79, 70, 229, 0.12)",
                            }}
                        >
                            {selectedContact?.fullname?.charAt(0).toUpperCase()}
                        </Avatar>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: 14.5,
                            color: "#334155",
                            lineHeight: 1.5,
                            mb: 0.5,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "100%",
                        }}
                    >
                        Set a memorable name for{" "}
                        <Box
                            component="span"
                            sx={{
                                fontWeight: 700,
                                color: "#0f172a",
                            }}
                        >
                            {selectedContact?.nickname ?? selectedContact?.fullname}
                        </Box>
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 13.5,
                            color: "#64748b",
                            lineHeight: 1.5,
                            mb: 3,
                            maxWidth: 320,
                        }}
                    >
                        Note: This nickname will only be visible to you.
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder={selectedContact?.fullname}
                        value={nickname}
                        onChange={(event) => setNickname(event.target.value)}
                        autoFocus
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "14px",
                                backgroundColor: "rgba(248, 250, 252, 0.8)",
                                color: "#0f172a",
                                transition: "all 0.2s ease",
                                "& fieldset": {
                                    borderColor: "rgba(148, 163, 184, 0.2)",
                                },
                                "&:hover fieldset": {
                                    borderColor: "rgba(111, 99, 246, 0.4)",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#4f46e5",
                                    borderWidth: "2px",
                                },
                            },
                            "& .MuiInputBase-input": {
                                fontSize: 15.5,
                                py: 1.6,
                                px: 2,
                                fontWeight: 600,
                            },
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3.5,
                    pb: 3,
                    pt: 1,
                    justifyContent: "flex-end",
                    gap: 2,
                    borderTop: "1px solid rgba(148, 163, 184, 0.08)",
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
                    Cancel
                </Button>

                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={!(nickname !== selectedContact?.nickname) || isSubmitting}
                    sx={{
                        minWidth: 110,
                        height: 38,
                        textTransform: "none",
                        fontSize: 14.5,
                        fontWeight: 700,
                        color: "#ffffff",
                        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                        boxShadow: "0 6px 16px rgba(79, 70, 229, 0.22)",
                        borderRadius: "12px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                            boxShadow: "0 8px 20px rgba(79, 70, 229, 0.32)",
                            transform: "translateY(-1px)",
                        },
                    }}
                >
                    {isSubmitting ? "Saving..." : "Confirm"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import type { ConfirmRemoveFriendModalProps } from "../../../../types/contact/contact.ui.type";
import Zoom from "@mui/material/Zoom";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";

export function ConfirmRemoveFriendModal({
    open,
    onClose,
    onConfirm,
    selectedContact,
}: ConfirmRemoveFriendModalProps) {
    const displayName = selectedContact?.nickname ?? selectedContact?.fullname ?? "";
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async () => {
        try {
            setIsSubmitting(true);
            const result = await onConfirm?.();
            
            if (result) {
                enqueueSnackbar("Removed friend successfully", {
                    variant: "success",
                });
                onClose();
            }
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
                    border: "1px solid rgba(239, 68, 68, 0.15)",
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
                    background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
                }}
            >
                Remove Contact
            </DialogTitle>

            <DialogContent
                sx={{
                    px: 3.5,
                    pt: 4,
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
                            width: 54,
                            height: 54,
                            borderRadius: "16px",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "rgba(239, 68, 68, 0.08)",
                            color: "#ef4444",
                            mb: 2.5,
                            boxShadow: "0 8px 20px rgba(239, 68, 68, 0.1)",
                        }}
                    >
                        <WarningAmberRoundedIcon sx={{ fontSize: 28 }} />
                    </Box>

                    <Typography
                        sx={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "#0f172a",
                            lineHeight: 1.4,
                            mb: 1,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        Are you sure you want to remove this friend?
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 14.5,
                            color: "#64748b",
                            lineHeight: 1.6,
                            maxWidth: 320,
                        }}
                    >
                        You are about to remove{" "}
                        <Box
                            component="span"
                            sx={{
                                fontWeight: 700,
                                color: "#0f172a",
                            }}
                        >
                            {displayName}
                        </Box>{" "}
                        from your friends list. This action cannot be undone automatically.
                    </Typography>
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
                    disabled={isSubmitting}
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
                    disabled={!selectedContact || isSubmitting}
                    sx={{
                        minWidth: 124,
                        height: 38,
                        textTransform: "none",
                        fontSize: 14.5,
                        fontWeight: 700,
                        color: "#ffffff",
                        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                        boxShadow: "0 6px 16px rgba(239, 68, 68, 0.22)",
                        borderRadius: "12px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                            boxShadow: "0 8px 20px rgba(239, 68, 68, 0.32)",
                            transform: "translateY(-1px)",
                        },
                    }}
                >
                    {isSubmitting ? "Removing..." : "Remove friend"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

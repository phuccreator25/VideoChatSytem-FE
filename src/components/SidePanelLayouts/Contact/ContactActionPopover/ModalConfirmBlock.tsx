import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import Zoom from "@mui/material/Zoom";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import type { ConfirmBlockModalProps } from "../../../../types/contact/contact.ui.type";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../redux/store";
import { updateContactBlockedStatus } from "../../../../redux/contact.redux";

export function ConfirmBlockModal({
    open,
    onClose,
    onConfirm,
    selectedContact,
    handleUnblock
}: ConfirmBlockModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const displayName =
        selectedContact?.nickname ?? selectedContact?.fullname ?? "";

    const distpatch = useDispatch<AppDispatch>();

    const handleConfirm = async () => {
        try {
            if (!selectedContact) return;
            setIsSubmitting(true);
            const result = await onConfirm(selectedContact);

            if (result) {
                enqueueSnackbar("User blocked successfully", {
                    variant: "success",
                });

                await distpatch(updateContactBlockedStatus({
                    contactId: selectedContact._id,
                    isBlocked: true
                }));
                
                onClose();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmUnblock = async () => {
        try {
            if (!selectedContact) return;
            
            setIsSubmitting(true);
            const result = await handleUnblock(selectedContact);

            if (result) {
                enqueueSnackbar("User unblocked successfully", {
                    variant: "success",
                });

                await distpatch(updateContactBlockedStatus({
                    contactId: selectedContact._id,
                    isBlocked: false
                }));

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
                    border: "1px solid rgba(124, 58, 237, 0.15)",
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
                    background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
                }}
            >
                {selectedContact?.isBlocked ? "Unblock this user" : "Block this user"}
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
                            bgcolor: "rgba(124, 58, 237, 0.08)",
                            color: "#7c3aed",
                            mb: 2.5,
                            boxShadow: "0 8px 20px rgba(124, 58, 237, 0.1)",
                        }}
                    >
                        <BlockRoundedIcon sx={{ fontSize: 26 }} />
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
                        {selectedContact?.isBlocked ? "Unblock this user?" : "Block this user?"}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 14.5,
                            color: "#64748b",
                            lineHeight: 1.6,
                            maxWidth: 320,
                        }}
                    >
                        {selectedContact?.isBlocked
                            ? "You are about to unblock "
                            : "You are about to block "}
                        <Box
                            component="span"
                            sx={{
                                fontWeight: 700,
                                color: "#0f172a",
                            }}
                        >
                            {displayName}
                        </Box>
                        {selectedContact?.isBlocked ? " from your contacts." : " from your contacts."} They will no longer be able to send you messages or call you.
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
                    onClick={selectedContact?.isBlocked ? handleConfirmUnblock : handleConfirm}
                    variant="contained"
                    disabled={!selectedContact || isSubmitting}
                    sx={{
                        minWidth: 124,
                        height: 38,
                        textTransform: "none",
                        fontSize: 14.5,
                        fontWeight: 700,
                        color: "#ffffff",
                        background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                        boxShadow: "0 6px 16px rgba(124, 58, 237, 0.22)",
                        borderRadius: "12px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            background: "linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%)",
                            boxShadow: "0 8px 20px rgba(124, 58, 237, 0.32)",
                            transform: "translateY(-1px)",
                        },
                    }}
                >
                    {isSubmitting ? (selectedContact?.isBlocked ? "Unblocking..." : "Blocking...") : selectedContact?.isBlocked ? "Unblock" : "Block"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

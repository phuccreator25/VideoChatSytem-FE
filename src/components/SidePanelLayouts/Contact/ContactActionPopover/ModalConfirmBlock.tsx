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
import type { ConfirmBlockModalProps } from "../../../../types/contact.type";

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

    const handleConfirm = async () => {
        try {
            if (!selectedContact) return
            setIsSubmitting(true);
            const result = await onConfirm(selectedContact);

            if (result) {
                enqueueSnackbar("User blocked successfully", {
                    variant: "success",
                });
                selectedContact.isBlocked = true
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
            if (!selectedContact) return
            console.log('oko');
            
            setIsSubmitting(true);
            const result = await handleUnblock(selectedContact);

            if (result) {
                enqueueSnackbar("User unblocked successfully", {
                    variant: "success",
                });
                selectedContact.isBlocked = false
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
            transitionDuration={220}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    backgroundColor: "#ffffff",
                    border: "1px solid #ede9fe",
                    boxShadow: "none",
                    overflow: "hidden",
                    m: 0,
                },
            }}
        >
            <DialogTitle
                sx={{
                    px: 3,
                    py: 2,
                    fontSize: 20,
                    fontWeight: 650,
                    color: "#7c3aed",
                    borderBottom: "1px solid #ede9fe",
                    backgroundColor: "#faf7ff",
                }}
            >
                Block this user
            </DialogTitle>

            <DialogContent
                sx={{
                    px: 3,
                    pt: 3,
                    pb: 2.5,
                    backgroundColor: "#ffffff",
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
                            mt: 2,
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "#f5f3ff",
                            color: "#7c3aed",
                            mb: 1.5,
                        }}
                    >
                        <BlockRoundedIcon sx={{ fontSize: 24 }} />
                    </Box>

                    <Typography
                        sx={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#111827",
                            lineHeight: 1.4,
                            mb: 0.75,
                        }}
                    >
                        {selectedContact?.isBlocked ? "Unblock this user?" : "Block this user?"}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "#4b5563",
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
                                color: "#111827",
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
                    disabled={isSubmitting}
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
                    onClick={selectedContact?.isBlocked ? handleConfirmUnblock : handleConfirm}
                    variant="contained"
                    disabled={!selectedContact || isSubmitting}
                    sx={{
                        minWidth: 124,
                        height: 44,
                        textTransform: "none",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#ffffff",
                        backgroundColor: "#7c3aed",
                        boxShadow: "none",
                        borderRadius: 2,
                        "&:hover": {
                            backgroundColor: "#6d28d9",
                            boxShadow: "none",
                        },
                    }}
                >
                    {isSubmitting ? (selectedContact?.isBlocked ? "Unblocking..." : "Blocking...") : selectedContact?.isBlocked ? " Unblock" : "Block"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import type { ConfirmRemoveFriendModalProps } from "../../../../types/contact.type";
import Zoom from "@mui/material/Zoom";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../redux/store";
import { onGetDataContact } from "../../../../redux/contact.redux";

export function ConfirmRemoveFriendModal({
    open,
    onClose,
    onConfirm,
    selectedContact,
}: ConfirmRemoveFriendModalProps) {
    const displayName = selectedContact?.nickname ?? selectedContact?.fullname ?? "";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch<AppDispatch>()

    const handleConfirm = async () => {
        try {
            setIsSubmitting(true);
            const result = await onConfirm?.();
            
            if (result) {
                enqueueSnackbar("Removed friend successfully", {
                    variant: "success",
                });
                onClose();
                dispatch(onGetDataContact());
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
                    py: 2,
                    fontSize: 20,
                    fontWeight: 650,
                    color: "#dc2626",
                    borderBottom: "1px solid #fee2e2",
                    backgroundColor: "#fffafa",
                }}
            >
                Remove Contact
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
                            marginTop: 2,
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "#fff1f2",
                            color: "#dc2626",
                            mb: 1.5,
                        }}
                    >
                        <WarningAmberRoundedIcon sx={{ fontSize: 24 }} />
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
                        Are you sure you want to remove this friend?
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "#4b5563",
                            lineHeight: 1.6,
                            maxWidth: 320,
                        }}
                    >
                        You are about to remove{" "}
                        <Box
                            component="span"
                            sx={{
                                fontWeight: 700,
                                color: "#111827",
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
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={!selectedContact || isSubmitting}
                    sx={{
                        minWidth: 132,
                        height: 44,
                        textTransform: "none",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#ffffff",
                        backgroundColor: "#dc2626",
                        boxShadow: "none",
                        borderRadius: 2,
                        "&:hover": {
                            backgroundColor: "#b91c1c",
                            boxShadow: "none",
                        },
                    }}
                >
                    {isSubmitting ? "Removing..." : "Remove friend"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
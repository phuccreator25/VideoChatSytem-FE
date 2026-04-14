import {
    Box,
    Button,
    Divider,
    Popover,
    Stack,
    Typography,
} from "@mui/material";
import { FriendRequestsSection } from "./FriendRequestSection";
import { SentInvitationsSection } from "./SentInvitationsSection";
import type { InvitationPopoverProps } from "../../../../types/Invitation";

export function InvitationPopover({
    openPopover,
    anchorEl,
    handleCloseInvitationPopover,
    handleOpenAddContactModal,
    receivedInvitations,
    setReceivedInvitations,
    handleDeclineInvitation,
    handleAcceptInvitation,
    sentInvitations,
    handleCancelSentInvitation,
    handleViewAllRequests,
    getTimeAgo,
    handleRemoveSentInvitation,
    handleRemoveReceivedInvitation,
    setSentInvitations
}: InvitationPopoverProps) {

    return (
        <Popover
            open={openPopover}
            anchorEl={anchorEl}
            onClose={handleCloseInvitationPopover}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            PaperProps={{
                elevation: 0,
                sx: {
                    mt: 1,
                    width: 340,
                    maxWidth: "calc(100vw - 24px)",
                    borderRadius: 3,
                    border: "1px solid #ebecef",
                    boxShadow: "0 18px 40px rgba(31, 36, 48, 0.12)",
                    overflow: "hidden",
                },
            }}
        >
            <Box sx={{ p: 2 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 1.5 }}
                >
                    <Typography
                        sx={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#1f2430",
                        }}
                    >
                        Connections
                    </Typography>

                    <Button
                        onClick={handleOpenAddContactModal}
                        sx={{
                            minWidth: "auto",
                            px: 1,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#6f63f6",
                            textTransform: "none",
                        }}
                    >
                        Add contact
                    </Button>
                </Stack>

                <Divider sx={{ mb: 1.5 }} />

                <FriendRequestsSection
                    receivedInvitations={receivedInvitations}
                    handleDeclineInvitation={handleDeclineInvitation}
                    handleAcceptInvitation={handleAcceptInvitation}
                    getTimeAgo={getTimeAgo}
                    handleRemoveReceivedInvitation={handleRemoveReceivedInvitation}
                    setReceivedInvitations={setReceivedInvitations}
                />

                <Divider sx={{ my: 1.5 }} />

                <SentInvitationsSection
                    sentInvitations={sentInvitations}
                    handleCancelSentInvitation={handleCancelSentInvitation}
                    getTimeAgo={getTimeAgo}
                    handleRemoveSentInvitation={handleRemoveSentInvitation}
                    setSentInvitations={setSentInvitations}
                />

                <Button
                    fullWidth
                    onClick={handleViewAllRequests}
                    sx={{
                        mt: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        color: "#6f63f6",
                        bgcolor: "rgba(111, 99, 246, 0.06)",
                        "&:hover": {
                            bgcolor: "rgba(111, 99, 246, 0.1)",
                        },
                    }}
                >
                    View all requests
                </Button>
            </Box>
        </Popover>
    );
}
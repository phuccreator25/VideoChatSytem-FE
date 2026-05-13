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
import type { InvitationPopoverGroup } from "../../../../types/Invitation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../redux/store";
import { bindInvitationAccept, bindInvitationCancel, bindInvitationCreated, bindInvitationDecline, unbindInvitationAccept, unbindInvitationCancel, unbindInvitationCreated, unbindInvitationDecline } from "../../../../socket/invitationSocket.socket";

type InvitationPopoverProps = {
    invitationPopover: InvitationPopoverGroup;
};

export function InvitationPopover({
    invitationPopover,
}: InvitationPopoverProps) {

    const { data, ui, handlers, helpers } = invitationPopover;

    const friendRequestsSection = {
        data: {
            receivedInvitations: data.receivedInvitations,
        },
        handlers: {
            handleRemoveReceivedInvitation: handlers.handleRemoveReceivedInvitation,
            setReceivedInvitations: handlers.setReceivedInvitations,
            refreshPopoverReceivedInvitations: handlers.refreshPopoverReceivedInvitations
        },
        helpers: {
            getTimeAgo: helpers.getTimeAgo,
        },
    };

    const sentInvitationsSection = {
        data: {
            sentInvitations: data.sentInvitations,
        },
        handlers: {
            handleRemoveSentInvitation: handlers.handleRemoveSentInvitation,
            setSentInvitations: handlers.setSentInvitations,
            refreshPopoverSentInvitations: handlers.refreshPopoverSentInvitations
        },
        helpers: {
            getTimeAgo: helpers.getTimeAgo,
        },
    };

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const handleInvitationAccept = async () => {
            if (ui.openPopover === true) {
                await handlers.refreshPopoverSentInvitations()
            }
        };

        const handleInvitationDecline = async () => {
            if (ui.openPopover === true) {
                await handlers.refreshPopoverSentInvitations();
            }
        };

        const handleInvitationCreated = async () => {
            if (ui.openPopover === true) {
                await handlers.refreshPopoverReceivedInvitations();
            }
        }

        const handleInvitationCancel = async () => {
            if (ui.openPopover === true) {
                await handlers.refreshPopoverReceivedInvitations();
            }
        };

        bindInvitationAccept(handleInvitationAccept);
        bindInvitationDecline(handleInvitationDecline);

        bindInvitationCreated(handleInvitationCreated);
        bindInvitationCancel(handleInvitationCancel)

        return () => {
            unbindInvitationAccept(handleInvitationAccept);
            unbindInvitationDecline(handleInvitationDecline);

            unbindInvitationCreated(handleInvitationCreated);
            unbindInvitationCancel(handleInvitationCancel)
        };
    }, [
        dispatch,
        ui.openPopover
    ]);

    return (
        <Popover
            open={ui.openPopover}
            anchorEl={ui.anchorEl}
            onClose={handlers.handleCloseInvitationPopover}
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
                        onClick={handlers.handleOpenAddContactModal}
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

                <FriendRequestsSection friendRequestsSection={friendRequestsSection} />

                <Divider sx={{ my: 1.5 }} />

                <SentInvitationsSection
                    sentInvitationsSection={sentInvitationsSection}
                />

                <Button
                    fullWidth
                    onClick={handlers.handleViewAllRequests}
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
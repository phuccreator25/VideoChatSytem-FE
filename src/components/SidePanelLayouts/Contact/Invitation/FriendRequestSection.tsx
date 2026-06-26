import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useState } from "react";
import { useSelector } from "react-redux";

import { type RootState } from "../../../../redux/store";
import type { FriendRequestsSectionGroup } from "../../../../types/invitation/invitation.ui.type";
import useInvitationAction from "../../../../helpers/InvitationAction.helper";

type FriendRequestsSectionProps = {
  friendRequestsSection: FriendRequestsSectionGroup;
};

export function FriendRequestsSection({
  friendRequestsSection,
}: FriendRequestsSectionProps) {

  const { data, handlers, helpers } = friendRequestsSection;

  const [submitingId, setSubmitingId] = useState<string | null>(null);

  const actionStatusById = useSelector(
    (state: RootState) => state.invitation.actionStatusById
  );

  const countReceived = useSelector(
    (state: RootState) => state.invitation.countReceived
  );

  const { onHandleAcceptInvitation, onHandleDeclineInvitation } = useInvitationAction();

  const onAccept = async (id: string) => {
    try {
      setSubmitingId(id);

      await onHandleAcceptInvitation(id, undefined);
    
    }  finally {
      setSubmitingId(null);
    }
  };

  const onDecline = async (id: string) => {
    try {
      setSubmitingId(id);

      await onHandleDeclineInvitation(id, undefined)

    } finally {
      setSubmitingId(null);
    }
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            color: "#1f2430",
          }}
        >
          Friend requests
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: "#8a91a3",
          }}
        >
          {countReceived}
        </Typography>
      </Stack>

      {data.receivedInvitations.length > 0 ? (
        <Stack spacing={1.25}>
          {data.receivedInvitations.map((invitation) => {
            const actionStatus = actionStatusById[invitation.id];
            const isHandled = !!actionStatus;
            const isSubmitting = submitingId === invitation.id;

            return (
              <Box
                key={invitation.id}
                sx={{
                  p: 1.25,
                  borderRadius: 2.5,
                  bgcolor: "#f8f9fd",
                  border: "1px solid #f0f2f7",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  spacing={1.25}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#1f2430",
                          lineHeight: 1.3,
                        }}
                      >
                        {invitation.fullname}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#6b7280",
                          lineHeight: 1.3,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {helpers.getTimeAgo(invitation.receiveAt)}
                      </Typography>
                    </Box>

                    {!!invitation.message && (
                      <Typography
                        sx={{
                          mt: 0.5,
                          fontSize: 12.5,
                          color: "#8a91a3",
                          lineHeight: 1.35,
                        }}
                      >
                        {invitation.message}
                      </Typography>
                    )}
                  </Box>

                  {isHandled && (
                    <IconButton
                      size="small"
                      onClick={() =>
                        handlers.handleRemoveReceivedInvitation(invitation.id)
                      }
                      sx={{
                        mt: -0.5,
                        color: "#98a0b3",
                      }}
                    >
                      <CloseRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                </Stack>

                {actionStatusById[invitation.id] === "accepted" ? (
                  <Alert
                    severity="success"
                    sx={{
                      mt: 1.25,
                      borderRadius: 2,
                      fontSize: 13,
                    }}
                  >
                    Accepted successfully
                  </Alert>
                ) : actionStatusById[invitation.id] === "declined" ? (
                  <Alert
                    severity="info"
                    sx={{
                      mt: 1.25,
                      borderRadius: 2,
                      fontSize: 13,
                    }}
                  >
                    Declined successfully
                  </Alert>
                ) : (
                  <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={isSubmitting}
                      onClick={() => onAccept(invitation.id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "none",
                        bgcolor: "#6f63f6",
                        "&:hover": {
                          bgcolor: "#5d52df",
                          boxShadow: "none",
                        },
                      }}
                    >
                      Accept
                    </Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      disabled={isSubmitting}
                      onClick={() => onDecline(invitation.id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#d9deea",
                        color: "#667085",
                      }}
                    >
                      Decline
                    </Button>
                  </Stack>
                )}
              </Box>
            );
          })}
        </Stack>
      ) : (
        <Box sx={{ py: 3, textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: 13,
              color: "#8a91a3",
            }}
          >
            No pending requests
          </Typography>
        </Box>
      )}
    </>
  );
}

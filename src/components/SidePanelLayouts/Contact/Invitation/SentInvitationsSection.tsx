import { useState } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";

import type { RootState } from "../../../../redux/store";
import type { SentInvitationsSectionGroup } from "../../../../types/invitation/invitation.ui.type";
import useInvitationAction from "../../../../helpers/InvitationAction.helper";

type SentInvitationsSectionProps = {
  sentInvitationsSection: SentInvitationsSectionGroup;
};

export function SentInvitationsSection({
  sentInvitationsSection,
}: SentInvitationsSectionProps) {
  const { data, helpers } = sentInvitationsSection;

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const totalCountSent = useSelector((state: RootState) => state.invitation.countSent);

  const cancelledMap = useSelector(
    (state: RootState) => state.invitation.actionStatusById
  );

  const { onHandleCancelInvitation } = useInvitationAction()

  const handleCancel = async (id: string) => {
    if (loadingId === id) return;

    try {
      setLoadingId(id);

      await onHandleCancelInvitation(id, undefined)

    } finally {
      setLoadingId(null);
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
          Sent invitations
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: "#8a91a3",
          }}
        >
          {totalCountSent}
        </Typography>
      </Stack>

      {data.sentInvitations.length > 0 ? (
        <Stack spacing={1.25}>
          {data.sentInvitations.map((invitation) => (
            <Box
              key={invitation.id}
              sx={{
                p: 1.25,
                borderRadius: 2.5,
                bgcolor: "#fcfcfe",
                border: "1px solid #f0f2f7",
              }}
            >
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
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
                        mt: 0.5,
                        fontSize: 12.5,
                        color: "#8a91a3",
                        lineHeight: 1.35,
                      }}
                    >
                      Sent {helpers.getTimeAgo(invitation.sentAt)}
                    </Typography>
                  </Box>

                  {!cancelledMap[invitation.id] && (
                    <Button
                      variant="text"
                      onClick={() => handleCancel(invitation.id)}
                      disabled={loadingId === invitation.id}
                      sx={{
                        minWidth: "auto",
                        px: 1,
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#e05a5a",
                      }}
                    >
                      {loadingId === invitation.id ? "Cancelling..." : "Cancel"}
                    </Button>
                  )}
                </Stack>

                {cancelledMap[invitation.id] === "cancelled" && (
                  <Alert
                    severity="success"
                    sx={{
                      borderRadius: 2,
                      py: 0.5,
                      "& .MuiAlert-message": {
                        fontSize: 13,
                        fontWeight: 500,
                      },
                    }}
                  >
                    Invitation cancelled successfully.
                  </Alert>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : (
        <Box sx={{ py: 2, textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: 13,
              color: "#8a91a3",
            }}
          >
            No sent invitations
          </Typography>
        </Box>
      )}
    </>
  );
}

import { useState } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import type { SentInvitationProps } from "../../../../types/Invitation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../redux/store";
import { setInvitationActionStatus } from "../../../../redux/invitation.redux";

export function SentInvitationsSection({
  sentInvitations,
  handleCancelSentInvitation,
  getTimeAgo,
  handleRemoveSentInvitation,
  setSentInvitations
}: SentInvitationProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>()
  const cancelledMap = useSelector((state : RootState) => state.invitation.actionStatusById)

  const handleCancel = async (id: string) => {
    if (loadingId === id) return;

    try {
      setLoadingId(id);
      const result = await handleCancelSentInvitation(id);

      if (result) {
        dispatch(
          setInvitationActionStatus({
            id,
            status: "cancelled",
          })
        );

        setTimeout(() => {
          setSentInvitations((prev) => prev.filter((item) => item.id !== id))
          handleRemoveSentInvitation(id)
        }, 700)
      }
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
          {sentInvitations.length}
        </Typography>
      </Stack>

      {sentInvitations.length > 0 ? (
        <Stack spacing={1.25}>
          {sentInvitations.map((invitation) => (
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
                      Sent {"" + getTimeAgo(invitation.sentAt)}
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

                {cancelledMap[invitation.id] === 'cancelled' && (
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
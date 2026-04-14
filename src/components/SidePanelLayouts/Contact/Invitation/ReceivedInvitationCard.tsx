import { useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import type { InvitationItem, InvitationActionStatus } from "../../../../types/Invitation";
import type { AppDispatch, RootState } from "../../../../redux/store";
import {
  clearInvitationActionStatus,
  setInvitationActionStatus,
} from "../../../../redux/invitation.redux";
import { onGetDataContact } from "../../../../redux/contact.redux";

export function ReceivedInvitationCard({
  item,
  onAccept,
  onDecline,
  getTimeAgo,
  handleRemoveReceivedInvitation,
}: {
  item: InvitationItem;
  onAccept?: (id: string) => Promise<boolean> | boolean;
  onDecline?: (id: string) => Promise<boolean> | boolean;
  getTimeAgo: (dateString: string) => string;
  handleRemoveReceivedInvitation: (id: string) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [loadingAction, setLoadingAction] = useState<"accept" | "decline" | null>(null);

  const actionStatus = useSelector(
    (state: RootState) =>
      state.invitation.actionStatusById?.[item.id] as InvitationActionStatus | undefined
  );

  const isResolved =
    actionStatus === "accepted" || actionStatus === "declined";

  const handleAcceptClick = async () => {
    if (!onAccept || loadingAction || isResolved) return;

    try {
      setLoadingAction("accept");
      const success = await onAccept(item.id);

      if (success) {
        await dispatch(
          setInvitationActionStatus({
            id: item.id,
            status: "accepted",
          })
        );
        await dispatch(onGetDataContact());

        setTimeout(() => {
          handleRemoveReceivedInvitation(item.id);
          dispatch(clearInvitationActionStatus(item.id));
        }, 500);
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeclineClick = async () => {
    if (!onDecline || loadingAction || isResolved) return;

    try {
      setLoadingAction("decline");
      const success = await onDecline(item.id);

      if (success) {
        await dispatch(
          setInvitationActionStatus({
            id: item.id,
            status: "declined",
          })
        );

        setTimeout(() => {
          handleRemoveReceivedInvitation(item.id);
          dispatch(clearInvitationActionStatus(item.id));
        }, 500);
      }
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        bgcolor: "#fff",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        height: "100%",
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar
            src={item.avatar}
            sx={{
              width: 52,
              height: 52,
              flexShrink: 0,
              bgcolor: "#e5e7eb",
            }}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.fullname}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: 13,
                    color: "#6b7280",
                    lineHeight: 1.3,
                  }}
                >
                  {getTimeAgo(item.receiveAt)}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  fontSize: 16,
                  flexShrink: 0,
                  bgcolor: "#f8fafc",
                }}
              >
                💬
              </Box>
            </Box>
          </Box>
        </Stack>

        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 2,
            border: "1px solid #dbe2ea",
            bgcolor: "#ffffff",
            minHeight: 76,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 15,
              color: "#374151",
              lineHeight: 1.5,
              textAlign: "center",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.message}
          </Typography>
        </Box>

        {actionStatus === "accepted" && (
          <Alert
            severity="success"
            sx={{
              borderRadius: 2,
              alignItems: "center",
            }}
          >
            Invitation accepted successfully.
          </Alert>
        )}

        {actionStatus === "declined" && (
          <Alert
            severity="info"
            sx={{
              borderRadius: 2,
              alignItems: "center",
            }}
          >
            Invitation declined successfully.
          </Alert>
        )}

        {!isResolved && (
          <Stack direction="row" spacing={1.5}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleDeclineClick}
              disabled={!!loadingAction}
              sx={{
                height: 44,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                fontSize: 16,
                bgcolor: "#eef2f7",
                color: "#374151",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#e5eaf1",
                  boxShadow: "none",
                },
              }}
            >
              {loadingAction === "decline" ? "Declining..." : "Decline"}
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={handleAcceptClick}
              disabled={!!loadingAction}
              sx={{
                height: 44,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                fontSize: 16,
                bgcolor: "#2563eb",
                color: "#fff",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#1d4ed8",
                  boxShadow: "none",
                },
              }}
            >
              {loadingAction === "accept" ? "Accepting..." : "Accept"}
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
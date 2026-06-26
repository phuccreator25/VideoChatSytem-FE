import { useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import { useSelector } from "react-redux";

import type {
  InvitationItem,
  InvitationActionStatus,
} from "../../../../types/invitation/invitation.model.type";
import type { RootState } from "../../../../redux/store";
import useOpenConversation from "../../../../helpers/openConversation.helper";
import useInvitationAction from "../../../../helpers/InvitationAction.helper";

export function ReceivedInvitationCard({
  item,
  getTimeAgo,
}: {
  item: InvitationItem;
  getTimeAgo: (dateString: string) => string;
}) {
  const { handleOpenConversation, isSubmitting } = useOpenConversation();
  const { onHandleAcceptInvitation, onHandleDeclineInvitation } = useInvitationAction();

  const [loadingAction, setLoadingAction] = useState<
    "accept" | "decline" | null
  >(null);

  const actionStatus = useSelector(
    (state: RootState) =>
      state.invitation.actionStatusById?.[item.id] as
      | InvitationActionStatus
      | undefined,
  );

  const isResolved = actionStatus === "accepted" || actionStatus === "declined";

  const handleAccept = async () => {
    if (loadingAction || isResolved) return;

    try {
      setLoadingAction("accept");

      await onHandleAcceptInvitation(item.id, item.senderId, {
        TimeClear: 700,
      });

    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDecline = async () => {
    if (loadingAction || isResolved) return;

    try {
      setLoadingAction("decline");

      await onHandleDeclineInvitation(item.id, item.senderId, {
        TimeClear: 700
      })
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        border: "1px solid #dfe6f3",
        bgcolor: "#ffffff",
        boxShadow: "0 8px 24px rgba(17, 32, 69, 0.06)",
        height: "100%",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 14px 28px rgba(17, 32, 69, 0.1)",
        },
      }}
    >
      <Stack spacing={1.75}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar
            src={item.avatar}
            sx={{
              width: { xs: 44, sm: 52 },
              height: { xs: 44, sm: 52 },
              flexShrink: 0,
              bgcolor: "#e5e7eb",
              border: "2px solid #f2f5fb",
            }}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: { xs: 15.5, sm: 17.5 },
                    fontWeight: 750,
                    color: "#111b2f",
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
                    fontSize: 12.5,
                    color: "#63708e",
                    lineHeight: 1.3,
                  }}
                >
                  {getTimeAgo(item.receiveAt)}
                </Typography>
              </Box>

              <IconButton
                onClick={() => handleOpenConversation(item.senderId)}
                disabled={isSubmitting}
                sx={{
                  width: 30,
                  height: 30,
                  border: "1px solid #e1e8f5",
                  bgcolor: "#f5f8ff",
                  color: "#6a7aa2",
                  transition: "all 0.2s ease",

                  "&:hover": {
                    bgcolor: "#e8f0ff",
                    color: "#2563eb",
                    borderColor: "#bcd0ff",
                    transform: "scale(1.06)",
                  },

                  "&.Mui-disabled": {
                    bgcolor: "#f1f3f6",
                    color: "#b0b7c3",
                    borderColor: "#e5e7eb",
                  },
                }}
              >
                <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        </Stack>

        <Box
          sx={{
            px: 1.75,
            py: 1.5,
            borderRadius: 2.25,
            border: "1px solid #dce5f4",
            bgcolor: "#f9fbff",
            minHeight: 76,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 14.5,
              color: "#32415f",
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
          <Alert severity="success" sx={{ borderRadius: 2, alignItems: "center" }}>
            Invitation accepted successfully.
          </Alert>
        )}

        {actionStatus === "declined" && (
          <Alert severity="info" sx={{ borderRadius: 2, alignItems: "center" }}>
            Invitation declined successfully.
          </Alert>
        )}

        {!isResolved && (
          <Stack direction="row" spacing={1.25}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleDecline}
              disabled={!!loadingAction}
              sx={{
                height: 42,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                fontSize: 15,
                bgcolor: "#ecf2fc",
                color: "#3a4a68",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#e3ebf9",
                  boxShadow: "none",
                },
              }}
            >
              {loadingAction === "decline" ? "Declining..." : "Decline"}
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={handleAccept}
              disabled={!!loadingAction}
              sx={{
                height: 42,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                fontSize: 15,
                bgcolor: "#2b6cff",
                color: "#fff",
                boxShadow: "0 8px 18px rgba(43, 108, 255, 0.22)",
                "&:hover": {
                  bgcolor: "#2058d7",
                  boxShadow: "0 10px 20px rgba(43, 108, 255, 0.28)",
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

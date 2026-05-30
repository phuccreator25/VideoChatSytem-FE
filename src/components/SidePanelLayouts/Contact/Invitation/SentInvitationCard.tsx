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
import type { InvitationActionStatus, SentInvitationItem } from "../../../../types/Invitation";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../../../redux/store";
import {
  clearInvitationActionStatus,
  onCancelSentInvitation,
  setInvitationActionStatus,
} from "../../../../redux/invitation.redux";
import useOpenConversation from "../../../../helpers/openConversation.helper";

export function SentInvitationCard({
  item,
  getTimeAgo,
}: {
  item: SentInvitationItem;
  getTimeAgo: (dateString: string) => string;
}) {
  const [isCancelling, setIsCancelling] = useState(false);

  const isCancelled = useSelector(
    (state: RootState) =>
      state.invitation.actionStatusById?.[item.id] as
        | InvitationActionStatus
        | undefined,
  );
  const dispatch = useDispatch<AppDispatch>();

  const { handleOpenConversation, isSubmitting } = useOpenConversation();

  const onCancel = async (id: string) => {
    if (isCancelling || isCancelled) return;

    try {
      setIsCancelling(true);
      const res = await dispatch(onCancelSentInvitation(id)).unwrap();

      if (res) {
        await dispatch(
          setInvitationActionStatus({
            id: item.id,
            status: "cancelled",
          }),
        );

        setTimeout(() => {
          dispatch(clearInvitationActionStatus(item.id));
        }, 700);
      }
    } finally {
      setIsCancelling(false);
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
                  Sent {getTimeAgo(item.sentAt)}
                </Typography>
              </Box>

              <IconButton
                onClick={() => handleOpenConversation(item.receiverId)}
                disabled={isSubmitting}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: "1px solid #e1e8f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6a7aa2",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                  bgcolor: "#f5f8ff",
                  cursor: "pointer",
                  transition: "all 0.2s ease",

                  "&:hover": {
                    bgcolor: "#e8f0ff",
                    color: "#2563eb",
                    borderColor: "#bcd0ff",
                    transform: "scale(1.06)",
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
            {item.message || "You sent a friend invitation"}
          </Typography>
        </Box>

        {isCancelled === "cancelled" ? (
          <Alert severity="success" sx={{ borderRadius: 2, alignItems: "center" }}>
            Invitation cancelled successfully.
          </Alert>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onClick={() => onCancel(item.id)}
            disabled={isCancelling}
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
              "&.Mui-disabled": {
                bgcolor: "#f3f6fc",
                color: "#95a2bf",
              },
            }}
          >
            {isCancelling ? "Cancelling..." : "Cancel invitation"}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

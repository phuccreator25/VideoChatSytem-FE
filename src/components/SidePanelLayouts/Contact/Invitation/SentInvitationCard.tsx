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
import type { InvitationActionStatus, SentInvitationItem } from "../../../../types/Invitation";
import { useDispatch, useSelector } from "react-redux";
import {type AppDispatch, type RootState } from "../../../../redux/store";
import {clearInvitationActionStatus, onCancelSentInvitation, onGetCountSentInvitation, onGetListSentInvitation, setInvitationActionStatus } from "../../../../redux/invitation.redux";

export function SentInvitationCard({
  item,
  getTimeAgo,
}: {
  item: SentInvitationItem;
  getTimeAgo: (dateString: string) => string;
}) {
  
  const [isCancelling, setIsCancelling] = useState(false);
  
  const isCancelled = useSelector(
    (state : RootState) => 
    state.invitation.actionStatusById?.[item.id] as InvitationActionStatus | undefined
  )    
  const dispatch = useDispatch<AppDispatch>();

  const refreshViewAllSent = async () => {
    await Promise.all([
      dispatch(onGetCountSentInvitation()),
      dispatch(onGetListSentInvitation({})),
    ]);
  };

  const onCancel = async (id: string) => {
    if (isCancelling || isCancelled) return;

    try {
      setIsCancelling(true);
      const res = await dispatch(onCancelSentInvitation(id)).unwrap();

      if (res) {
        await dispatch(
          setInvitationActionStatus({
            id: item.id,
            status: "cancelled"
          })
        )
        
        await refreshViewAllSent();

        setTimeout(() => {
          dispatch(clearInvitationActionStatus(item.id));
        }, 700)
      }
    } finally {
      setIsCancelling(false);
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
                  Sent {getTimeAgo(item.sentAt)}
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
            {item.message || "You sent a friend invitation"}
          </Typography>
        </Box>

        {isCancelled === 'cancelled' ? (
          <Alert
            severity="success"
            sx={{
              borderRadius: 2,
              alignItems: "center",
            }}
          >
            Invitation cancelled successfully.
          </Alert>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onClick={() => onCancel(item.id)}
            disabled={isCancelling}
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
              "&.Mui-disabled": {
                bgcolor: "#f3f4f6",
                color: "#9ca3af",
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
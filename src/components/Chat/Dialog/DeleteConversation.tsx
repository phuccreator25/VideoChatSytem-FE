import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { ConversationUserInfo } from "../../../types/chat/chat.conversation.type";

type DialogDeleteConversationProps = {
    isOpen: boolean;
    onClose: () => void;
    userData: ConversationUserInfo | null;
    isLoading: boolean;
    onConfirm: () => void;
}

export function DialogDeleteConversation({ isOpen, onClose, userData, isLoading, onConfirm }: DialogDeleteConversationProps) {
    
    const displayName = userData?.nickname || userData?.fullname || "Người dùng"

    return (
         <Dialog
        open={isOpen}
        onClose={() => onClose()}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "28px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(254, 202, 202, 0.6)",
            boxShadow: "0 25px 60px -15px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(239, 68, 68, 0.08)",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              bgcolor: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(10px)",
            },
          },
        }}
      >
        <Box sx={{ position: "relative", p: 3.5, textAlign: "center" }}>
          {/* Header Ambient Glow & Icon Badge */}
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
            }}
          >
            {/* Background glowing halo */}
            <Box
              sx={{
                position: "absolute",
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, rgba(239, 68, 68, 0) 70%)",
                filter: "blur(8px)",
                animation: "pulse 2s infinite ease-in-out",
                "@keyframes pulse": {
                  "0%": { transform: "scale(0.95)", opacity: 0.7 },
                  "50%": { transform: "scale(1.2)", opacity: 1 },
                  "100%": { transform: "scale(0.95)", opacity: 0.7 },
                },
              }}
            />
            {/* Main Icon Badge */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "22px",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
                position: "relative",
                zIndex: 1,
              }}
            >
              <DeleteForeverRoundedIcon sx={{ fontSize: 34 }} />
            </Box>
          </Box>

          {/* Close button at top right */}
          <IconButton
            size="small"
            onClick={() => onClose()}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "#94a3b8",
              bgcolor: "rgba(241, 245, 249, 0.8)",
              "&:hover": {
                bgcolor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#0f172a",
              fontSize: "20px",
              letterSpacing: "-0.3px",
              mb: 1,
            }}
          >
            Delete conversation ?
          </Typography>

          {/* Description text */}
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontSize: "13.5px",
              lineHeight: 1.5,
              mb: 2.5,
            }}
          >
            Are you sure you want to delete this conversation? This action cannot be undone.
          </Typography>

          {/* User target summary pill */}
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              px: 2,
              borderRadius: "16px",
              bgcolor: "rgba(248, 250, 252, 0.9)",
              border: "1px solid rgba(226, 232, 240, 0.9)",
              mb: 2.5,
            }}
          >
            <Avatar
              src={userData?.avatar}
              alt={displayName}
              sx={{
                width: 40,
                height: 40,
                bgcolor: "#4f46e5",
                fontWeight: 700,
                fontSize: 16,
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1, textAlign: "left" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: "#0f172a",
                  fontSize: "14px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontSize: "11.5px",
                  display: "block",
                }}
              >
                Direct conversation
              </Typography>
            </Box>
          </Paper>

          {/* Warning Banner / Details box */}
          <Box
            sx={{
              bgcolor: "rgba(254, 242, 242, 0.75)",
              border: "1px solid rgba(254, 202, 202, 0.8)",
              borderRadius: "14px",
              p: 1.75,
              mb: 3,
              textAlign: "left",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.25,
            }}
          >
            <WarningAmberRoundedIcon sx={{ color: "#ef4444", fontSize: 20, mt: 0.25, flexShrink: 0 }} />
            <Typography
              variant="caption"
              sx={{
                color: "#991b1b",
                fontSize: "12px",
                lineHeight: 1.45,
                fontWeight: 500,
              }}
            >
              All messages, images, and files shared in this conversation will be deleted from your account.
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              sx={{
                py: 1.25,
                borderRadius: "14px",
                color: "#475569",
                borderColor: "#cbd5e1",
                fontWeight: 700,
                fontSize: "13.5px",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#94a3b8",
                  bgcolor: "rgba(241, 245, 249, 0.8)",
                  color: "#0f172a",
                },
                transition: "all 0.2s ease",
              }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              variant="contained"
              disableElevation
              disabled={isLoading}
              onClick={() => {
                onConfirm();
              }}
              startIcon={<DeleteForeverRoundedIcon />}
              sx={{
                py: 1.25,
                borderRadius: "14px",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "13.5px",
                textTransform: "none",
                boxShadow: "0 8px 20px -4px rgba(239, 68, 68, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                  boxShadow: "0 10px 24px -2px rgba(239, 68, 68, 0.5)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Delete conversation
            </Button>
          </Stack>
        </Box>
      </Dialog>
    )
}
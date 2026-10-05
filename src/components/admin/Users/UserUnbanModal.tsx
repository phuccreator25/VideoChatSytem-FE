import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { AdminUserItem } from "../../../types/admin/userAdmin.type";
import { formatDate } from "../../../helpers/formatDate.helper";

type UserUnbanModalProps = {
  user: AdminUserItem | null;
  open: boolean;
  onClose: () => void;
  onConfirmUnban: (id: string) => void;
};

export const UserUnbanModal = ({
  user,
  open,
  onClose,
  onConfirmUnban,
}: UserUnbanModalProps) => {
  if (!user) return null;

  const handleConfirm = () => {
    if(!user) return;
    onConfirmUnban(user._id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          bgcolor: "#FFFFFF",
          p: 1,
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Modal Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          px: 3,
          pt: 3,
          pb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              minWidth: 42,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #10B981 0%, #059669 60%, #047857 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              boxShadow: "0 6px 16px -2px rgba(16, 185, 129, 0.35)",
            }}
          >
            <VerifiedUserRoundedIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.15rem",
                color: "#0F172A",
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
              }}
            >
              Unban User Account
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                fontSize: "0.85rem",
                fontWeight: 400,
                lineHeight: 1.4,
                mt: 0.25,
              }}
            >
              Restore account privileges and reactivate platform access
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: "#94A3B8",
            "&:hover": { color: "#475569", bgcolor: "#F1F5F9" },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        {/* Target User Info Summary Card */}
        <Box
          sx={{
            p: 2,
            mb: 2.5,
            borderRadius: "12px",
            bgcolor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              src={user.avatar || undefined}
              sx={{
                width: 44,
                height: 44,
                bgcolor: "#059669",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              {user.fullname?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
                {user.fullname}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.825rem" }}>
                {user.email} {user.username ? `• @${user.username}` : ""}
              </Typography>
            </Box>
          </Box>

          <Chip
            label="Currently Banned"
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.75rem",
              bgcolor: "#FEE2E2",
              color: "#DC2626",
              borderRadius: "6px",
              border: "1px solid rgba(220, 38, 38, 0.2)",
            }}
          />
        </Box>

        {/* Previous Ban Details Card */}
        {user.banReason && (
          <Box
            sx={{
              p: 2,
              mb: 2.5,
              borderRadius: "10px",
              bgcolor: "#FFFBEB",
              border: "1px solid #FDE68A",
            }}
          >
            <Typography variant="caption" sx={{ color: "#92400E", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", mb: 0.5 }}>
              Previous Sanction Record
            </Typography>
            <Typography variant="body2" sx={{ color: "#78350F", fontSize: "0.85rem", fontStyle: "italic", mb: 0.75 }}>
              "{user.banReason}"
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {user.bannedBy && (
                <Typography variant="caption" sx={{ color: "#B45309" }}>
                  Enforced by: <strong>{user.bannedByInfo?.fullname || user.bannedByInfo?.username}</strong>
                </Typography>
              )}
              {user.bannedAt && (
                <Typography variant="caption" sx={{ color: "#B45309" }}>
                  Date: <strong>{formatDate(user.bannedAt)}</strong>
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Informational Action Notice */}
        <Alert
          severity="success"
          icon={<InfoOutlinedIcon sx={{ fontSize: 20, color: "#059669" }} />}
          sx={{
            borderRadius: "10px",
            fontSize: "0.825rem",
            bgcolor: "rgba(16, 185, 129, 0.08)",
            color: "#065F46",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          Unbanning will immediately restore this account. The user will be able to log in, create/join video calls, and interact with other members without restrictions.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "flex-end", gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: "none", color: "#64748B", fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          startIcon={<CheckCircleRoundedIcon />}
          sx={{
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            color: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
            px: 2.5,
            py: 1,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            },
          }}
        >
          Confirm Unban
        </Button>
      </DialogActions>
    </Dialog>
  );
};

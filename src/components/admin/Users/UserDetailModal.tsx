import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Avatar,
  Button,
  Chip,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MarkEmailUnreadRoundedIcon from "@mui/icons-material/MarkEmailUnreadRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { UserStatusBadge } from "./UserStatusBadge";
import type { AdminUserItem } from "../../../types/admin/userAdmin.type";
import { formatDate } from "../../../helpers/formatDate.helper";
import type { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

type UserDetailModalProps = {
  user: AdminUserItem | null;
  open: boolean;
  onClose: () => void;
  onOpenBan: (user: AdminUserItem) => void;
  onOpenUnban: (user: AdminUserItem) => void;
  onResendVerification: (id: string) => void;
  isSendMailing: { [key: string]: boolean }
};

export const UserDetailModal = ({
  user,
  open,
  onClose,
  onOpenBan,
  onOpenUnban,
  onResendVerification,
  isSendMailing
}: UserDetailModalProps) => {
  const currentAdmin = useSelector((state: RootState) => state.admin.currentAdmin);

  if (!user) return null;

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
          color: "#0F172A",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
          p: 1,
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
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              minWidth: 42,
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #6366F1 0%, #7C3AED 60%, #8B5CF6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              boxShadow: "0 6px 16px -2px rgba(124, 58, 237, 0.35)",
            }}
          >
            <PersonOutlineRoundedIcon sx={{ fontSize: 22 }} />
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
              User Information
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
              Comprehensive account profile, activity logs, and status
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

      <DialogContent sx={{ px: 3, py: 2 }}>
        {/* User Profile Header Card */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2.25,
            borderRadius: "14px",
            bgcolor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            mb: 3,
          }}
        >
          <Avatar
            src={user.avatar || undefined}
            sx={{
              width: 56,
              height: 56,
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "#FFFFFF",
              background:
                user.role === "ADMIN"
                  ? "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)"
                  : "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {user.fullname?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "#0F172A",
                  lineHeight: 1.2,
                }}
              >
                {user.fullname}
              </Typography>
              <Chip
                label={user.role}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  bgcolor: user.role === "ADMIN" ? "#EDE9FE" : "#E0F2FE",
                  color: user.role === "ADMIN" ? "#6D28D9" : "#0369A1",
                  borderRadius: "6px",
                  border:
                    user.role === "ADMIN"
                      ? "1px solid rgba(124, 58, 237, 0.25)"
                      : "1px solid rgba(2, 132, 199, 0.25)",
                }}
              />
              <UserStatusBadge
                variant={user.isOnline ? "online" : "offline"}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                fontSize: "0.85rem",
                wordBreak: "break-all",
              }}
            >
              {user.username ? `@${user.username} • ` : ""}
              {user.email}
            </Typography>
          </Box>
        </Box>

        {/* Section: Account Overview Metrics */}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#64748B",
            display: "block",
            mb: 1.25,
            fontSize: "0.72rem",
          }}
        >
          Account Overview
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 2,
            mb: 3,
          }}
        >
          {/* Tile 1: Registered On */}
          <Box
            sx={{
              p: 1.75,
              borderRadius: "12px",
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                minWidth: 38,
                borderRadius: "10px",
                bgcolor: "#F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
              }}
            >
              <CalendarTodayRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: "#64748B", display: "block", fontSize: "0.75rem" }}
              >
                Registered On
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#0F172A",
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {formatDate(user.createdAt, true)}
              </Typography>
            </Box>
          </Box>

          {/* Tile 2: Last Active */}
          <Box
            sx={{
              p: 1.75,
              borderRadius: "12px",
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                minWidth: 38,
                borderRadius: "10px",
                bgcolor: user.isOnline ? "rgba(16, 185, 129, 0.1)" : "#F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: user.isOnline ? "#059669" : "#64748B",
              }}
            >
              <AccessTimeRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: "#64748B", display: "block", fontSize: "0.75rem" }}
              >
                Last Active
              </Typography>
              {user.isOnline ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    mt: 0.25,
                  }}
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      bgcolor: "#10B981",
                      boxShadow: "0 0 6px #10B981",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: "#059669",
                      fontSize: "0.85rem",
                    }}
                  >
                    Online Now
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#0F172A",
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {formatDate(user.lastSeenAt, true)}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Tile 3: Email Verification */}
          <Box
            sx={{
              p: 1.75,
              borderRadius: "12px",
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                minWidth: 38,
                borderRadius: "10px",
                bgcolor: user.isActive
                  ? "rgba(16, 185, 129, 0.1)"
                  : "rgba(245, 158, 11, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: user.isActive ? "#059669" : "#D97706",
              }}
            >
              {user.isActive ? (
                <CheckCircleRoundedIcon sx={{ fontSize: 18 }} />
              ) : (
                <MarkEmailUnreadRoundedIcon sx={{ fontSize: 18 }} />
              )}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: "#64748B", display: "block", fontSize: "0.75rem" }}
              >
                Email Status
              </Typography>
              <UserStatusBadge
                variant={user.isActive ? "active" : "pending"}
                label={user.isActive ? "Verified" : "Pending"}
              />
            </Box>
          </Box>

          {/* Tile 4: Account Sanction State */}
          <Box
            sx={{
              p: 1.75,
              borderRadius: "12px",
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                minWidth: 38,
                borderRadius: "10px",
                bgcolor: user.isBanned
                  ? "rgba(239, 68, 68, 0.1)"
                  : "rgba(16, 185, 129, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: user.isBanned ? "#DC2626" : "#059669",
              }}
            >
              <SecurityRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: "#64748B", display: "block", fontSize: "0.75rem" }}
              >
                Account State
              </Typography>
              <UserStatusBadge
                variant={user.isBanned ? "banned" : "normal"}
                label={user.isBanned ? "Banned" : "Normal"}
              />
            </Box>
          </Box>
        </Box>

        {/* Creator Info (Show if role !== client and createdByUser exists) */}
        {user.role?.toLowerCase() !== "client" && user.createdByUser && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#64748B",
                display: "block",
                mb: 1.25,
                fontSize: "0.72rem",
              }}
            >
              Created By
            </Typography>

            <Box
              sx={{
                p: 2,
                borderRadius: "14px",
                bgcolor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                src={user.createdByUser.avatar || undefined}
                sx={{
                  width: 48,
                  height: 48,
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
                  boxShadow: "0 3px 8px rgba(124, 58, 237, 0.2)",
                }}
              >
                {user.createdByUser.fullname?.charAt(0)?.toUpperCase() || "A"}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: "#0F172A",
                      lineHeight: 1.2,
                    }}
                  >
                    {user.createdByUser.fullname}
                  </Typography>
                  <Chip
                    icon={<AdminPanelSettingsRoundedIcon sx={{ fontSize: "14px !important", color: "#6D28D9 !important" }} />}
                    label="Admin Creator"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      height: 22,
                      bgcolor: "#EDE9FE",
                      color: "#6D28D9",
                      borderRadius: "6px",
                      border: "1px solid rgba(124, 58, 237, 0.25)",
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748B",
                    fontSize: "0.825rem",
                    wordBreak: "break-all",
                  }}
                >
                  {user.createdByUser.username ? `@${user.createdByUser.username} • ` : ""}
                  {user.createdByUser.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Pending Verification Callout Banner (only if unverified) */}
        {!user.isActive && (
          <Box
            sx={{
              p: 2,
              mb: 3,
              borderRadius: "12px",
              bgcolor: "#FFFBEB",
              border: "1px solid #FDE68A",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "#92400E", fontSize: "0.85rem" }}
              >
                Verification Email Pending
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#B45309", display: "block", mt: 0.25 }}
              >
                {"User has not activated the email link yet."}
              </Typography>
            </Box>
            <Button
              size="small"
              variant="contained"
              onClick={() => onResendVerification(user._id)}
              startIcon={<MarkEmailReadRoundedIcon sx={{ fontSize: 16 }} />}
              disabled={isSendMailing?.[user?._id]}
              sx={{
                textTransform: "none",
                fontSize: "0.78rem",
                fontWeight: 600,
                bgcolor: "#D97706",
                color: "#FFFFFF",
                boxShadow: "none",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                "&:hover": { bgcolor: "#B45309", boxShadow: "none" },
              }}
            >
              Resend Link
            </Button>
          </Box>
        )}

        {/* Sanctions Details (Only if user is BANNED) */}
        {user.isBanned && (
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#DC2626",
                display: "block",
                mb: 1.25,
                fontSize: "0.72rem",
              }}
            >
              Sanction & Enforcement Details
            </Typography>

            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                bgcolor: "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}
              >
                <WarningAmberRoundedIcon
                  sx={{ color: "#DC2626", fontSize: 20 }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "#DC2626" }}
                >
                  This account is currently BANNED
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "#991B1B", display: "block" }}
                  >
                    Banned At:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#7F1D1D" }}
                  >
                    {formatDate(user.bannedAt, true)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "#991B1B", display: "block" }}
                  >
                    Enforced By:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#7F1D1D" }}
                  >
                    {user.bannedByInfo?.fullname || user.bannedByInfo?.username}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "#991B1B", display: "block" }}
                >
                  Reason for Ban:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: "#7F1D1D",
                    bgcolor: "#FFFFFF",
                    p: 1.25,
                    borderRadius: "8px",
                    border: "1px solid #FECACA",
                    mt: 0.5,
                    fontSize: "0.85rem",
                  }}
                >
                  {user.banReason || "No specific reason stated."}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* Footer Actions */}
      {(user.role?.toLowerCase() !== "supper_admin" && user._id !== currentAdmin?._id )&& (
        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
            pt: 1.5,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {user.isBanned ? (
            <Button
              variant="contained"
              onClick={() => onOpenUnban(user)}
              startIcon={<CheckCircleRoundedIcon />}
              sx={{
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                px: 2.5,
                py: 0.9,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                },
              }}
            >
              Unban Account
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => onOpenBan(user)}
              startIcon={<BlockRoundedIcon />}
              sx={{
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                color: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)",
                px: 2.5,
                py: 0.9,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                },
              }}
            >
              Ban Account
            </Button>
          )}

          <Button
            onClick={onClose}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              color: "#64748B",
              fontWeight: 600,
              px: 2.5,
              py: 0.9,
              "&:hover": { bgcolor: "#F1F5F9", color: "#334155" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

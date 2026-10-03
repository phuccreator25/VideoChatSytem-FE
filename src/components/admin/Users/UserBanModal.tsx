import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Alert,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import GppBadRoundedIcon from "@mui/icons-material/GppBadRounded";
import type { AdminUserItem } from "../../../types/admin/userAdmin.type";
import { useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";

type UserBanModalProps = {
  user: AdminUserItem | null;
  open: boolean;
  onClose: () => void;
  onConfirmBan: ({_id, banReason}: {_id: string, banReason: string}) => void;
};

const quickBanReasons = [
  "Spamming in video calls",
  "Harassment & offensive language",
  "Suspicious account activity",
  "Violation of Terms of Service",
];

export const UserBanModal = ({
  user,
  open,
  onClose,
  onConfirmBan,
}: UserBanModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<{ banReason: string }>({
    defaultValues: { banReason: "" },
    mode: "onBlur",
  });

  const banReason = watch("banReason") || "";

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleSelectQuickReason = (quickReason: string) => {
    setValue("banReason", quickReason, { shouldValidate: true, shouldDirty: true });
    trigger("banReason");
  };

  const onSubmit = async (data: { banReason: string }) => {
    if(!user) return;

    if (!data.banReason.trim()) {
      enqueueSnackbar("Please provide a specific reason for banning this account.", {variant: "error"});
      return;
    }

    await onConfirmBan({_id:user?._id, banReason:data.banReason.trim()});
    reset();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 60%, #B91C1C 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 6px 16px -2px rgba(239, 68, 68, 0.35)",
              }}
            >
              <GppBadRoundedIcon sx={{ fontSize: 22 }} />
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
                Ban User Account
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
                Revoke session tokens and suspend platform access
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={handleClose}
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
                src={user?.avatar || undefined}
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "#EF4444",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
                  {user?.fullname}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.825rem" }}>
                  {user?.email} {user?.username ? `• @${user?.username}` : ""}
                </Typography>
              </Box>
            </Box>

            <Chip
              label={user?.role}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                bgcolor: user?.role === "ADMIN" ? "#EDE9FE" : "#F1F5F9",
                color: user?.role === "ADMIN" ? "#6D28D9" : "#475569",
                borderRadius: "6px",
              }}
            />
          </Box>

          {/* Warning Impact Notice */}
          <Alert
            severity="error"
            icon={<WarningAmberRoundedIcon sx={{ fontSize: 20, color: "#DC2626" }} />}
            sx={{
              mb: 2.5,
              borderRadius: "10px",
              fontSize: "0.825rem",
              bgcolor: "rgba(239, 68, 68, 0.06)",
              color: "#991B1B",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <strong>Warning:</strong> The user will be immediately disconnected from any live video/chat rooms and blocked from signing in until unbanned.
          </Alert>

          {/* Reason Input */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <TextField
              autoFocus
              label="Ban Reason *"
              placeholder="Specify the reason for suspending this account..."
              fullWidth
              multiline
              rows={3}
              InputLabelProps={{
                shrink: banReason ? true : undefined,
              }}
              {...register("banReason", {
                required: "Reason is required",
                validate: (value) => value.trim().length > 0 || "Reason is required",
              })}
              error={Boolean(errors.banReason)}
              helperText={errors.banReason?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                },
              }}
            />

            {/* Quick Reason Suggestions */}
            <Box>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600, display: "block", mb: 0.75 }}>
                Quick Preset Reasons:
              </Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                {quickBanReasons.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    size="small"
                    onClick={() => handleSelectQuickReason(item)}
                    clickable
                    sx={{
                      fontSize: "0.75rem",
                      borderRadius: "6px",
                      bgcolor: banReason === item ? "rgba(239, 68, 68, 0.12)" : "#F1F5F9",
                      color: banReason === item ? "#DC2626" : "#475569",
                      borderColor: banReason === item ? "#FCA5A5" : "transparent",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      "&:hover": {
                        bgcolor: "rgba(239, 68, 68, 0.08)",
                        color: "#DC2626",
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={handleClose}
            sx={{ textTransform: "none", color: "#64748B", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<BlockRoundedIcon />}
            disabled={isSubmitting}
            sx={{
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              color: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)",
              px: 2.5,
              py: 1,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
              },
            }}
          >
            Confirm Ban
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

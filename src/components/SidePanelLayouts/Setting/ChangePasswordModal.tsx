import { useState } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import type { ChangePasswordForm } from "../../../types/profile/profile.model.type";
import {
  evaluatePasswordStrength,
  PASSWORD_REQUIREMENTS,
  passwordValidationRules,
  currentPasswordValidationRules,
  validateConfirmPassword,
} from "../../../helpers/passwordValidation.helper";
import type { AppDispatch } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { onUpdateProfile } from "../../../redux/auth.redux";
import { enqueueSnackbar } from "notistack";

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ChangePasswordForm>({
    mode: "onChange",
    defaultValues: {
      currentPass: "",
      password: "",
      confirmPass: "",
    },
  });

  const newPassword = watch("password") || "";
  const confirmPassword = watch("confirmPass") || "";

  const strength = evaluatePasswordStrength(newPassword);

  const isMinLength = newPassword.length >= PASSWORD_REQUIREMENTS.minLength;
  const hasNumber = PASSWORD_REQUIREMENTS.hasNumber(newPassword);
  const hasUppercase = PASSWORD_REQUIREMENTS.hasUppercase(newPassword);
  const hasSpecialChar = PASSWORD_REQUIREMENTS.hasSpecialChar(newPassword);
  const isMatch = confirmPassword.length > 0 && validateConfirmPassword(confirmPassword, newPassword) === true;

  const handleResetForm = () => {
    reset();
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      await dispatch(onUpdateProfile(data)).unwrap()

      enqueueSnackbar("Đổi mật khẩu thành công", {
        variant: "success",
      })

      reset()
      onClose()
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.message || "Đổi mật khẩu thất bại", {
        variant: "error",
      })
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleResetForm}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#ffffff",
          backgroundImage: "none",
          boxShadow: "0 24px 48px rgba(15, 23, 42, 0.16)",
          overflow: "hidden",
          border: "1px solid rgba(148, 163, 184, 0.18)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: { xs: 2.5, sm: 3 },
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
          bgcolor: "rgba(248, 250, 252, 0.6)",
        }}
      >
        <Stack direction="row" spacing={1.75} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: "rgba(99, 102, 241, 0.08)",
              color: "#6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.12)",
            }}
          >
            <LockResetRoundedIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.01em",
              }}
            >
              Change Password
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#64748b", mt: 0.2 }}>
              Update your account password to stay secure
            </Typography>
          </Box>
        </Stack>

        <IconButton
          onClick={handleResetForm}
          size="small"
          sx={{
            color: "#64748b",
            "&:hover": { bgcolor: "rgba(148, 163, 184, 0.14)", color: "#0f172a" },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      {/* Content Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent
        sx={{
          p: { xs: 2.5, sm: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        {/* Security Banner Note */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: "rgba(239, 246, 255, 0.7)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 20, color: "#2563eb", mt: 0.2, flexShrink: 0 }} />
          <Typography sx={{ fontSize: 13, color: "#1e40af", leading: 1.5 }}>
            Changing your password will sign you out of all other active sessions for security purposes.
          </Typography>
        </Paper>

        {/* Current Password */}
        <Box>
          <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "#334155", mb: 0.8 }}>
            Current Password
          </Typography>
          <TextField
            fullWidth
            size="small"
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Enter your current password"
            {...register("currentPass", currentPasswordValidationRules)}
            error={!!errors.currentPass}
            helperText={errors.currentPass?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    edge="end"
                    sx={{ color: "#94a3b8" }}
                  >
                    {showCurrentPassword ? (
                      <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2.5,
                fontSize: 14,
                bgcolor: "#f8fafc",
                "& fieldset": { borderColor: errors.currentPass ? "#ef4444" : "rgba(148, 163, 184, 0.25)" },
                "&:hover fieldset": { borderColor: "rgba(99, 102, 241, 0.4)" },
              },
            }}
          />
        </Box>

        {/* New Password */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
            <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "#334155" }}>
              New Password
            </Typography>
            {strength.label && (
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: strength.color }}>
                {strength.label}
              </Typography>
            )}
          </Stack>

          <TextField
            fullWidth
            size="small"
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter a new password"
            {...register("password", passwordValidationRules)}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    edge="end"
                    sx={{ color: "#94a3b8" }}
                  >
                    {showNewPassword ? (
                      <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2.5,
                fontSize: 14,
                bgcolor: "#f8fafc",
                "& fieldset": { borderColor: errors.password ? "#ef4444" : "rgba(148, 163, 184, 0.25)" },
                "&:hover fieldset": { borderColor: "rgba(99, 102, 241, 0.4)" },
              },
            }}
          />

          {/* Strength Bar */}
          {newPassword && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={strength.score}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "rgba(226, 232, 240, 0.8)",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: strength.color,
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                  },
                }}
              />
            </Box>
          )}

          {/* Password Requirements Checklist */}
          <Box sx={{ mt: 1.2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            <Stack direction="row" spacing={0.6} alignItems="center">
              <CheckCircleRoundedIcon
                sx={{
                  fontSize: 15,
                  color: isMinLength ? "#10b981" : "#cbd5e1",
                  transition: "color 0.2s ease",
                }}
              />
              <Typography
                sx={{
                  fontSize: 12,
                  color: isMinLength ? "#0f172a" : "#94a3b8",
                  fontWeight: isMinLength ? 600 : 400,
                }}
              >
                At least 8 characters
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.6} alignItems="center">
              <CheckCircleRoundedIcon
                sx={{
                  fontSize: 15,
                  color: hasUppercase ? "#10b981" : "#cbd5e1",
                  transition: "color 0.2s ease",
                }}
              />
              <Typography
                sx={{
                  fontSize: 12,
                  color: hasUppercase ? "#0f172a" : "#94a3b8",
                  fontWeight: hasUppercase ? 600 : 400,
                }}
              >
                Uppercase letter (A-Z)
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.6} alignItems="center">
              <CheckCircleRoundedIcon
                sx={{
                  fontSize: 15,
                  color: hasNumber ? "#10b981" : "#cbd5e1",
                  transition: "color 0.2s ease",
                }}
              />
              <Typography
                sx={{
                  fontSize: 12,
                  color: hasNumber ? "#0f172a" : "#94a3b8",
                  fontWeight: hasNumber ? 600 : 400,
                }}
              >
                Number (0-9)
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.6} alignItems="center">
              <CheckCircleRoundedIcon
                sx={{
                  fontSize: 15,
                  color: hasSpecialChar ? "#10b981" : "#cbd5e1",
                  transition: "color 0.2s ease",
                }}
              />
              <Typography
                sx={{
                  fontSize: 12,
                  color: hasSpecialChar ? "#0f172a" : "#94a3b8",
                  fontWeight: hasSpecialChar ? 600 : 400,
                }}
              >
                Special character (!@#$)
              </Typography>
            </Stack>
          </Box>
        </Box>

        {/* Confirm New Password */}
        <Box>
          <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "#334155", mb: 0.8 }}>
            Confirm New Password
          </Typography>
          <TextField
            fullWidth
            size="small"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter your new password"
            {...register("confirmPass", {
              required: "Please confirm your password",
              validate: (val) => validateConfirmPassword(val, newPassword),
            })}
            error={!!errors.confirmPass}
            helperText={errors.confirmPass?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                    sx={{ color: "#94a3b8" }}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2.5,
                fontSize: 14,
                bgcolor: "#f8fafc",
                "& fieldset": {
                  borderColor: errors.confirmPass
                    ? "#ef4444"
                    : confirmPassword
                    ? isMatch
                      ? "rgba(16, 185, 129, 0.5)"
                      : "rgba(239, 68, 68, 0.5)"
                    : "rgba(148, 163, 184, 0.25)",
                },
                "&:hover fieldset": { borderColor: "rgba(99, 102, 241, 0.4)" },
              },
            }}
          />

          {confirmPassword && !errors.confirmPass && (
            <Typography
              sx={{
                fontSize: 12,
                mt: 0.6,
                fontWeight: 600,
                color: isMatch ? "#10b981" : "#ef4444",
              }}
            >
              {isMatch ? "✓ Passwords match" : "✕ Passwords do not match"}
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            type="button"
            onClick={handleResetForm}
            sx={{
              borderRadius: 2.5,
              px: 2.5,
              py: 0.8,
              fontSize: 13.5,
              fontWeight: 600,
              color: "#64748b",
              borderColor: "rgba(148, 163, 184, 0.25)",
              textTransform: "none",
              "&:hover": {
                bgcolor: "rgba(148, 163, 184, 0.08)",
                borderColor: "#94a3b8",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || !isMatch}
            sx={{
              borderRadius: 2.5,
              px: 3,
              py: 0.8,
              fontSize: 13.5,
              fontWeight: 700,
              bgcolor: "#4f46e5",
              color: "#ffffff",
              textTransform: "none",
              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
              "&:hover": {
                bgcolor: "#4338ca",
                boxShadow: "0 6px 18px rgba(79, 70, 229, 0.4)",
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(148, 163, 184, 0.2)",
                color: "#94a3b8",
              },
            }}
          >
            Update Password
          </Button>
        </Stack>
      </DialogContent>
      </form>
    </Dialog>
  );
}


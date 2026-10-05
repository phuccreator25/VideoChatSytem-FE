import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import { useForm } from "react-hook-form";
import {
  fullnameValidationRules,
  usernameValidationRules,
  emailValidationRules,
  passwordValidationRules,
} from "../../../validations/accountValidation.helper";
import type { typeDataCreateUser } from "../../../types/admin/userAdmin.type";
import { generateRandomPassword } from "../../../helpers/admin/userAdmin.helper";

type UserCreateModalProps = {
  open: boolean;
  onClose: () => void;
  onCreateAdmin: (newAdmin: typeDataCreateUser) => void;
};

export const UserCreateModal = ({
  open,
  onClose,
  onCreateAdmin,
}: UserCreateModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<typeDataCreateUser>({
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onGeneratePassword = () => {
    const {password, confirmPassword} = generateRandomPassword();
    setValue("password", password, { shouldValidate: true, shouldDirty: true });
    setValue("confirmPassword", confirmPassword, { shouldValidate: true, shouldDirty: true });
    trigger(["password", "confirmPassword"]);
  }

  const handleFormSubmit = async (data: typeDataCreateUser) => {
    await onCreateAdmin(data)
    handleClose();
  };

  const handleClose = () => {
    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            px: 3,
            pt: 3,
            pb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                minWidth: 42,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366F1 0%, #7C3AED 60%, #8B5CF6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 6px 16px -2px rgba(124, 58, 237, 0.35)",
              }}
            >
              <SecurityRoundedIcon sx={{ fontSize: 22 }} />
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
                Create Admin Account
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
                Grant administrative privileges and system management access
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
          {/* Role Notice */}
          <Alert
            severity="info"
            icon={<SecurityRoundedIcon sx={{ fontSize: 20, color: "#7C3AED" }} />}
            sx={{
              mb: 2.5,
              borderRadius: "10px",
              fontSize: "0.825rem",
              bgcolor: "rgba(124, 58, 237, 0.06)",
              color: "#5B21B6",
              border: "1px solid rgba(124, 58, 237, 0.18)",
            }}
          >
            Assigned Role: <strong>ADMIN</strong>. This account will have full access to view users, enforce moderation, and configure system settings.
          </Alert>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Full Name & Username Row */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
              <TextField
                label="Full Name *"
                placeholder="Enter full name"
                fullWidth
                {...register("fullname", fullnameValidationRules)}
                error={Boolean(errors.fullname)}
                helperText={errors.fullname?.message}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.875rem" } }}
              />

              <TextField
                label="Username (Optional)"
                placeholder="Enter username"
                fullWidth
                {...register("username", usernameValidationRules)}
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
                InputProps={{
                  startAdornment: <InputAdornment position="start">@</InputAdornment>,
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.875rem" } }}
              />
            </Box>

            {/* Email Address */}
            <TextField
              label="Email *"
              type="email"
              placeholder="you@example.com"
              fullWidth
              {...register("email", emailValidationRules)}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.875rem" } }}
            />

            {/* Password Field */}
            <Box>
              <TextField
                label="Password *"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                fullWidth
                {...register("password", passwordValidationRules)}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyRoundedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        sx={{ color: "#94A3B8" }}
                      >
                        {showPassword ? (
                          <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} />
                        ) : (
                          <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.875rem" } }}
              />

              {/* Password Generator Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.75 }}>
                <Button
                  size="small"
                  onClick={onGeneratePassword}
                  startIcon={<AutoFixHighRoundedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "#7C3AED",
                    "&:hover": { bgcolor: "rgba(124, 58, 237, 0.08)" },
                  }}
                >
                  Generate Strong Password
                </Button>
              </Box>
            </Box>

            {/* Confirm Password Field */}
            <TextField
              label="Confirm Password *"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              fullWidth
              {...register("confirmPassword", {
                required: "Please confirm password",
                validate: (val, formValues) =>
                  val === formValues.password || "Passwords do not match",
              })}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyRoundedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                      sx={{ color: "#94A3B8" }}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.875rem" } }}
            />

            {/* Role Badge Preview */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                bgcolor: "#F8FAFC",
                borderRadius: "10px",
                border: "1px solid #E2E8F0",
              }}
            >
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
                Account Privileges
              </Typography>
              <Chip
                label="Role: ADMIN"
                size="small"
                sx={{
                  bgcolor: "#EDE9FE",
                  color: "#6D28D9",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  borderRadius: "6px",
                  border: "1px solid rgba(124, 58, 237, 0.25)",
                }}
              />
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
            disabled={isSubmitting}
            variant="contained"
            startIcon={<PersonAddRoundedIcon />}
            sx={{
              background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
              color: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
              px: 2.5,
              py: 1,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)",
              },
            }}
          >
            Create Admin
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

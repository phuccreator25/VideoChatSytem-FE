import { useEffect, useState } from "react";
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
  InputAdornment,
  Alert,
  MenuItem,
  Collapse,
} from "@mui/material";
import { roleList } from "../../../data/user.data";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
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
  PASSWORD_REGEX,
} from "../../../validations/accountValidation.helper";
import type { AdminUserItem, typeDataUpdateUser } from "../../../types/admin/userAdmin.type";
import { generateRandomPassword } from "../../../helpers/admin/userAdmin.helper";

type UserUpdateModalProps = {
  open: boolean;
  user: AdminUserItem | null;
  onClose: () => void;
  onUpdateAdmin: (updatedData: typeDataUpdateUser) => void;
};

export const UserUpdateModal = ({
  open,
  user,
  onClose,
  onUpdateAdmin,
}: UserUpdateModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<typeDataUpdateUser>({
    defaultValues: {
      _id: "",
      fullname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
    mode: "onTouched",
  });

  const onGeneratePassword = () => {
    const { password, confirmPassword } = generateRandomPassword();
    setValue("password", password, { shouldValidate: true, shouldDirty: true });
    setValue("confirmPassword", confirmPassword, { shouldValidate: true, shouldDirty: true });
    trigger(["password", "confirmPassword"]);
  }

  const handleToggleChangePassword = () => {
    setIsChangingPassword((prev) => {
      const nextState = !prev;
      if (!nextState) {
        setValue("password", "");
        setValue("confirmPassword", "");
        clearErrors(["password", "confirmPassword"]);
      }
      return nextState;
    });
  };


  const handleFormSubmit = (data: typeDataUpdateUser) => {
    if (!user) return;

    onUpdateAdmin({
      _id: user._id,
      fullname: data.fullname?.trim(),
      username: data.username?.trim(),
      email: data.email?.trim().toLowerCase(),
      password: isChangingPassword && data.password ? data.password : undefined,
      role: data.role,
    });

    handleClose();
  };

  useEffect(() => {
    if (!user) return;
    reset({
      _id: user._id,
      fullname: user.fullname || "",
      username: user.username || "",
      email: user.email || "",
      password: "",
      confirmPassword: "",
      role: user.role || "client",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsChangingPassword(false);
  }, [user, reset]);

  const handleClose = () => {
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsChangingPassword(false);
    reset();
    onClose();
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
                background:
                  "linear-gradient(135deg, #6366F1 0%, #7C3AED 60%, #8B5CF6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 6px 16px -2px rgba(124, 58, 237, 0.35)",
              }}
            >
              <EditRoundedIcon sx={{ fontSize: 22 }} />
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
                Update Admin Account
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
                Modify administrative credentials and account profile
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
          {/* Admin Role Status Notice */}
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
            Editing Admin account for: <strong>{user?.email}</strong>. Changes will apply immediately.
          </Alert>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Full Name & Username Row */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gap: 2,
              }}
            >
              <TextField
                label="Full Name *"
                placeholder="Enter full name"
                fullWidth
                {...register("fullname", fullnameValidationRules)}
                error={Boolean(errors.fullname)}
                helperText={errors.fullname?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                  },
                }}
              />

              <TextField
                label="Username (Optional)"
                placeholder="Enter username"
                fullWidth
                {...register("username", usernameValidationRules)}
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">@</InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                  },
                }}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                },
              }}
            />

            {/* Role Select */}
            {user?.role !== 'supper_admin' && (
              <TextField
                select
                label="Role *"
                fullWidth
                value={watch("role") || "client"}
                {...register("role", { required: "Role is required" })}
                onChange={(e) =>
                  setValue("role", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={Boolean(errors.role)}
                helperText={errors.role?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                  },
                }}
              >
                {roleList
                  .filter((item) => item.value !== "all" && item.value !== "supper_admin")
                  .map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
              </TextField>
            )}

            {/* Change Password Toggle Section */}
            <Box
              sx={{
                p: 1.75,
                bgcolor: isChangingPassword ? "rgba(124, 58, 237, 0.03)" : "#F8FAFC",
                borderRadius: "12px",
                border: "1px solid",
                borderColor: isChangingPassword ? "rgba(124, 58, 237, 0.25)" : "#E2E8F0",
                transition: "all 0.2s ease",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "8px",
                      bgcolor: isChangingPassword ? "rgba(124, 58, 237, 0.12)" : "#E2E8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isChangingPassword ? "#7C3AED" : "#64748B",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <KeyRoundedIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#1E293B", fontSize: "0.875rem" }}
                    >
                      Account Password
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", fontSize: "0.75rem", display: "block" }}
                    >
                      {isChangingPassword
                        ? "Enter new password for this user"
                        : "Password is kept unchanged"}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  size="small"
                  variant={isChangingPassword ? "outlined" : "contained"}
                  onClick={handleToggleChangePassword}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    borderRadius: "8px",
                    px: 1.5,
                    ...(isChangingPassword
                      ? {
                        color: "#64748B",
                        borderColor: "#CBD5E1",
                        "&:hover": { bgcolor: "#F1F5F9", borderColor: "#94A3B8" },
                      }
                      : {
                        bgcolor: "#7C3AED",
                        color: "#FFFFFF",
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#6D28D9", boxShadow: "none" },
                      }),
                  }}
                >
                  {isChangingPassword ? "Cancel" : "Change Password"}
                </Button>
              </Box>

              {/* Collapsible Password Fields */}
              <Collapse in={isChangingPassword} unmountOnExit>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    pt: 2,
                    mt: 1.5,
                    borderTop: "1px dashed rgba(124, 58, 237, 0.2)",
                  }}
                >
                  {/* New Password Field */}
                  <Box>
                    <TextField
                      label="New Password *"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      fullWidth
                      {...register("password", {
                        validate: (val) => {
                          if (!isChangingPassword) return true;
                          if (!val || val.length === 0) {
                            return "Please enter a new password";
                          }
                          if (val.length < 8) {
                            return "Password must be at least 8 characters long";
                          }
                          if (!PASSWORD_REGEX.test(val)) {
                            return "Password must contain uppercase, lowercase, numbers, and special characters";
                          }
                          return true;
                        },
                      })}
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          fontSize: "0.875rem",
                          bgcolor: "#FFFFFF",
                        },
                      }}
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

                  {/* Confirm New Password Field */}
                  <TextField
                    label="Confirm New Password *"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    fullWidth
                    {...register("confirmPassword", {
                      validate: (val, formValues) => {
                        if (!isChangingPassword) return true;
                        const currentPassword = formValues.password;
                        if (!val || val.length === 0) {
                          return "Please confirm your new password";
                        }
                        if (val !== currentPassword) {
                          return "Passwords do not match";
                        }
                        return true;
                      },
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "0.875rem",
                        bgcolor: "#FFFFFF",
                      },
                    }}
                  />
                </Box>
              </Collapse>
            </Box>


          </Box>
        </DialogContent>

        <DialogActions
          sx={{ px: 3, pb: 2, justifyContent: "flex-end", gap: 1 }}
        >
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
            startIcon={<EditRoundedIcon />}
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
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

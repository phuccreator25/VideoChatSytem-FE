import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import type { typeUpdateAdmin } from "../../../types/admin/profileAdmin.type";
import { useForm } from "react-hook-form";
import {
  passwordValidationRules,
} from "../../../validations/accountValidation.helper";

export const AdminPasswordForm= ({
  onSave,
}: {onSave: (payload: typeUpdateAdmin) => Promise<void> | void}) => {
    
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors, isSubmitting, isDirty },
    } = useForm<typeUpdateAdmin>({
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const newPass = watch("newPassword");

  const onSubmit = async (payload: typeUpdateAdmin) => {
    if (onSave) {
      await onSave(payload);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        p: { xs: 2.5, sm: 3.5 },
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#0F172A" }}
      >
        Security & Change Password
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "#64748B", fontSize: "0.82rem", mt: 0.5, mb: 3 }}
      >
        Verify identity and securely update account login password
      </Typography>

      {/* Inputs Container */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, flex: 1 }}>
          {/* Field 1: Current Password */}
          <Box>
            <Typography
              sx={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#334155",
                mb: 0.75,
              }}
            >
              Current Password
            </Typography>
            <TextField
              fullWidth
              type={showCurrentPass ? "text" : "password"}
              {...register("currentPassword", passwordValidationRules)}
              error={Boolean(errors.currentPassword)}
              helperText={errors.currentPassword?.message}
              placeholder="Current Password"
              size="small"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        edge="end"
                        size="small"
                        sx={{ color: "#94A3B8" }}
                      >
                        {showCurrentPass ? (
                          <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                        ) : (
                          <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  bgcolor: "#FFFFFF",
                  fontSize: "0.875rem",
                  "& fieldset": { borderColor: "#E2E8F0" },
                  "&:hover fieldset": { borderColor: "#CBD5E1" },
                  "&.Mui-focused fieldset": { borderColor: "#6366F1", borderWidth: "1.5px" },
                },
                "& .MuiOutlinedInput-input": {
                  py: 1.2,
                  px: 1.75,
                  color: "#0F172A",
                },
              }}
            />
          </Box>

          {/* Field 2: New Password */}
          <Box>
            <Typography
              sx={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#334155",
                mb: 0.75,
              }}
            >
              New Password
            </Typography>
            <TextField
              fullWidth
              type={showNewPass ? "text" : "password"}
              {...register("newPassword", passwordValidationRules)}
              error={Boolean(errors.newPassword)}
              helperText={errors.newPassword?.message}
              placeholder="New Password"
              size="small"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPass(!showNewPass)}
                        edge="end"
                        size="small"
                        sx={{ color: "#94A3B8" }}
                      >
                        {showNewPass ? (
                          <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                        ) : (
                          <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  bgcolor: "#FFFFFF",
                  fontSize: "0.875rem",
                  "& fieldset": { borderColor: "#A5B4FC" },
                  "&:hover fieldset": { borderColor: "#818CF8" },
                  "&.Mui-focused fieldset": { borderColor: "#6366F1", borderWidth: "1.5px" },
                },
                "& .MuiOutlinedInput-input": {
                  py: 1.2,
                  px: 1.75,
                  color: "#0F172A",
                },
              }}
            />
          </Box>

          {/* Field 3: Confirm New Password */}
          <Box>
            <Typography
              sx={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#334155",
                mb: 0.75,
              }}
            >
              Confirm New Password
            </Typography>
            <TextField
              fullWidth
              type={showConfirmPass ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Please confirm new password",
                validate: (val) => {
                  if (newPass && val !== newPass) {
                    return "Confirm password not match";
                  }
                  return true;
                },
              })}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              placeholder="Confirm Password"
              size="small"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        edge="end"
                        size="small"
                        sx={{ color: "#94A3B8" }}
                      >
                        {showConfirmPass ? (
                          <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                        ) : (
                          <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  bgcolor: "#FFFFFF",
                  fontSize: "0.875rem",
                  "& fieldset": { borderColor: "#E2E8F0" },
                  "&:hover fieldset": { borderColor: "#CBD5E1" },
                  "&.Mui-focused fieldset": { borderColor: "#6366F1", borderWidth: "1.5px" },
                },
                "& .MuiOutlinedInput-input": {
                  py: 1.2,
                  px: 1.75,
                  color: "#0F172A",
                },
              }}
            />
          </Box>

          {/* Password Requirement Hint Box */}
          <Box
            sx={{
              bgcolor: "#ECFDF5",
              border: "1px solid #A7F3D0",
              borderRadius: "8px",
              py: 1.2,
              px: 1.75,
              display: "flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <CheckRoundedIcon sx={{ fontSize: 16, color: "#10B981" }} />
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "#065F46",
              }}
            >
              Strength: Minimum 8 characters, including numbers, uppercase & special characters
            </Typography>
          </Box>

          {/* Action Button: CHANGE PASSWORD */}
          <Box sx={{ mt: 1, pt: 1, display: "flex", justifyContent: "right" }}>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting || !isDirty}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                bgcolor: "#5B50E5",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.82rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                px: 3,
                py: 1.15,
                borderRadius: "8px",
                boxShadow: "0 4px 14px rgba(91, 80, 229, 0.3)",
                "&:hover": {
                  bgcolor: "#4B40D5",
                  boxShadow: "0 6px 18px rgba(91, 80, 229, 0.4)",
                },
              }}
            >
              CHANGE PASSWORD
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default AdminPasswordForm;

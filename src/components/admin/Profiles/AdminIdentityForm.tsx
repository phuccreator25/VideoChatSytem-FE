import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { typeProfileAdmin, typeUpdateAdmin } from "../../../types/admin/profileAdmin.type";
import { useForm } from "react-hook-form";
import {
  fullnameValidationRules,
  usernameValidationRules,
} from "../../../validations/accountValidation.helper";

export type AdminIdentityFormProps = {
  data: typeProfileAdmin | null;
  onSave?: (payload: typeUpdateAdmin) => Promise<void> | void;
}

export const AdminIdentityForm = ({
  data,
  onSave,
}: AdminIdentityFormProps) => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<typeUpdateAdmin>({
    values: {
      fullname: data?.fullname || "",
      username: data?.username || "",
    },
    resetOptions: {
      keepDirtyValues: true, // Giữ lại thong tin đã nhập khi form re-render
    },
    mode: "onTouched",
  });

  const onSubmit = async (payload: typeUpdateAdmin) => {
    if (onSave) {
      await onSave(payload);
      reset(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
        Edit Identity Information
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "#64748B", fontSize: "0.82rem", mt: 0.5, mb: 3 }}
      >
        Update your information.
      </Typography>

      {/* Inputs Container */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, flex: 1 }}>
        {/* Field 1: Fullname */}
        <Box>
          <Typography
            sx={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#334155",
              mb: 0.75,
            }}
          >
            Full Name
          </Typography>
          <TextField
            fullWidth
            {...register("fullname", fullnameValidationRules)}
            error={Boolean(errors.fullname)}
            helperText={errors.fullname?.message}
            placeholder="Enter full name"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                bgcolor: "#FFFFFF",
                fontSize: "0.875rem",
                "& fieldset": { borderColor: "#E2E8F0" },
                "&:hover fieldset": { borderColor: "#CBD5E1" },
                "&.Mui-focused fieldset": { borderColor: "#6366F1", borderWidth: "1.5px" },
                "&.Mui-error fieldset": { borderColor: "#EF4444" },
              },
              "& .MuiOutlinedInput-input": {
                py: 1.2,
                px: 1.75,
                color: "#0F172A",
              },
              "& .MuiFormHelperText-root": {
                mx: 0,
                mt: 0.5,
                fontSize: "0.75rem",
                color: "#EF4444",
              },
            }}
          />
        </Box>

        {/* Field 2: Username */}
        <Box>
          <Typography
            sx={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#334155",
              mb: 0.75,
            }}
          >
            Username
          </Typography>
          <TextField
            fullWidth
            {...register("username", usernameValidationRules)}
            error={Boolean(errors.username)}
            helperText={errors.username?.message}
            placeholder="@username"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                bgcolor: "#FFFFFF",
                fontSize: "0.875rem",
                "& fieldset": { borderColor: "#E2E8F0" },
                "&:hover fieldset": { borderColor: "#CBD5E1" },
                "&.Mui-focused fieldset": { borderColor: "#6366F1", borderWidth: "1.5px" },
                "&.Mui-error fieldset": { borderColor: "#EF4444" },
              },
              "& .MuiOutlinedInput-input": {
                py: 1.2,
                px: 1.75,
                color: "#0F172A",
              },
              "& .MuiFormHelperText-root": {
                mx: 0,
                mt: 0.5,
                fontSize: "0.75rem",
                color: "#EF4444",
              },
            }}
          />
        </Box>

        {/* Field 3: Admin Email (Read-only) */}
        <Box>
          <Typography
            sx={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#334155",
              mb: 0.75,
            }}
          >
            Admin Email (Read-only)
          </Typography>
          <TextField
            fullWidth
            value={data?.email}
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <LockOutlinedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              },
            }}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                bgcolor: "#F8FAFC",
                fontSize: "0.875rem",
                "& fieldset": { borderColor: "#E2E8F0" },
                "&:hover fieldset": { borderColor: "#E2E8F0" },
              },
              "& .MuiOutlinedInput-input": {
                py: 1.2,
                px: 1.75,
                color: "#64748B",
              },
            }}
          />
        </Box>

        {/* Email Info Hint Box */}
        <Box
          sx={{
            bgcolor: "#F0F9FF",
            border: "1px solid #BAE6FD",
            borderRadius: "8px",
            py: 1.2,
            px: 1.75,
            display: "flex",
            alignItems: "center",
            gap: 0.75,
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 16, color: "#0284C7" }} />
          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: 500,
              color: "#0369A1",
              textAlign: "left",
            }}
          >
            Note: Admin email is permanently protected and cannot be modified
          </Typography>
        </Box>

        {/* Action Button: SAVE CHANGES */}
        <Box sx={{ mt: 1, pt: 1, display: "flex", justifyContent: "right" }}>
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            variant="contained"
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
              "&:disabled": {
                bgcolor: "#A5B4FC",
                color: "#FFFFFF",
                cursor: "not-allowed",
              },
            }}
          >
            {isSubmitting ? "SAVING..." : "SAVE CHANGES"}
          </Button>
        </Box>
      </Box>
      </Box>
    </form>
  );
};

export default AdminIdentityForm;

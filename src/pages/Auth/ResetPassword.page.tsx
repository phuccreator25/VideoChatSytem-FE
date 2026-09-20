import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/Auth/auth.hook";

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });
  const password = watch("password");

  const { handleResetPass, loading } = useAuth();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 400,
            color: "#0f172a",
            mb: 1,
          }}
        >
          Reset Password
        </Typography>

        <Typography sx={{ color: "#64748b", fontWeight: 400 }}>
          Enter a new password to continue signing in to your account.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(handleResetPass)}>
        <Box>
          <Stack spacing={2.2}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              placeholder="Enter new password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password", {
                required: "Please enter password",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                  message:
                    "Password must be at least 8 characters, containing uppercase, lowercase, numbers, and special characters",
                },
              })}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              placeholder="Re-enter new password"
              error={!!errors.confirm_password}
              helperText={errors.confirm_password?.message}
              {...register("confirm_password", {
                required: "Please confirm password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />

            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              loading={loading}
              sx={{
                mt: 1,
                py: 1.4,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 500,
                boxShadow: "none",
              }}
            >
              Update Password
            </Button>
          </Stack>
        </Box>
      </form>

      <Typography
        sx={{
          mt: 3,
          textAlign: "center",
          color: "#64748b",
          fontWeight: 400,
        }}
      >
        Back to{" "}
        <Link
          component={RouterLink}
          to="/login"
          underline="hover"
          sx={{ fontWeight: 400, color: "#1976d2" }}
        >
          Sign In
        </Link>
      </Typography>
    </Box>
  );
}

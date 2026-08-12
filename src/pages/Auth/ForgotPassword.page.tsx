import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useAuth from "../../hooks/Auth/auth.hook";
import { useForm } from "react-hook-form";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm({
    defaultValues: {
      email: ''
    }
  });
  const { handleForgotPass, loading } = useAuth();

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
          Quên mật khẩu
        </Typography>

        <Typography sx={{ color: "#64748b", fontWeight: 400 }}>
          Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(handleForgotPass)}>
        <div style={{ display: "flex", flexDirection: "column", gap: "17px" }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Vui lòng nhập vào email tài khoản",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email không đúng định dạng"
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
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
            Gửi yêu cầu
          </Button>
        </div>
      </form>

      <Typography
        sx={{
          mt: 3,
          textAlign: "center",
          color: "#64748b",
          fontWeight: 400,
        }}
      >
        Nhớ mật khẩu rồi?{" "}
        <Link
          component={RouterLink}
          to="/login"
          underline="hover"
          sx={{ fontWeight: 400, color: "#1976d2" }}
        >
          Quay lại đăng nhập
        </Link>
      </Typography>
    </Box>
  );
}

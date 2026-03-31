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
          Đặt lại mật khẩu
        </Typography>

        <Typography sx={{ color: "#64748b", fontWeight: 400 }}>
          Nhập mật khẩu mới để tiếp tục đăng nhập vào tài khoản của bạn.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(handleResetPass)}>
        <Box>
          <Stack spacing={2.2}>
            <TextField
              fullWidth
              label="Mật khẩu mới"
              type="password"
              placeholder="Nhập mật khẩu mới"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password", {
                required: "Vui lòng nhập vào mật khẩu",
                minLength: {
                  value: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                  message:
                    "Mật khẩu phải gồm ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt",
                },
              })}
            />

            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              error={!!errors.confirm_password}
              helperText={errors.confirm_password?.message}
              {...register("confirm_password", {
                required: "Vui lòng nhập mật khẩu xác nhận",
                validate: (value) =>
                  value === password || "Mật khẩu xác nhận không khớp",
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
              Cập nhật mật khẩu
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
        Quay lại{" "}
        <Link
          component={RouterLink}
          to="/login"
          underline="hover"
          sx={{ fontWeight: 400, color: "#1976d2" }}
        >
          đăng nhập
        </Link>
      </Typography>
    </Box>
  );
}

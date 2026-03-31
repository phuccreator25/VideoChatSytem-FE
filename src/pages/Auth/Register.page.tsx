import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";

import useAuth from "../../hooks/Auth/auth.hook";
import type { typeRegister } from "../../types/auth.type";
export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    //KHÔNG KHAI BÁO ONCHANGE THÌ MẶC ĐỊNH KHI SUBMIT MỚI CHECK ERRORS
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
  });

  const { handleRegister, typeAlert, loading, isShowAlert } = useAuth();

  const onSubmit = async (data: typeRegister) => {
    await handleRegister(data);
  };

  const password = watch("password");

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
          Đăng ký
        </Typography>
        <Typography sx={{ color: "#64748b", fontWeight: 400 }}>
          Tạo tài khoản để bắt đầu chat và gọi video.
        </Typography>
        {isShowAlert && (
          <Alert icon={<CheckIcon fontSize="inherit" />} severity={typeAlert}>
            Đã đăng ký tài khoản thành công. Vui lòng kiểm tra Email của bạn để
            tiến hành kích hoạt tài khoản
          </Alert>
        )}
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.2}>
          <TextField
            fullWidth
            label="Họ và tên"
            placeholder="Nhập họ và tên"
            {...register("fullname", {
              required: "Vui lòng nhập họ và tên",
            })}
            error={!!errors.fullname}
            helperText={errors.fullname?.message}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Vui lòng nhập email",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Email không hợp lệ",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu"
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
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            fullWidth
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            {...register("confirmPassword", {
              required: "Vui lòng xác nhận mật khẩu",
              validate: (value) =>
                value === password || "Mật khẩu xác nhận không khớp",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <FormControlLabel
            control={
              <Checkbox
                {...register("agree", {
                  required: "Bạn cần đồng ý với điều khoản",
                })}
              />
            }
            label="Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật"
          />

          {errors.agree && (
            <Typography sx={{ color: "error.main", fontSize: 14 }}>
              {errors.agree.message}
            </Typography>
          )}

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
            Đăng ký
          </Button>
        </Stack>
      </form>

      <Typography
        sx={{
          mt: 3,
          textAlign: "center",
          color: "#64748b",
          fontWeight: 400,
        }}
      >
        Đã có tài khoản?{" "}
        <Link
          component={RouterLink}
          to="/login"
          underline="hover"
          sx={{ fontWeight: 400, color: "#1976d2" }}
        >
          Đăng nhập ngay
        </Link>
      </Typography>
    </Box>
  );
}

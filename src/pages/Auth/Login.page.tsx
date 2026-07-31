import { Link as RouterLink, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/Auth/auth.hook";
import type { typeLogin } from "../../types/auth.type";
import { getVisitorId } from "../../config/FingerPrintJS";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const emailParams = searchParams.get('email');

  const {
    register,
    handleSubmit,
    formState: { errors }, } = useForm({
      defaultValues: {
        email: emailParams || '',
        password: ''
      }
    })

  const { handleLogin, loading } = useAuth();

  const onLogin = async (data: typeLogin) => {
    try {
      const deviceId = await getVisitorId();

      await handleLogin({
        email: data.email,
        password: data.password,
        deviceId,
      });

    } catch (error) {
      console.error('Login error:', error);
    }
  };


  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 400,
            color: '#0f172a',
            mb: 1,
          }}
        >
          Đăng nhập
        </Typography>

        <Typography sx={{ color: '#64748b', fontWeight: 400 }}>
          Truy cập tài khoản để bắt đầu chat và gọi video.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onLogin)}>
        <Box >
          <Stack spacing={2.2}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Vui lòng nhập vào email"
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
                required: "Vui lòng nhập vào mật khẩu"
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <FormControlLabel
                control={<Checkbox />}
                label="Ghi nhớ đăng nhập"
              />

              <Link
                component={RouterLink}
                to="/forgot-password"
                underline="hover"
                sx={{
                  fontWeight: 400,
                  color: '#1976d2',
                }}
              >
                Quên mật khẩu?
              </Link>
            </Box>

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
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
              }}
            >
              Đăng nhập
            </Button>
          </Stack>
        </Box>
      </form>

      <Typography
        sx={{
          mt: 3,
          textAlign: 'center',
          color: '#64748b',
          fontWeight: 400,
        }}
      >
        Chưa có tài khoản?{' '}
        <Link
          component={RouterLink}
          to="/register"
          underline="hover"
          sx={{ fontWeight: 400, color: '#1976d2' }}
        >
          Đăng ký ngay
        </Link>
      </Typography>
    </Box>
  );
}
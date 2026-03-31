import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import CheckIcon from "@mui/icons-material/Check";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useEffect } from "react";
import authApi from "../../api/Auth.api";

export default function ActivateSuccessPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();
  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    const handleActivate = async () => {
      try {
        const res = await authApi.onActivAccount(email);
        console.log(res.data);
      } catch (error: any) {
        console.log("Lỗi:", error.response?.data?.message);
        navigate("/login");
      }
    };

    handleActivate();
  }, [email]);

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
          Kích hoạt tài khoản
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            fontWeight: 400,
          }}
        >
          Tài khoản của bạn đã được kích hoạt thành công.
        </Typography>

        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          sx={{ mt: 2 }}
        >
          Kích hoạt tài khoản <b>{email}</b> thành công. Bây giờ bạn có thể đăng
          nhập để bắt đầu chat và gọi video.
        </Alert>
      </Box>

      <Stack spacing={2.2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 2,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 72, color: "success.main" }} />
        </Box>

        <Typography
          sx={{
            textAlign: "center",
            color: "#0f172a",
            fontWeight: 500,
            fontSize: 18,
          }}
        >
          Chúc mừng! Tài khoản của bạn đã sẵn sàng.
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            color: "#64748b",
            fontWeight: 400,
            fontSize: 14,
          }}
        >
          Nhấn nút bên dưới để đăng nhập và bắt đầu trải nghiệm ứng dụng.
        </Typography>

        <Button
          fullWidth
          size="large"
          variant="contained"
          component={RouterLink}
          to={`/login?email=${email}`}
          sx={{
            mt: 1,
            py: 1.4,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 500,
            boxShadow: "none",
          }}
        >
          Đi đến trang đăng nhập
        </Button>
      </Stack>
    </Box>
  );
}

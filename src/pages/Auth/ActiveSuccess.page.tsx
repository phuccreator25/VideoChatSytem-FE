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
  const token = searchParams.get("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const handleActivate = async () => {
      try {
        await authApi.onActiveAccount({ token: token });
      } catch (error: any) {
        console.log("Lỗi:", error.response?.data?.message);
        navigate("/login");
      }
    };

    handleActivate();
  }, [token]);

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
          Account Activation
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            fontWeight: 400,
          }}
        >
          Your account has been successfully activated.
        </Typography>

        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          sx={{ mt: 2 }}
        >
          Account activated successfully. You can now log in to start
          chatting and video calling.
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
          Congratulations! Your account is ready.
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            color: "#64748b",
            fontWeight: 400,
            fontSize: 14,
          }}
        >
          Click the button below to log in and get started.
        </Typography>

        <Button
          fullWidth
          size="large"
          variant="contained"
          component={RouterLink}
          to={`/login`}
          sx={{
            mt: 1,
            py: 1.4,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 500,
            boxShadow: "none",
          }}
        >
          Go to Sign In
        </Button>
      </Stack>
    </Box>
  );
}

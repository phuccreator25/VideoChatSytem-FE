import { Link as RouterLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import { useParams } from "react-router-dom";

export default function CheckEmailPage() {
  const navigate = useNavigate();
  const { email } = useParams();

  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 2,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <MarkEmailReadRoundedIcon
          sx={{
            fontSize: 72,
            color: '#1976d2',
            mb: 1,
          }}
        />

        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: '#0f172a',
            mb: 1.5,
          }}
        >
          Unable to Sign In?
        </Typography>

        <Typography
          sx={{
            color: '#64748b',
            mb: 2,
            maxWidth: 360,
            mx: 'auto',
          }}
        >
          We have sent a password recovery link to your email.
        </Typography>

        <Typography
          sx={{
            fontWeight: 600,
            color: '#334155',
            fontSize: '1.05rem',
            wordBreak: 'break-word',
          }}
        >
          {email}
        </Typography>
      </Box>

      <Typography
        sx={{
          color: '#64748b',
          mb: 3,
          maxWidth: 380,
          mx: 'auto',
        }}
      >
        If you have not received the email, please check your spam folder or try resending the recovery link.
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        justifyContent="center"
        sx={{ mb: 3 }}
      >
        <Button
          component={RouterLink}
          to="/login"
          variant="text"
          sx={{ textTransform: 'none', fontWeight: 500 }}
        >
          Back to Sign In
        </Button>

        <Button
          variant="text"
          onClick={() =>
            navigate('/forgot-password', {
              state: { email },
            })
          }
          sx={{ textTransform: 'none', fontWeight: 500 }}
        >
          Resend Link
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Typography sx={{ color: '#94a3b8', fontSize: 14 }}>
        Need additional help? Contact support or try again later.
      </Typography>
    </Box>
  );
}
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { keyframes } from "@emotion/react";

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
`;

type CallStatusBadgeProps = {
  status: string;
};

export const CallStatusBadge = ({ status }: CallStatusBadgeProps) => {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "active":
      return (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.25,
            py: 0.4,
            borderRadius: "9999px",
            bgcolor: "#ECFDF5",
            border: "1px solid #A7F3D0",
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#10B981",
              animation: `${pulseAnimation} 1.8s infinite ease-in-out`,
            }}
          />
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#059669",
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            Active (Live)
          </Typography>
        </Box>
      );

    case "ringing":
      return (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.25,
            py: 0.4,
            borderRadius: "9999px",
            bgcolor: "#FEF3C7",
            border: "1px solid #FDE68A",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#D97706",
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            Ringing
          </Typography>
        </Box>
      );

    case "completed":
      return (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.25,
            py: 0.4,
            borderRadius: "9999px",
            bgcolor: "#ECFDF5",
            border: "1px solid #D1FAE5",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#059669",
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            Completed
          </Typography>
        </Box>
      );

    case "missed":
      return (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.25,
            py: 0.4,
            borderRadius: "9999px",
            bgcolor: "#FEF2F2",
            border: "1px solid #FECACA",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#DC2626",
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            Missed
          </Typography>
        </Box>
      );

    case "rejected":
      return (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.25,
            py: 0.4,
            borderRadius: "9999px",
            bgcolor: "#FEF2F2",
            border: "1px solid #FECACA",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#DC2626",
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            Rejected
          </Typography>
        </Box>
      );

    case "cancelled":
    default:
      return (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.25,
            py: 0.4,
            borderRadius: "9999px",
            bgcolor: "#F1F5F9",
            border: "1px solid #E2E8F0",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#64748B",
              letterSpacing: "0.01em",
              lineHeight: 1,
              textTransform: "capitalize",
            }}
          >
            {status}
          </Typography>
        </Box>
      );
  }
};

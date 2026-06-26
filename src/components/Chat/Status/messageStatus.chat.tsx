import { CircularProgress, Stack, Typography } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DoneIcon from "@mui/icons-material/Done";

type StatusIndicatorProps = {
  status?: string;
  type?: "message" | "attachment";
  onResend?: () => void;
  onDeleteFailed?: () => void;
};

export function MessageStatus({
  status,
  type = "message",
  onResend,
  onDeleteFailed,
}: StatusIndicatorProps) {
  if (!status) return null;

  if (type === "attachment") {
    if (
      status === "pending" ||
      status === "uploading" ||
      status === "sending"
    ) {
      return (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <CircularProgress
            size={11}
            thickness={5}
            sx={{ color: "rgba(229, 231, 255, 0.9)" }}
          />

          <Typography
            sx={{
              fontSize: 11,
              color: "rgba(229, 231, 255, 0.9)",
              fontWeight: 700,
            }}
          >
            Uploading
          </Typography>
        </Stack>
      );
    }

    if (status === "failed") {
      return (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <ErrorOutlineIcon
            sx={{
              fontSize: 14,
              color: "#dc2626",
            }}
          />

          <Typography
            sx={{
              fontSize: 11,
              color: "#dc2626",
              fontWeight: 700,
            }}
          >
            Upload failed
          </Typography>
        </Stack>
      );
    }

    if (status === "done") {
      return (
        <Stack direction="row" spacing={0.25} alignItems="center">
          <DoneIcon
            sx={{
              fontSize: 14,
              color: "#15803d",
            }}
          />

          <Typography
            sx={{
              fontSize: 11,
              color: "#15803d",
              fontWeight: 700,
            }}
          >
            Ready
          </Typography>
        </Stack>
      );
    }

    return null;
  }

  // Message-level status
  if (status === "read") return null;

  if (status === "sending") {
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <CircularProgress
          size={11}
          thickness={5}
          sx={{
            color: "rgba(229, 231, 255, 0.9)",
          }}
        />

        <Typography
          sx={{
            fontSize: 11.5,
            color: "rgba(229, 231, 255, 0.9)",
            fontWeight: 600,
          }}
        >
          Sending
        </Typography>
      </Stack>
    );
  }

  if (status === "failed") {
    return (
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ userSelect: "none" }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <ErrorOutlineIcon
            sx={{
              fontSize: 14,
              color: "#fecaca",
            }}
          />

          <Typography
            sx={{
              fontSize: 11.5,
              color: "#fecaca",
              fontWeight: 700,
            }}
          >
            Error
          </Typography>
        </Stack>

        {(onResend || onDeleteFailed) && (
          <Stack direction="row" spacing={0.75} alignItems="center">
            {onResend && (
              <Typography
                onClick={(e) => {
                  e.stopPropagation();
                  onResend();
                }}
                sx={{
                  fontSize: 11,
                  color: "#ffffff",
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "underline",
                  opacity: 0.85,
                  transition: "opacity 0.2s",
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              >
                Resend
              </Typography>
            )}
            {onResend && onDeleteFailed && (
              <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                |
              </Typography>
            )}
            {onDeleteFailed && (
              <Typography
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFailed();
                }}
                sx={{
                  fontSize: 11,
                  color: "#fca5a5",
                  fontWeight: 700,
                  cursor: "pointer",
                  textDecoration: "underline",
                  opacity: 0.85,
                  transition: "opacity 0.2s",
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              >
                Cancel
              </Typography>
            )}
          </Stack>
        )}
      </Stack>
    );
  }

  if (status === "delivered") {
    return (
      <Stack direction="row" spacing={0.25} alignItems="center">
        <DoneAllIcon
          sx={{
            fontSize: 15,
            color: "rgba(229, 231, 255, 0.95)",
          }}
        />

        <Typography
          sx={{
            fontSize: 11.5,
            color: "rgba(229, 231, 255, 0.95)",
            fontWeight: 600,
          }}
        >
          Received
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={0.25} alignItems="center">
      <DoneIcon
        sx={{
          fontSize: 14,
          color: "rgba(229, 231, 255, 0.9)",
        }}
      />

      <Typography
        sx={{
          fontSize: 11.5,
          color: "rgba(229, 231, 255, 0.9)",
          fontWeight: 600,
        }}
      >
        Sent
      </Typography>
    </Stack>
  );
}
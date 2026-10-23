import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { formatDate } from "../../../../../helpers/formatDate.helper";
import { MESSAGE_REASONS } from "../../../../../data/Report.data";

type ModeratedMessageBubbleProps = {
  reason?: string | null;
  moderatedAt?: string | null;
}

export function ModeratedMessageBubble({ reason, moderatedAt }: ModeratedMessageBubbleProps) {
  const tooltipText = moderatedAt
    ? `Removed at: ${formatDate(moderatedAt, true)}`
    : "This message violated community standards and was removed.";

  return (
    <Tooltip title={tooltipText} placement="top" arrow>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          bgcolor: "#FFF1F2",
          border: "1px dashed #FDA4AF",
          borderRadius: "12px",
          px: 2,
          py: 1.25,
          minWidth: 160,
          maxWidth: { xs: "90%", sm: "75%" },
          boxShadow: "0 1px 3px rgba(225, 29, 72, 0.05)",
          cursor: "default",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "#FFE4E6",
            borderColor: "#FB7185",
          },
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            bgcolor: "#FEE2E2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShieldOutlinedIcon sx={{ fontSize: 16, color: "#E11D48" }} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 13,
              color: "#9F1239",
              fontStyle: "italic",
              fontWeight: 600,
              userSelect: "none",
              lineHeight: 1.4,
            }}
          >
            This message has been deleted by a moderator.
          </Typography>

          {reason && (
            <Typography
              sx={{
                fontSize: 11.5,
                color: "#BE123C",
                mt: 0.25,
                fontWeight: 500,
                opacity: 0.85,
                lineHeight: 1.3,
                wordBreak: "break-word",
              }}
            >
              Reason: {MESSAGE_REASONS.find((r) => r.id == reason)?.label}
            </Typography>
          )}
        </Box>
      </Box>
    </Tooltip>
  );
}

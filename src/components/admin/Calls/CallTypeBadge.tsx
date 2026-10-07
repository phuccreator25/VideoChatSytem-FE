import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import HeadsetRoundedIcon from "@mui/icons-material/HeadsetRounded";

type CallTypeBadgeProps = {
  type: "video" | "voice" | string;
};

export const CallTypeBadge = ({ type }: CallTypeBadgeProps) => {
  const isVideo = type.toLowerCase() === "video";

  if (isVideo) {
    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.6,
          px: 1.2,
          py: 0.35,
          borderRadius: "9999px",
          bgcolor: "#F5F3FF",
          border: "1px solid #DDD6FE",
        }}
      >
        <VideocamRoundedIcon sx={{ fontSize: 15, color: "#7C3AED" }} />
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#7C3AED",
            lineHeight: 1,
          }}
        >
          Video
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.6,
        px: 1.2,
        py: 0.35,
        borderRadius: "9999px",
        bgcolor: "#EFF6FF",
        border: "1px solid #BFDBFE",
      }}
    >
      <HeadsetRoundedIcon sx={{ fontSize: 14, color: "#2563EB" }} />
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#2563EB",
          lineHeight: 1,
        }}
      >
        Audio
      </Typography>
    </Box>
  );
};

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import type { LinkPreviewData } from "../../../types/chat/chat.payload.type";

export function LinkPreview({ preview = null, isLeft }: { preview: LinkPreviewData | null, isLeft: boolean }) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (preview) return;

    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [preview]);

  if (!preview) {
    if (showSkeleton) {
      return (
        <Box sx={{ width: "100%", mt: 1, minWidth: 240 }}>
          <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 3 }} />
          <Skeleton variant="text" sx={{ mt: 1 }} width="80%" />
          <Skeleton variant="text" width="60%" />
        </Box>
      );
    }
    return null;
  }

  return (
    <Box
      component="a"
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-preview-card"
      sx={{
        display: "block",
        mt: 1.25,
        width: "100%",
        minWidth: 240,
        borderRadius: 3.5,
        overflow: "hidden",
        textDecoration: "none",
        border: isLeft ? "1px solid rgba(226, 232, 240, 0.8)" : "1px solid rgba(255, 255, 255, 0.12)",
        bgcolor: isLeft ? "rgba(248, 250, 252, 0.6)" : "rgba(15, 23, 42, 0.2)",
        backdropFilter: "blur(12px)",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isLeft ? "0 10px 24px rgba(15, 23, 42, 0.06)" : "0 12px 30px rgba(0, 0, 0, 0.25)",
          bgcolor: isLeft ? "#ffffff" : "rgba(15, 23, 42, 0.35)",
        },
      }}
    >
      {preview.image && (
        <Box sx={{ width: "100%", height: 160, overflow: "hidden", position: "relative" }}>
          <Box
            component="img"
            src={preview.image}
            alt={preview.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderBottom: isLeft ? "1px solid rgba(226, 232, 240, 0.8)" : "1px solid rgba(255, 255, 255, 0.12)",
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              ".link-preview-card:hover &": {
                transform: "scale(1.05)",
              },
            }}
          />
        </Box>
      )}
      <Box sx={{ p: 1.75, textAlign: "left" }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: "13.5px",
            color: isLeft ? "#1e293b" : "#ffffff",
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.4,
          }}
        >
          {preview.title}
        </Typography>
        {preview.description && (
          <Typography
            variant="caption"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: isLeft ? "#64748b" : "rgba(255, 255, 255, 0.75)",
              fontSize: "11px",
              lineHeight: 1.5,
              mb: 1.25,
            }}
          >
            {preview.description}
          </Typography>
        )}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            fontSize: "9.5px",
            color: isLeft ? "#4f46e5" : "#a5b4fc",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            display: "inline-block",
            bgcolor: isLeft ? "rgba(79, 70, 229, 0.06)" : "rgba(255, 255, 255, 0.08)",
            px: 1,
            py: 0.25,
            borderRadius: "4px",
          }}
        >
          {preview.domain || preview.siteName}
        </Typography>
      </Box>
    </Box>
  );
}

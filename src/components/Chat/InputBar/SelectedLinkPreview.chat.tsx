import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import { COLORS } from "../../../utils/Colors";
import type { LinkPreviewData } from "../../../types/chat/chat.payload.type";

type SelectedLinkPreviewProps = {
  linkPreview: LinkPreviewData | null;
  isLoading?: boolean;
  onRemove?: () => void;
};

export function SelectedLinkPreview({
  linkPreview,
  isLoading = false,
  onRemove,
}: SelectedLinkPreviewProps) {
  // If not loading and no preview data, render nothing
  if (!isLoading && !linkPreview) return null;

  // Extract hostname for cleaner display if siteName is missing
  const getDisplayDomain = (urlStr: string) => {
    try {
      const url = new URL(urlStr);
      return url.hostname.replace("www.", "");
    } catch {
      return urlStr;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        mb: 1.6,
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 620,
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          border: "1px solid rgba(148, 163, 184, 0.22)",
          bgcolor: "rgba(248, 250, 252, 0.88)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.95)",
            borderColor: "rgba(99, 102, 241, 0.35)",
            boxShadow: "0 12px 30px rgba(99, 102, 241, 0.08)",
            transform: "translateY(-1px)",
          },
          p: 1.5,
          gap: 1.8,
        }}
      >
        {/* Loading / Skeleton State */}
        {isLoading ? (
          <>
            {/* Image Skeleton */}
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{
                width: { xs: 90, sm: 120 },
                height: { xs: 70, sm: 90 },
                borderRadius: 2.2,
                flexShrink: 0,
              }}
            />

            {/* Text Skeleton */}
            <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0.8 }}>
              <Skeleton variant="text" width="30%" height={16} animation="wave" />
              <Skeleton variant="text" width="85%" height={22} animation="wave" />
              <Skeleton variant="text" width="95%" height={16} animation="wave" />
              <Skeleton variant="text" width="60%" height={16} animation="wave" />
            </Box>
          </>
        ) : (
          linkPreview && (
            <>
              {/* Left Side: Preview Image / Placeholder */}
              <Box
                sx={{
                  width: { xs: 90, sm: 120 },
                  height: { xs: 70, sm: 90 },
                  borderRadius: 2.2,
                  overflow: "hidden",
                  bgcolor: "rgba(226, 232, 240, 0.6)",
                  border: "1px solid rgba(148, 163, 184, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                {linkPreview.image ? (
                  <Box
                    component="img"
                    src={linkPreview.image}
                    alt={linkPreview.title || "Link Preview"}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#4f46e5",
                    }}
                  >
                    <LinkRoundedIcon sx={{ fontSize: 28 }} />
                  </Box>
                )}
              </Box>

              {/* Right Side: Text Information */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  pr: onRemove ? 3.5 : 0, // Space for close button
                }}
              >
                {/* Domain / Site Name Badge */}
                <Typography
                  sx={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: COLORS.primary,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 0.4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  {linkPreview.siteName || getDisplayDomain(linkPreview.url || "")}
                </Typography>

                {/* Title */}
                <Typography
                  sx={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: COLORS.textMain,
                    lineHeight: 1.35,
                    mb: 0.6,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "left",
                  }}
                >
                  {linkPreview.title || "No Title"}
                </Typography>

                {/* Description */}
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: COLORS.textMuted,
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "left",
                  }}
                >
                  {linkPreview.description || linkPreview.url}
                </Typography>
              </Box>

              {/* Close / Dismiss Button */}
              {onRemove && (
                <IconButton
                  size="small"
                  onClick={onRemove}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 24,
                    height: 24,
                    color: COLORS.textMuted,
                    bgcolor: "rgba(15, 23, 42, 0.04)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#dc2626",
                      bgcolor: "rgba(254, 242, 242, 0.95)",
                      border: "1px solid rgba(248, 113, 113, 0.18)",
                    },
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 15 }} />
                </IconButton>
              )}
            </>
          )
        )}
      </Box>
    </Box>
  );
}

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import ChatAPI from "../../../api/Chat.api";

type LinkMetadata = {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName?: string;
  domain?: string;
};

export function LinkPreview({ url, isLeft }: { url: string; isLeft: boolean }) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const res = await ChatAPI.onGetLinkPreview(url);
        if (active && res.status === 200 && res.data.data) {
          setMetadata(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching link preview", error);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchMetadata();
    return () => {
      active = false;
    };
  }, [url]);

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 1, minWidth: 240, maxWidth: 340 }}>
        <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
        <Skeleton variant="text" sx={{ mt: 1 }} width="80%" />
        <Skeleton variant="text" width="60%" />
      </Box>
    );
  }

  if (!metadata || (!metadata.title && !metadata.description)) {
    return null;
  }

  return (
    <Box
      component="a"
      href={metadata.url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "block",
        mt: 1.25,
        width: "100%",
        minWidth: 240,
        maxWidth: 340,
        borderRadius: 3.5,
        overflow: "hidden",
        textDecoration: "none",
        border: isLeft ? "1px solid rgba(226, 232, 240, 0.8)" : "1px solid rgba(255, 255, 255, 0.15)",
        bgcolor: isLeft ? "rgba(248, 250, 252, 0.8)" : "rgba(15, 23, 42, 0.15)",
        backdropFilter: "blur(12px)",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isLeft ? "0 8px 20px rgba(15,23,42,0.06)" : "0 8px 24px rgba(0,0,0,0.25)",
          bgcolor: isLeft ? "#ffffff" : "rgba(15, 23, 42, 0.25)",
        },
      }}
    >
      {metadata.image && (
        <Box
          sx={{
            width: "100%",
            height: 150,
            background: `url(${metadata.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderBottom: isLeft ? "1px solid rgba(226, 232, 240, 0.8)" : "1px solid rgba(255, 255, 255, 0.15)",
          }}
        />
      )}
      <Box sx={{ p: 1.75, textAlign: "left" }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: "13px",
            color: isLeft ? "#1e293b" : "#ffffff",
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {metadata.title}
        </Typography>
        {metadata.description && (
          <Typography
            variant="caption"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: isLeft ? "#64748b" : "rgba(248, 250, 252, 0.75)",
              fontSize: "11px",
              lineHeight: 1.5,
              mb: 1.25,
            }}
          >
            {metadata.description}
          </Typography>
        )}
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            fontSize: "10px",
            color: isLeft ? "#4f46e5" : "#a5b4fc",
            textTransform: "lowercase",
            letterSpacing: 0.5,
            display: "block"
          }}
        >
          {metadata.domain || metadata.siteName}
        </Typography>
      </Box>
    </Box>
  );
}

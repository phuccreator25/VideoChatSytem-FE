import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { MessageStatus } from "../Status/messageStatus.chat";

export function ImageCard({
  src,
  status,
  isPreview = false,
  isPinned = false,
  onOpen,
  onDownload,
  onPin,
}: {
  src: string;
  status?: string;
  isPreview?: boolean;
  isPinned?: boolean;
  onOpen: () => void;
  onDownload: () => void;
  onPin?: () => void;
}) {
  const [isPortrait, setIsPortrait] = useState(false);
  const isLoading = status === "pending" || status === "uploading";
  const isFailed = status === "failed";
  const canDownload = !isPreview && !isLoading && !isFailed;

  return (
    <Box
      onClick={onOpen}
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        borderRadius: 2,
        flexShrink: 1,
        border: "1px solid rgba(148, 163, 184, 0.2)",
        cursor: "zoom-in",
        bgcolor: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
        opacity: isLoading ? 0.8 : 1,
        "&:hover .image-card-img": {
          transform: "scale(1.04)",
        },
        "&:hover .image-card-actions": {
          opacity: 1,
        },
      }}
    >
      <Box
        component="img"
        src={src}
        alt="gallery"
        loading="lazy"
        onLoad={(event) => {
          const target = event.currentTarget;
          const ratio = (target.naturalWidth || 1) / (target.naturalHeight || 1);
          setIsPortrait(ratio < 1);
        }}
        className="image-card-img"
        sx={{
          width: isPortrait ? "auto" : "100%",
          height: isPortrait ? "100%" : "auto",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          display: "block",
          transition: "transform 0.22s ease",
          mx: "auto",
          my: "auto",
        }}
      />

      {/* View — bottom left */}
      <Box
        className="image-card-actions"
        sx={{
          position: "absolute",
          left: 8,
          top: 8,
          opacity: { xs: 1, sm: 0 },
          transition: "opacity 0.18s ease",
        }}
      >
        <Tooltip title="View">
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            sx={{
              color: "#fff",
              bgcolor: "rgba(15,23,42,0.46)",
              "&:hover": { bgcolor: "rgba(15,23,42,0.64)" },
            }}
          >
            <OpenInFullRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Download + Pin — top right, stacked vertically */}
      <Box
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Tooltip title="Download">
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              if (!canDownload) return;
              onDownload();
            }}
            disabled={!canDownload}
            sx={{
              color: "#fff",
              bgcolor: "rgba(15,23,42,0.46)",
              "&:hover": { bgcolor: "rgba(15,23,42,0.64)" },
            }}
          >
            <DownloadOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {onPin && (
          <Tooltip title={isPinned ? "UnPin" : "Pin Image"}>
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onPin();
              }}
              sx={{
                color: isPinned ? "#fbbf24" : "#fff",
                bgcolor: isPinned ? "rgba(251,191,36,0.18)" : "rgba(15,23,42,0.46)",
                "&:hover": {
                  bgcolor: isPinned ? "rgba(251,191,36,0.32)" : "rgba(15,23,42,0.64)",
                },
                transition: "color 0.15s, background 0.15s",
              }}
            >
              <PushPinOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {status && status !== "done" && (
        <Box
          sx={{
            position: "absolute",
            left: 8,
            bottom: 8,
            px: 1.1,
            py: 0.45,
            borderRadius: 999,
            bgcolor:
              status === "failed"
                ? "rgba(127, 29, 29, 0.82)"
                : "rgba(15, 23, 42, 0.72)",
            backdropFilter: "blur(4px)",
          }}
        >
          <MessageStatus
            type="attachment"
            status={status}
          />
        </Box>
      )}
    </Box>
  );
}
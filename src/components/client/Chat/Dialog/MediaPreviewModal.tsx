import { useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

export type MediaPreviewItem = {
  url: string;
  fileName?: string;
  mimeType?: string;
  resourceType?: string;
};

export type MediaPreviewModalProps = {
  open: boolean;
  items: MediaPreviewItem[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
  onDownload?: (url: string, fileName: string) => void;
};

export function MediaPreviewModal({
  open,
  items,
  currentIndex,
  onClose,
  onIndexChange,
  onDownload,
}: MediaPreviewModalProps) {
  const currentItem = items[currentIndex] || null;

  const handlePrevMedia = useCallback(() => {
    if (items.length <= 1) return;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    onIndexChange?.(prevIndex);
  }, [currentIndex, items.length, onIndexChange]);

  const handleNextMedia = useCallback(() => {
    if (items.length <= 1) return;
    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    onIndexChange?.(nextIndex);
  }, [currentIndex, items.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevMedia();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNextMedia();
      } else if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handlePrevMedia, handleNextMedia, onClose]);

  return (
    <Dialog
      open={open && Boolean(currentItem)}
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          bgcolor: "transparent",
          boxShadow: "none",
          overflow: "visible",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            bgcolor: "rgba(15, 23, 42, 0.82)",
            backdropFilter: "blur(12px)",
          },
        },
      }}
    >
      {currentItem && (
        <Box sx={{ position: "relative", display: "inline-block" }}>
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: -46,
              right: 0,
              color: "#ffffff",
              bgcolor: "rgba(255, 255, 255, 0.15)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Counter Badge */}
          {items.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                color: "#ffffff",
                bgcolor: "rgba(15, 23, 42, 0.65)",
                backdropFilter: "blur(8px)",
                px: 1.5,
                py: 0.5,
                borderRadius: "12px",
                fontSize: 12,
                fontWeight: 700,
                border: "1px solid rgba(255, 255, 255, 0.15)",
                zIndex: 10,
              }}
            >
              {currentIndex + 1} / {items.length}
            </Box>
          )}

          {/* Prev / Next Arrows */}
          {items.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevMedia}
                sx={{
                  position: "absolute",
                  left: { xs: 8, sm: -56 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#ffffff",
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(8px)",
                  zIndex: 10,
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                <NavigateBeforeRoundedIcon sx={{ fontSize: 28 }} />
              </IconButton>
              <IconButton
                onClick={handleNextMedia}
                sx={{
                  position: "absolute",
                  right: { xs: 8, sm: -56 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#ffffff",
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(8px)",
                  zIndex: 10,
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                <NavigateNextRoundedIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </>
          )}

          {/* Media Content (Video vs Image) */}
          {currentItem.mimeType?.startsWith("video/") ||
          currentItem.resourceType === "video" ? (
            <Box
              component="video"
              src={currentItem.url}
              controls
              autoPlay
              preload="auto"
              sx={{
                maxWidth: { xs: "90vw", sm: "80vw", md: "70vw" },
                maxHeight: "75vh",
                borderRadius: "20px",
                border: "4px solid rgba(255, 255, 255, 0.95)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                display: "block",
              }}
            />
          ) : (
            <Box
              component="img"
              src={currentItem.url}
              alt={currentItem.fileName || "media-preview"}
              loading="lazy"
              sx={{
                maxWidth: { xs: "90vw", sm: "80vw", md: "70vw" },
                maxHeight: "75vh",
                borderRadius: "20px",
                border: "4px solid rgba(255, 255, 255, 0.95)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                display: "block",
                objectFit: "contain",
              }}
            />
          )}

          {/* Floating Download Button */}
          {onDownload && (
            <IconButton
              onClick={() =>
                onDownload(currentItem.url, currentItem.fileName || "download")
              }
              sx={{
                position: "absolute",
                bottom: 16,
                right: 16,
                color: "#ffffff",
                bgcolor: "rgba(15, 23, 42, 0.65)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  bgcolor: "rgba(15, 23, 42, 0.85)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <DownloadForOfflineOutlinedIcon sx={{ fontSize: 24 }} />
            </IconButton>
          )}
        </Box>
      )}
    </Dialog>
  );
}

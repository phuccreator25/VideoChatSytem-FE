import {
  Box,
  Dialog,
  Stack,
  IconButton,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import ZoomOutRoundedIcon from "@mui/icons-material/ZoomOutRounded";
import { COLORS } from "../../../utils/Colors";
import { ImageCard } from "./ImageCard.chat";
import { ChatTime } from "../ChatTime/ChatTime.chat";
import useDownloadFile from "../../../helpers/downloadFile.helper";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import { onPinMessageConversation } from "../../../redux/conversation.redux";
import { useParams } from "react-router-dom";
import { MessageStatus } from "../Status/messageStatus.chat";

export type ImageFrameItem = {
  src: string;
  fileName: string;
  status?: string;
  isPreview?: boolean;
  attachmentId?: string;
  messageId?: string;
  mimeType?: string;
};

export type VideoFrameItem = {
  src: string;
  fileName: string;
  status?: string;
  isPreview?: boolean;
  attachmentId?: string;
  messageId?: string;
  mimeType?: string;
};

export function ImageFrame({
  images,
  createdAt,
  isLeft = true,
  status,
  showStatus = false,
  onResend,
  onDeleteFailed,
}: {
  images: Array<string | ImageFrameItem>;
  createdAt?: string;
  isLeft?: boolean;
  status?: string;
  showStatus?: boolean;
  onResend?: () => void;
  onDeleteFailed?: () => void;
}) {
  const normalizedImages: ImageFrameItem[] = useMemo(
    () =>
      images.map((item) =>
        typeof item === "string"
          ? {
              src: item,
              fileName: item.split("/").pop() || "download",
              status: "done",
            }
          : item
      ),
    [images]
  );

  const isUploadingImage = (item: ImageFrameItem) =>
    item.isPreview ||
    item.status === "pending" ||
    item.status === "uploading" ||
    item.status === "sending";

  const [openedImage, setOpenedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewRatio, setPreviewRatio] = useState<number>(1);
  const [previewScale, setPreviewScale] = useState<number>(1);
  const [previewOffset, setPreviewOffset] = useState({ x: 0, y: 0 });
  const [isDraggingPreview, setIsDraggingPreview] = useState(false);
  const dragOriginRef = useRef<{
    pointerX: number;
    pointerY: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1366,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });
  const MIN_PREVIEW_SCALE = 0.8;
  const MAX_PREVIEW_SCALE = 2;
  const PREVIEW_SCALE_STEP = 0.2;

  const gridTemplateColumns =
    normalizedImages.length === 1
      ? "minmax(220px, 420px)"
      : "repeat(2, minmax(150px, 1fr))";


  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!openedImage) return;

    setPreviewScale(1);

    const image = new Image();
    image.src = openedImage;

    image.onload = () => {
      const width = image.naturalWidth || 1;
      const height = image.naturalHeight || 1;
      setPreviewRatio(width / height);
    };
  }, [openedImage]);

  const previewLayout = useMemo(() => {
    const safeRatio = Number.isFinite(previewRatio) && previewRatio > 0 ? previewRatio : 1;
    const maxPaperWidth = Math.min(viewport.width * 0.9, 1240);
    const maxMediaHeight = Math.max(340, viewport.height * 0.78);

    let mediaWidth = Math.min(maxPaperWidth - 28, maxMediaHeight * safeRatio);
    let mediaHeight = mediaWidth / safeRatio;

    if (mediaHeight > maxMediaHeight) {
      mediaHeight = maxMediaHeight;
      mediaWidth = mediaHeight * safeRatio;
    }

    if (safeRatio < 1) {
      mediaWidth = Math.min(mediaWidth, viewport.width * 0.56);
      mediaHeight = mediaWidth / safeRatio;
    }

    const paperWidth = Math.max(360, Math.min(maxPaperWidth, mediaWidth + 28));

    return {
      paperWidth,
      mediaWidth,
      mediaHeight,
    };
  }, [previewRatio, viewport.height, viewport.width]);

  const clampPreviewOffset = useCallback(
    (nextOffset: { x: number; y: number }, scale = previewScale) => {
      const scaledWidth = previewLayout.mediaWidth * scale;
      const scaledHeight = previewLayout.mediaHeight * scale;
      const maxOffsetX = Math.max(0, (scaledWidth - previewLayout.mediaWidth) / 2);
      const maxOffsetY = Math.max(0, (scaledHeight - previewLayout.mediaHeight) / 2);

      return {
        x: Math.min(maxOffsetX, Math.max(-maxOffsetX, nextOffset.x)),
        y: Math.min(maxOffsetY, Math.max(-maxOffsetY, nextOffset.y)),
      };
    },
    [previewLayout.mediaHeight, previewLayout.mediaWidth, previewScale],
  );

  useEffect(() => {
    setPreviewOffset((current) =>
      previewScale > 1 ? clampPreviewOffset(current, previewScale) : { x: 0, y: 0 },
    );

    if (previewScale <= 1) {
      dragOriginRef.current = null;
      setIsDraggingPreview(false);
    }
  }, [clampPreviewOffset, previewScale]);

  useEffect(() => {
    if (!isDraggingPreview) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!dragOriginRef.current) return;

      const deltaX = event.clientX - dragOriginRef.current.pointerX;
      const deltaY = event.clientY - dragOriginRef.current.pointerY;

      setPreviewOffset(
        clampPreviewOffset({
          x: dragOriginRef.current.offsetX + deltaX,
          y: dragOriginRef.current.offsetY + deltaY,
        }),
      );
    };

    const handleMouseUp = () => {
      dragOriginRef.current = null;
      setIsDraggingPreview(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [clampPreviewOffset, isDraggingPreview]);

  const handlePreviewDragStart = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (previewScale <= 1) return;

    event.preventDefault();
    dragOriginRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      offsetX: previewOffset.x,
      offsetY: previewOffset.y,
    };
    setIsDraggingPreview(true);
  };

  const { onHandleDownloadFile } = useDownloadFile()
  const dispatch = useDispatch<AppDispatch>();
  const { conversationId } = useParams()

  return (
    <>
      <Box
        sx={{
          bgcolor: isLeft ? "#ffffff" : "transparent",
          backgroundImage: isLeft
            ? "none"
            : status === "failed"
              ? "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)"
              : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
          border: isLeft ? "1px solid rgba(148, 163, 184, 0.18)" : "none",
          borderRadius: 3.2,
          px: 1.4,
          pt: 1.4,
          pb: 1.15,
          width: "fit-content",
          minWidth: { xs: 250, sm: 320 },
          maxWidth: { xs: "92vw", sm: 540 },
          boxShadow: "0 10px 26px rgba(15, 23, 42, 0.08)",
        }}
      >
        <Stack
          sx={{
            display: "grid",
            gap: 1.2,
            gridTemplateColumns,
            alignItems: "stretch",
          }}
        >
          {normalizedImages.map((item, index) => {
            const isUploading = isUploadingImage(item);

            return (
              <ImageCard
                key={index}
                src={item.src}
                status={item.status}
                isPreview={item.isPreview}
                onDownload={() => {
                  if (isUploading) return;
                  onHandleDownloadFile(item.src, item.fileName);
                }}
                onOpen={() => {
                  if (isUploading) return;
                  setOpenedImage(item.src);
                  setSelectedFileName(item.fileName)
                }}
                onPin={() => {
                  if (isUploading || !conversationId || !item.messageId) return;
                  dispatch(onPinMessageConversation({ conversationId, messageId: item.messageId, attachmentId: item.attachmentId ?? null}))
                }}
              />
            );
          })}
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1.1,
            px: 0.4,
            gap: 1,
          }}
        >
          <ChatTime
            createdAt={createdAt}
            color={isLeft ? COLORS.textMuted : "rgba(229, 231, 255, 0.95)"}
            dense
          />
          {!isLeft && showStatus && (
            <MessageStatus
              status={status}
              type="message"
              onResend={onResend}
              onDeleteFailed={onDeleteFailed}
            />
          )}
        </Box>
      </Box>

      <Dialog
        open={Boolean(openedImage)}
        onClose={() => setOpenedImage(null)}
        maxWidth={false}
        PaperProps={{
          sx: {
            bgcolor: "rgba(2, 6, 23, 0.96)",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(2, 6, 23, 0.65)",
            width: `${previewLayout.paperWidth}px`,
            maxWidth: "95vw",
          },
        }}
      >
        <Box
          sx={{
            px: 1.1,
            py: 0.8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(148, 163, 184, 0.28)",
          }}
        >
          <Typography sx={{ color: "rgba(226, 232, 240, 0.92)", fontSize: 13.5, fontWeight: 600 }}>
            IMAGE PREVIEW
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <IconButton
              onClick={() =>
                setPreviewScale((current) =>
                  Math.max(MIN_PREVIEW_SCALE, Number((current - PREVIEW_SCALE_STEP).toFixed(2))),
                )
              }
              disabled={previewScale <= MIN_PREVIEW_SCALE}
              sx={{ color: "#e2e8f0" }}
            >
              <ZoomOutRoundedIcon />
            </IconButton>
            <IconButton
              onClick={() =>
                setPreviewScale((current) =>
                  Math.min(MAX_PREVIEW_SCALE, Number((current + PREVIEW_SCALE_STEP).toFixed(2))),
                )
              }
              disabled={previewScale >= MAX_PREVIEW_SCALE}
              sx={{ color: "#e2e8f0" }}
            >
              <ZoomInRoundedIcon />
            </IconButton>
            <IconButton
              onClick={() => (openedImage && selectedFileName) && onHandleDownloadFile(openedImage, selectedFileName)}
              sx={{ color: "#e2e8f0" }}
            >
              <DownloadOutlinedIcon />
            </IconButton>
            <IconButton onClick={() => setOpenedImage(null)} sx={{ color: "#e2e8f0" }}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            minHeight: 220,
            height: `${previewLayout.mediaHeight + 24}px`,
            maxHeight: "82vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1.5,
            overflow: "hidden",
          }}
        >
          {openedImage && (
            <Box
              onMouseDown={handlePreviewDragStart}
              sx={{
                width: `${previewLayout.mediaWidth}px`,
                height: `${previewLayout.mediaHeight}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                cursor: previewScale > 1 ? (isDraggingPreview ? "grabbing" : "grab") : "default",
                userSelect: "none",
              }}
            >
              <Box
                component="img"
                src={openedImage}
                alt="image-preview"
                draggable={false}
                sx={{
                  width: `${previewLayout.mediaWidth * previewScale}px`,
                  height: `${previewLayout.mediaHeight * previewScale}px`,
                  objectFit: "contain",
                  userSelect: "none",
                  pointerEvents: "none",
                  transform: `translate(${previewOffset.x}px, ${previewOffset.y}px)`,
                  transition: isDraggingPreview ? "none" : "transform 0.15s ease",
                }}
              />
            </Box>
          )}
        </Box>
      </Dialog>
    </>
  );
}

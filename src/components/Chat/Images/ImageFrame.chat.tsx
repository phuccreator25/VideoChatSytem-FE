import { Box, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { COLORS } from "../../../utils/Colors";
import { ImageCard } from "./ImageCard.chat";
import { ChatTime } from "../ChatTime/ChatTime.chat";
import useDownloadFile from "../../../helpers/downloadFile.helper";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import { onPinMessageConversation } from "../../../redux/conversation.redux";
import { useParams } from "react-router-dom";
import { MessageStatus } from "../Status/messageStatus.chat";
import { MediaPreviewModal, type MediaPreviewItem } from "../Dialog/MediaPreviewModal";

export type ImageFrameItem = {
  src: string;
  fileName: string;
  status?: string | null;
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
}: {
  images: Array<string | ImageFrameItem>;
  createdAt?: string;
  isLeft?: boolean;
  status?: string;
  showStatus?: boolean;
  onResend?: () => void;
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

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const mediaItems: MediaPreviewItem[] = useMemo(
    () =>
      normalizedImages.map((img) => ({
        url: img.src,
        fileName: img.fileName,
        mimeType: img.mimeType,
      })),
    [normalizedImages]
  );

  const gridTemplateColumns =
    normalizedImages.length === 1
      ? "minmax(220px, 420px)"
      : "repeat(2, minmax(150px, 1fr))";

  const { onHandleDownloadFile } = useDownloadFile();
  const dispatch = useDispatch<AppDispatch>();
  const { conversationId } = useParams();

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
                status={item.status || undefined}
                isPreview={item.isPreview}
                onDownload={() => {
                  if (isUploading) return;
                  onHandleDownloadFile(item.src, item.fileName);
                }}
                onOpen={() => {
                  if (isUploading) return;
                  setSelectedIndex(index);
                }}
                onPin={() => {
                  if (isUploading || !conversationId || !item.messageId) return;
                  dispatch(
                    onPinMessageConversation({
                      conversationId,
                      messageId: item.messageId,
                      attachmentId: item.attachmentId ?? null,
                    })
                  );
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
            />
          )}
        </Box>
      </Box>

      {/* Shared Media Preview Modal */}
      <MediaPreviewModal
        open={selectedIndex !== null}
        items={mediaItems}
        currentIndex={selectedIndex ?? 0}
        onClose={() => setSelectedIndex(null)}
        onIndexChange={setSelectedIndex}
        onDownload={onHandleDownloadFile}
      />
    </>
  );
}

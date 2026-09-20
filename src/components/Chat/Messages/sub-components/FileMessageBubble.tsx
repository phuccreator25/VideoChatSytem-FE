import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { MessageAttachment, MessageType } from "../../../../types/chat/chat.model.type";
import type { ImageFrameItem } from "../../Images/ImageFrame.chat";
import type { AbortMultipartParams } from "../../../../types/upload.type";
import { ImageFrame } from "../../Images/ImageFrame.chat";
import { FileGroupBubble } from "../../Files/FileBubble.chat";
import { AudioBubble } from "../../Audio/audioBubble.chat";
import { VideoBubble } from "../../Video/videoBubble.chat";
import { MessageActions } from "../MessageActions.chat";
import { EmotionPicker } from "../../Emotion/emotionPicker.chat";
import { ReplyQuoteBubble } from "../ReplyBubble.chat";
import { COLORS } from "../../../../utils/Colors";

type FileMessageBubbleProps = {
  msg: MessageType;
  isLeft: boolean;
  effectiveStatus?: string | null;
  shouldShowStatus: boolean;
  showEmotionTrigger: boolean;
  fileNote: string | null;
  imageItems: ImageFrameItem[];
  nonImageAttachments: MessageAttachment[];
  audioAttachment: MessageAttachment[];
  videoAttachment: MessageAttachment[];
  failedAttachmentCount: number;
  replyMessage: MessageType | null;
  isText: boolean;
  onGoToMessage?: (msg: MessageType) => void;
  onResend?: (msg: MessageType) => void;
  onCancelUpload?: (item: AbortMultipartParams) => void;
  onReply: (m: MessageType) => void;
  onShare: () => void;
  onReact: (messageId: string, emotion: string) => void;
  onOpenEmotionDetail: (el: HTMLElement) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function FileMessageBubble({
  msg,
  isLeft,
  effectiveStatus,
  shouldShowStatus,
  showEmotionTrigger,
  fileNote,
  imageItems,
  nonImageAttachments,
  audioAttachment,
  videoAttachment,
  failedAttachmentCount,
  replyMessage,
  isText,
  onGoToMessage,
  onResend,
  onCancelUpload,
  onReply,
  onShare,
  onReact,
  onOpenEmotionDetail,
  onMouseEnter,
  onMouseLeave,
}: FileMessageBubbleProps) {
  const actionHandlers = {
    onReply,
    onShare,
    onMore: (m: MessageType, anchor: HTMLElement) => console.log("more", m, anchor),
  };

  const hasMediaContent =
    imageItems.length > 0 ||
    nonImageAttachments.length > 0 ||
    audioAttachment.length > 0 ||
    videoAttachment.length > 0;

  return (
    <>
      {/* ── FILE: caption text ── */}
      {fileNote && (
        <Box
          sx={{
            mt: isText ? 0 : 0.35,
            mb: 1,
            px: 1.6,
            py: 1.1,
            borderRadius: 2.5,
            maxWidth: { xs: "90%", sm: "75%" },
            bgcolor: isLeft ? "rgba(255,255,255,0.9)" : "rgba(67, 56, 202, 0.12)",
            border: isLeft
              ? "1px solid rgba(148, 163, 184, 0.2)"
              : "1px solid rgba(99, 102, 241, 0.18)",
          }}
        >
          {replyMessage && (
            <Box sx={{ mb: 1 }}>
              <ReplyQuoteBubble replyMsg={replyMessage} isLeft={isLeft} onClick={() => onGoToMessage?.(replyMessage)} />
            </Box>
          )}
          <Typography
            sx={{
              fontSize: 14.5,
              lineHeight: 1.58,
              color: COLORS.textMain,
              wordBreak: "break-word",
            }}
          >
            {fileNote}
          </Typography>
        </Box>
      )}

      {/* ── FILE: attachments ── */}
      {hasMediaContent && (
        <Box
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          sx={{
            position: "relative",
            opacity: msg.status === "sending" ? 0.78 : 1,
            mb: (msg.reactions?.length ?? 0) > 0 ? "18px" : 0,
            display: "flex",
            flexDirection: "column",
            alignItems: isLeft ? "flex-start" : "flex-end",
            gap: 0.5,
          }}
        >
          <MessageActions
            msg={msg}
            isLeft={isLeft}
            {...actionHandlers}
            variant={imageItems.length > 0 ? "image" : "file"}
          />

          {replyMessage && !fileNote && (
            <Box sx={{ mb: 0.5 }}>
              <ReplyQuoteBubble replyMsg={replyMessage} isLeft={isLeft} onClick={() => onGoToMessage?.(replyMessage)} />
            </Box>
          )}

          {imageItems.length > 0 && (
            <ImageFrame
              images={imageItems}
              createdAt={msg.createdAt}
              isLeft={isLeft}
              status={effectiveStatus || undefined}
              showStatus={shouldShowStatus && nonImageAttachments.length === 0 && audioAttachment.length === 0 && videoAttachment.length === 0}
              onResend={() => onResend?.(msg)}
            />
          )}

          {nonImageAttachments.length > 0 && (
            <FileGroupBubble
              files={nonImageAttachments.map((a) => ({
                fileName: a.fileName || "Attachment",
                fileSize: a.fileSize ?? 0,
                fileUrl: a.fileUrl,
                mimeType: a.mimeType,
                status: a.status,
                messageId: a.messageId,
                attachmentId: a.attachmentId,
                tempAttachmentId: a.tempAttachmentId || undefined,
              }))}
              createdAt={msg.createdAt}
              isLeft={isLeft}
              showStatus={shouldShowStatus && audioAttachment.length === 0 && videoAttachment.length === 0}
              status={effectiveStatus || undefined}
              onResend={() => onResend?.(msg)}
              onCancelUpload={onCancelUpload}
            />
          )}

          {failedAttachmentCount > 0 && (
            <Box
              sx={{
                mt: 0.4,
                px: 1.2,
                py: 0.8,
                borderRadius: 2,
                bgcolor: "rgba(254,226,226,0.72)",
                border: "1px solid rgba(248,113,113,0.28)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontSize: 12.5, color: "#b91c1c", fontWeight: 700 }}>
                {failedAttachmentCount} attachment
                {failedAttachmentCount > 1 ? "s" : ""} failed to upload
              </Typography>
              {!isLeft && onResend && (
                <Typography
                  onClick={() => onResend(msg)}
                  sx={{
                    fontSize: 12.5,
                    color: "#dc2626",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                    ml: 1,
                    "&:hover": {
                      color: "#991b1b",
                    },
                  }}
                >
                  Resend
                </Typography>
              )}
            </Box>
          )}

          {audioAttachment.length > 0 &&
            audioAttachment.map((a, idx) => (
              <AudioBubble
                key={a.attachmentId || idx}
                src={a.fileUrl ?? ""}
                durationProp={a.recordDuration ?? null}
                isLeft={isLeft}
                status={effectiveStatus || undefined}
                showStatus={shouldShowStatus && videoAttachment.length === 0 && idx === audioAttachment.length - 1}
                createdAt={msg.createdAt}
                onResend={() => onResend?.(msg)}
              />
            ))}

          {videoAttachment.length > 0 &&
            videoAttachment.map((item, idx) => (
              <VideoBubble
                key={item.attachmentId || item.tempAttachmentId || idx}
                messageId={msg.id}
                attachmentId={item.attachmentId || item.tempAttachmentId}
                src={item.fileUrl || item.previewUrl || ""}
                fileName={item.fileName ?? ""}
                fileSize={item.fileSize}
                isLeft={isLeft}
                status={msg.status}
                showStatus={shouldShowStatus && idx === videoAttachment.length - 1}
                createdAt={msg.createdAt}
                onResend={() => onResend?.(msg)}
              />
            ))}

          <EmotionPicker
            reactions={msg.reactions || []}
            isLeft={isLeft}
            showTrigger={showEmotionTrigger}
            onReact={onReact}
            onOpenDetail={onOpenEmotionDetail}
            msg={msg}
          />
        </Box>
      )}
    </>
  );
}

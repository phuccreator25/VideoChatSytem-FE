import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";


import type { MessageType } from "../../../types/chat/chat.model.type";
import { ImageFrame, type ImageFrameItem } from "../Images/ImageFrame.chat";
import { FileGroupBubble } from "../Files/FileBubble.chat";
import { ChatTime } from "../ChatTime/ChatTime.chat";
import { COLORS } from "../../../utils/Colors";
import { MessageActions } from "./MessageActions.chat";
import { LinkPreview } from "./LinkPreview.chat";
import { AudioBubble } from "../Audio/audioBubble.chat";
import { MessageStatus } from "../Status/messageStatus.chat";
import { VideoBubble } from "../Video/videoBubble.chat";
import { EmotionPicker } from "../Emotion/emotionPicker.chat";
import { useEffect, useState, memo } from "react";
import { EmotionDetailPopover } from "../Emotion/emotionDetailsPopover.chat";
import { PopoverShare } from "./PopoverShare.chat";
import renderMessageContent from "../../../helpers/renderMessageUrl.helper";
import { ReplyQuoteBubble } from "./ReplyBubble.chat";
import { CallBubble } from "./CallBubble.chat";

type TempPreviewFile = {
  tempAttachmentId?: string;
  previewUrl?: string;
  fileName?: string;
  fileSize?: number;
  resourceType?: string;
};

type MessageAttachment = {
  messageId?: string | null;
  attachmentId?: string | null;
  tempAttachmentId?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: string | number | null;
  mimeType?: string | null;
  resourceType?: string | null;
  width?: number | null;
  height?: number | null;
  status?: string;
  previewUrl?: string | null;
  recordDuration?: number | null
};

const getAttachments = (msg: MessageType) => {
  const attachments = (msg.attachments || []) as MessageAttachment[];
  return attachments.map((attachment) => ({
    ...attachment,
    messageId: msg.id,
  }));
};

const isAudioAttachment = (attachment: MessageAttachment) =>
  String(attachment.mimeType || "").startsWith("audio/") || attachment.resourceType === "audio";

const isImageAttachment = (attachment: MessageAttachment) =>
  attachment.resourceType === "image" ||
  String(attachment.mimeType || "").startsWith("image/");

const isVideoAttachment = (attachment: MessageAttachment) =>
  attachment.resourceType === "video" &&
  String(attachment.mimeType || "").startsWith("video/");

const isRawAttachment = (attachment: MessageAttachment) =>
  attachment.resourceType === "raw" &&
  !isAudioAttachment(attachment);

const parseImageItems = (msg: MessageType): ImageFrameItem[] => {
  if (msg.type !== "file") return [];

  const FilesBeforeUpload =
    (msg as MessageType & { attachments?: TempPreviewFile[] }).attachments || [];

  const imageAttachments = getAttachments(msg).filter((attachment) =>
    isImageAttachment(attachment),
  );

  if (imageAttachments.length > 0) {
    return imageAttachments.reduce<ImageFrameItem[]>((result, attachment) => {
      const attachmentBeforeUpload = FilesBeforeUpload.find(
        (item) =>
          item.tempAttachmentId &&
          item.tempAttachmentId === attachment.tempAttachmentId,
      );

      const urlBeforeUpload = attachmentBeforeUpload?.previewUrl;
      const fileUrl = attachment.fileUrl ? String(attachment.fileUrl) : "";
      const src = fileUrl || urlBeforeUpload || undefined;

      if (!src) return result;

      result.push({
        src,
        fileName: attachment.fileName || "",
        status: attachment.status || (fileUrl ? "done" : "pending"),
        isPreview: !fileUrl,
        attachmentId: attachment.attachmentId || "",
        messageId: msg.id || ""
      });

      return result;
    }, []);
  }

  return FilesBeforeUpload.reduce<ImageFrameItem[]>((result, item) => {
    if (!item.previewUrl || item.resourceType !== 'image') return result;

    result.push({
      src: item.previewUrl,
      fileName: item.fileName || "",
      status: msg.status || "sending",
      isPreview: true,
    });

    return result;
  }, []);
};

const getFileNote = (msg: MessageType) => {
  if (msg.type !== "file") return "";
  return String(msg.content || "").trim();
};


// ── MessageItem ───────────────────────────────────────────────────────────
export const MessageItem = memo(function MessageItem({
  msg,
  isLeft,
  displayName,
  avatar,
  setMessageReplyed,
  onReact,
  onUnReact,
  onHandleShare,
  onResend,
  onDeleteFailed,
  onGoToMessage,
  onReCall,
}: {
  msg: MessageType;
  isLeft: boolean;
  displayName: string;
  avatar: string;
  setMessageReplyed: React.Dispatch<React.SetStateAction<MessageType | null>>;
  onReact: (messageId: string, emotion: string) => void;
  onUnReact: (messageId: string) => void;
  onHandleShare: (targetConversationIds: string[], messageId: string) => Promise<void>;
  onResend?: (msg: MessageType) => void;
  onDeleteFailed?: (msgId: string) => void;
  onGoToMessage?: (msg: MessageType) => void;
  onReCall?: (type: "video" | "voice") => void;
}) {
  const attachments = getAttachments(msg);
  const imageItems = parseImageItems(msg);
  const nonImageAttachments = attachments.filter(
    (attachment) => isRawAttachment(attachment),
  );

  const audioAttachment = attachments.filter(
    (attachment) => isAudioAttachment(attachment)
  )

  const videoAttachment = attachments.filter(
    (attachment) => isVideoAttachment(attachment)
  )

  const fileNote = getFileNote(msg);
  const failedAttachmentCount = attachments.filter(
    (attachment) => attachment.status === "failed",
  ).length;

  const effectiveStatus = failedAttachmentCount > 0 ? "failed" : msg.status;

  const isText = msg.type === "text";
  const isGif = msg.type === "gif";
  const isCall = (msg.type as string) === "call" || msg.messageType === "call" || Boolean(msg.callInfo);
  const shouldShowStatus = !isLeft;

  const URL_REGEX = /(https?:\/\/[^\s]+)/g;
  const hasUrl = msg.content && /https?:\/\/[^\s]+/.test(msg.content);
  const urlMatches = msg.content?.match(URL_REGEX);
  const hasLinkPreview = Boolean(hasUrl && urlMatches?.length === 1 && (msg.preview || msg.type === "text"));

  const replyMessage = msg.replyMessage || null

  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const actionHandlers = {
    onReply: (m: MessageType) => setMessageReplyed(m),
    onShare: () => {
      setShareDialogOpen(true);
    },
    onMore: (m: MessageType, anchor: HTMLElement) => console.log("more", m, anchor),
  };

  //EMOTION
  const [showEmotionTrigger, setShowEmotionTrigger] = useState(false);

  const [anchorEl, setPopoverAnchor] = useState<HTMLElement | null>(null);

  const handleCloseDetail = () => {
    setPopoverAnchor(null);
  };

  useEffect(() => {
    if (anchorEl && (msg.reactions?.length ?? 0) === 0) {
      const timer = setTimeout(() => {
        handleCloseDetail();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [msg.reactions?.length, anchorEl]);

  return (
    <Stack
      direction={isLeft ? "row" : "row-reverse"}
      spacing={1.5}
      alignItems="flex-end"
      sx={{ width: "100%" }}
    >
      <Avatar
        src={avatar}
        sx={{
          width: 42,
          height: 42,
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.18)",
          border: "2px solid rgba(255,255,255,0.9)",
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: isLeft ? "flex-start" : "flex-end",
          width: "100%",
          "&:hover .message-actions": {
            opacity: 1,
            pointerEvents: "auto",
          },
        }}
        onMouseEnter={() => setShowEmotionTrigger(true)}
        onMouseLeave={() => setShowEmotionTrigger(false)}
      >

        {msg.isRevoked && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "action.hover",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              px: 2.2,
              py: 1.25,
              minWidth: 140,
              maxWidth: { xs: "90%", sm: "75%" },
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                color: "text.secondary",
                fontStyle: "italic",
                userSelect: "none",
              }}
            >
              This message has been revoked
            </Typography>
          </Box>
        )}

        {/* ── CALL BUBBLE ── */}
        {isCall && !msg.isRevoked && (
          <Box
            onMouseEnter={() => setShowEmotionTrigger(true)}
            onMouseLeave={() => setShowEmotionTrigger(false)}
            sx={{
              position: "relative",
              maxWidth: { xs: "90%", sm: "75%" },
              mb: (msg.reactions?.length ?? 0) > 0 ? "18px" : 0,
            }}
          >
            <MessageActions msg={msg} isLeft={isLeft} {...actionHandlers} variant="text" />
            <CallBubble msg={msg} isLeft={isLeft} shouldShowStatus={shouldShowStatus} onReCall={onReCall} />
            <EmotionPicker
              reactions={msg.reactions || []}
              isLeft={isLeft}
              showTrigger={showEmotionTrigger}
              onReact={onReact}
              onOpenDetail={(el) => setPopoverAnchor(el)}
              msg={msg}
            />
          </Box>
        )}

        {/* ── TEXT BUBBLE ── */}
        {(isText && !msg.isRevoked) && (
          <Box sx={{ position: "relative", width: hasLinkPreview ? "100%" : "auto", maxWidth: { xs: "90%", sm: hasLinkPreview ? 420 : "75%" } }}>
            <MessageActions msg={msg} isLeft={isLeft} {...actionHandlers} variant={'text'} />
            <Box
              onMouseEnter={() => setShowEmotionTrigger(true)}
              onMouseLeave={() => setShowEmotionTrigger(false)}
              sx={{
                position: "relative",         // ✅ required cho absolute children
                overflow: "visible",          // ✅ cho phép icon tràn ra ngoài bubble
                mb: (msg.reactions?.length ?? 0) > 0 ? "18px" : 0, // ✅ chừa chỗ reaction bar
                bgcolor: isLeft ? "#ffffff" : "transparent",
                backgroundImage: isLeft
                  ? "none"
                  : effectiveStatus === "failed"
                    ? "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)"
                    : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                border: isLeft ? "1px solid rgba(148, 163, 184, 0.22)" : "none",
                borderRadius: 3,
                px: 2.1,
                py: 1.35,
                minWidth: 140,
                width: "100%",
                opacity: effectiveStatus === "sending" ? 0.78 : 1,
                boxShadow: isLeft
                  ? "0 8px 22px rgba(15, 23, 42, 0.07)"
                  : effectiveStatus === "failed"
                    ? "0 12px 30px rgba(239, 68, 68, 0.25)"
                    : "0 12px 30px rgba(79, 70, 229, 0.34)",
              }}
            >
              {replyMessage && (
                <Box sx={{ mb: 1 }}>
                  <ReplyQuoteBubble replyMsg={replyMessage} isLeft={isLeft} onClick={() => onGoToMessage?.(replyMessage)} />
                </Box>
              )}

              <Typography sx={{
                fontSize: 15, lineHeight: 1.62,
                color: isLeft ? COLORS.textMain : "#f8faff",
                textAlign: "left", wordBreak: "break-word", letterSpacing: 0.1,
              }}>
                {renderMessageContent(msg.content || "", isLeft)}
              </Typography>

              {(() => {
                if (!hasLinkPreview) return null;

                if (msg.preview || (msg.type === "text" && hasUrl)) {
                  return <LinkPreview preview={msg.preview || null} isLeft={isLeft} />;
                }

                return null;
              })()}

              <Box sx={{
                display: "flex",
                justifyContent: isLeft ? "flex-start" : "flex-end",
                alignItems: "center", gap: 1, mt: 0.75,
              }}>
                {msg.createdAt && (
                  <ChatTime
                    createdAt={msg.createdAt}
                    color={isLeft ? COLORS.textMuted : "rgba(229, 231, 255, 0.95)"}
                    dense
                  />
                )}
                {shouldShowStatus && (
                  <MessageStatus
                    type="message"
                    status={effectiveStatus}
                    onResend={() => onResend?.(msg)}
                    onDeleteFailed={() => onDeleteFailed?.(msg.tempMessageId || msg.id)}
                  />
                )}
              </Box>

              {/* ✅ EmotionPicker nằm trong bubble để absolute đúng tọa độ */}
              <EmotionPicker
                reactions={msg.reactions || []}
                isLeft={isLeft}
                showTrigger={showEmotionTrigger}
                onReact={onReact}
                onOpenDetail={(el) => setPopoverAnchor(el)}
                msg={msg}
              />
            </Box>
          </Box>
        )}

        {/* ── GIF BUBBLE ── */}
        {isGif && msg.gifUrl && !msg.isRevoked && (
          <Box
            onMouseEnter={() => setShowEmotionTrigger(true)}
            onMouseLeave={() => setShowEmotionTrigger(false)}
            sx={{
              position: "relative",
              maxWidth: { xs: "90%", sm: "75%" },
              mb: (msg.reactions?.length ?? 0) > 0 ? "18px" : 0,
            }}
          >
            <MessageActions msg={msg} isLeft={isLeft} {...actionHandlers} />
            <Box
              sx={{
                bgcolor: isLeft ? "#ffffff" : "transparent",
                backgroundImage: isLeft
                  ? "none"
                  : msg.status === "failed"
                    ? "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)"
                    : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                border: isLeft ? "1px solid rgba(148, 163, 184, 0.22)" : "none",
                borderRadius: 2,
                overflow: "hidden",
                minWidth: 140,
                opacity: msg.status === "sending" ? 0.78 : 1,
                boxShadow: isLeft
                  ? "0 8px 22px rgba(15, 23, 42, 0.07)"
                  : msg.status === "failed"
                    ? "0 12px 30px rgba(239, 68, 68, 0.25)"
                    : "0 12px 30px rgba(79, 70, 229, 0.34)",
              }}
            >
              {replyMessage && (
                <Box sx={{ px: 1, pt: 1 }}>
                  <ReplyQuoteBubble replyMsg={replyMessage} isLeft={isLeft} onClick={() => onGoToMessage?.(replyMessage)} />
                </Box>
              )}

              <Box
                component="img"
                src={msg.gifUrl}
                alt="GIF message"
                loading="lazy"
                sx={{
                  display: "block",
                  width: "100%",
                  maxWidth: { xs: 180, sm: 280 },
                  maxHeight: 320,
                  objectFit: "contain",
                  bgcolor: "rgba(241, 245, 249, 0.8)",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 1,
                  px: 1.25,
                  py: 0.8,
                  backgroundImage: isLeft
                    ? "rgba(255, 255, 255, 0.96)"
                    : msg.status === "failed"
                      ? "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)"
                      : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                }}
              >
                {msg.createdAt && (
                  <ChatTime
                    createdAt={msg.createdAt}
                    color={isLeft ? COLORS.textMuted : "rgba(229, 231, 255, 0.95)"}
                    dense
                  />
                )}
                {shouldShowStatus && (
                  <MessageStatus
                    type="message"
                    status={msg.status}
                    onResend={() => onResend?.(msg)}
                    onDeleteFailed={() => onDeleteFailed?.(msg.tempMessageId || msg.id)}
                  />
                )}
              </Box>
            </Box>
            <EmotionPicker
              reactions={msg.reactions || []}
              isLeft={isLeft}
              showTrigger={showEmotionTrigger}
              onReact={onReact}
              onOpenDetail={(el) => setPopoverAnchor(el)}
              msg={msg}
            />
          </Box>
        )}

        {/* ── FILE: caption text ── */}
        {msg.type === "file" && fileNote && !msg.isRevoked && (
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

        {/* ── FILE: images ── */}
        {msg.type === "file" && imageItems.length > 0 && !msg.isRevoked && (
          <Box
            onMouseEnter={() => setShowEmotionTrigger(true)}
            onMouseLeave={() => setShowEmotionTrigger(false)}
            sx={{
              position: "relative",
              opacity: msg.status === "sending" ? 0.78 : 1,
              mb: (msg.reactions?.length ?? 0) > 0 ? "18px" : 0,
            }}
          >
            <MessageActions msg={msg} isLeft={isLeft} {...actionHandlers} variant={'image'} />
            {replyMessage && (
              <Box sx={{ mb: 0.5 }}>
                <ReplyQuoteBubble replyMsg={replyMessage} isLeft={isLeft} onClick={() => onGoToMessage?.(replyMessage)} />
              </Box>
            )}
            <ImageFrame
              images={imageItems}
              createdAt={msg.createdAt}
              isLeft={isLeft}
              status={effectiveStatus}
              showStatus={shouldShowStatus}
              onResend={() => onResend?.(msg)}
              onDeleteFailed={() => onDeleteFailed?.(msg.tempMessageId || msg.id)}
            />
            <EmotionPicker
              reactions={msg.reactions || []}
              isLeft={isLeft}
              showTrigger={showEmotionTrigger}
              onReact={onReact}
              onOpenDetail={(el) => setPopoverAnchor(el)}
              msg={msg}
            />
          </Box>
        )}

        {/* ── FILE: non-image attachments ── */}
        {msg.type === "file" && nonImageAttachments.length > 0 && !msg.isRevoked && (
          <Box
            onMouseEnter={() => setShowEmotionTrigger(true)}
            onMouseLeave={() => setShowEmotionTrigger(false)}
            sx={{
              position: "relative",
              mb: (msg.reactions?.length ?? 0) > 0 ? "18px" : 0,
            }}
          >
            {/* 1 MessageActions duy nhất cho toàn bộ group */}
            <MessageActions msg={msg} isLeft={isLeft} {...actionHandlers} variant="file" />

            {/* Reply quote chỉ hiện 1 lần phía trên */}
            {replyMessage && (
              <Box sx={{ mb: 0.5 }}>
                <ReplyQuoteBubble replyMsg={replyMessage} isLeft={isLeft} onClick={() => onGoToMessage?.(replyMessage)} />
              </Box>
            )}

            {/* Tất cả file trong 1 card */}
            {nonImageAttachments.length > 0 && (
              <FileGroupBubble
                files={nonImageAttachments.map((a) => ({
                  fileName: a.fileName || "Attachment",
                  fileSize: a.fileSize ?? 0,
                  fileUrl: a.fileUrl,
                  mimeType: a.mimeType,
                  status: a.status,
                  messageId: a.messageId,
                  attachmentId: a.attachmentId
                }))}
                createdAt={msg.createdAt}
                isLeft={isLeft}
                showStatus={shouldShowStatus}
                status={effectiveStatus}
                onResend={() => onResend?.(msg)}
                onDeleteFailed={() => onDeleteFailed?.(msg.tempMessageId || msg.id)}
              />
            )}

            {/* Failed notice */}
            {failedAttachmentCount > 0 && (
              <Box
                sx={{
                  mt: nonImageAttachments.length > 0 ? 0.4 : 0.9,
                  px: 1.2,
                  py: 0.8,
                  borderRadius: 2,
                  bgcolor: "rgba(254,226,226,0.72)",
                  border: "1px solid rgba(248,113,113,0.28)",
                }}
              >
                <Typography sx={{ fontSize: 12.5, color: "#b91c1c", fontWeight: 700 }}>
                  {failedAttachmentCount} attachment
                  {failedAttachmentCount > 1 ? "s" : ""} failed to upload
                </Typography>
              </Box>
            )}
            <EmotionPicker
              reactions={msg.reactions || []}
              isLeft={isLeft}
              showTrigger={showEmotionTrigger}
              onReact={onReact}
              onOpenDetail={(el) => setPopoverAnchor(el)}
              msg={msg}
            />
          </Box>
        )}

        {/* ── FILE: audio ── */}
        {msg.type === "file" && audioAttachment.length > 0 && !msg.isRevoked && (
          <Box
            onMouseEnter={() => setShowEmotionTrigger(true)}
            onMouseLeave={() => setShowEmotionTrigger(false)}
            sx={{
              position: "relative",
              mb: (msg.reactions?.length ?? 0) > 0 ? "18px" : 0,
            }}
          >
            <MessageActions msg={msg} isLeft={isLeft} {...actionHandlers} variant={'file'} />
            {audioAttachment.map((a) => (
              <AudioBubble
                key={a.attachmentId}
                src={a.fileUrl ?? ""}
                durationProp={a.recordDuration ?? null}
                isLeft={isLeft}
                status={effectiveStatus}
                showStatus={shouldShowStatus}
                createdAt={msg.createdAt}
                onResend={() => onResend?.(msg)}
                onDeleteFailed={() => onDeleteFailed?.(msg.tempMessageId || msg.id)}
              />
            ))}
            <EmotionPicker
              reactions={msg.reactions || []}
              isLeft={isLeft}
              showTrigger={showEmotionTrigger}
              onReact={onReact}
              onOpenDetail={(el) => setPopoverAnchor(el)}
              msg={msg}
            />
          </Box>
        )}

        {/* ── FILE: video ── */}
        {msg.type === "file" && videoAttachment.length > 0 && !msg.isRevoked && (
          <Box
            onMouseEnter={() => setShowEmotionTrigger(true)}
            onMouseLeave={() => setShowEmotionTrigger(false)}
            sx={{
              position: "relative",
              mb: (msg.reactions?.length ?? 0) > 0 ? "18px" : 0,
            }}
          >
            <MessageActions msg={msg} isLeft={isLeft} {...actionHandlers} variant="file" />

            {replyMessage && (
              <Box sx={{ mb: 0.5 }}>
                <ReplyQuoteBubble replyMsg={replyMessage} isLeft={isLeft} onClick={() => onGoToMessage?.(replyMessage)} />
              </Box>
            )}

            {videoAttachment.map((item, index) => (
              <VideoBubble
                messageId={msg.id}
                key={item.attachmentId}
                src={item.fileUrl ?? msg.attachments?.[index].previewUrl}
                thumbnailUrl={null}
                fileName={item.fileName ?? ""}
                fileSize={item.fileSize}
                isLeft={isLeft}
                status={msg.status}
                showStatus={shouldShowStatus}
                createdAt={msg.createdAt}
                onResend={() => onResend?.(msg)}
                onDeleteFailed={() => onDeleteFailed?.(msg.tempMessageId || msg.id)}
              />
            ))}
            <EmotionPicker
              reactions={msg.reactions || []}
              isLeft={isLeft}
              showTrigger={showEmotionTrigger}
              onReact={onReact}
              onOpenDetail={(el) => setPopoverAnchor(el)}
              msg={msg}
            />
          </Box>
        )}

        {/* ── Display name ──s*/}
        <Typography
          sx={{
            mt: 1,
            px: 0.35,
            fontSize: 12.5,
            color: COLORS.textMuted,
            fontWeight: 600,
            textAlign: isLeft ? "left" : "right",
            letterSpacing: 0.3,
          }}
        >
          {displayName}
        </Typography>

        <EmotionDetailPopover
          anchor={anchorEl}
          reactions={msg.reactions || []}
          onClose={handleCloseDetail}
          msg={msg}
          onUnReact={onUnReact}
        />

        <PopoverShare
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          message={msg}
          onShare={onHandleShare}
        />
      </Box>
    </Stack>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.msg === nextProps.msg &&
    prevProps.isLeft === nextProps.isLeft &&
    prevProps.displayName === nextProps.displayName &&
    prevProps.avatar === nextProps.avatar
  );
});


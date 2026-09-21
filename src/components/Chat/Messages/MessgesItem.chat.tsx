import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState, memo } from "react";

import type { MessageType } from "../../../types/chat/chat.model.type";
import type { AbortMultipartParams } from "../../../types/upload.type";
import { COLORS } from "../../../utils/Colors";
import { EmotionDetailPopover } from "../Emotion/emotionDetailsPopover.chat";
import { PopoverShare } from "./PopoverShare.chat";

import {
  getAttachments,
  getFileNote,
  isAudioAttachment,
  isRawAttachment,
  isVideoAttachment,
  parseImageItems,
} from "../../../helpers/messageItem.helper";

import { RevokedMessageBubble } from "./sub-components/RevokedMessageBubble";
import { CallMessageBubbleItem } from "./sub-components/CallMessageBubbleItem";
import { TextMessageBubble } from "./sub-components/TextMessageBubble";
import { GifMessageBubble } from "./sub-components/GifMessageBubble";
import { FileMessageBubble } from "./sub-components/FileMessageBubble";

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
  onGoToMessage,
  onReCall,
  onCancelUpload,
  onTranslate,
  targetLanguage
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
  onGoToMessage?: (msg: MessageType) => void;
  onReCall?: (type: "video" | "voice") => void;
  onCancelUpload?: (item: AbortMultipartParams) => void;
  onTranslate?: (msg: MessageType) => void;
  targetLanguage?: string;
}) {
  const attachments = getAttachments(msg);
  const hasDoneAttachments = attachments.some((att) => att.status === "done" || !!att.fileUrl || !att.status);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
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
  
  // Nếu không có file nào done thì ẩn luôn
  if (isLeft && msg.type === "file" && !hasDoneAttachments) {
    return null;
  }

  const imageItems = parseImageItems(msg);
  const nonImageAttachments = attachments.filter((attachment) => isRawAttachment(attachment));
  const audioAttachment = attachments.filter((attachment) => isAudioAttachment(attachment));
  const videoAttachment = attachments.filter((attachment) => isVideoAttachment(attachment));

  const fileNote = getFileNote(msg);
  const failedAttachmentCount = attachments.filter((attachment) => attachment.status === "failed").length;

  const isAnyUploading = attachments.some(
    (att) => att.status === "pending" || att.status === "uploading" || att.status === "sending"
  );
  const allFailed = attachments.length > 0 && attachments.every((att) => att.status === "failed");

  const effectiveStatus = isAnyUploading
    ? "sending"
    : allFailed || msg.status === "failed"
      ? "failed"
      : msg.status;

  const isText = msg.type === "text";
  const isGif = msg.type === "gif";
  const isCall = (msg.type as string) === "call" || msg.messageType === "call" || Boolean(msg.callInfo);
  const shouldShowStatus = !isLeft;

  const URL_REGEX = /(https?:\/\/[^\s]+)/g;
  const hasUrl = msg.content && URL_REGEX.test(msg.content);
  const urlMatches = msg.content?.match(URL_REGEX);
  const hasLinkPreview = Boolean(hasUrl && urlMatches?.length === 1 && (msg.preview || msg.type === "text"));

  const replyMessage = msg.replyMessage || null;

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
        {msg.isRevoked && <RevokedMessageBubble />}

        {isCall && !msg.isRevoked && (
          <CallMessageBubbleItem
            msg={msg}
            isLeft={isLeft}
            shouldShowStatus={shouldShowStatus}
            showEmotionTrigger={showEmotionTrigger}
            onReCall={onReCall}
            onReply={(m) => setMessageReplyed(m)}
            onShare={() => setShareDialogOpen(true)}
            onReact={onReact}
            onOpenEmotionDetail={(el) => setPopoverAnchor(el)}
            onMouseEnter={() => setShowEmotionTrigger(true)}
            onMouseLeave={() => setShowEmotionTrigger(false)}
          />
        )}

        {isText && !msg.isRevoked && (
          <TextMessageBubble
            msg={msg}
            isLeft={isLeft}
            effectiveStatus={effectiveStatus}
            shouldShowStatus={shouldShowStatus}
            showEmotionTrigger={showEmotionTrigger}
            hasLinkPreview={hasLinkPreview}
            replyMessage={replyMessage}
            onGoToMessage={onGoToMessage}
            onResend={onResend}
            onReply={(m) => setMessageReplyed(m)}
            onShare={() => setShareDialogOpen(true)}
            onReact={onReact}
            onOpenEmotionDetail={(el) => setPopoverAnchor(el)}
            onMouseEnter={() => setShowEmotionTrigger(true)}
            onMouseLeave={() => setShowEmotionTrigger(false)}
            onTranslate={onTranslate}
            targetLanguage={targetLanguage}
          />
        )}

        {isGif && msg.gifUrl && !msg.isRevoked && (
          <GifMessageBubble
            msg={msg}
            isLeft={isLeft}
            shouldShowStatus={shouldShowStatus}
            showEmotionTrigger={showEmotionTrigger}
            replyMessage={replyMessage}
            onGoToMessage={onGoToMessage}
            onResend={onResend}
            onReply={(m) => setMessageReplyed(m)}
            onShare={() => setShareDialogOpen(true)}
            onReact={onReact}
            onOpenEmotionDetail={(el) => setPopoverAnchor(el)}
            onMouseEnter={() => setShowEmotionTrigger(true)}
            onMouseLeave={() => setShowEmotionTrigger(false)}
          />
        )}

        {msg.type === "file" && !msg.isRevoked && (
          <FileMessageBubble
            msg={msg}
            isLeft={isLeft}
            effectiveStatus={effectiveStatus}
            shouldShowStatus={shouldShowStatus}
            showEmotionTrigger={showEmotionTrigger}
            fileNote={fileNote}
            imageItems={imageItems}
            nonImageAttachments={nonImageAttachments}
            audioAttachment={audioAttachment}
            videoAttachment={videoAttachment}
            failedAttachmentCount={failedAttachmentCount}
            replyMessage={replyMessage}
            isText={isText}
            onGoToMessage={onGoToMessage}
            onResend={onResend}
            onCancelUpload={onCancelUpload}
            onReply={(m) => setMessageReplyed(m)}
            onShare={() => setShareDialogOpen(true)}
            onReact={onReact}
            onOpenEmotionDetail={(el) => setPopoverAnchor(el)}
            onMouseEnter={() => setShowEmotionTrigger(true)}
            onMouseLeave={() => setShowEmotionTrigger(false)}
          />
        )}

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

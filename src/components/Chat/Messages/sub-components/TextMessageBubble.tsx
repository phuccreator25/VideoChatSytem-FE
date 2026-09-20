import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { MessageType } from "../../../../types/chat/chat.model.type";
import { COLORS } from "../../../../utils/Colors";
import { MessageActions } from "../MessageActions.chat";
import { LinkPreview } from "../LinkPreview.chat";
import { ChatTime } from "../../ChatTime/ChatTime.chat";
import { MessageStatus } from "../../Status/messageStatus.chat";
import { EmotionPicker } from "../../Emotion/emotionPicker.chat";
import renderMessageContent from "../../../../helpers/renderMessageUrl.helper";
import { ReplyQuoteBubble } from "../ReplyBubble.chat";

type TextMessageBubbleProps = {
  msg: MessageType;
  isLeft: boolean;
  effectiveStatus?: string | null;
  shouldShowStatus: boolean;
  showEmotionTrigger: boolean;
  hasLinkPreview: boolean;
  replyMessage: MessageType | null;
  onGoToMessage?: (msg: MessageType) => void;
  onResend?: (msg: MessageType) => void;
  onReply: (m: MessageType) => void;
  onShare: () => void;
  onReact: (messageId: string, emotion: string) => void;
  onOpenEmotionDetail: (el: HTMLElement) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function TextMessageBubble({
  msg,
  isLeft,
  effectiveStatus,
  shouldShowStatus,
  showEmotionTrigger,
  hasLinkPreview,
  replyMessage,
  onGoToMessage,
  onResend,
  onReply,
  onShare,
  onReact,
  onOpenEmotionDetail,
  onMouseEnter,
  onMouseLeave,
}: TextMessageBubbleProps) {
  const actionHandlers = {
    onReply,
    onShare,
    onMore: (m: MessageType, anchor: HTMLElement) => console.log("more", m, anchor),
  };

  const URL_REGEX = /(https?:\/\/[^\s]+)/g;
  const hasUrl = msg.content && URL_REGEX.test(msg.content);

  return (
    <Box
      sx={{
        position: "relative",
        width: hasLinkPreview ? "100%" : "auto",
        maxWidth: { xs: "90%", sm: hasLinkPreview ? 420 : "75%" },
      }}
    >
      <MessageActions msg={msg} isLeft={isLeft} {...actionHandlers} variant="text" />
      <Box
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        sx={{
          position: "relative",
          overflow: "visible",
          mb: (msg.reactions?.length ?? 0) > 0 ? "18px" : 0,
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

        <Typography
          sx={{
            fontSize: 15,
            lineHeight: 1.62,
            color: isLeft ? COLORS.textMain : "#f8faff",
            textAlign: "left",
            wordBreak: "break-word",
            letterSpacing: 0.1,
          }}
        >
          {renderMessageContent(msg.content || "", isLeft)}
        </Typography>

        {hasLinkPreview && (msg.preview || (msg.type === "text" && hasUrl)) && (
          <LinkPreview preview={msg.preview || null} isLeft={isLeft} />
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: isLeft ? "flex-start" : "flex-end",
            alignItems: "center",
            gap: 1,
            mt: 0.75,
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
              status={effectiveStatus}
              onResend={() => onResend?.(msg)}
            />
          )}
        </Box>

        <EmotionPicker
          reactions={msg.reactions || []}
          isLeft={isLeft}
          showTrigger={showEmotionTrigger}
          onReact={onReact}
          onOpenDetail={onOpenEmotionDetail}
          msg={msg}
        />
      </Box>
    </Box>
  );
}

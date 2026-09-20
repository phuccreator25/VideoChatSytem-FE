import Box from "@mui/material/Box";
import type { MessageType } from "../../../../types/chat/chat.model.type";
import { COLORS } from "../../../../utils/Colors";
import { MessageActions } from "../MessageActions.chat";
import { ChatTime } from "../../ChatTime/ChatTime.chat";
import { MessageStatus } from "../../Status/messageStatus.chat";
import { EmotionPicker } from "../../Emotion/emotionPicker.chat";
import { ReplyQuoteBubble } from "../ReplyBubble.chat";

type GifMessageBubbleProps = {
  msg: MessageType;
  isLeft: boolean;
  shouldShowStatus: boolean;
  showEmotionTrigger: boolean;
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

export function GifMessageBubble({
  msg,
  isLeft,
  shouldShowStatus,
  showEmotionTrigger,
  replyMessage,
  onGoToMessage,
  onResend,
  onReply,
  onShare,
  onReact,
  onOpenEmotionDetail,
  onMouseEnter,
  onMouseLeave,
}: GifMessageBubbleProps) {
  const actionHandlers = {
    onReply,
    onShare,
    onMore: (m: MessageType, anchor: HTMLElement) => console.log("more", m, anchor),
  };

  return (
    <Box
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
          src={msg.gifUrl ?? undefined}
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
            />
          )}
        </Box>
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
  );
}

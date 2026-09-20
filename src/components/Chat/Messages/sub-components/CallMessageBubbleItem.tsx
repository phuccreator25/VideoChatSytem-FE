import Box from "@mui/material/Box";
import type { MessageType } from "../../../../types/chat/chat.model.type";
import { MessageActions } from "../MessageActions.chat";
import { CallBubble } from "../CallBubble.chat";
import { EmotionPicker } from "../../Emotion/emotionPicker.chat";

type CallMessageBubbleItemProps = {
  msg: MessageType;
  isLeft: boolean;
  shouldShowStatus: boolean;
  showEmotionTrigger: boolean;
  onReCall?: (type: "video" | "voice") => void;
  onReply: (m: MessageType) => void;
  onShare: () => void;
  onReact: (messageId: string, emotion: string) => void;
  onOpenEmotionDetail: (el: HTMLElement) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function CallMessageBubbleItem({
  msg,
  isLeft,
  shouldShowStatus,
  showEmotionTrigger,
  onReCall,
  onReply,
  onShare,
  onReact,
  onOpenEmotionDetail,
  onMouseEnter,
  onMouseLeave,
}: CallMessageBubbleItemProps) {
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
      <MessageActions msg={msg} isLeft={isLeft} {...actionHandlers} variant="text" />
      <CallBubble msg={msg} isLeft={isLeft} shouldShowStatus={shouldShowStatus} onReCall={onReCall} />
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

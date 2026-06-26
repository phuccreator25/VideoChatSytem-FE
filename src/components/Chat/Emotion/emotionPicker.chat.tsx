import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { MESSAGE_EMOTION_UI } from "../../../data/messageReaction.data";
import type { MessageType, reactionMessage } from "../../../types/chat/chat.model.type";
import { triggerEmojiConfetti } from "../../../helpers/emojiConfetti.helper";

type EmotionKey = reactionMessage["emotion"];

type Props = {
  reactions: reactionMessage[];
  isLeft: boolean;
  showTrigger: boolean;
  onReact: (messageId: string, emotion: string) => void
  onOpenDetail: (anchor: HTMLElement) => void;
  msg: MessageType
};

export function EmotionPicker({ reactions, isLeft, showTrigger, onReact, onOpenDetail, msg }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPicker = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setPickerOpen(true);
  };
  const closePicker = () => { hideTimer.current = setTimeout(() => setPickerOpen(false), 150); };

  const topEmotions = (() => {
    const counts: Record<string, number> = {};
    reactions.forEach(r => { counts[r.emotion] = (counts[r.emotion] || 0) + 1; });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([e]) => e as EmotionKey);
  })();

  const triggerVisible = showTrigger || pickerOpen;
  const hasReactions = reactions.length > 0;
  const pickerTransform = pickerOpen
    ? isLeft
      ? "translateX(-50%) scale(1)"
      : "scale(1)"
    : isLeft
      ? "translateX(-50%) scale(0.9)"
      : "scale(0.9)";

  return (
    <>
      {/* ── Wrapper bọc trigger + popup để căn giữa đúng ── */}
      <Box
        sx={{
          position: "absolute",
          bottom: -11,
          right: -11,
          width: 26,
          height: 26,
        }}
      >
        {/* Popup căn giữa so với trigger */}
        <Box
          onMouseEnter={openPicker}
          onMouseLeave={closePicker}
          sx={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            ...(isLeft ? { left: "50%" } : { right: 15 }),
            transform: pickerTransform,
            transformOrigin: isLeft ? "bottom center" : "bottom right",
            opacity: pickerOpen ? 1 : 0,
            pointerEvents: pickerOpen ? "auto" : "none",
            transition: "opacity 0.15s, transform 0.15s",
            display: "flex", gap: "3px", alignItems: "center",
            bgcolor: "rgba(255, 255, 255, 0.94)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(148, 163, 184, 0.24)",
            borderRadius: "32px", px: 1.1, py: 0.75,
            zIndex: 30,
            boxShadow:
              "0 14px 34px rgba(15, 23, 42, 0.14), 0 2px 8px rgba(79, 70, 229, 0.08)",
            whiteSpace: "nowrap",
          }}
        >
          {(Object.entries(MESSAGE_EMOTION_UI) as [EmotionKey, { label: string; icon: string }][]).map(([key, val]) => (
            <Tooltip key={key} title={val.label} placement="top" arrow>
              <Box
                onClick={(e) => {
                  triggerEmojiConfetti(val.icon, e);
                  onReact(msg.id, key);
                  setPickerOpen(false);
                }}
                sx={{
                  fontSize: 25, lineHeight: 1, cursor: "pointer",
                  p: "5px 6px", borderRadius: "14px",
                  transition: "transform 0.14s ease, background-color 0.14s ease, box-shadow 0.14s ease",
                  "&:hover": {
                    transform: "scale(1.22) translateY(-3px)",
                    bgcolor: "rgba(238, 242, 255, 0.92)",
                    boxShadow: "0 6px 14px rgba(79, 70, 229, 0.12)",
                  },
                }}
              >
                {val.icon}
              </Box>
            </Tooltip>
          ))}
        </Box>

        {/* Trigger icon */}
        <Box
          onMouseEnter={openPicker}
          onMouseLeave={closePicker}
          sx={{
            width: 26, height: 26,
            borderRadius: "50%",
            bgcolor: "background.paper",
            border: "1.5px solid", borderColor: "divider",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, cursor: "pointer",
            opacity: triggerVisible ? 1 : 0,
            transform: triggerVisible ? "scale(1)" : "scale(0.5)",
            transition: "opacity 0.15s, transform 0.15s",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            userSelect: "none",
          }}
        >
          👍
        </Box>
      </Box>

      {/* ── Reaction bar — hiện khi có reactions, góc dưới-trái bubble ── */}
      {hasReactions && (
        <Box
          onClick={(e) => onOpenDetail(e.currentTarget)}
          sx={{
            position: "absolute",
            bottom: -13,
            left: 8,
            display: "inline-flex", alignItems: "center", gap: "1px",
            bgcolor: "background.paper",
            border: "1px solid", borderColor: "divider",
            borderRadius: "20px", px: "6px", py: "2px",
            cursor: "pointer", zIndex: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
            transition: "border-color 0.15s",
            "&:hover": { borderColor: "text.secondary" },
          }}
        >
          {topEmotions.map(emotion => (
            <Box key={emotion} sx={{ fontSize: 13, lineHeight: 1 }}>
              {MESSAGE_EMOTION_UI[emotion].icon}
            </Box>
          ))}
          <Box sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary", ml: "3px" }}>
            {reactions.length}
          </Box>
        </Box>
      )}
    </>
  );
}

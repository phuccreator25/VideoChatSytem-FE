import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";
import Fade from "@mui/material/Fade";
import Skeleton from "@mui/material/Skeleton";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
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
  onTranslate: (msg: MessageType) => void;
  targetLanguage?: string;
};

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
  onTranslate,
  targetLanguage
}: TextMessageBubbleProps) {
  const [showTranslation, setShowTranslation] = useState<boolean>(false);

  useEffect(() => {
    const currentLang = (targetLanguage ?? "en").toLowerCase();
    if (showTranslation && !msg.translations?.[currentLang]) {
      onTranslate(msg);
    }
  }, [showTranslation, targetLanguage, msg.translations, msg.id]);

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
          minWidth: 160,
          width: "100%",
          opacity: effectiveStatus === "sending" ? 0.78 : 1,
          boxShadow: isLeft
            ? "0 8px 22px rgba(15, 23, 42, 0.07)"
            : effectiveStatus === "failed"
              ? "0 12px 30px rgba(239, 68, 68, 0.25)"
              : "0 12px 30px rgba(79, 70, 229, 0.34)",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {replyMessage && (
          <Box sx={{ mb: 1 }}>
            <ReplyQuoteBubble replyMsg={replyMessage} isLeft={isLeft} onClick={() => onGoToMessage?.(replyMessage)} />
          </Box>
        )}

        {/* Phần hiển thị bản gốc và nút Icon Toggle dịch */}
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {showTranslation && (
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: isLeft ? "#64748b" : "rgba(255, 255, 255, 0.75)",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  mb: 0.5,
                }}
              >
                Original
              </Typography>
            )}

            <Typography
              sx={{
                fontSize: 15,
                lineHeight: 1.62,
                color: isLeft ? COLORS.textMain : "#f8faff",
                textAlign: "left",
                wordBreak: "break-word",
                letterSpacing: 0.1,
                opacity: showTranslation ? (isLeft ? 0.65 : 0.8) : 1,
                transition: "opacity 0.25s ease",
              }}
            >
              {renderMessageContent(msg.content || "", isLeft)}
            </Typography>
          </Box>

          {/* Icon Toggle Dịch */}
          {isLeft && (
            <Tooltip title={showTranslation ? "Hide translation" : "Translate message"} placement="top">
            <IconButton
              size="small"
              onClick={() => {
                if (!showTranslation) onTranslate(msg)
                setShowTranslation((prev) => !prev)
              }}
              sx={{
                p: 0.5,
                ml: 0.5,
                bgcolor: showTranslation
                  ? isLeft
                    ? "rgba(79, 70, 229, 0.12)"
                    : "rgba(255, 255, 255, 0.25)"
                  : "transparent",
                color: isLeft
                  ? showTranslation
                    ? "#4f46e5"
                    : "#94a3b8"
                  : showTranslation
                    ? "#ffffff"
                    : "rgba(255, 255, 255, 0.75)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: isLeft ? "rgba(79, 70, 229, 0.1)" : "rgba(255, 255, 255, 0.2)",
                  color: isLeft ? "#4f46e5" : "#ffffff",
                },
              }}
            >
              <LanguageRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          )}
        </Box>

        {hasLinkPreview && (msg.preview || (msg.type === "text" && hasUrl)) && (
          <LinkPreview preview={msg.preview || null} isLeft={isLeft} />
        )}

        {/* Thời gian và trạng thái tin nhắn */}
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

        {/* TRẠNG THÁI KÍCH HOẠT (STACKED SPLIT CARD - BẢN DỊCH VỚI HIỆU ỨNG COLLAPSE & FADE) */}
        <Collapse in={showTranslation} unmountOnExit timeout={300}>
          <Fade in={showTranslation} timeout={350}>
            <Box
              sx={{
                mt: 1.5,
                pt: 1.25,
                borderTop: isLeft
                  ? "1px dashed rgba(148, 163, 184, 0.28)"
                  : "1px dashed rgba(255, 255, 255, 0.3)",
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: isLeft ? "#4f46e5" : "rgba(255, 255, 255, 0.85)",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  mb: 0.5,
                }}
              >
                Translation
              </Typography>

              {(() => {
                const currentLang = (targetLanguage ?? "en").toLowerCase();
                const translatedText = msg.translations?.[currentLang] || (targetLanguage ? msg.translations?.[targetLanguage] : undefined);
                if (!translatedText) {
                  return (
                    <Box sx={{ py: 0.5 }}>
                      <Skeleton
                        variant="text"
                        width="85%"
                        height={20}
                        sx={{
                          bgcolor: isLeft ? "rgba(148, 163, 184, 0.25)" : "rgba(255, 255, 255, 0.35)",
                          borderRadius: "4px",
                        }}
                      />
                      <Skeleton
                        variant="text"
                        width="55%"
                        height={20}
                        sx={{
                          bgcolor: isLeft ? "rgba(148, 163, 184, 0.25)" : "rgba(255, 255, 255, 0.35)",
                          borderRadius: "4px",
                          mt: 0.5,
                        }}
                      />
                    </Box>
                  );
                }
                return (
                  <Typography
                    sx={{
                      fontSize: 14.5,
                      lineHeight: 1.6,
                      color: isLeft ? "#1e293b" : "#ffffff",
                      fontWeight: 450,
                      wordBreak: "break-word",
                    }}
                  >
                    {translatedText}
                  </Typography>
                );
              })()}

              {/* Nút Ẩn bản dịch ở góc dưới */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Typography
                  onClick={() => setShowTranslation(false)}
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: isLeft ? "#4f46e5" : "rgba(255, 255, 255, 0.9)",
                    cursor: "pointer",
                    userSelect: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.4,
                    py: 0.25,
                    px: 1,
                    borderRadius: "6px",
                    transition: "all 0.18s ease",
                    "&:hover": {
                      bgcolor: isLeft ? "rgba(79, 70, 229, 0.08)" : "rgba(255, 255, 255, 0.15)",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Hide translation
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Collapse>

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

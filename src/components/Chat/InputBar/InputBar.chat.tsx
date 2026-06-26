import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Stack from "@mui/material/Stack";
import { COLORS } from "../../../utils/Colors";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import MicNoneRoundedIcon from "@mui/icons-material/MicNoneRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { SelectedImagesPreview } from "./SelectedFilesPreview.chat";
import { ACCEPTED_NON_IMAGE_FILE_TYPES } from "../../../data/FilesType.data";
import { useCallback, useMemo, useState } from "react";
import { CONFIG } from "../../../config/appConfig";
import { GiphyFetch } from "@giphy/js-fetch-api";
import type { IGif } from "@giphy/js-types";
import { SelectedGifPreview } from "./SelectedGifPreview.chat";
import type { MessageType, SelectedGif } from "../../../types/chat/chat.model.type";
import { EmoijPopover } from "./emojiPopover.chat";
import { GifPopover } from "./gifPopover.chat";
import { ReplyPreview } from "./ReplyPreview.chat";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import { Tooltip } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";

type voiceUi = {
  isRecording: boolean,
  recordingDuration: number,
  previewUrl: string | null,
}

type voiceData = {
  recordedFile: File | null
}

type voiceHandler = {
  startRecording: () => Promise<void>,
  stopRecording: () => void,
  clearRecording: () => void,
  handleVoiceClick: () => void,
  formatVoiceDuration: (second: number) => string
}

// ── InputBar ──────────────────────────────────────────────────
export function InputBar({
  value,
  onChange,
  onSend,
  onChangeFile,
  files,
  onRemoveFile,
  onApplyEmoji,
  onSelectGif,
  selectedGif,
  onRemoveGif,
  messageReplyed,
  onRemoveReply,
  voiceUi,
  voiceData,
  voiceHandler
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onChangeFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  files: File[];
  onRemoveFile?: (index: number) => void;
  onApplyEmoji: (emoji: string) => void;
  onSelectGif: (gif: IGif) => void;
  selectedGif: SelectedGif | null;
  onRemoveGif?: () => void;
  messageReplyed?: MessageType | null;
  onRemoveReply?: () => void;
  voiceUi: voiceUi,
  voiceData: voiceData,
  voiceHandler: voiceHandler 
}) {
  const hasText = value.trim().length > 0;
  const hasGif = selectedGif ? true : false;

  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLElement | null>(null);
  const isEmojiOpen = Boolean(emojiAnchorEl);

  const [gifAnchorEl, setGifAnchorEl] = useState<HTMLElement | null>(null);
  const [gifSearch, setGifSearch] = useState("");
  const isGifOpen = Boolean(gifAnchorEl);

  const giphyFetch = useMemo(() => {
    const apiKey = CONFIG.VITE_GIPHY_API_KEY;
    if (!apiKey) console.error("VITE_GIPHY_API_KEY chưa được cấu hình");
    return new GiphyFetch(apiKey);
  }, []);

  const fetchGifs = useCallback(
    (offset: number) => {
      const keyword = gifSearch.trim();
      if (keyword) {
        return giphyFetch.search(keyword, { offset, limit: 20, rating: "pg", lang: "vi" });
      }
      return giphyFetch.trending({ offset, limit: 20, rating: "pg" });
    },
    [gifSearch, giphyFetch],
  );

  return (
    <Box
      sx={{
        p: 2.4,
        bgcolor: "rgba(255,255,255,0.84)",
        borderTop: "1px solid rgba(148, 163, 184, 0.22)",
        backdropFilter: "blur(10px)",
        flexShrink: 0,
      }}
    >
      {/* ── Reply preview ── */}
      {messageReplyed && (
        <ReplyPreview message={messageReplyed} onRemove={onRemoveReply} />
      )}

      {/* ── Preview Image ── */}
      <SelectedImagesPreview files={files} onRemoveFile={onRemoveFile} />

      {/* ── Preview Gif ── */}
      <SelectedGifPreview gif={selectedGif} onRemove={onRemoveGif} />

      {voiceUi.previewUrl && voiceData.recordedFile && (
        <Box
          sx={{
            mb: 1.5,
            px: 1.4,
            py: 1.1,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            bgcolor: "rgba(238, 242, 255, 0.92)",
            border: "1px solid rgba(99, 102, 241, 0.18)",
            boxShadow: "0 8px 22px rgba(79, 70, 229, 0.08)",
          }}
        >
          <Box
            component="audio"
            src={voiceUi.previewUrl}
            controls
            preload="metadata"
            sx={{
              flex: 1,
              minWidth: 0,
              height: 38,
            }}
          />

          <Tooltip title="Record again">
            <IconButton
              onClick={() => {
                voiceHandler.clearRecording();
                void voiceHandler.startRecording();
              }}
              sx={{
                width: 38,
                height: 38,
                color: "#475569",
                bgcolor: "#fff",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                "&:hover": {
                  color: "#7c3aed",
                  bgcolor: "#f8fafc",
                },
              }}
            >
              <ReplayRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete recording">
            <IconButton
              onClick={voiceHandler.clearRecording}
              sx={{
                width: 38,
                height: 38,
                color: "#dc2626",
                bgcolor: "rgba(254, 242, 242, 0.95)",
                border: "1px solid rgba(248, 113, 113, 0.18)",
                "&:hover": {
                  bgcolor: "rgba(254, 226, 226, 0.95)",
                },
              }}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Stack
        direction="row"
        spacing={{ xs: 1.2, sm: 2 }}
        alignItems="flex-end"
        sx={{ flexWrap: { xs: "wrap", sm: "nowrap" }, rowGap: 1.2 }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: { xs: "100%", sm: 0 },
            minHeight: 58,
            pl: { xs: 1.8, sm: 2.2 },
            pr: { xs: 6.5, sm: 7 },
            py: 0.8,
            borderRadius: 3,
            bgcolor: "rgba(241, 245, 249, 0.8)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <InputBase
            disabled={voiceUi.isRecording || Boolean(voiceUi.previewUrl)}
            placeholder={
              voiceUi.isRecording
                ? `Recording voice... ${voiceUi.recordingDuration}s`
                : voiceUi.previewUrl
                  ? "Voice message ready"
                  : "Enter Message..."
            }
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && hasText) {
                e.preventDefault();
                onSend();
              }
            }}
            fullWidth
            multiline
            minRows={1}
            maxRows={5}
            sx={{
              width: "100%",
              fontSize: 16,
              color: "#0f172a",
              fontWeight: 500,
              lineHeight: 1.5,
              py: 0.6,
              "& .MuiInputBase-input": { padding: 0 },
              "& .MuiInputBase-inputMultiline": {
                padding: 0,
                overflowY: "auto !important",
                overflowX: "hidden !important",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(100, 116, 139, 0.5) transparent",
                "&::-webkit-scrollbar": { width: 8 },
                "&::-webkit-scrollbar-track": { background: "transparent", borderRadius: 999 },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(100, 116, 139, 0.5)",
                  borderRadius: 999,
                  border: "2px solid transparent",
                  backgroundClip: "padding-box",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "rgba(71, 85, 105, 0.68)",
                  backgroundClip: "padding-box",
                },
              },
              "& textarea": { resize: "none" },
              "& textarea::placeholder": { color: COLORS.textSoft, opacity: 1 },
            }}
          />

          {/* Show time recording */}
          {voiceUi.isRecording && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.7}
              sx={{
                position: "absolute",
                right: 56,
                bottom: 18,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#ef4444",
                  animation: "voicePulse 1s ease-in-out infinite",
                  "@keyframes voicePulse": {
                    "0%, 100%": {
                      opacity: 1,
                      transform: "scale(1)",
                    },
                    "50%": {
                      opacity: 0.45,
                      transform: "scale(0.8)",
                    },
                  },
                }}
              />

              <Box
                component="span"
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#dc2626",
                }}
              >
                {voiceHandler.formatVoiceDuration(voiceUi.recordingDuration)}
              </Box>
            </Stack>
          )}

          <Tooltip
            title={
              voiceUi.isRecording
                ? "Stop voice recording"
                : "Record voice message"
            }
          >
            <IconButton
              onClick={voiceHandler.handleVoiceClick}
              disabled={Boolean(voiceUi.previewUrl)}
              aria-label={
                voiceUi.isRecording
                  ? "Stop voice recording"
                  : "Start voice recording"
              }
              sx={{
                position: "absolute",
                right: 8,
                bottom: 8,
                width: 40,
                height: 40,

                color: voiceUi.isRecording
                  ? "#dc2626"
                  : "#475569",

                bgcolor: voiceUi.isRecording
                  ? "rgba(254, 226, 226, 0.94)"
                  : "rgba(255, 255, 255, 0.72)",

                border:
                  "1px solid rgba(148, 163, 184, 0.16)",

                boxShadow:
                  "0 6px 14px rgba(15, 23, 42, 0.06)",

                "&:hover": {
                  bgcolor: voiceUi.isRecording
                    ? "rgba(254, 202, 202, 0.95)"
                    : "rgba(255, 255, 255, 0.94)",

                  color: voiceUi.isRecording
                    ? "#b91c1c"
                    : "#7c3aed",
                },
              }}
            >
              {voiceUi.isRecording ? (
                <StopRoundedIcon />
              ) : (
                <MicNoneRoundedIcon />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ height: 58, flex: { xs: 1, sm: "0 0 auto" } }}
        >
          <IconButton
            onClick={(event) => setGifAnchorEl(event.currentTarget)}
            sx={{
              width: 40,
              height: 40,
              color: "#475569",
              bgcolor: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              transition: "background-color 180ms ease, color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
              boxShadow: isGifOpen ? "0 8px 18px rgba(67, 56, 202, 0.14)" : "none",
              "&:hover": { bgcolor: "rgba(255,255,255,0.94)", color: "#4338ca", transform: "translateY(-1px)" },
            }}
          >
            <Box component="span" sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, lineHeight: 1 }}>
              GIF
            </Box>
          </IconButton>

          <IconButton
            onClick={(event) => setEmojiAnchorEl(event.currentTarget)}
            sx={{
              color: "#475569",
              bgcolor: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              transition: "background-color 180ms ease, color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
              boxShadow: isEmojiOpen ? "0 8px 18px rgba(67, 56, 202, 0.14)" : "none",
              "&:hover": { bgcolor: "rgba(255,255,255,0.94)", color: "#4338ca", transform: "translateY(-1px)" },
            }}
          >
            <SentimentSatisfiedAltOutlinedIcon />
          </IconButton>

          <IconButton
            component="label"
            sx={{ color: "#475569", bgcolor: "rgba(255,255,255,0.72)", border: "1px solid rgba(148, 163, 184, 0.2)" }}
          >
            <AttachFileOutlinedIcon />
            <input hidden type="file" accept={ACCEPTED_NON_IMAGE_FILE_TYPES} multiple onChange={onChangeFile} />
          </IconButton>

          <IconButton
            component="label"
            sx={{
              color: "#475569",
              bgcolor: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              "&:hover": { bgcolor: "rgba(241,245,249,0.95)", color: "#2563eb" },
            }}
          >
            <ImageOutlinedIcon />
            <input hidden type="file" accept="image/*" multiple onChange={onChangeFile} />
          </IconButton>
        </Stack>

        <IconButton
          onClick={() => {
            
            if (!hasText && files.length < 1 && !hasGif && !voiceData.recordedFile) return;
            console.log('1');
            onSend();
          }}
          disabled={!hasText && files.length < 1 && !hasGif && !voiceData.recordedFile}
          sx={{
            width: { xs: 54, sm: 60 },
            height: { xs: 52, sm: 58 },
            borderRadius: 3,
            bgcolor: "#4338ca",
            color: "#fff",
            boxShadow: hasText ? "0 12px 24px rgba(67, 56, 202, 0.34)" : "none",
            "&:hover": { bgcolor: "#3730a3" },
            "&.Mui-disabled": { bgcolor: "#cbd5e1", color: "#94a3b8" },
          }}
        >
          <SendRoundedIcon />
        </IconButton>
      </Stack>

      {/* ── Emoji ── */}
      <EmoijPopover
        isEmojiOpen={isEmojiOpen}
        emojiAnchorEl={emojiAnchorEl}
        setEmojiAnchorEl={setEmojiAnchorEl}
        onApplyEmoji={onApplyEmoji}
      />

      {/* ── GIF ── */}
      <GifPopover
        isGifOpen={isGifOpen}
        gifAnchorEl={gifAnchorEl}
        setGifAnchorEl={setGifAnchorEl}
        gifSearch={gifSearch}
        setGifSearch={setGifSearch}
        fetchGifs={fetchGifs}
        onSelectGif={onSelectGif}
      />
    </Box>
  );
}
import { useEffect, useRef, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import { ChatTime } from "../ChatTime/ChatTime.chat";
import { MessageStatus } from "../Status/messageStatus.chat";
import { COLORS } from "../../../utils/Colors";

export interface AudioBubbleProps {
  src: string;
  durationProp?: number | null;
  isLeft: boolean;
  status?: string;
  showStatus?: boolean;
  createdAt?: string;
  onResend?: () => void;
  onDeleteFailed?: () => void;
}

const BAR_COUNT = 36;

function seedBars(src: string): number[] {
  let hash = 0;
  for (let i = 0; i < src.length; i++) {
    hash = (hash * 31 + src.charCodeAt(i)) >>> 0;
  }
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    const r = Math.sin(hash + i * 127.1) * 43758.5453;
    const v = r - Math.floor(r);
    return 0.18 + v * 0.72;
  });
}

function formatTime(sec: number): string {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioBubble({
  src,
  durationProp,
  isLeft,
  status,
  showStatus = false,
  createdAt,
  onResend,
  onDeleteFailed,
}: AudioBubbleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);

  const bars = seedBars(src);

  useEffect(() => {
    if (!src) {
      audioRef.current = null;
      return;
    }

    const audio = new Audio(src);

    audio.preload = "metadata";
    audioRef.current = audio;

    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
      setCurrent(0);
    };

    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);

      audioRef.current = null;
      cancelAnimationFrame(rafRef.current);
    };
  }, [src]);

  const tick = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;
    const p = audio.duration ? audio.currentTime / audio.duration : 0;
    setProgress(p);
    setCurrent(audio.currentTime);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      cancelAnimationFrame(rafRef.current);
    } else {
      audio.play();
      setPlaying(true);
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const handleSeek = (index: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const ratio = index / BAR_COUNT;
    audio.currentTime = ratio * audio.duration;
    setProgress(ratio);
    setCurrent(audio.currentTime);
  };

  // ── theme ──
  const isRight = !isLeft;
  const bubbleBg = isRight ? "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)" : "#ffffff";
  const bubbleBorder = isRight ? "none" : "1px solid rgba(148,163,184,0.22)";
  const bubbleShadow = isRight
    ? "0 12px 30px rgba(79,70,229,0.34)"
    : "0 8px 22px rgba(15,23,42,0.07)";
  const playBg = isRight ? "rgba(255,255,255,0.18)" : "rgba(99,102,241,0.1)";
  const playHover = isRight ? "rgba(255,255,255,0.28)" : "rgba(99,102,241,0.18)";
  const playColor = isRight ? "#fff" : "#6366f1";
  const playBorder = isRight ? "1.5px solid rgba(255,255,255,0.3)" : "1.5px solid rgba(99,102,241,0.28)";
  const barFilled = isRight ? "#fff" : "#6366f1";
  const barEmpty = isRight ? "rgba(255,255,255,0.25)" : "rgba(99,102,241,0.2)";
  const barHover = isRight ? "rgba(255,255,255,0.55)" : "rgba(99,102,241,0.5)";
  const timeColor = isRight ? "rgba(199,210,254,0.85)" : "#94a3b8";
  const dividerColor = isRight ? "rgba(255,255,255,0.1)" : "rgba(148,163,184,0.15)";
  const footerBg = isRight ? "rgba(0,0,0,0.08)" : "rgba(241,245,249,0.7)";

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        borderRadius: "16px",
        background: bubbleBg,
        border: bubbleBorder,
        boxShadow: bubbleShadow,
        minWidth: 260,
        maxWidth: 320,
        overflow: "hidden",
      }}
    >
      {/* ── Main row: play btn + waveform ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 1.4,
          pt: 1.3,
          pb: 1,
        }}
      >
        {/* Play / Pause */}
        <IconButton
          size="small"
          onClick={togglePlay}
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            bgcolor: playBg,
            color: playColor,
            border: playBorder,
            "&:hover": { bgcolor: playHover },
            transition: "background 0.15s",
          }}
        >
          {playing
            ? <PauseRoundedIcon sx={{ fontSize: 22 }} />
            : <PlayArrowRoundedIcon sx={{ fontSize: 22 }} />
          }
        </IconButton>

        {/* Waveform */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Bars */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "2.5px",
              height: 34,
              cursor: "pointer",
              mb: "4px",
            }}
          >
            {bars.map((h, i) => {
              const filled = i / BAR_COUNT < progress;
              return (
                <Box
                  key={i}
                  onClick={() => handleSeek(i)}
                  sx={{
                    flex: 1,
                    height: `${Math.round(h * 100)}%`,
                    minHeight: 3,
                    borderRadius: 999,
                    bgcolor: filled ? barFilled : barEmpty,
                    transition: "background 0.08s",
                    "&:hover": { bgcolor: barHover },
                  }}
                />
              );
            })}
          </Box>

          {/* Duration row */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 10.5, color: timeColor, fontWeight: 600, letterSpacing: 0.2 }}>
              {formatTime(current)}
            </Typography>
            <Typography sx={{ fontSize: 10.5, color: timeColor, fontWeight: 600, letterSpacing: 0.2 }}>
              {formatTime(durationProp ?? 0)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Footer: time + status ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isRight ? "flex-end" : "flex-start",
          gap: 0.75,
          px: 1.4,
          py: 0.6,
          borderTop: `1px solid ${dividerColor}`,
          bgcolor: footerBg,
        }}
      >
        <ChatTime
          createdAt={createdAt}
          color={isLeft ? COLORS.textMuted : "rgba(229, 231, 255, 0.95)"}
          dense
        />
        {isRight && showStatus && (
          <MessageStatus
            type="message"
            status={status}
            onResend={onResend}
            onDeleteFailed={onDeleteFailed}
          />
        )}
      </Box>
    </Box>
  );
}
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Stack from "@mui/material/Stack";

import { COLORS } from "../../../utils/Colors";

import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

export function InputBar({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}) {
  const hasText = value.trim().length > 0;

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
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            flex: 1,
            height: 58,
            px: 2.2,
            borderRadius: 3,
            bgcolor: "rgba(241, 245, 249, 0.8)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <InputBase
            placeholder="Enter Message..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && hasText) onSend();
            }}
            fullWidth
            sx={{
              fontSize: 16,
              color: "#0f172a",
              fontWeight: 500,
              '& input::placeholder': {
                color: COLORS.textSoft,
                opacity: 1,
              },
            }}
          />
        </Box>

        <Stack direction="row" spacing={1}>
          <IconButton
            sx={{
              color: "#475569",
              bgcolor: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
            }}
          >
            <SentimentSatisfiedAltOutlinedIcon />
          </IconButton>
          <IconButton
            sx={{
              color: "#475569",
              bgcolor: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
            }}
          >
            <AttachFileOutlinedIcon />
          </IconButton>
          <IconButton
            sx={{
              color: "#475569",
              bgcolor: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
            }}
          >
            <ImageOutlinedIcon />
          </IconButton>
        </Stack>

        <IconButton
          onClick={() => {
            if (!hasText) return;
            onSend();
          }}
          disabled={!hasText}
          sx={{
            width: 60,
            height: 58,
            borderRadius: 3,
            bgcolor: "#4338ca",
            color: '#fff',
            boxShadow: hasText ? "0 12px 24px rgba(67, 56, 202, 0.34)" : "none",
            '&:hover': {
              bgcolor: "#3730a3",
            },
            "&.Mui-disabled": {
              bgcolor: "#cbd5e1",
              color: "#94a3b8",
            },
          }}
        >
          <SendRoundedIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}

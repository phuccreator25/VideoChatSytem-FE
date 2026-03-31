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
  return (
    <Box sx={{ p: 3, bgcolor: COLORS.white, flexShrink: 0 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            flex: 1,
            height: 56,
            px: 2.5,
            borderRadius: 1.5,
            bgcolor: COLORS.inputBg,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <InputBase
            placeholder="Enter Message..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSend();
            }}
            fullWidth
            sx={{
              fontSize: 16,
              color: COLORS.textMain,
              '& input::placeholder': {
                color: COLORS.textSoft,
                opacity: 1,
              },
            }}
          />
        </Box>

        <Stack direction="row" spacing={1}>
          <IconButton sx={{ color: COLORS.primary }}>
            <SentimentSatisfiedAltOutlinedIcon />
          </IconButton>
          <IconButton sx={{ color: COLORS.primary }}>
            <AttachFileOutlinedIcon />
          </IconButton>
          <IconButton sx={{ color: COLORS.primary }}>
            <ImageOutlinedIcon />
          </IconButton>
        </Stack>

        <IconButton
          onClick={onSend}
          sx={{
            width: 60,
            height: 56,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            color: '#fff',
            '&:hover': {
              bgcolor: COLORS.primary,
              opacity: 0.95,
            },
          }}
        >
          <SendRoundedIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
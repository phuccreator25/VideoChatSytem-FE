import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { COLORS } from "../../../utils/Colors";

export function TypingIndicator({ isLeft = true }: { isLeft?: boolean }) {
  return (
    <Box
      sx={{
        bgcolor: isLeft ? "#ffffff" : "#eef2ff",
        border: "1px solid rgba(148, 163, 184, 0.22)",
        color: COLORS.textSoft,
        borderRadius: 3,
        px: 2.2,
        py: 1.2,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.8,
        boxShadow: "0 8px 22px rgba(15, 23, 42, 0.07)",
      }}
    >
      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Typing</Typography>
      <Stack direction="row" spacing={0.5}>
        {[0, 1, 2].map((dot) => (
          <Box
            key={dot}
            sx={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              bgcolor: "rgba(99, 102, 241, 0.8)",
              mt: '2px',
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

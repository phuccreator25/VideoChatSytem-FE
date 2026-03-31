import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { COLORS } from "../../../utils/Colors";

export function TypingIndicator() {
  return (
    <Box
      sx={{
        bgcolor: COLORS.primarySoft,
        color: '#fff',
        borderRadius: 2.5,
        px: 3,
        py: 1.8,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.8,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          bottom: -10,
          width: 20,
          height: 20,
          bgcolor: COLORS.primarySoft,
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
        },
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 600 }}>typing</Typography>
      <Stack direction="row" spacing={0.5}>
        {[0, 1, 2].map((dot) => (
          <Box
            key={dot}
            sx={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.75)',
              mt: '2px',
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
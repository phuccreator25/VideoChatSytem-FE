import { Box, Stack } from "@mui/material";
import { COLORS } from "../../../utils/Colors";
import { ImageCard } from "./ImageCard.chat";
import { ChatTime } from "../ChatTime/ChatTime.chat";

export function ImageFrame({
  images,
  time,
}: {
  images: string[];
  time: string;
}) {
  return (
    <Box
      sx={{
        bgcolor: COLORS.primarySoft,
        borderRadius: 2.5,
        px: 2,
        pt: 1,
        pb: 1.5,
        minWidth: { xs: 'auto', sm: 420 },
        maxWidth: 460,
      }}
    >
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {images.map((src, index) => (
          <ImageCard
            key={index}
            src={src}
            onDownload={() => {
              window.open(src, '_blank', 'noopener,noreferrer');
            }}
            onView={() => {
              window.open(src, '_blank', 'noopener,noreferrer');
            }}
            onDelete={() => {
              console.log('delete image', index);
            }}
          />
        ))}
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <ChatTime time={time} />
      </Box>
    </Box>
  );
}
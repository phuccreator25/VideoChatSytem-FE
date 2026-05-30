import { Box, Stack } from "@mui/material";
import { COLORS } from "../../../utils/Colors";
import { ImageCard } from "./ImageCard.chat";
import { ChatTime } from "../ChatTime/ChatTime.chat";

export function ImageFrame({
  images,
  createdAt,
  isLeft = true,
}: {
  images: string[];
  createdAt?: string;
  isLeft?: boolean;
}) {
  return (
    <Box
      sx={{
        bgcolor: isLeft ? "#ffffff" : "#f2f5ff",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        borderRadius: 3,
        px: 1.5,
        pt: 1.5,
        pb: 1.25,
        minWidth: { xs: "auto", sm: 360 },
        maxWidth: 470,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
      }}
    >
      <Stack direction="row" spacing={1.5} flexWrap="wrap">
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

      <Box
        sx={{
          display: "flex",
          justifyContent: isLeft ? "flex-start" : "flex-end",
          mt: 1.1,
          px: 0.4,
        }}
      >
        <ChatTime createdAt={createdAt} color={COLORS.textMuted} dense />
      </Box>
    </Box>
  );
}

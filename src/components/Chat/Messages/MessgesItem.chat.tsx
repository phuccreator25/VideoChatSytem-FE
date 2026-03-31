import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { Message } from "../../../types/data.type";
import { ImageFrame } from "../Images/ImageFrame.chat";
import { FileBubble } from "../Files/FileBubble.chat";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator.chat";
import { COLORS } from "../../../utils/Colors";

export function MessageItem({ msg }: { msg: Message }) {
  const isLeft = msg.sender === 'left';

  return (
    <Stack
      direction={isLeft ? 'row' : 'row-reverse'}
      spacing={1.5}
      alignItems="flex-end"
      sx={{ width: '100%' }}
    >
      <Avatar src={msg.avatar} sx={{ width: 44, height: 44 }} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isLeft ? 'flex-start' : 'flex-end',
          width: '100%',
        }}
      >
        {msg.type === 'gallery' && <ImageFrame images={msg.images} time={msg.time} />}

        {msg.type === 'file' && (
          <FileBubble fileName={msg.fileName} fileSize={msg.fileSize} time={msg.time} />
        )}

        {msg.type === 'typing' && <TypingIndicator />}

        <Typography
          sx={{
            mt: 1.2,
            px: 0.2,
            fontSize: 16,
            color: COLORS.textMain,
            textAlign: isLeft ? 'left' : 'right',
          }}
        >
          {msg.name}
        </Typography>
      </Box>
    </Stack>
  );
}
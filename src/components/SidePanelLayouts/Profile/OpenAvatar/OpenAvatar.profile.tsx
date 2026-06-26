import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";

import type { OpenAvatarProps } from "../../../../types/profile/profile.ui.type";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export function OpenAvatar({
  openAvatarPreview,
  setOpenAvatarPreview,
  profile,
}: OpenAvatarProps) {
  return (
    <Dialog
      open={openAvatarPreview}
      onClose={() => setOpenAvatarPreview(false)}
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: '#ffffff',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          p: 2,
        }}
      >
        <IconButton
          onClick={() => setOpenAvatarPreview(false)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            bgcolor: 'rgba(255,255,255,0.92)',
            color: '#1f2430',
            '&:hover': {
              bgcolor: '#ffffff',
            },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>

        <Box
          component="img"
          src={profile.avatar}
          alt={profile.fullname}
          sx={{
            display: 'block',
            width: '100%',
            maxWidth: 420,
            maxHeight: '70vh',
            objectFit: 'contain',
            mx: 'auto',
            borderRadius: 1,
          }}
        />
      </Box>
    </Dialog>
  );
}

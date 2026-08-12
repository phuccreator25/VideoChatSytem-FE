import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type { OpenAvatarProps } from '../../../../types/data.type';

export default function OpenAvatar({
  openAvatarPreview,
  setOpenAvatarPreview,
  profile,
}: OpenAvatarProps) {
  return (
    <Dialog
      open={openAvatarPreview}
      onClose={() => setOpenAvatarPreview(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'transparent',
          boxShadow: 'none',
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#0f172a',
          p: 2,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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
          src={profile?.avatar}
          alt={profile?.fullname}
          loading="lazy"
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

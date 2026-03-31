import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

import { COLORS } from "../../../utils/Colors";

const leftAvatar =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop';

export function Header() {
  return (
    <Box
      sx={{
        height: 80,
        px: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: COLORS.white,
        flexShrink: 0,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: COLORS.online,
                border: '2px solid white',
              }}
            />
          }
        >
          <Avatar src={leftAvatar} sx={{ width: 44, height: 44 }} />
        </Badge>

        <Typography sx={{ fontSize: 18, fontWeight: 600, color: COLORS.textMain }}>
          Doris Brown
        </Typography>
      </Stack>

      <Stack direction="row" spacing={0.5}>
        <IconButton sx={{ color: COLORS.icon }}>
          <SearchOutlinedIcon />
        </IconButton>
        <IconButton sx={{ color: COLORS.icon }}>
          <CallOutlinedIcon />
        </IconButton>
        <IconButton sx={{ color: COLORS.icon }}>
          <VideocamOutlinedIcon />
        </IconButton>
        <IconButton sx={{ color: COLORS.icon }}>
          <PersonOutlineOutlinedIcon />
        </IconButton>
        <IconButton sx={{ color: COLORS.icon }}>
          <MoreHorizOutlinedIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import { useState, type MouseEvent } from "react";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

export function ImageCard({
  src,
  onDownload,
  onView,
  onDelete,
}: {
  src: string;
  onDownload: () => void;
  onView: () => void;
  onDelete: () => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: 150, sm: 188 },
        height: { xs: 110, sm: 126 },
        overflow: 'hidden',
        borderRadius: 1.5,
        flexShrink: 0,
      }}
    >
      <Box
        component="img"
        src={src}
        alt="gallery"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          position: 'absolute',
          right: 8,
          bottom: 8,
        }}
      >
        <Tooltip title="Download">
          <IconButton
            size="small"
            onClick={onDownload}
            sx={{
              color: '#fff',
              bgcolor: 'rgba(0,0,0,0.24)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.38)' },
            }}
          >
            <DownloadOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="More">
          <IconButton
            size="small"
            onClick={openMenu}
            sx={{
              color: '#fff',
              bgcolor: 'rgba(0,0,0,0.24)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.38)' },
            }}
          >
            <MoreHorizOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            closeMenu();
            onView();
          }}
        >
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            onDownload();
          }}
        >
          Download
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            onDelete();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}
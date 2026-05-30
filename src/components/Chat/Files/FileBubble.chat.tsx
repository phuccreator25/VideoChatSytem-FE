import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { useState, type MouseEvent } from "react";

import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import { COLORS } from "../../../utils/Colors";
import { ChatTime } from "../ChatTime/ChatTime.chat";

export function FileBubble({
  fileName,
  fileSize,
  createdAt,
  isLeft = true,
}: {
  fileName: string;
  fileSize: string | number;
  createdAt?: string;
  isLeft?: boolean;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu = (event: MouseEvent<HTMLElement>) => {setAnchorEl(event.currentTarget)};
  const closeMenu = () => setAnchorEl(null);

  const handleDownload = () => {
    console.log('download file:', fileName);
  };

  const normalizedFileSize =
    typeof fileSize === "number"
      ? `${(fileSize / (1024 * 1024)).toFixed(2)} MB`
      : fileSize;

  return (
    <Box sx={{ display: "flex", justifyContent: isLeft ? "flex-start" : "flex-end", width: "100%" }}>
      <Box sx={{ position: 'relative', maxWidth: 380 }}>
        <IconButton
          size="small"
          onClick={openMenu}
          sx={{
            position: 'absolute',
            [isLeft ? "right" : "left"]: -22,
            top: 2,
            color: COLORS.icon,
          }}
        >
          <MoreHorizOutlinedIcon fontSize="small" />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
          <MenuItem onClick={closeMenu}>Open</MenuItem>
          <MenuItem
            onClick={() => {
              closeMenu();
              handleDownload();
            }}
          >
            Download
          </MenuItem>
          <MenuItem onClick={closeMenu}>Delete</MenuItem>
        </Menu>

        <Box
          sx={{
            bgcolor: isLeft ? "#ffffff" : COLORS.rightBubble,
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: 3,
            p: 2.5,
            minWidth: { xs: 280, sm: 365 },
            position: 'relative',
            boxShadow: "0 10px 26px rgba(15, 23, 42, 0.08)",
            '&::after': {
              content: '""',
              position: 'absolute',
              [isLeft ? "left" : "right"]: 0,
              bottom: -10,
              width: 20,
              height: 20,
              bgcolor: isLeft ? "#ffffff" : COLORS.rightBubble,
              clipPath: isLeft
                ? "polygon(0 0, 100% 0, 0 100%)"
                : "polygon(100% 0, 0 0, 100% 100%)",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 500,
              color: COLORS.textMain,
              textAlign: isLeft ? "left" : "right",
              mb: 1,
            }}
          >
            Files
          </Typography>

          <Paper elevation={0} sx={{ borderRadius: 2, p: 1.3, bgcolor: '#fff' }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 62,
                  height: 58,
                  borderRadius: 1.5,
                  bgcolor: '#ece9ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: COLORS.primary,
                  flexShrink: 0,
                }}
              >
                <InsertDriveFileOutlinedIcon />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: COLORS.textMain,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {fileName}
                </Typography>
                <Typography sx={{ fontSize: 13, color: COLORS.textSoft }}>
                  {normalizedFileSize}
                </Typography>
              </Box>

              <Tooltip title="Download">
                <IconButton size="small" onClick={handleDownload} sx={{ color: COLORS.icon }}>
                  <DownloadOutlinedIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="More">
                <IconButton size="small" onClick={openMenu} sx={{ color: COLORS.icon }}>
                  <MoreHorizOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>

          <Box sx={{ mt: 1.5 }}>
            <ChatTime createdAt={createdAt} color={COLORS.textSoft} dense />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

import type { ConversationUserInfo } from "../../../types/chat.type";

type HeaderProps = {
  userData?: ConversationUserInfo | null;
};

export function Header({ userData }: HeaderProps) {
  const getLastSeenText = (lastSeenAt?: string | null) => {
    if (!lastSeenAt) return "Offline";

    const now = Date.now();
    const lastSeen = new Date(lastSeenAt).getTime();
    const diffMs = now - lastSeen;

    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (minutes < 1) return "Active just now";
    if (minutes < 60) return `Active ${minutes}m ago`;
    if (hours < 24) return `Active ${hours}h ago`;
    if (days < 7) return `Active ${days}d ago`;

    return `Last active ${new Date(lastSeenAt).toLocaleDateString("vi-VN")}`;
  };

  const displayName = userData?.nickname ?? userData?.fullname ?? "Unknown user";

  const actionButtonSx = {
    width: 42,
    height: 42,
    borderRadius: "50%",
    color: "#4b5563",
    backgroundColor: "rgba(255,255,255,0.75)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    backdropFilter: "blur(10px)",
    transition: "all 0.22s ease",
    "&:hover": {
      backgroundColor: "#ffffff",
      color: "#312e81",
      borderColor: "rgba(99, 102, 241, 0.35)",
      transform: "translateY(-1px)",
    },
  };

  return (
    <Box
      sx={{
        height: 88,
        px: 2.75,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "rgba(255, 255, 255, 0.84)",
        borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
        backdropFilter: "blur(12px)",
        flexShrink: 0,
      }}
    >
      <Stack direction="row" spacing={1.75} alignItems="center" sx={{ minWidth: 0 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          invisible={userData?.isOnline !== "online"}
          badgeContent={
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: userData?.isOnline === 'online' ? "#22c55e" : "#94a3b8",
                border: "2px solid #ffffff",
                boxShadow: "0 0 0 1px rgba(34, 197, 94, 0.2)",
              }}
            />
          }
        >
          <Avatar
            src={userData?.avatar}
            alt={displayName}
            sx={{
              width: 50,
              height: 50,
              boxShadow: "0 8px 20px rgba(15, 23, 42, 0.14)",
              border: "2px solid rgba(255,255,255,0.9)",
            }}
          />
        </Badge>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 19,
              fontWeight: 600,
              color: "#0f172a",
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: { xs: 140, sm: 220, md: 320 },
            }}
          >
            {displayName}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: userData?.isOnline === 'online' ? "#22c55e" : "#94a3b8",
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: userData?.isOnline === 'online' ? "#16a34a" : "#6b7280",
                lineHeight: 1.2,
              }}
            >
              {userData?.isOnline === 'online' ? "Active now" : getLastSeenText(userData?.lastSeenAt)}
            </Typography>
          </Stack>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title="Search">
          <IconButton sx={actionButtonSx}>
            <SearchOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Voice call">
          <IconButton sx={actionButtonSx}>
            <CallOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Video call">
          <IconButton sx={actionButtonSx}>
            <VideocamOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Profile">
          <IconButton sx={actionButtonSx}>
            <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="More">
          <IconButton sx={actionButtonSx}>
            <MoreHorizOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}

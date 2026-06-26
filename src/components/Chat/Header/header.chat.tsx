import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import InputBase from "@mui/material/InputBase";
import { useState } from "react";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import type { ConversationUserInfo } from "../../../types/chat/chat.conversation.type";

type HeaderProps = {
  userData?: ConversationUserInfo | null;
};

export function Header({ userData }: HeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

      <Stack direction="row-reverse" spacing={1} alignItems="center">
        <Tooltip title="More">
          <IconButton sx={actionButtonSx}>
            <MoreHorizOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Profile">
          <IconButton sx={actionButtonSx}>
            <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Video call">
          <IconButton sx={actionButtonSx}>
            <VideocamOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Voice call">
          <IconButton sx={actionButtonSx}>
            <CallOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        {/* Search Bar Container - leftmost since it is last in row-reverse */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isSearchExpanded ? "flex-start" : "center",
            height: 42,
            width: isSearchExpanded ? { xs: 180, sm: 260 } : 42,
            borderRadius: "21px",
            backgroundColor: isSearchExpanded ? "rgba(243, 244, 246, 0.8)" : "rgba(255, 255, 255, 0.75)",
            border: "1px solid",
            borderColor: isSearchExpanded ? "rgba(99, 102, 241, 0.4)" : "rgba(148, 163, 184, 0.2)",
            boxShadow: isSearchExpanded ? "0 8px 24px rgba(99, 102, 241, 0.15)" : "none",
            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
            pr: isSearchExpanded ? 1.5 : 0,
            pl: isSearchExpanded ? 1.5 : 0,
            backdropFilter: "blur(10px)",
            mr: 0.5,
          }}
        >
          <IconButton
            size="small"
            onClick={() => setIsSearchExpanded(true)}
            disabled={isSearchExpanded}
            sx={{
              color: isSearchExpanded ? "#4f46e5" : "#4b5563",
              p: 0,
              mr: isSearchExpanded ? 1 : 0,
              minWidth: 0,
              transition: "color 0.22s ease",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            <SearchOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {isSearchExpanded && (
            <InputBase
              autoFocus
              fullWidth
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                fontSize: 14,
                color: "#0f172a",
                p: 0,
                "& input::placeholder": {
                  color: "#94a3b8",
                  opacity: 1,
                },
              }}
            />
          )}

          {isSearchExpanded && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery("");
                setIsSearchExpanded(false);
              }}
              sx={{
                color: "#94a3b8",
                p: 0.2,
                ml: 0.5,
                "&:hover": { color: "#ef4444" },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

// TIẾN HÀNH XỬ LÝ LOGIC SEARCH MESSAGE
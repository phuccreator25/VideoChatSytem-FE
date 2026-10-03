import React, { useState } from "react";
import {
  IconButton,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
  Tooltip,
} from "@mui/material";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";

type NotificationItem = {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "report" | "user" | "call";
  unread: boolean;
};

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "New user report",
    desc: "User @alex_smith was reported for suspicious activity.",
    time: "5m ago",
    type: "report",
    unread: true,
  },
  {
    id: "2",
    title: "High traffic alert",
    desc: "Room #room-884 reached 85% bandwidth threshold.",
    time: "20m ago",
    type: "call",
    unread: true,
  },
  {
    id: "3",
    title: "New registrations",
    desc: "15 new user accounts were successfully activated.",
    time: "1h ago",
    type: "user",
    unread: false,
  },
];

export const AdminNotifications = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const open = Boolean(anchorEl);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "report":
        return <ReportProblemRoundedIcon sx={{ color: "#EF4444", fontSize: 20 }} />;
      case "call":
        return <VideocamRoundedIcon sx={{ color: "#F59E0B", fontSize: 20 }} />;
      case "user":
      default:
        return <PersonAddRoundedIcon sx={{ color: "#06B6D4", fontSize: 20 }} />;
    }
  };

  return (
    <>
      <Tooltip title="Notifications" arrow>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            color: "#64748B",
            p: 0.85,
            borderRadius: "50%",
            position: "relative",
            "&:hover": {
              bgcolor: "#F8FAFC",
              color: "#0F172A",
            },
          }}
        >
          <NotificationsNoneRoundedIcon sx={{ fontSize: 20 }} />

          {/* Cyan / Sky Notification Dot matching Orbit mockup */}
          {unreadCount > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 7,
                right: 7,
                width: 6.5,
                height: 6.5,
                borderRadius: "50%",
                bgcolor: "#06B6D4",
                boxShadow: "0 0 6px rgba(6, 182, 212, 0.6)",
                border: "1.5px solid #FFFFFF",
              }}
            />
          )}
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 360,
            maxHeight: 480,
            bgcolor: "#FFFFFF",
            color: "#0F172A",
            border: "1px solid #E2E8F0",
            borderRadius: "14px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            backgroundImage: "none",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography
                variant="caption"
                sx={{
                  bgcolor: "rgba(124, 58, 237, 0.1)",
                  color: "#7C3AED",
                  px: 1,
                  py: 0.2,
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                }}
              >
                {unreadCount} new
              </Typography>
            )}
          </Box>

          <Button
            size="small"
            onClick={handleMarkAllRead}
            startIcon={<DoneAllRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{
              color: "#64748B",
              fontSize: "0.75rem",
              textTransform: "none",
              "&:hover": { color: "#7C3AED" },
            }}
          >
            Mark all as read
          </Button>
        </Box>

        <Divider sx={{ borderColor: "#F1F5F9" }} />

        {/* List */}
        <List sx={{ p: 1 }}>
          {notifications.map((n) => (
            <ListItem
              key={n.id}
              sx={{
                borderRadius: "10px",
                mb: 0.5,
                bgcolor: n.unread ? "rgba(124, 58, 237, 0.04)" : "transparent",
                border: n.unread ? "1px solid rgba(124, 58, 237, 0.12)" : "1px solid transparent",
                "&:hover": {
                  bgcolor: "#F8FAFC",
                },
                cursor: "pointer",
                p: 1.25,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "8px",
                    bgcolor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getIcon(n.type)}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: n.unread ? 600 : 500,
                      color: "#0F172A",
                      fontSize: "0.825rem",
                    }}
                  >
                    {n.title}
                  </Typography>
                }
                secondary={
                  <Box component="span" sx={{ display: "block" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748B",
                        fontSize: "0.75rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {n.desc}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#94A3B8", fontSize: "0.7rem", mt: 0.25, display: "block" }}
                    >
                      {n.time}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};
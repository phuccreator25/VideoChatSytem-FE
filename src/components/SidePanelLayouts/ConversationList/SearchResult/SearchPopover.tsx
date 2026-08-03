import React from "react";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";

import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { COLORS } from "../../../../utils/Colors";
import { customScrollbarSx } from "../../../../utils/CustomScroll";
import type { SearchPopoverProps } from "../../../../types/search.type";

export const SearchPopover = ({
  open,
  anchorEl,
  searchQuery,
  isLoading = false,
  recentChats = [],
  contacts = [],
  messages = [],
  onClose,
  onSelectConversation,
  onSelectMessage,
}: SearchPopoverProps) => {
  const hasRecentChats = recentChats.length > 0;
  const hasContacts = contacts.length > 0;
  const hasMessages = messages.length > 0;
  const hasAnyResult = hasRecentChats || hasContacts || hasMessages;
  
  // Helper to render section title with badge counter
  const renderSectionHeader = (
    icon: React.ReactNode,
    title: string,
    count: number,
    color: string
  ) => (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: 1,
        py: 0.75,
        mb: 1,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 24,
            height: 24,
            borderRadius: "7px",
            bgcolor: `${color}14`,
            color: color,
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 800,
            color: COLORS.title,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            fontFamily: "'Outfit', 'Inter', sans-serif",
          }}
        >
          {title}
        </Typography>
      </Stack>

      <Chip
        label={count}
        size="small"
        sx={{
          height: 18,
          fontSize: 10.5,
          fontWeight: 750,
          bgcolor: `${color}18`,
          color: color,
          borderRadius: "5px",
          px: 0.25,
          "& .MuiChip-label": { px: 0.6 },
        }}
      />
    </Stack>
  );

  // Helper to highlight matched query text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim() || !text) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <Box
          key={index}
          component="span"
          sx={{
            bgcolor: "rgba(99, 102, 241, 0.18)",
            color: "#4f46e5",
            fontWeight: 700,
            px: 0.4,
            py: 0.1,
            borderRadius: "4px",
          }}
        >
          {part}
        </Box>
      ) : (
        part
      )
    );
  };

  // Helper to format ISO timestamps nicely
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      if (isToday) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      marginThreshold={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            mt: 1,
            width: anchorEl ? Math.max(anchorEl.getBoundingClientRect().width, 280) : "90vw",
            maxWidth: "92vw",
            maxHeight: { xs: "calc(100vh - 160px)", sm: "calc(100vh - 180px)" },
            borderRadius: { xs: "18px", sm: "22px" },
            bgcolor: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            boxShadow:
              "0 24px 60px -12px rgba(15, 23, 42, 0.22), 0 0 1px 1px rgba(255, 255, 255, 0.9) inset",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            animation: "fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateY(-8px) scale(0.98)" },
              to: { opacity: 1, transform: "translateY(0) scale(1)" },
            },
          },
        },
      }}
    >
      {/* Header bar of Popover */}
      <Box
        sx={{
          px: 2,
          py: 1.25,
          borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
          bgcolor: "rgba(248, 250, 252, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 800,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            fontFamily: "'Outfit', 'Inter', sans-serif",
          }}
        >
          Search Results
        </Typography>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            width: 24,
            height: 24,
            color: "#94a3b8",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "rgba(226, 232, 240, 0.8)",
              color: "#1e293b",
            },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          p: 1.5,
          overflowY: "auto",
          ...customScrollbarSx,
        }}
      >
        {isLoading ? (
          /* Loading Skeleton State */
          <Stack spacing={1.5} sx={{ p: 0.5 }}>
            <Skeleton variant="text" width="40%" height={20} sx={{ borderRadius: 1 }} />
            {Array.from({ length: 4 }).map((_, idx) => (
              <Stack key={idx} direction="row" spacing={1.5} alignItems="center">
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={18} />
                  <Skeleton variant="text" width="85%" height={14} />
                </Box>
              </Stack>
            ))}
          </Stack>
        ) : !hasAnyResult ? (
          /* empty */
          <Box
            sx={{
              py: 5,
              px: 2,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                display: "grid",
                placeItems: "center",
                color: "#6366f1",
                mb: 1.5,
                boxShadow: "0 8px 20px rgba(99, 102, 241, 0.08)",
              }}
            >
              <SearchOffRoundedIcon sx={{ fontSize: 26 }} />
            </Box>
            <Typography
              sx={{
                fontSize: 14.5,
                fontWeight: 700,
                color: COLORS.title,
                mb: 0.5,
              }}
            >
              No result
            </Typography>
            <Typography
              sx={{
                fontSize: 12.5,
                color: COLORS.textMuted,
                maxWidth: 240,
                lineHeight: 1.4,
              }}
            >
              No conversation, friend or message matches "{searchQuery}"
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {/* people & chats */}
            {(hasRecentChats || hasContacts) && (
              <Box>
                {renderSectionHeader(
                  <PeopleOutlineRoundedIcon sx={{ fontSize: 14 }} />,
                  "People & Chats",
                  recentChats.length + contacts.length,
                  "#6366f1"
                )}
                <Stack spacing={0.75}>
                  {/* recent chats */}
                  {recentChats.map((chat) => (
                    <ButtonBase
                      key={chat.id}
                      onClick={async () => {
                        if (chat.userId) {
                          await onSelectConversation?.(chat.userId);
                        }
                        onClose();
                      }}
                      sx={{
                        width: "100%",
                        p: 1.25,
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        textAlign: "left",
                        bgcolor: "rgba(255, 255, 255, 0.6)",
                        border: "1px solid rgba(226, 232, 240, 0.7)",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          bgcolor: "#ffffff",
                          borderColor: "rgba(99, 102, 241, 0.3)",
                          boxShadow: "0 4px 16px rgba(99, 102, 241, 0.08)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                          <Avatar
                            src={chat.avatar}
                            alt={chat.name}
                            sx={{ width: 40, height: 40, bgcolor: COLORS.primary }}
                          />

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography
                              noWrap
                              sx={{
                                fontSize: 13.5,
                                fontWeight: 700,
                                color: COLORS.title,
                                mr: 1,
                              }}
                            >
                              {highlightMatch(chat.name, searchQuery)}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </ButtonBase>
                  ))}

                  {/* contacts  */}
                  {contacts.map((contact) => {
                    const displayName = contact.name;
                    
                    return (
                      <ButtonBase
                        key={contact.userId}
                        onClick={async () => {
                          await onSelectConversation?.(contact.userId.toString());
                          onClose();
                        }}
                        sx={{
                          width: "100%",
                          p: 1.25,
                          borderRadius: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          textAlign: "left",
                          bgcolor: "rgba(255, 255, 255, 0.6)",
                          border: "1px solid rgba(226, 232, 240, 0.7)",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            bgcolor: "#ffffff",
                            borderColor: "rgba(16, 185, 129, 0.3)",
                            boxShadow: "0 4px 16px rgba(16, 185, 129, 0.08)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                          <Avatar
                            src={contact.avatar}
                            alt={displayName}
                            sx={{ width: 40, height: 40, bgcolor: "#10b981" }}
                          />

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              noWrap
                              sx={{
                                fontSize: 13.5,
                                fontWeight: 700,
                                color: COLORS.title,
                              }}
                            >
                              {highlightMatch(displayName, searchQuery)}
                            </Typography>
                          </Box>
                        </Stack>

                        <Chip
                          label="Nhắn tin"
                          size="small"
                          icon={<ArrowForwardIosRoundedIcon sx={{ fontSize: "9px !important" }} />}
                          sx={{
                            height: 22,
                            fontSize: 11,
                            fontWeight: 700,
                            bgcolor: "rgba(16, 185, 129, 0.1)",
                            color: "#059669",
                            borderRadius: "7px",
                            pointerEvents: "none",
                            "& .MuiChip-label": { pr: 0.6 },
                          }}
                        />
                      </ButtonBase>
                    );
                  })}
                </Stack>
              </Box>
            )}

            {/* messages  */}
            {hasMessages && (
              <Box>
                {renderSectionHeader(
                  <MessageOutlinedIcon sx={{ fontSize: 14 }} />,
                  "Messages",
                  messages.length,
                  "#8b5cf6"
                )}
                <Stack spacing={0.75}>
                  {messages.map((msg) => (
                    <ButtonBase
                      key={msg.messageId}
                      onClick={async () => {
                        await onSelectMessage?.(msg.conversationId, msg.messageId);
                        onClose();
                      }}
                      sx={{
                        width: "100%",
                        p: 1.25,
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "flex-start",
                        textAlign: "left",
                        bgcolor: "rgba(255, 255, 255, 0.6)",
                        border: "1px solid rgba(226, 232, 240, 0.7)",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          bgcolor: "#ffffff",
                          borderColor: "rgba(139, 92, 246, 0.3)",
                          boxShadow: "0 4px 16px rgba(139, 92, 246, 0.08)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      <Avatar
                        alt={msg.senderName}
                        sx={{ width: 36, height: 36, mr: 1.25, mt: 0.2, bgcolor: "#8b5cf6", fontSize: 14, fontWeight: 700 }}
                      >
                        {msg.senderName?.charAt(0)?.toUpperCase() || "M"}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography
                            noWrap
                            sx={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: COLORS.title,
                              mr: 1,
                            }}
                          >
                            {msg.senderName}
                            {msg.conversationName && (
                              <Box component="span" sx={{ fontWeight: 400, color: COLORS.textMuted, ml: 0.5 }}>
                                in {msg.conversationName}
                              </Box>
                            )}
                          </Typography>

                          {msg.createdAt && (
                            <Typography
                              sx={{
                                fontSize: 10.5,
                                color: COLORS.textMuted,
                                fontWeight: 500,
                                flexShrink: 0,
                              }}
                            >
                              {formatDate(msg.createdAt)}
                            </Typography>
                          )}
                        </Stack>

                        <Typography
                          noWrap
                          sx={{
                            fontSize: 12,
                            color: COLORS.title,
                            fontWeight: 450,
                            mt: 0.2,
                            bgcolor: "rgba(241, 245, 249, 0.7)",
                            p: 0.6,
                            borderRadius: "7px",
                            borderLeft: "3px solid #8b5cf6",
                          }}
                        >
                          {highlightMatch(msg.content, searchQuery)}
                        </Typography>
                      </Box>
                    </ButtonBase>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </Popover>
  );
};

export default SearchPopover;

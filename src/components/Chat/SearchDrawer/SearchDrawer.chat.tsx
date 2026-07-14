import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import SearchIcon from "@mui/icons-material/Search";

import type { MessageType } from "../../../types/chat/chat.model.type";
import type { ConversationUserInfo } from "../../../types/chat/chat.conversation.type";
import { customScrollbarSx } from "../../../utils/CustomScroll";

type SearchDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  results: MessageType[];
  keyword: string;
  currentIndex: number;
  onNavigate: (index: number) => void;
  otherUser: ConversationUserInfo | null;
  currentUserId: string;
};

export function SearchDrawer({
  isOpen,
  onClose,
  results,
  keyword,
  currentIndex,
  onNavigate,
  otherUser,
  currentUserId,
}: SearchDrawerProps) {
  if (!isOpen) return null;

  const highlightText = (text: string, kw: string) => {
    if (!kw.trim()) return text;
    // escape special regex chars to avoid crash
    const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escapedKw})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === kw.toLowerCase() ? (
            <mark
              key={i}
              style={{
                backgroundColor: "rgba(234, 179, 8, 0.35)", // soft yellow
                color: "#854d0e",
                padding: "0 2px",
                borderRadius: "2px",
                fontWeight: 600,
              }}
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const renderSnippet = (msg: MessageType) => {
    if (msg.type === "gif") {
      return (
        <Typography variant="body2" sx={{ fontStyle: "italic", color: "#64748b" }}>
          [GIF]
        </Typography>
      );
    }

    const text = msg.content || "";
    if (msg.type === "file") {
      const fileNames = msg.attachments?.map((att) => att.fileName).filter(Boolean).join(", ") || "File";
      return (
        <Stack spacing={0.5}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#4f46e5" }}>
            <FilePresentIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
              {highlightText(fileNames, keyword)}
            </Typography>
          </Box>
          {text && (
            <Typography variant="body2" sx={{ color: "#475569", fontSize: 13 }}>
              {highlightText(text, keyword)}
            </Typography>
          )}
        </Stack>
      );
    }

    return (
      <Typography variant="body2" sx={{ color: "#334155", fontSize: 13, wordBreak: "break-word" }}>
        {highlightText(text, keyword)}
      </Typography>
    );
  };

  const getSenderDetails = (senderId: string) => {
    const isCurrentUser = senderId === currentUserId;
    const name = isCurrentUser
      ? "Bạn"
      : otherUser?.nickname || otherUser?.fullname || "Người dùng";
    const avatar = isCurrentUser ? "" : otherUser?.avatar || "";
    return { name, avatar, isCurrentUser };
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: 330, md: 360 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: { xs: "#ffffff", md: "rgba(255, 255, 255, 0.78)" },
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid rgba(148, 163, 184, 0.18)",
        position: { xs: "absolute", md: "relative" },
        right: { xs: 0, md: "auto" },
        top: { xs: 0, md: "auto" },
        zIndex: 50,
        boxShadow: "-10px 0 30px rgba(15, 23, 42, 0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.25,
          borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <SearchIcon sx={{ color: "#4f46e5", fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a" }}>
            Search Messages
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose} sx={{ color: "#64748b" }}>
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Result Count Status */}
      <Box sx={{ px: 2.5, py: 1.5, bgcolor: "rgba(241, 245, 249, 0.5)" }}>
        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
          {results.length > 0
            ? `${results.length} results found for "${keyword}"`
            : `No results found for "${keyword}"`}
        </Typography>
      </Box>

      {/* Results List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          ...customScrollbarSx,
        }}
      >
        <Stack spacing={1.5}>
          {results.map((msg, index) => {
            const sender = getSenderDetails(msg.senderId);
            const isActive = index === currentIndex;

            return (
              <Paper
                key={msg.id}
                elevation={0}
                onClick={() => onNavigate(index)}
                sx={{
                  p: 1.75,
                  borderRadius: 3,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: isActive ? "rgba(99, 102, 241, 0.35)" : "rgba(148, 163, 184, 0.12)",
                  bgcolor: isActive
                    ? "rgba(99, 102, 241, 0.08)"
                    : "rgba(255, 255, 255, 0.6)",
                  boxShadow: isActive
                    ? "0 4px 16px rgba(99, 102, 241, 0.08)"
                    : "0 2px 8px rgba(15, 23, 42, 0.01)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: isActive ? "rgba(99, 102, 241, 0.4)" : "rgba(99, 102, 241, 0.2)",
                    bgcolor: isActive
                      ? "rgba(99, 102, 241, 0.1)"
                      : "rgba(255, 255, 255, 0.95)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="flex-start">
                  <Avatar
                    src={sender.avatar}
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: 12,
                      bgcolor: sender.isCurrentUser ? "#4f46e5" : "#0ea5e9",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    {sender.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: "#1e293b",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxHeight: 18,
                        }}
                      >
                        {sender.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#94a3b8", fontSize: 11, flexShrink: 0, ml: 1 }}
                      >
                        {formatDate(msg.createdAt)}
                      </Typography>
                    </Stack>
                    {renderSnippet(msg)}
                  </Box>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Box>

      {/* Navigation Footer */}
      {results.length > 0 && (
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(148, 163, 184, 0.15)",
            bgcolor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#475569" }}>
            Result: <span style={{ color: "#4f46e5" }}>{currentIndex + 1}</span> / {results.length}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Older messages">
              <IconButton
                size="small"
                disabled={currentIndex <= 0}
                onClick={() => onNavigate(currentIndex - 1)}
                sx={{
                  color: "#4f46e5",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  "&:hover": { bgcolor: "rgba(99, 102, 241, 0.08)" },
                  "&.Mui-disabled": { color: "#cbd5e1", borderColor: "transparent" },
                }}
              >
                <KeyboardArrowUpRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Newer messages">
              <IconButton
                size="small"
                disabled={currentIndex >= results.length - 1}
                onClick={() => onNavigate(currentIndex + 1)}
                sx={{
                  color: "#4f46e5",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  "&:hover": { bgcolor: "rgba(99, 102, 241, 0.08)" },
                  "&.Mui-disabled": { color: "#cbd5e1", borderColor: "transparent" },
                }}
              >
                <KeyboardArrowDownRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

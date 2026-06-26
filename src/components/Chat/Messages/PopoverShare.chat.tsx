import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import GifIcon from "@mui/icons-material/Gif";
import SendIcon from "@mui/icons-material/Send";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import type { MessageType } from "../../../types/chat/chat.model.type";
import { COLORS } from "../../../utils/Colors";
import { onGetDataContact } from "../../../redux/contact.redux";

//TIẾN HÀNH XỬ LÝ LOGIC Ở BE

type Props = {
  open: boolean;
  onClose: () => void;
  message: MessageType | null;
  onShare: (targetConversationIds: string[], messageId: string) => Promise<void>;
};

export function PopoverShare({ open, onClose, message, onShare }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  // Fetch recent conversations
  const allConversations = useSelector(
    (state: RootState) => state.conversation.conversations
  );

  // Fetch friends/contacts
  const allContacts = useSelector(
    (state: RootState) => state.contact.contacts
  );

  const [activeTab, setActiveTab] = useState<"chats" | "contacts">("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sharing, setSharing] = useState(false);

  // Fetch contacts list when dialog is opened
  useEffect(() => {
    if (open) {
      dispatch(onGetDataContact());
    }
  }, [open, dispatch]);

  // Helper to find existing conversation ID for a contact, or return contact fallback ID
  const getSelectedIdForContact = (contactUserId: string) => {
    const existingConv = allConversations.find((c) => c.userId === contactUserId);
    return existingConv ? existingConv.id : `contact-${contactUserId}`;
  };

  // Helper to get contact info by contact ID
  const getContactByFallbackId = (fallbackId: string) => {
    const contactUserId = fallbackId.replace("contact-", "");
    return allContacts.find((c) => c.userId === contactUserId);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRemoveTag = (id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleShareClick = async () => {
    if (selectedIds.length === 0 || !message) return;
    setSharing(true);
    try {
      await onShare(selectedIds, message.id);
      setSelectedIds([]);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error("Failed to share message:", err);
    } finally {
      setSharing(false);
    }
  };

  // Filter based on active tab
  const filteredConversations = allConversations.filter((c) =>
    (c.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = allContacts.filter((c) =>
    (c.nickname || c.fullname || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render message preview
  const renderMessagePreview = () => {
    if (!message) return null;

    let previewContent = null;
    if (message.type === "text") {
      previewContent = (
        <Typography sx={{ fontSize: 13, color: "text.secondary" }} noWrap>
          {message.content}
        </Typography>
      );
    } else if (message.type === "gif") {
      previewContent = (
        <Stack direction="row" spacing={1} alignItems="center">
          <GifIcon sx={{ color: COLORS.textMuted }} />
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>[GIF]</Typography>
        </Stack>
      );
    } else if (message.type === "file") {
      const attachments = message.attachments || [];
      const isImg = attachments[0]?.resourceType === "image";
      previewContent = (
        <Stack direction="row" spacing={1} alignItems="center">
          {isImg ? (
            <Box
              component="img"
              src={String(attachments[0]?.fileUrl || attachments[0]?.previewUrl || "")}
              alt=""
              sx={{ width: 28, height: 28, borderRadius: 0.5, objectFit: "cover" }}
            />
          ) : (
            <InsertDriveFileOutlinedIcon sx={{ fontSize: 18, color: COLORS.textMuted }} />
          )}
          <Typography sx={{ fontSize: 13, color: "text.secondary" }} noWrap>
            {attachments[0]?.fileName || "Attachment"}
          </Typography>
        </Stack>
      );
    }

    return (
      <Box
        sx={{
          p: 1.5,
          bgcolor: "rgba(241, 245, 249, 0.6)",
          border: "1px solid rgba(148, 163, 184, 0.15)",
          borderRadius: "10px",
          mb: 2,
        }}
      >
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: COLORS.primary, mb: 0.5, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Sharing message
        </Typography>
        {previewContent}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      disableScrollLock
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 24px 54px rgba(15, 23, 42, 0.18)",
          backgroundImage: "none",
          border: "1px solid rgba(148, 163, 184, 0.15)",
          p: 0.5,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: COLORS.textMain }}>
          Forward to
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, pt: 2, pb: 1, display: "flex", flexDirection: "column", maxHeight: "68vh" }}>
        {/* Message Preview */}
        {renderMessagePreview()}

        {/* Selected Tags Panel (Tag Cloud) */}
        {selectedIds.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              maxHeight: 110,
              overflowY: "auto",
              mb: 2,
              p: 1.5,
              borderRadius: "12px",
              bgcolor: "rgba(99, 102, 241, 0.04)",
              border: "1px dashed rgba(99, 102, 241, 0.2)",
              "&::-webkit-scrollbar": { width: 5 },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "rgba(148, 163, 184, 0.3)",
                borderRadius: 4,
              },
            }}
          >
            {selectedIds.map((id) => {
              // Try to find conversation first
              let name = "";
              let avatar = "";

              const conv = allConversations.find((c) => c.id === id);
              if (conv) {
                name = conv.name;
                avatar = conv.avatar || "";
              } else {
                // If not found in conversations, look in contacts
                const contact = getContactByFallbackId(id);
                if (contact) {
                  name = contact.nickname || contact.fullname;
                  avatar = contact.avatar || "";
                }
              }

              if (!name) return null;

              return (
                <Box
                  key={id}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    bgcolor: "rgba(99, 102, 241, 0.1)",
                    color: "#4f46e5",
                    fontSize: 12.5,
                    fontWeight: 600,
                    borderRadius: "32px",
                    pl: 1,
                    pr: 0.5,
                    py: 0.5,
                    border: "1px solid rgba(99, 102, 241, 0.15)",
                  }}
                >
                  <Avatar src={avatar} sx={{ width: 18, height: 18, fontSize: 8 }}>
                    {name.charAt(0)}
                  </Avatar>
                  <span style={{ maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {name}
                  </span>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveTag(id)}
                    sx={{
                      p: 0.25,
                      color: "#4f46e5",
                      bgcolor: "rgba(99, 102, 241, 0.08)",
                      "&:hover": { bgcolor: "rgba(99, 102, 241, 0.2)" },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 12 }} />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Custom Segmented Control (Tabs) */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            mb: 2,
            bgcolor: "rgba(241, 245, 249, 0.8)",
            p: 0.5,
            borderRadius: "12px",
            border: "1px solid rgba(148, 163, 184, 0.1)",
          }}
        >
          <Button
            fullWidth
            onClick={() => {
              setActiveTab("chats");
              setSearchQuery("");
            }}
            sx={{
              borderRadius: "9px",
              py: 0.75,
              textTransform: "none",
              fontSize: 13,
              fontWeight: activeTab === "chats" ? 700 : 500,
              bgcolor: activeTab === "chats" ? "background.paper" : "transparent",
              color: activeTab === "chats" ? "#4f46e5" : "text.secondary",
              boxShadow: activeTab === "chats" ? "0 2px 8px rgba(15, 23, 42, 0.05)" : "none",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: activeTab === "chats" ? "background.paper" : "rgba(148, 163, 184, 0.08)",
              },
            }}
          >
            Recent Chats
          </Button>
          <Button
            fullWidth
            onClick={() => {
              setActiveTab("contacts");
              setSearchQuery("");
            }}
            sx={{
              borderRadius: "9px",
              py: 0.75,
              textTransform: "none",
              fontSize: 13,
              fontWeight: activeTab === "contacts" ? 700 : 500,
              bgcolor: activeTab === "contacts" ? "background.paper" : "transparent",
              color: activeTab === "contacts" ? "#4f46e5" : "text.secondary",
              boxShadow: activeTab === "contacts" ? "0 2px 8px rgba(15, 23, 42, 0.05)" : "none",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: activeTab === "contacts" ? "background.paper" : "rgba(148, 163, 184, 0.08)",
              },
            }}
          >
            Contacts
          </Button>
        </Stack>

        {/* Search Bar */}
        <TextField
          placeholder={activeTab === "chats" ? "Search recent chats..." : "Search friends..."}
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "rgba(241, 245, 249, 0.5)",
              "& fieldset": { borderColor: "rgba(148, 163, 184, 0.25)" },
              "&:hover fieldset": { borderColor: "rgba(148, 163, 184, 0.4)" },
              "&.Mui-focused fieldset": { borderColor: COLORS.primary },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        {/* List Header */}
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {activeTab === "chats" ? "Conversations" : "All Friends"}
        </Typography>

        {/* Main List */}
        <List
          sx={{
            flex: 1,
            overflowY: "auto",
            maxHeight: "32vh",
            pr: 0.5,
            "&::-webkit-scrollbar": { width: 5 },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "rgba(148, 163, 184, 0.3)",
              borderRadius: 4,
            },
          }}
        >
          {activeTab === "chats" ? (
            filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const isSelected = selectedIds.includes(conv.id);
                return (
                  <ListItemButton
                    key={conv.id}
                    onClick={() => handleToggleSelect(conv.id)}
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: "12px",
                      mb: 0.5,
                      transition: "all 0.15s ease",
                      bgcolor: isSelected ? "rgba(99, 102, 241, 0.04)" : "transparent",
                      "&:hover": {
                        bgcolor: isSelected ? "rgba(99, 102, 241, 0.08)" : "rgba(241, 245, 249, 0.8)",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={conv.avatar} sx={{ width: 40, height: 40 }}>
                        {conv.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={conv.name}
                      primaryTypographyProps={{
                        fontSize: 14.5,
                        fontWeight: 600,
                        color: isSelected ? "#4f46e5" : COLORS.textMain,
                      }}
                      secondary={conv.unread ? `${conv.unread} unread` : "Chat room"}
                      secondaryTypographyProps={{
                        fontSize: 12,
                        color: "text.secondary",
                      }}
                    />
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleToggleSelect(conv.id)}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        color: "rgba(148, 163, 184, 0.5)",
                        "&.Mui-checked": {
                          color: "#4f46e5",
                        },
                      }}
                    />
                  </ListItemButton>
                );
              })
            ) : (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                  No recent chats found
                </Typography>
              </Box>
            )
          ) : (
            filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => {
                const targetId = getSelectedIdForContact(contact.userId);
                const isSelected = selectedIds.includes(targetId);
                const displayName = contact.nickname || contact.fullname;
                return (
                  <ListItemButton
                    key={contact._id}
                    onClick={() => handleToggleSelect(targetId)}
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: "12px",
                      mb: 0.5,
                      transition: "all 0.15s ease",
                      bgcolor: isSelected ? "rgba(99, 102, 241, 0.04)" : "transparent",
                      "&:hover": {
                        bgcolor: isSelected ? "rgba(99, 102, 241, 0.08)" : "rgba(241, 245, 249, 0.8)",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={contact.avatar} sx={{ width: 40, height: 40 }}>
                        {displayName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={displayName}
                      primaryTypographyProps={{
                        fontSize: 14.5,
                        fontWeight: 600,
                        color: isSelected ? "#4f46e5" : COLORS.textMain,
                      }}
                      secondary={contact.email}
                      secondaryTypographyProps={{
                        fontSize: 12,
                        color: "text.secondary",
                      }}
                    />
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleToggleSelect(targetId)}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        color: "rgba(148, 163, 184, 0.5)",
                        "&.Mui-checked": {
                          color: "#4f46e5",
                        },
                      }}
                    />
                  </ListItemButton>
                );
              })
            ) : (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                  No contacts found
                </Typography>
              </Box>
            )
          )}
        </List>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 2.5, borderTop: "1px solid rgba(148, 163, 184, 0.1)", justifyContent: "flex-end" }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: "10px",
            px: 2.5,
            py: 1,
            textTransform: "none",
            color: "text.secondary",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleShareClick}
          disabled={selectedIds.length === 0 || sharing}
          variant="contained"
          startIcon={<SendIcon />}
          sx={{
            borderRadius: "10px",
            px: 3,
            py: 1,
            textTransform: "none",
            bgcolor: "#4f46e5",
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
            "&:hover": {
              bgcolor: "#3730a3",
              boxShadow: "0 6px 20px rgba(79, 70, 229, 0.4)",
            },
            "&.Mui-disabled": {
              bgcolor: "rgba(148, 163, 184, 0.15)",
              color: "text.disabled",
              boxShadow: "none",
            },
          }}
        >
          {sharing ? "Sharing..." : `Share (${selectedIds.length})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

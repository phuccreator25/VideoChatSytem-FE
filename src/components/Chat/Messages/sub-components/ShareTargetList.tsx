import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import { COLORS } from "../../../../utils/Colors";
import type { Conversation } from "../../../../types/data.type";
import type { Contact } from "../../../../types/contact.type";

type ShareTargetListProps = {
  activeTab: "chats" | "contacts";
  searchQuery: string;
  selectedIds: string[];
  filteredConversations: Conversation[];
  filteredContacts: Contact[];
  allConversations: Conversation[];
  onTabChange: (tab: "chats" | "contacts") => void;
  onSearchChange: (query: string) => void;
  onToggleSelect: (id: string) => void;
}

export function ShareTargetList({
  activeTab,
  searchQuery,
  selectedIds,
  filteredConversations,
  filteredContacts,
  allConversations,
  onTabChange,
  onSearchChange,
  onToggleSelect,
}: ShareTargetListProps) {
  const getSelectedIdForContact = (contactUserId: string) => {
    const existingConv = allConversations.find((c) => c.userId === contactUserId);
    return existingConv ? existingConv.id : `contact-${contactUserId}`;
  };

  return (
    <>
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
          onClick={() => onTabChange("chats")}
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
          onClick={() => onTabChange("contacts")}
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
        onChange={(e) => onSearchChange(e.target.value)}
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
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: "text.secondary",
          mb: 1,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
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
              const isBlocked = Boolean(conv.isBlocked);
              return (
                <ListItemButton
                  key={conv.id}
                  disabled={isBlocked}
                  onClick={() => !isBlocked && onToggleSelect(conv.id)}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: "12px",
                    mb: 0.5,
                    opacity: isBlocked ? 0.55 : 1,
                    transition: "all 0.15s ease",
                    bgcolor: isSelected ? "rgba(99, 102, 241, 0.04)" : "transparent",
                    "&:hover": {
                      bgcolor: isBlocked
                        ? "transparent"
                        : isSelected
                          ? "rgba(99, 102, 241, 0.08)"
                          : "rgba(241, 245, 249, 0.8)",
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
                    secondary={isBlocked ? "Blocked" : conv.unread ? `${conv.unread} unread` : "Chat room"}
                    secondaryTypographyProps={{
                      fontSize: 12,
                      color: isBlocked ? "error.main" : "text.secondary",
                    }}
                  />
                  <Checkbox
                    checked={isSelected}
                    disabled={isBlocked}
                    onChange={() => !isBlocked && onToggleSelect(conv.id)}
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
        ) : filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => {
            const targetId = getSelectedIdForContact(contact.userId);
            const isSelected = selectedIds.includes(targetId);
            const displayName = contact.nickname || contact.fullname;
            const isBlocked = Boolean(contact.isBlocked);
            return (
              <ListItemButton
                key={contact._id}
                disabled={isBlocked}
                onClick={() => !isBlocked && onToggleSelect(targetId)}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: "12px",
                  mb: 0.5,
                  opacity: isBlocked ? 0.55 : 1,
                  transition: "all 0.15s ease",
                  bgcolor: isSelected ? "rgba(99, 102, 241, 0.04)" : "transparent",
                  "&:hover": {
                    bgcolor: isBlocked
                      ? "transparent"
                      : isSelected
                        ? "rgba(99, 102, 241, 0.08)"
                        : "rgba(241, 245, 249, 0.8)",
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
                  secondary={isBlocked ? "Blocked" : contact.email}
                  secondaryTypographyProps={{
                    fontSize: 12,
                    color: isBlocked ? "error.main" : "text.secondary",
                  }}
                />
                <Checkbox
                  checked={isSelected}
                  disabled={isBlocked}
                  onChange={() => !isBlocked && onToggleSelect(targetId)}
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
        )}
      </List>
    </>
  );
}

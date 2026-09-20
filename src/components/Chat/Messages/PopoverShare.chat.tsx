import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import type { MessageType } from "../../../types/chat/chat.model.type";
import { COLORS } from "../../../utils/Colors";
import { onGetDataContact } from "../../../redux/contact.redux";

import { ShareMessagePreview } from "./sub-components/ShareMessagePreview";
import { ShareSelectedTags } from "./sub-components/ShareSelectedTags";
import { ShareTargetList } from "./sub-components/ShareTargetList";

type Props = {
  open: boolean;
  onClose: () => void;
  message: MessageType | null;
  onShare: (targetConversationIds: string[], messageId: string) => Promise<void>;
};

export function PopoverShare({ open, onClose, message, onShare }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const allConversations = useSelector(
    (state: RootState) => state.conversation.conversations
  );
  const allContacts = useSelector(
    (state: RootState) => state.contact.contacts
  );

  const [activeTab, setActiveTab] = useState<"chats" | "contacts">("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (open) {
      dispatch(onGetDataContact());
    }
  }, [open, dispatch]);

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

  const filteredConversations = allConversations.filter((c) =>
    (c.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = allContacts.filter((c) =>
    (c.nickname || c.fullname || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <ShareMessagePreview message={message} />

        <ShareSelectedTags
          selectedIds={selectedIds}
          allConversations={allConversations}
          allContacts={allContacts}
          onRemoveTag={handleRemoveTag}
        />

        <ShareTargetList
          activeTab={activeTab}
          searchQuery={searchQuery}
          selectedIds={selectedIds}
          filteredConversations={filteredConversations}
          filteredContacts={filteredContacts}
          allConversations={allConversations}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSearchQuery("");
          }}
          onSearchChange={setSearchQuery}
          onToggleSelect={handleToggleSelect}
        />
      </DialogContent>

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

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import type { Conversation } from "../../../../types/data.type";
import type { Contact } from "../../../../types/contact.type";

type ShareSelectedTagsProps = {
  selectedIds: string[];
  allConversations: Conversation[];
  allContacts: Contact[];
  onRemoveTag: (id: string) => void;
}

export function ShareSelectedTags({
  selectedIds,
  allConversations,
  allContacts,
  onRemoveTag,
}: ShareSelectedTagsProps) {
  if (selectedIds.length === 0) return null;

  const getContactByFallbackId = (fallbackId: string) => {
    const contactUserId = fallbackId.replace("contact-", "");
    return allContacts.find((c) => c.userId === contactUserId);
  };

  return (
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
        let name = "";
        let avatar = "";

        const conv = allConversations.find((c) => c.id === id);
        if (conv) {
          name = conv.name;
          avatar = conv.avatar || "";
        } else {
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
              onClick={() => onRemoveTag(id)}
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
  );
}

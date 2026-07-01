import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { customScrollbarSx } from "../../../utils/CustomScroll";
import SidePanelLayout from "../SidePanelLayout";
import type {
  Conversation,
  QuickUser,
} from "../../../types/conversation/conversation.preview.type";
import { COLORS } from "../../../utils/Colors";
import { ActiveList } from "./ActiveList/ActiveList.conversation";
import { ConversationItem } from "./ConversationItem/ConversaationItem.conversation";
import { useConversation } from "../../../hooks/Conversation/ConversationList.hook";
import { useParams } from "react-router-dom";
import { ConversationItemSkeleton } from "./Skeleton/Skeleton.conversation";

const quickUsers: QuickUser[] = [
  {
    id: 1,
    name: 'Patrick',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop',
    online: true,
  },
  {
    id: 2,
    name: 'Doris',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop',
    online: true,
  },
  {
    id: 3,
    name: 'Emily',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&auto=format&fit=crop',
    online: true,
  },
  {
    id: 4,
    name: 'Michael',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80&auto=format&fit=crop',
    online: true,
  },
];

export default function ConversationList() {
  const { data } = useConversation();
  const { conversationId } = useParams();

  const conversations = Array.isArray(data.conversations) ? data.conversations : [];
  const conversationsWithActive = conversations.map((item: Conversation) => ({
    ...item,
    active: String(item.id) === String(conversationId),
  }));

  return (
    <SidePanelLayout
      header={
        <>
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 800,
              color: COLORS.title,
              mb: 2,
              letterSpacing: -0.5,
              fontFamily: "'Outfit', 'Inter', sans-serif"
            }}
          >
            Chats
          </Typography>

          {/* Premium Glassmorphic Search Bar */}
          <Box
            sx={{
              height: 48,
              px: 2,
              borderRadius: "14px",
              bgcolor: "rgba(255, 255, 255, 0.45)",
              border: "1px solid rgba(148, 163, 184, 0.16)",
              display: 'flex',
              alignItems: 'center',
              mb: 3,
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.6)",
              transition: "all 0.2s ease-in-out",
              "&:focus-within": {
                bgcolor: "#ffffff",
                borderColor: COLORS.primary,
                boxShadow: `0 8px 24px rgba(79, 70, 229, 0.06), inset 0 1px 0 rgba(255, 255, 255, 1)`,
              }
            }}
          >
            <IconButton size="small" sx={{ color: COLORS.textMuted, mr: 1, p: 0.25 }}>
              <SearchOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>

            <InputBase
              fullWidth
              placeholder="Search messages or users"
              sx={{
                fontSize: 14.5,
                color: COLORS.title,
                fontWeight: 500,
                '& input::placeholder': {
                  color: COLORS.textSoft,
                  opacity: 0.85,
                },
              }}
            />
          </Box>

          {/* Online Active Users List */}
          <Typography
            sx={{
              fontSize: 12.5,
              fontWeight: 750,
              color: COLORS.textMuted,
              mb: 1.5,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              fontFamily: "'Outfit', 'Inter', sans-serif"
            }}
          >
            Online Now
          </Typography>

          <Box
            sx={{
              mb: 3.5,
              overflowX: "auto",
              mx: -1,
              px: 1,
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none"
            }}
          >
            <Stack direction="row" spacing={1.5}>
              {quickUsers.map((user) => (
                <ActiveList key={user.id} user={user} />
              ))}
            </Stack>
          </Box>

          <Typography
            sx={{
              fontSize: 12.5,
              fontWeight: 750,
              color: COLORS.textMuted,
              mb: 1.8,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              fontFamily: "'Outfit', 'Inter', sans-serif"
            }}
          >
            Recent Chats
          </Typography>
        </>
      }
    >
      <Stack
        spacing={1.2}
        sx={{
          minHeight: 0,
          flex: 1,
          overflowY: 'auto',
          pr: 0.5,
          ...customScrollbarSx,
        }}
      >
        {data.isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <ConversationItemSkeleton key={`conv-sk-${idx}`} />
          ))
        ) : (
          conversationsWithActive.map((item: Conversation) => (
            <ConversationItem key={item.id} item={item} />
          ))
        )}
      </Stack>
    </SidePanelLayout>
  );
}

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
];

export default function ConversationList() {
  const { data } = useConversation()
  const { conversationId } = useParams()
  const conversations = Array.isArray(data.conversations) ? data.conversations : []
  const conversationsWithActive = conversations.map((item: Conversation) => ({
    ...item,
    active: String(item.id) === String(conversationId),
  }))

  return (
    <SidePanelLayout
      header={
        <>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: COLORS.title, mb: 2 }}>
            Chats
          </Typography>

          <Box
            sx={{
              height: 50,
              px: 2,
              borderRadius: 1.8,
              bgcolor: COLORS.searchBg,
              display: 'flex',
              alignItems: 'center',
              mb: 2.5,
            }}
          >
            <IconButton size="small" sx={{ color: COLORS.textMuted, mr: 1 }}>
              <SearchOutlinedIcon />
            </IconButton>

            <InputBase
              fullWidth
              placeholder="Search messages or users"
              sx={{
                fontSize: 15,
                color: COLORS.title,
                '& input::placeholder': {
                  color: COLORS.textSoft,
                  opacity: 1,
                },
              }}
            />
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
            {quickUsers.map((user) => (
              <ActiveList key={user.id} user={user} />
            ))}
          </Stack>

          <Typography sx={{ fontSize: 18, fontWeight: 700, color: COLORS.title, mb: 2 }}>
            Recent
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
        {conversationsWithActive.map((item: Conversation) => (
          <ConversationItem key={item.id} item={item} />
        ))}
      </Stack>
    </SidePanelLayout>
  );
}

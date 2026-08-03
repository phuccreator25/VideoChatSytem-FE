import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { customScrollbarSx } from "../../../utils/CustomScroll";
import SidePanelLayout from "../SidePanelLayout";
import type {
  Conversation,
} from "../../../types/conversation/conversation.preview.type";
import { COLORS } from "../../../utils/Colors";
import { ActiveList } from "./ActiveList/ActiveList.conversation";
import { ConversationItem } from "./ConversationItem/ConversaationItem.conversation";
import { useConversation } from "../../../hooks/Conversation/ConversationList.hook";
import { useNavigate, useParams } from "react-router-dom";
import { ConversationItemSkeleton } from "./Skeleton/Skeleton.conversation";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import useOpenConversation from "../../../helpers/openConversation.helper";
import SearchPopover from "./SearchResult/SearchPopover";

export default function ConversationList() {
  const { ui, data, handlers } = useConversation();
  const { conversationId } = useParams();
  const navigate = useNavigate()

  const { handleOpenConversation } = useOpenConversation();
  const conversations = Array.isArray(data.conversations) ? data.conversations : [];
  const conversationsWithActive = conversations.map((item: Conversation) => ({
    ...item,
    active: String(item.id) === String(conversationId),
  }));

  const onlineUsers = useSelector((state: RootState) => state.contact.onlineUsers);

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
            ref={(el) => handlers.setSearchAnchorEl(el as HTMLElement | null)}
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
            <IconButton aria-label="Search" size="small" sx={{ color: COLORS.textMuted, mr: 1, p: 0.25 }}>
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
              value={data.searchQuery}
              onChange={(e) => handlers.setSearchQuery(e.target.value)}
            />
            {Boolean(data.searchQuery) && (
              <IconButton
                aria-label="Clear search"
                size="small"
                onClick={() => handlers.setSearchQuery("")}
                sx={{ color: COLORS.textMuted, p: 0.25, ml: 0.5 }}
              >
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>

          {/* Online Active Users List */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 800,
                color: COLORS.textMuted,
                textTransform: "uppercase",
                letterSpacing: 1,
                fontFamily: "'Outfit', 'Inter', sans-serif",
              }}
            >
              Online Now
            </Typography>
            {onlineUsers.length > 0 && (
              <Box
                sx={{
                  px: 1,
                  py: 0.2,
                  borderRadius: "10px",
                  bgcolor: "rgba(16, 185, 129, 0.12)",
                  color: "#10B981",
                  fontSize: 11,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "#10B981",
                    boxShadow: "0 0 6px #10B981",
                  }}
                />
                {onlineUsers.length}
              </Box>
            )}
          </Stack>

          <Box
            sx={{
              mb: 3.5,
              overflowX: "auto",
              mx: -1,
              px: 1,
              py: 0.5,
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {onlineUsers.length > 0 ? (
              <Stack direction="row" spacing={1.5}>
                {onlineUsers.map((user) => (
                  <ActiveList
                    key={user.userId}
                    user={{ ...user }}
                    onClick={() => handleOpenConversation(user.userId)}
                  />
                ))}
              </Stack>
            ) : (
              <Typography
                sx={{
                  fontSize: 12,
                  color: "#94A3B8",
                  fontStyle: "italic",
                  px: 1,
                  py: 0.5,
                }}
              >
                No active contacts online
              </Typography>
            )}
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
      <SearchPopover
        open={Boolean(data.searchQuery?.trim())}
        anchorEl={ui.searchAnchorEl}
        searchQuery={data.searchQuery}
        isLoading={ui.isSearching}
        recentChats={data.filteredConversations}
        contacts={data.searchContacts}
        messages={data.searchMessages}
        onClose={() => handlers.setSearchQuery("")}
        onSelectConversation={handleOpenConversation}
        onSelectMessage={(conversationId, messageId) => {
          navigate(`/chat/${conversationId}?targetMessageId=${messageId}`)
        }}
      />
    </SidePanelLayout>
    
  );
}

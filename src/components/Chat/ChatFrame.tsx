import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { customScrollbarSx } from "../../utils/CustomScroll";
import { COLORS } from "../../utils/Colors";
import { Header } from "./Header/header.chat";
import { MessageItem } from "./Messages/MessgesItem.chat";
import { InputBar } from "./InputBar/InputBar.chat";
import { useChatFrame } from "../../hooks/Chat/chat.hook";
import { ContactRelationBar } from "./ContactRelationBar/ContactRelationBar.chat";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../../redux/store";
import { TypingIndicator } from "./TypingIndicator/TypingIndicator.chat";
import { PinnedMessageStrip } from "./PinnedMessageStrip/pinnedMessageStrip.chat";
import { SearchDrawer } from "./SearchDrawer/SearchDrawer.chat";
import { ProfileDrawer } from "./ProfileDrawer/ProfileDrawer.chat";

export default function ChatFrame() {
  const {
    ui,
    data,
    handler,
    ref: { messagesEndRef },
  } = useChatFrame();

  const { conversationId } = useParams()
  const isTyping = useSelector(
    (state: RootState) => {
      if (!conversationId) return false;

      return (
        state.chat.typingByConversation[conversationId] ??
        false
      );
    },
  );

  if (!data.conversationId) {
    return (
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 5,
          bgcolor: "#f8fafc",
          border: "1px solid rgba(148, 163, 184, 0.22)",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(79,70,229,0.1), transparent 40%), radial-gradient(circle at 80% 80%, rgba(14,165,233,0.12), transparent 38%)",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{ fontSize: 22, fontWeight: 700, color: COLORS.title, mb: 1 }}
          >
            Chọn một cuộc trò chuyện
          </Typography>
          <Typography sx={{ fontSize: 15, color: COLORS.textMuted }}>
            Hãy chọn contact hoặc conversation để bắt đầu nhắn tin
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 5,
        overflow: "hidden",
        bgcolor: "#eef3fb",
        border: "1px solid rgba(148, 163, 184, 0.24)",
        boxShadow: "0 20px 48px rgba(15, 23, 42, 0.14)",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 15% 12%, rgba(99,102,241,0.16), transparent 34%), radial-gradient(circle at 88% 92%, rgba(56,189,248,0.14), transparent 35%)",
        },
        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      <Header
        userData={data.userData}
        onSearchMessage={handler.handleSearchMessage}
        onOpenProfileDrawer={handler.openProfileDrawer}
      />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            position: "relative",
          }}
        >
          <PinnedMessageStrip
            pinnedMessages={data.pinMessages}
            otherUser={data.userData}
            onUnpin={handler.onUnPin}
          />

          <ContactRelationBar
            status={data.relationStatus}
            displayName={data.userData?.nickname || data.userData?.fullname}
            addContactModalOpen={ui.openAddContactModal}
            addContactMessage={ui.invitationMessage}
            addContactSubmitting={ui.addContactSubmitting}
            onAddContact={handler.onAddContact}
            onCloseAddContactModal={handler.onCloseAddContactModal}
            onChangeAddContactMessage={handler.onChangeAddContactMessage}
            onSubmitAddContact={handler.onSubmitAddContact}
            onAccept={handler.onAcceptInvitation}
            onDecline={handler.onDeclineInvitation}
            onCancel={handler.onCancelInvitation}
            loadingAction={ui.loadingAction}
          />

          <Box
            onScroll={handler.handleScroll}
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              px: { xs: 2, sm: 3, md: 3.5 },
              py: 3,
              ...customScrollbarSx,
            }}
          >
            <Stack spacing={3}>
              {ui.normalizedMessages.map(
                ({ msg, isLeft, displayName, avatar }) => (
                  <Box
                    key={msg.id}
                    id={`msg-${msg.id}`}
                    sx={{
                      width: "100%",
                      borderRadius: 3.5,
                      p: 0.5,
                      transition: "all 0.3s ease",
                      "@keyframes search-highlight-flash": {
                        "0%": {
                          backgroundColor: "rgba(79, 70, 229, 0.25)",
                          boxShadow: "0 0 16px rgba(79, 70, 229, 0.28)",
                        },
                        "30%": {
                          backgroundColor: "rgba(79, 70, 229, 0.18)",
                          boxShadow: "0 0 10px rgba(79, 70, 229, 0.15)",
                        },
                        "100%": {
                          backgroundColor: "transparent",
                          boxShadow: "none",
                        },
                      },
                      animation:
                        data.highlightedMessageId === msg.id
                          ? "search-highlight-flash 2.2s cubic-bezier(0.25, 1, 0.5, 1)"
                          : "none",
                    }}
                  >
                    <MessageItem
                      msg={msg}
                      isLeft={isLeft}
                      displayName={displayName}
                      avatar={avatar}
                      setMessageReplyed={handler.setMessageReplyed}
                      onReact={handler.handleEmotion}
                      onUnReact={handler.handleUnReactEmotionMessage}
                      onHandleShare={handler.onHandleShare}
                      onResend={handler.handleResend}
                      onDeleteFailed={handler.handleDeleteFailedMessage}
                    />
                  </Box>
                ),
              )}

              {isTyping && <TypingIndicator
                avatar={data.userData?.avatar}
                displayName={data.userData?.nickname ?? data.userData?.fullname}
              />}

              <Box ref={messagesEndRef} />
            </Stack>
          </Box>

          <InputBar
            value={data.inputText}
            onChange={handler.setInputText}
            onSend={handler.handleSend}
            onChangeFile={handler.onChangeFile}
            files={ui.files}
            onRemoveFile={handler.onRemoveFile}
            onApplyEmoji={handler.onApplyEmoji}
            onSelectGif={handler.onSelectGif}
            selectedGif={data.selectedGif}
            onRemoveGif={handler.onRemoveGif}
            messageReplyed={data.messageReplyed}
            onRemoveReply={() => handler.setMessageReplyed(null)}
            voiceUi={ui.voiceUi}
            voiceData={data.voiceData}
            voiceHandler={handler.voiceHandler}
          />
        </Box>

        <SearchDrawer
          isOpen={ui.isSearchDrawerOpen}
          onClose={handler.closeSearchDrawer}
          results={data.messagesSearch}
          keyword={data.searchKeyword}
          currentIndex={data.currentSearchIndex}
          onNavigate={handler.navigateToSearchResult}
          otherUser={data.userData}
          currentUserId={data.currentUserId}
        />

        <ProfileDrawer
          isOpen={ui.isProfileDrawerOpen}
          onClose={handler.closeProfileDrawer}
          userData={data.userData}
        />
      </Box>
    </Paper>
  );
}

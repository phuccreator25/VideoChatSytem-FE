import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { MessageType } from "../../types/chat/chat.model.type";
import { type AppDispatch, type RootState } from "../../redux/store";
import ConversationsAPI from "../../api/Conversation.api";
import { emitConversationRead } from "../../socket/message.socket";
import ChatAPI from "../../api/Chat.api";
import { setUserData, updateContactRelation } from "../../redux/chat.redux";
import {
  onDeletePinMessageConversation,
  setAllPinnedMessagesByConversation,
} from "../../redux/conversation.redux";
import { openCallModal } from "../../redux/call.redux";
import { useVoiceChat } from "../Voice/voiceChat.hook";
import { enqueueSnackbar } from "notistack";

import { useContactAction } from "./sub-hooks/useContactAction";
import { useSendMessage } from "./sub-hooks/useSendMessage";
import { useMessageSearch } from "./sub-hooks/useMessageSearch";
import { useChatMessageSocket } from "./sub-hooks/useChatMessageSocket";

export function useChatFrame() {
  const { conversationId } = useParams();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const userData = useSelector((state: RootState) => state.chat.userData);

  const currentUserDisplayName =
    currentUser?.fullname || currentUser?.username || "You";
  const currentUserAvatar = currentUser?.avatar || "";
  const currentUserId = currentUser?._id || "";

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const pinMessages = useSelector((state: RootState) => {
    if (!conversationId) return [];

    return (
      state.conversation.pinnedMessageIdsByConversation[conversationId] || []
    );
  });

  const relationStatus = useSelector(
    (state: RootState) => state.chat.contactRelation,
  );

  // VOICE
  const { voiceData, voiceHandler, voiceUi } = useVoiceChat({
    onError: (error) => {
      enqueueSnackbar("Voice no supported. Please try again", {
        variant: "error",
      });
      console.log(error);
    },
  });

  // 1. SUB-HOOK: Sub-actions Thêm/Sửa/Chấp nhận kết bạn
  const {
    openAddContactModal,
    invitationMessage,
    addContactSubmitting,
    loadingAction,
    setInvitationMessage,
    handleCancelInvitation,
    handleDeclineInvitation,
    handleAcceptInvitation,
    handleOpenAddContactModal,
    handleCloseAddContactModal,
    handleSubmitAddContact,
  } = useContactAction({ userData, currentUser });

  // 2. SUB-HOOK: Gửi tin nhắn, file, voice, GIF, link preview
  const {
    inputText,
    files,
    messageReplyed,
    selectedGif,
    linkPreview,
    isLoadingLinkPreview,
    setInputText,
    setMessageReplyed,
    setLinkPreview,
    handleSend,
    handleResend,
    handleDeleteFailedMessage,
    handleUploadFile,
    handleRemoveFile,
    handleSelectGif,
    onRemoveGif,
    applyEmoji,
  } = useSendMessage({
    conversationId,
    currentUserId,
    voiceData,
    voiceUi,
    voiceHandler,
    setMessages,
  });

  // 3. SUB-HOOK: Tìm kiếm tin nhắn & Phân trang cuộn
  const {
    messagesSearch,
    isSearchDrawerOpen,
    isProfileDrawerOpen,
    searchKeyword,
    currentSearchIndex,
    highlightedMessageId,
    handleSearchMessage,
    closeSearchDrawer,
    navigateToSearchResult,
    navigateToMessage,
    goToNextSearch,
    goToPrevSearch,
    handleScroll,
    openProfileDrawer,
    closeProfileDrawer,
  } = useMessageSearch({
    conversationId,
    messages,
    setMessages,
  });

  // 4. SUB-HOOK: Quản lý Socket events & Reconnect Sync
  useChatMessageSocket({
    conversationId,
    currentUserId,
    userData,
    inputText,
    setMessages,
  });

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({
      behavior,
      block: "end",
    });
  };

  // FETCH DANH SÁCH MESSAGE BAN ĐẦU
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;
      setIsMessagesLoading(true);
      try {
        const conversationRes =
          await ConversationsAPI.getConversationById(conversationId);

        const pinMessages =
          conversationRes.data.data.conversation.pinMessages || [];
        await dispatch(
          setAllPinnedMessagesByConversation({
            conversationId,
            pinMessages,
          }),
        );

        await dispatch(setUserData(conversationRes.data.data.user));

        await dispatch(
          updateContactRelation({
            userId: conversationRes.data.data.user?.userId,
            relation: conversationRes.data.data.user?.relationStatus,
          }),
        );

        setMessages(conversationRes.data.data.messages);

        await emitConversationRead(conversationId);

        requestAnimationFrame(() => {
          scrollToBottom("auto");
        });
      } catch (error) {
        console.error("Fetch messages error:", error);
      } finally {
        setIsMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, dispatch]);

  useEffect(() => {
    if (!messages.length) return;

    requestAnimationFrame(() => {
      scrollToBottom("smooth");
    });
  }, [messages.length]);

  // Xử lý normalize messages
  const normalizedMessages = useMemo(() => {
    return messages.map((msg) => {
      const isLeft = msg.senderId === userData?.userId;

      return {
        msg,
        isLeft,
        displayName: isLeft
          ? userData?.nickname || userData?.fullname || "Unknown"
          : currentUserDisplayName,
        avatar: isLeft ? userData?.avatar || "" : currentUserAvatar,
      };
    });
  }, [messages, userData, currentUserAvatar, currentUserDisplayName]);

  // PIN
  const onUnPin = async (messageId: string, attachmentId: string | null) => {
    if (!conversationId || !messageId) return;

    try {
      await dispatch(
        onDeletePinMessageConversation({
          conversationId,
          messageId,
          attachmentId,
        }),
      ).unwrap();
    } catch (error) {
      console.error("UNPIN MESSAGE ERROR:", error);
    }
  };

  // Emotion
  const handleEmotion = async (messageId: string, emotion: string) => {
    try {
      if (!conversationId || !messageId || !emotion) return;

      const payload = {
        emotion,
      };

      await ChatAPI.onReactionMessage(payload, conversationId, messageId);
    } catch (error) {
      console.log("ERROE EMOTION: ", error);
    }
  };

  const handleUnReactEmotionMessage = async (messageId: string) => {
    try {
      if (!conversationId || !messageId) return;

      await ChatAPI.onUnReactEmotion(conversationId, messageId);
    } catch (error) {
      console.log("ERROE EMOTION: ", error);
    }
  };

  // Share Message
  const onHandleShare = async (
    targetConversationIds: string[],
    messageId: string,
  ) => {
    try {
      if (!targetConversationIds.length || !messageId) return;

      await ChatAPI.onForwardMessage(messageId, targetConversationIds);
    } catch (error) {
      console.log("ERROE SHARE: ", error);
    }
  };

  return {
    ui: {
      normalizedMessages,
      openAddContactModal,
      invitationMessage,
      addContactSubmitting,
      loadingAction,
      files,
      voiceUi,
      isSearchDrawerOpen,
      isProfileDrawerOpen,
      linkPreview,
      isLoadingLinkPreview,
      isMessagesLoading,
    },

    data: {
      conversationId,
      userData,
      inputText,
      relationStatus,
      selectedGif,
      messageReplyed,
      pinMessages,
      voiceData,
      messagesSearch,
      searchKeyword,
      currentSearchIndex,
      highlightedMessageId,
      currentUserId,
    },

    handler: {
      setInputText,
      setMessageReplyed,
      handleSend,
      onAddContact: handleOpenAddContactModal,
      onCloseAddContactModal: handleCloseAddContactModal,
      onChangeAddContactMessage: setInvitationMessage,
      onSubmitAddContact: handleSubmitAddContact,
      onAcceptInvitation: handleAcceptInvitation,
      onDeclineInvitation: handleDeclineInvitation,
      onCancelInvitation: handleCancelInvitation,
      onChangeFile: handleUploadFile,
      onRemoveFile: handleRemoveFile,
      onApplyEmoji: applyEmoji,
      onSelectGif: handleSelectGif,
      onRemoveGif: onRemoveGif,
      onUnPin,
      voiceHandler,
      handleEmotion,
      handleUnReactEmotionMessage,
      onHandleShare,
      handleResend,
      handleDeleteFailedMessage,
      handleSearchMessage,
      closeSearchDrawer,
      navigateToSearchResult,
      navigateToMessage,
      goToNextSearch,
      goToPrevSearch,
      handleScroll,
      openProfileDrawer,
      closeProfileDrawer,
      setLinkPreview,
      handleReCall: (type: "video" | "voice") => dispatch(openCallModal({ type })),
    },

    ref: {
      messagesEndRef,
    },
  };
}

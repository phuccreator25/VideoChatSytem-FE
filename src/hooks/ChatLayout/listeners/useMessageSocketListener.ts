import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import type { MessageType } from "../../../types/chat/chat.model.type";
import type { ConversationReadPayload } from "../../../types/chat/chat.payload.type";
import type { TypingSocket } from "../../../types/chat/chat.socket.type";
import {
  onGetConversations,
  resetUnread,
  updateConversationByMessage,
} from "../../../redux/conversation.redux";
import { setIsTyping } from "../../../redux/chat.redux";
import {
  bindConversationReadSuccess,
  bindMessageNew,
  bindTypingMessageSuccess,
  unbindConversationReadSuccess,
  unbindMessageNew,
  unbindTypingMessageSuccess,
  bindDeleteMessage,
  unbindDeleteMessage,
  bindRevokeMessage,
  unbindRevokeMessage,
} from "../../../socket/message.socket";
import { showTabNotification } from "../../../helpers/tabNotification";
import type { ProfileData } from "../../../types/data.type";

type UseMessageSocketListenerProps = {
  currentUserId: string;
  conversationId?: string;
  currentUser: ProfileData;
};

export default function useMessageSocketListener({
  currentUserId,
  conversationId,
  currentUser,
}: UseMessageSocketListenerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const conversations = useSelector(
    (state: RootState) => state.conversation.conversations,
  );

  useEffect(() => {
    if (!currentUser) return;

    const handleUpdateConversation = async (
      payload: ConversationReadPayload,
    ) => {
      dispatch(
        resetUnread({
          conversationId: payload.conversationId,
        }),
      );
    };

    const handleNewMessage = (payload: MessageType) => {
      const exitsConversation = conversations.some(
        (c) => c.id === payload.conversationId,
      );

      if (!exitsConversation) {
        dispatch(onGetConversations());
      } else {
        dispatch(
          updateConversationByMessage({
            currentUserId,
            message: payload,
            openingConversationId: conversationId,
          }),
        );
      }

      // Play sound, show tab notification and red dot favicon badge for incoming messages
      const isMyMessage = String(payload.senderId) === String(currentUserId);
      if (!isMyMessage) {
        const isActiveConversation =
          String(conversationId) === String(payload.conversationId);
        const isTabActive =
          document.hasFocus() && document.visibilityState === "visible";

        if (!isActiveConversation || !isTabActive) {
          const conversation = conversations.find(
            (c) => String(c.id) === String(payload.conversationId),
          );
          const senderName = conversation?.name || "Người dùng";

          let messageContent = "Đã gửi một tin nhắn";
          if (payload.type === "text" && payload.content) {
            messageContent = payload.content;
          } else if (payload.type === "file") {
            messageContent = "Đã gửi một tệp đính kèm";
          } else if (payload.type === "gif") {
            messageContent = "Đã gửi một ảnh GIF";
          }

          showTabNotification(senderName, messageContent);
        }
      }
    };

    const handleTypingEvent = async (payload: TypingSocket) => {
      if (payload.targetUserId !== currentUserId) return;

      dispatch(setIsTyping(payload));
    };

    const handleDeleteMessage = () => {
      dispatch(onGetConversations());
    };

    const handleRevokeMessage = () => {
      dispatch(onGetConversations());
    };

    bindConversationReadSuccess(handleUpdateConversation);
    bindMessageNew(handleNewMessage);
    bindTypingMessageSuccess(handleTypingEvent);
    bindDeleteMessage(handleDeleteMessage);
    bindRevokeMessage(handleRevokeMessage);

    return () => {
      unbindConversationReadSuccess(handleUpdateConversation);
      unbindMessageNew(handleNewMessage);
      unbindTypingMessageSuccess(handleTypingEvent);
      unbindDeleteMessage(handleDeleteMessage);
      unbindRevokeMessage(handleRevokeMessage);
    };
  }, [dispatch, currentUserId, conversationId, currentUser, conversations]);
}

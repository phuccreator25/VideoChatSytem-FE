import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import type { MessageType } from "../../../types/chat/chat.model.type";
import type {
  ConversationReadPayload,
  MessageReceivedPayload,
} from "../../../types/chat/chat.payload.type";
import {
  bindConversationReadSuccess,
  bindDeleteMessage,
  bindDeletePinMessage,
  bindMessageNew,
  bindPinMessage,
  bindReactEmotionMessage,
  bindReceivedMessages,
  bindRevokeMessage,
  bindUnReactEmotionMessage,
  bindUpdateLinkPreview,
  emitConversationRead,
  emitTypingMesssage,
  unbindConversationReadSuccess,
  unbindDeleteMessage,
  unbindDeletePinMessage,
  unbindMessageNew,
  unbindPinMessage,
  unbindReactEmotionMessage,
  unbindReceivedMessages,
  unbindRevokeMessage,
  unbindUnReactEmotionMessage,
  unbindUpdateLinkPreview,
} from "../../../socket/message.socket";
import ConversationsAPI from "../../../api/Conversation.api";
import { connectSocket } from "../../../socket/socket";
import { setUserData, updateContactRelation } from "../../../redux/chat.redux";
import useMergeAttachment from "../../../helpers/mergeAttachment.helper";
import {
  deletePinnedMessage,
  setAllPinnedMessagesByConversation,
  setPinnedMessage,
} from "../../../redux/conversation.redux";
import type {
  ConversationUserInfo,
  pinMessages,
} from "../../../types/chat/chat.conversation.type";
import type {
  deletePinMessageSocket,
  reactEmotionMessageSocket,
} from "../../../types/chat/chat.socket.type";

export const useChatMessageSocket = ({
  conversationId,
  currentUserId,
  userData,
  inputText,
  setMessages,
}: {
  conversationId?: string;
  currentUserId?: string;
  userData: ConversationUserInfo | null;
  inputText: string;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { mergeAttachments } = useMergeAttachment();

  const lastMessage = useRef<MessageType | null>(null);
  const currentTimeOut = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectTimeOut = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle Typing Messages
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (!conversationId) return;

    const hasText = inputText.trim().length > 0;

    if (!hasText) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      if (isTypingRef.current) {
        emitTypingMesssage(conversationId, false);
        isTypingRef.current = false;
      }

      return;
    }

    if (!isTypingRef.current) {
      emitTypingMesssage(conversationId, true);
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitTypingMesssage(conversationId, false);
      isTypingRef.current = false;
      typingTimeoutRef.current = null;
    }, 1000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [inputText, conversationId]);

  // XỬ LÝ SOCKET
  useEffect(() => {
    const handleNewMessage = (payload: MessageType) => {
      if (!payload || payload.conversationId !== conversationId) return;

      setMessages((prev) => {
        const currentMessages = prev || [];

        const existingIndex = currentMessages.findIndex(
          (msg) =>
            msg.id === payload.id ||
            (payload.tempMessageId &&
              (msg.tempMessageId === payload.tempMessageId ||
                msg.id === payload.tempMessageId)),
        );

        if (existingIndex >= 0) {
          const nextMessages = [...currentMessages];
          const currentMessage = nextMessages[existingIndex];

          nextMessages[existingIndex] = {
            ...currentMessage,
            ...payload,
            attachments: payload.attachments?.length
              ? mergeAttachments(
                  currentMessage.attachments,
                  payload.attachments,
                )
              : currentMessage.attachments,
          };

          return nextMessages;
        }

        return [...currentMessages, payload];
      });

      if (payload.senderId === currentUserId) return;

      lastMessage.current = payload;

      if (currentTimeOut.current) clearTimeout(currentTimeOut.current);

      currentTimeOut.current = setTimeout(async () => {
        if (!lastMessage.current) return;
        await emitConversationRead(conversationId);
      }, 500);
    };

    const handleReadMessage = (payload: ConversationReadPayload) => {
      if (!payload?.conversationId || payload.conversationId !== conversationId)
        return;

      const ids = payload.messageIds?.length
        ? payload.messageIds
        : payload.messageId
          ? [payload.messageId]
          : [];

      if (!ids.length) return;

      const readAt = payload.readAt || new Date().toISOString();
      const targetMessageIds = new Set(ids);

      setMessages((prev) =>
        (prev || []).map((msg) => {
          if (!targetMessageIds.has(msg.id)) return msg;

          return {
            ...msg,
            status: "read",
            deliveries: (msg.deliveries || []).map((delivery) =>
              delivery.userId === payload.readerUserId
                ? {
                    ...delivery,
                    readAt,
                    deliveredAt: delivery.deliveredAt || readAt,
                  }
                : delivery,
            ),
          };
        }),
      );
    };

    const handleUpdateStatusMessage = (payload: MessageReceivedPayload) => {
      if (!payload) return;

      if (!conversationId || conversationId !== payload.conversationId) return;

      const deliveredAt = payload.deliveredAt || new Date().toISOString();

      setMessages((prev) => {
        if (!prev || prev.length === 0) return prev;

        let hasChanged = false;

        const nextMessages = prev.map((msg) => {
          if (msg.conversationId !== payload.conversationId) return msg;
          if (msg.senderId !== currentUserId) return msg;
          if (msg.isRevoked) return msg;
          if (msg.status !== "sent") return msg;

          hasChanged = true;

          return {
            ...msg,
            status: "delivered",
            deliveries: (msg.deliveries || []).map((delivery) => {
              if (delivery.readAt !== null) return delivery;
              if (delivery.deliveredAt !== null) return delivery;

              return {
                ...delivery,
                deliveredAt,
              };
            }),
          };
        });

        if (!hasChanged) return prev;

        return nextMessages;
      });
    };

    const handlePinnedMessage = (payload: pinMessages) => {
      if (!conversationId) return;
      dispatch(setPinnedMessage(payload));
    };

    const handleDeletePinMessage = (payload: deletePinMessageSocket) => {
      if (!conversationId) return;
      dispatch(deletePinnedMessage(payload));
    };

    const handleReactEmotion = (payload: reactEmotionMessageSocket) => {
      if (!conversationId) return;
      console.log(payload);

      setMessages((prev) => {
        const currentMessages = prev || [];

        const existingIndex = currentMessages.findIndex(
          (msg) => msg.id === payload.messageId,
        );

        if (existingIndex >= 0) {
          const nextMessages = [...currentMessages];
          const currentMessage = nextMessages[existingIndex];

          nextMessages[existingIndex] = {
            ...currentMessage,
            reactions: payload.reactions,
          };

          return nextMessages;
        }
        return currentMessages;
      });
    };

    const handleUnReactEmotion = (payload: reactEmotionMessageSocket) => {
      if (!conversationId) return;

      setMessages((prev) => {
        const currentMessages = prev || [];

        const existingIndex = currentMessages.findIndex(
          (msg) => msg.id === payload.messageId,
        );

        if (existingIndex >= 0) {
          const nextMessages = [...currentMessages];

          nextMessages[existingIndex] = {
            ...currentMessages[existingIndex],
            reactions: payload.reactions,
          };

          return nextMessages;
        }
        return currentMessages;
      });
    };

    const handleDeleteMessage = (payload: MessageType) => {
      if (!conversationId) return;

      setMessages((prev) =>
        (prev || []).filter((msg) => msg.id !== payload.id),
      );
    };

    const handleRevokeMessage = (payload: MessageType) => {
      if (!conversationId) return;

      setMessages((prev) =>
        (prev || []).map((msg) =>
          msg.id === payload.id ? { ...msg, isRevoked: true } : msg,
        ),
      );
    };

    const handleUpdateLinkPreview = (payload: MessageType) => {
      if (!conversationId || payload.conversationId !== conversationId) return;

      setMessages((prev) =>
        (prev || []).map((msg) =>
          msg.id === payload.id ? { ...msg, preview: payload.preview } : msg,
        ),
      );
    };

    bindMessageNew(handleNewMessage);
    bindConversationReadSuccess(handleReadMessage);
    bindReceivedMessages(handleUpdateStatusMessage);
    bindPinMessage(handlePinnedMessage);
    bindDeletePinMessage(handleDeletePinMessage);
    bindReactEmotionMessage(handleReactEmotion);
    bindUnReactEmotionMessage(handleUnReactEmotion);
    bindDeleteMessage(handleDeleteMessage);
    bindRevokeMessage(handleRevokeMessage);
    bindUpdateLinkPreview(handleUpdateLinkPreview);

    return () => {
      unbindMessageNew(handleNewMessage);
      unbindConversationReadSuccess(handleReadMessage);
      unbindReceivedMessages(handleUpdateStatusMessage);
      unbindPinMessage(handlePinnedMessage);
      unbindDeletePinMessage(handleDeletePinMessage);
      unbindReactEmotionMessage(handleReactEmotion);
      unbindUnReactEmotionMessage(handleUnReactEmotion);
      unbindDeleteMessage(handleDeleteMessage);
      unbindRevokeMessage(handleRevokeMessage);
      unbindUpdateLinkPreview(handleUpdateLinkPreview);
    };
  }, [conversationId, userData?.userId]);

  // Xử lý khi reconnect -> miss socket
  useEffect(() => {
    const socket = connectSocket();

    const syncCurrentConversation = () => {
      if (!conversationId) return;

      if (reconnectTimeOut.current) {
        clearTimeout(reconnectTimeOut.current);
      }

      reconnectTimeOut.current = setTimeout(async () => {
        try {
          const res =
            await ConversationsAPI.getConversationById(conversationId);

          dispatch(setUserData(res.data.data.user));
          dispatch(
            updateContactRelation({
              userId: res.data.data.user?.userId,
              relation: res.data.data.user?.relationStatus || "none",
            }),
          );

          const pinMessages = res.data.data.conversation.pinMessages || [];
          dispatch(
            setAllPinnedMessagesByConversation({
              conversationId,
              pinMessages,
            }),
          );

          setMessages(res.data.data.messages);

          await emitConversationRead(conversationId);
        } catch (error) {
          console.log("Sync current conversation failed:", error);
        } finally {
          reconnectTimeOut.current = null;
        }
      }, 500);
    };

    socket.io.on("reconnect", syncCurrentConversation);

    return () => {
      if (reconnectTimeOut.current) {
        clearTimeout(reconnectTimeOut.current);
        reconnectTimeOut.current = null;
      }

      socket.io.off("reconnect", syncCurrentConversation);
    };
  }, [conversationId]);
};

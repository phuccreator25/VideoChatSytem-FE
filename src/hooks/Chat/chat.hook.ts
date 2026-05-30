import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChatItemTypes,
  type ConversationReadPayload,
  type MessageReceivedPayload,
  type MessageType,
  type SendMessagePayload,
} from "../../types/chat.type";
import { type AppDispatch, type RootState } from "../../redux/store";
import ConversationsAPI from "../../api/Conversation.api";
import {
  bindConversationReadSuccess,
  bindMessageNew,
  bindReceivedMessages,
  emitConversationRead,
  unbindConversationReadSuccess,
  unbindMessageNew,
  unbindReceivedMessages,
} from "../../socket/message.socket";
import ChatAPI from "../../api/Chat.api";
import { connectSocket } from "../../socket/socket";
import { setUserData, updateContactRelation } from "../../redux/chat.redux";
import {
  onAcceptInvitation,
  onAddContact,
  onCancelSentInvitation,
  onDeclineInvitation,
} from "../../redux/invitation.redux";
import useApplyRelationState from "../../helpers/relationState.helper";

type ContactAction = "add" | "accept" | "decline" | "cancel";

export function useChatFrame() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [openAddContactModal, setOpenAddContactModal] = useState(false);
  const [invitationMessage, setInvitationMessage] = useState("");
  const [addContactSubmitting, setAddContactSubmitting] = useState(false);
  const [loadingAction, setLoadingAction] = useState<ContactAction | null>(
    null,
  );
  const relationStatus = useSelector(
    (state: RootState) => state.chat.contactRelation,
  );
  const { applyRelationState } = useApplyRelationState();

  const { conversationId } = useParams();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const userData = useSelector((state: RootState) => state.chat.userData);

  const currentUserDisplayName =
    currentUser?.fullname || currentUser?.username || "You";
  const currentUserAvatar = currentUser?.avatar || "";
  const currentUserId = currentUser?._id || "";

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const lastMessage = useRef<MessageType | null>(null);
  const currentTimeOut = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectTimeOut = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({
      behavior,
      block: "end",
    });
  };

  const dispatch = useDispatch<AppDispatch>();

  // FETCH DANH SÁCH MESSAGE
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;

      const res = await ConversationsAPI.getConversationById(conversationId);
      dispatch(setUserData(res.data.data.user));
      dispatch(
        updateContactRelation({
          userId: res.data.data.user?.userId,
          relation: res.data.data.user?.relationStatus,
        }),
      );
      setMessages(res.data.data.messages);

      await emitConversationRead(conversationId);

      requestAnimationFrame(() => {
        scrollToBottom("auto");
      });
    };

    fetchMessages();
  }, [conversationId, dispatch]);

  useEffect(() => {
    if (!messages.length) return;

    requestAnimationFrame(() => {
      scrollToBottom("smooth");
    });
  }, [messages.length]);

  // XỬ LÝ SOCKET
  useEffect(() => {
    //Xử lý tin nhắn mới
    const handleNewMessage = (payload: MessageType) => {
      if (!payload || payload.conversationId !== conversationId) return;

      setMessages((prev) => {
        const currentMessages = prev || [];

        if (currentMessages.some((msg) => msg.id === payload.id)) {
          return currentMessages;
        }

        if (payload.senderId === currentUserId) {
          const tempIndex = currentMessages.findIndex(
            (msg) =>
              msg.status === "sending" &&
              msg.senderId === currentUserId &&
              msg.conversationId === payload.conversationId &&
              msg.type === payload.type &&
              msg.content === payload.content,
          ); // Tìm message tạm để thay thế message chính thức từ DB

          if (tempIndex >= 0) {
            const nextMessages = [...currentMessages];
            nextMessages[tempIndex] = payload;
            return nextMessages;
          }
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

    // READ KHI NGƯỜI NHẬN TRUY CẬP TỪ BÊN NGOÀI
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

    // Cập nhật trạng thái received cho message khi receiver online
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
          if (msg.deletedAt) return msg;
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

    bindMessageNew(handleNewMessage);
    bindConversationReadSuccess(handleReadMessage);
    bindReceivedMessages(handleUpdateStatusMessage);

    return () => {
      unbindMessageNew(handleNewMessage);
      unbindConversationReadSuccess(handleReadMessage);
      unbindReceivedMessages(handleUpdateStatusMessage);
    };
  }, [conversationId, userData?.userId]);

  //Xử lý khi reconnect -> miss socket
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

  const handleSend = async () => {
    if (!conversationId || !inputText.trim()) return;
    if (!currentUserId) return;

    const content = inputText.trim();
    const tempId = `temp-${Date.now()}`;

    const tempMessages = {
      id: tempId,
      conversationId,
      senderId: currentUserId,
      type: ChatItemTypes.TEXT,
      content: content || "",
      status: "sending",
    };

    setMessages((prev) => [...(prev || []), tempMessages]);
    setInputText("");

    try {
      const message: SendMessagePayload = {
        conversationId,
        type: ChatItemTypes.TEXT,
        content: content,
      };

      const res = await ChatAPI.onSendMessage(message, conversationId);
      const savedMessage = res.data.data;
      setInputText("");
      setMessages((prev) => {
        const currentMessages = prev || [];
        const withoutTemp = currentMessages.filter((msg) => msg.id !== tempId);

        if (withoutTemp.some((msg) => msg.id === savedMessage.id)) {
          return withoutTemp;
        }

        return [...withoutTemp, savedMessage];
      });
    } catch (error) {
      console.log(error);
      setMessages((prev) =>
        (prev || []).map((msg) =>
          msg.id === tempId
            ? {
                ...msg,
                status: "failed",
              }
            : msg,
        ),
      );
    }
  };

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

  const handleCancelInvitation = async () => {
    try {
      if (!userData?.invitationId) return;
      
      setLoadingAction("cancel");
      
      const res = await dispatch(
        onCancelSentInvitation(userData.invitationId),
      ).unwrap();
      
      if (res) {
        await applyRelationState({
          userId: userData?.userId,
          relation: "add",
          invitationId: null,
        });
      }
    } catch (error) {
      console.log("Error occurred while canceling invitation:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeclineInvitation = async () => {
    try {
      if (!userData?.invitationId) return;
      
      setLoadingAction("decline");
      
      const res = await dispatch(
        onDeclineInvitation(userData.invitationId),
      ).unwrap();
      
      if (res) {
        await applyRelationState({
          userId: userData?.userId,
          relation: "add",
          invitationId: null,
        });
      }
    } catch (error) {
      console.log("Error occurred while declining invitation:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAcceptInvitation = async () => {
    try {
      if (!userData?.invitationId) return;
      
      setLoadingAction("accept");
      
      const res = await dispatch(
        onAcceptInvitation(userData.invitationId),
      ).unwrap();
      
      if (res) {
        await applyRelationState({
          userId: userData?.userId,
          relation: "none",
          invitationId: null,
        });
      }
    } catch (error) {
      console.log("Error occurred while accepting invitation:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleOpenAddContactModal = () => {
    if (!userData?.userId) return;
    
    const defaultMessage = `Xin chào, tôi là ${currentUser?.fullname ?? ""}`;
    
    setInvitationMessage(defaultMessage);
    setOpenAddContactModal(true);
  };

  const handleCloseAddContactModal = () => {
    setOpenAddContactModal(false);
    setInvitationMessage("");
  };

  const handleSubmitAddContact = async () => {
    if (!userData?.userId) return;

    try {
      setAddContactSubmitting(true);
      const payloadMessage = invitationMessage.trim();
      
      const res = await dispatch(
        onAddContact({
          userId: userData.userId,
          invitationMessage: payloadMessage,
        }),
      ).unwrap();

      if (res) {
        await applyRelationState({
          userId: userData.userId,
          relation: "sent",
          invitationId: res.invitationId || null,
        });
        handleCloseAddContactModal();
      }
    } finally {
      setAddContactSubmitting(false);
    }
  };

  return {
    ui: {
      normalizedMessages,
      openAddContactModal,
      invitationMessage,
      addContactSubmitting,
      loadingAction,
    },

    data: {
      conversationId,
      userData,
      inputText,
      relationStatus,
    },

    handler: {
      setInputText,
      handleSend,
      onAddContact: handleOpenAddContactModal,
      onCloseAddContactModal: handleCloseAddContactModal,
      onChangeAddContactMessage: setInvitationMessage,
      onSubmitAddContact: handleSubmitAddContact,
      onAcceptInvitation: handleAcceptInvitation,
      onDeclineInvitation: handleDeclineInvitation,
      onCancelInvitation: handleCancelInvitation,
    },

    ref: {
      messagesEndRef,
    },
  };
}

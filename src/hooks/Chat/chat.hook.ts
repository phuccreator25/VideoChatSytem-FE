import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChatItemTypes,
  type MessageType,
  type SelectedGif,
} from "../../types/chat/chat.model.type";
import type {
  ConversationReadPayload,
  MessageReceivedPayload,
  SendMessagePayload,
} from "../../types/chat/chat.payload.type";
import { type AppDispatch, type RootState } from "../../redux/store";
import ConversationsAPI from "../../api/Conversation.api";
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
} from "../../socket/message.socket";
import ChatAPI from "../../api/Chat.api";
import { connectSocket } from "../../socket/socket";
import { setUserData, updateContactRelation } from "../../redux/chat.redux";
import useMergeAttachment from "../../helpers/mergeAttachment.helper";
import useInvitationAction from "../../helpers/InvitationAction.helper";
import type { IGif } from "@giphy/js-types";
import {
  deletePinnedMessage,
  onDeletePinMessageConversation,
  setAllPinnedMessagesByConversation,
  setPinnedMessage,
} from "../../redux/conversation.redux";
import type { pinMessages } from "../../types/chat/chat.conversation.type";
import type {
  deletePinMessageSocket,
  reactEmotionMessageSocket,
} from "../../types/chat/chat.socket.type";
import { useVoiceChat } from "../Voice/voiceChat.hook";
import { enqueueSnackbar } from "notistack";

type ContactAction = "add" | "accept" | "decline" | "cancel";

export function useChatFrame() {
  const { conversationId } = useParams();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const userData = useSelector((state: RootState) => state.chat.userData);

  const currentUserDisplayName =
    currentUser?.fullname || currentUser?.username || "You";
  const currentUserAvatar = currentUser?.avatar || "";
  const currentUserId = currentUser?._id || "";

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messagesSearch, setMessagesSearch] = useState<MessageType[]>([]);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [isHasMoreMessages, setIsHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [inputText, setInputText] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const lastMessage = useRef<MessageType | null>(null);
  const currentTimeOut = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectTimeOut = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [messageReplyed, setMessageReplyed] = useState<MessageType | null>(
    null,
  );

  const [openAddContactModal, setOpenAddContactModal] = useState(false);
  const [invitationMessage, setInvitationMessage] = useState("");
  const [addContactSubmitting, setAddContactSubmitting] = useState(false);
  const [loadingAction, setLoadingAction] = useState<ContactAction | null>(
    null,
  );

  const pinMessages = useSelector((state: RootState) => {
    if (!conversationId) return [];

    return (
      state.conversation.pinnedMessageIdsByConversation[conversationId] || []
    );
  });
  const [selectedGif, setSelectedGif] = useState<SelectedGif | null>(null);

  const relationStatus = useSelector(
    (state: RootState) => state.chat.contactRelation,
  );

  const { mergeAttachments } = useMergeAttachment();
  const dispatch = useDispatch<AppDispatch>();

  const {
    onHandleAcceptInvitation,
    onHandleDeclineInvitation,
    onHandleCancelInvitation,
    onHandleAddInvitation,
  } = useInvitationAction();

  //VOICE
  const { voiceData, voiceHandler, voiceUi } = useVoiceChat({
    onError: (error) => {
      enqueueSnackbar("Voice no supported. Please try again", {
        variant: "error",
      });
      console.log(error);
    },
  });

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({
      behavior,
      block: "end",
    });
  };

  // FETCH DANH SÁCH MESSAGE
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;

      const conversationRes =
        await ConversationsAPI.getConversationById(conversationId);

      const pinMessages = conversationRes.data.data.conversation.pinMessages || [];
      await dispatch(
        setAllPinnedMessagesByConversation({
          conversationId,
          pinMessages,
        })
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
    };

    fetchMessages();
  }, [conversationId, dispatch]);

  //Handle Typing Messages
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (!conversationId) return;

    const hasText = inputText.trim().length > 0;

    // Input bị xóa hết
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

    // Bắt đầu nhập: chỉ emit true một lần
    if (!isTypingRef.current) {
      emitTypingMesssage(conversationId, true);

      isTypingRef.current = true;
    }

    // Mỗi lần gõ tiếp thì reset timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Ngừng gõ 1 giây thì emit false
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

        const existingIndex = currentMessages.findIndex(
          (msg) =>
            msg.id === payload.id ||
            msg.tempMessageId === payload.tempMessageId ||
            msg.id === payload.tempMessageId,
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

    // Xử lý Pin message
    const handlePinnedMessage = (payload: pinMessages) => {
      if (!conversationId) return;
      dispatch(setPinnedMessage(payload));
    };

    // Xử lý delete pin message
    const handleDeletePinMessage = (payload: deletePinMessageSocket) => {
      if (!conversationId) return;
      dispatch(deletePinnedMessage(payload));
    };

    //Xử lý emotion
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

    bindMessageNew(handleNewMessage);
    bindConversationReadSuccess(handleReadMessage);
    bindReceivedMessages(handleUpdateStatusMessage);
    bindPinMessage(handlePinnedMessage);
    bindDeletePinMessage(handleDeletePinMessage);
    bindReactEmotionMessage(handleReactEmotion);
    bindUnReactEmotionMessage(handleUnReactEmotion);
    bindDeleteMessage(handleDeleteMessage);
    bindRevokeMessage(handleRevokeMessage);

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

          const pinMessages = res.data.data.conversation.pinMessages || [];
          dispatch(
            setAllPinnedMessagesByConversation({
              conversationId,
              pinMessages,
            })
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

  //Xử lý gửi tin nhắn
  const handleSend = async () => {
    if (
      !conversationId ||
      (!inputText.trim() &&
        files.length < 1 &&
        selectedGif === null &&
        !voiceData.recordedFile)
    ) {
      return;
    }

    if (!currentUserId) return;

    const content = inputText.trim();
    const voiceSnapshot = voiceData.recordedFile;
    const filesSnapshot = [...files, ...(voiceSnapshot ? [voiceSnapshot] : [])];
    const gifSnapshot = selectedGif;
    const replyMessageSnapshot = messageReplyed;

    const tempMessageId = `temp-${Date.now()}`;

    const hasFiles = filesSnapshot.length > 0;
    const hasGif = Boolean(gifSnapshot);

    const previewFiles = filesSnapshot.map((file) => {
      const isImage = file.type.startsWith("image/");
      const isAudio = file.type.startsWith("audio/");
      const isVideo = file.type.startsWith("video/");

      return {
        tempAttachmentId: `att-temp-${crypto.randomUUID()}`,
        file,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,

        resourceType: isImage
          ? "image"
          : isAudio
            ? "audio"
            : isVideo
              ? "video"
              : "raw",

        previewUrl:
          isImage || isVideo
            ? URL.createObjectURL(file)
            : isAudio
              ? voiceUi.previewUrl
              : null,

        recordDuration: isAudio ? voiceUi.recordingDuration : null,
      };
    });

    const tempMessage = {
      id: tempMessageId,
      tempMessageId,
      conversationId,
      senderId: currentUserId,
      type: hasFiles
        ? ChatItemTypes.FILE
        : hasGif
          ? ChatItemTypes.GIF
          : ChatItemTypes.TEXT,
      content,
      gifUrl: gifSnapshot?.url || null,
      attachments: previewFiles,
      status: "sending",
      replyToMessageId: replyMessageSnapshot?.id ?? null,
      replyMessage: replyMessageSnapshot ?? null,
    };

    setMessages((prev) => [...(prev || []), tempMessage]);

    setInputText("");
    setFiles([]);
    setSelectedGif(null);
    setMessageReplyed(null);
    voiceHandler.clearRecording();

    try {
      let payload: SendMessagePayload | FormData;

      if (hasFiles) {
        const formData = new FormData();

        formData.append("tempMessageId", tempMessageId);
        formData.append("conversationId", conversationId);
        formData.append("type", ChatItemTypes.FILE);
        formData.append("content", content);

        previewFiles.forEach((item) => {
          formData.append("files", item.file);
          formData.append(
            "recordDuration",
            String(voiceUi?.recordingDuration ?? 0),
          );
          formData.append("tempAttachmentIds", item.tempAttachmentId);
        });

        payload = formData;
      } else if (hasGif) {
        payload = {
          tempMessageId,
          conversationId,
          type: ChatItemTypes.GIF,
          gifUrl: gifSnapshot?.url || null,
        };
      } else {
        payload = {
          tempMessageId,
          conversationId,
          type: ChatItemTypes.TEXT,
          content: inputText.trim() || "",
          replyToMessageId: replyMessageSnapshot?.id ?? null,
        };
      }

      const res = await ChatAPI.onSendMessage(payload, conversationId);

      const savedMessage = res.data.data;

      setMessages((prev) => {
        const currentMessages = prev || [];

        const currentTempMessage = currentMessages.find(
          (msg) => msg.id === tempMessageId,
        );

        const mergedSavedMessage = {
          ...savedMessage,
          attachments: savedMessage.attachments?.length
            ? mergeAttachments(
                currentTempMessage?.attachments,
                savedMessage.attachments,
              )
            : currentTempMessage?.attachments,
        };

        const withoutTemp = currentMessages.filter(
          (msg) => msg.id !== tempMessageId && msg.tempMessageId !== tempMessageId
        );


        if (withoutTemp.some((msg) => msg.id === mergedSavedMessage.id)) {
          return withoutTemp;
        }

        return [...withoutTemp, mergedSavedMessage];
      });
    } catch (error) {
      console.error(error);

      setMessages((prev) =>
        (prev || []).map((msg) =>
          msg.id === tempMessageId
            ? {
                ...msg,
                status: "failed",
              }
            : msg,
        ),
      );
    }
  };

  //Gửi lại tin nhắn lỗi
  const handleResend = async (messageFailed: MessageType) => {
    if (!conversationId || !currentUserId) return;
    
    const tempMessageId = messageFailed.tempMessageId || messageFailed.id;
    const content = messageFailed.content || "";
    const type = messageFailed.type;
    const gifUrl = messageFailed.gifUrl;
    const replyToMessageId = messageFailed.replyToMessageId;

    setMessages((prev) =>
      (prev || []).map((msg) =>
        msg.id === messageFailed.id || msg.tempMessageId === tempMessageId
          ? {
              ...msg,
              status: "sending", // Đưa về lại sending
            }
          : msg,
      ),
    );

    try {
      let payload: SendMessagePayload | FormData;

      if (type === ChatItemTypes.FILE) {
        const formData = new FormData();
       
        formData.append("tempMessageId", tempMessageId);
        formData.append("conversationId", conversationId);
        formData.append("type", ChatItemTypes.FILE);
        formData.append("content", content);
       
        messageFailed.attachments?.forEach((item) => {
          if (item.file) {
            formData.append("files", item.file);
            formData.append(
              "recordDuration",
              String(item.recordDuration ?? 0)
            );
            formData.append("tempAttachmentIds", item.tempAttachmentId || "");
          }
        });
        
        payload = formData;
      } else if (type === ChatItemTypes.GIF) {
        payload = {
          tempMessageId,
          conversationId,
          type: ChatItemTypes.GIF,
          gifUrl: gifUrl || null,
        };
      } else {
        payload = {
          tempMessageId,
          conversationId,
          type: ChatItemTypes.TEXT,
          content: content,
          replyToMessageId: replyToMessageId ?? null,
        };
      }

      const res = await ChatAPI.onSendMessage(payload, conversationId);
      
      const savedMessage = res.data.data;
     
      setMessages((prev) => {
        const currentMessages = prev || [];
        const currentTempMessage = currentMessages.find(
          (msg) => msg.id === tempMessageId || msg.id === messageFailed.id
        );
        
        const mergedSavedMessage = {
          ...savedMessage,
          attachments: savedMessage.attachments?.length
            ? mergeAttachments(
                currentTempMessage?.attachments,
                savedMessage.attachments,
              )
            : currentTempMessage?.attachments,
        };
        
        const withoutTemp = currentMessages.filter(
          (msg) => msg.id !== tempMessageId && msg.id !== messageFailed.id
        );
        
        if (withoutTemp.some((msg) => msg.id === mergedSavedMessage.id)) { // Kiểm tra trùng lặp
          return withoutTemp;
        }
        
        return [...withoutTemp, mergedSavedMessage];
      });
    } catch (error) {
      console.error("Resend error:", error);
      setMessages((prev) =>
        (prev || []).map((msg) =>
          msg.id === messageFailed.id || msg.tempMessageId === tempMessageId
            ? {
                ...msg,
                status: "failed",
              }
            : msg,
        ),
      );
    }
  };

  // Xóa tin nhắn lỗi cục bộ khỏi giao diện
  const handleDeleteFailedMessage = (msgId: string) => {
    setMessages((prev) =>
      (prev || []).filter((msg) => msg.id !== msgId && msg.tempMessageId !== msgId)
    );
  };

  //Xử lý upload file
  const handleUploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (!files.length || !conversationId) return;

    setFiles(files);
  };

  //Xử lý xóa file
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  //Xử lý normalize messages
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

  //Invitation
  const handleCancelInvitation = async () => {
    try {
      if (!userData?.invitationId) return;

      setLoadingAction("cancel");

      await onHandleCancelInvitation(userData.invitationId, userData?.userId);
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

      await onHandleDeclineInvitation(userData.invitationId, userData.userId);
    } catch (error) {
      console.log("Error occurred while declining invitation:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAcceptInvitation = async () => {
    try {
      if (!userData?.invitationId || !userData?.userId) return;

      setLoadingAction("accept");

      await onHandleAcceptInvitation(userData.invitationId, userData.userId);
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

      const res = await onHandleAddInvitation(
        userData.userId,
        invitationMessage.trim(),
      );

      if (res) handleCloseAddContactModal();
    } finally {
      setAddContactSubmitting(false);
    }
  };

  // GIF
  const handleSelectGif = (gif: IGif) => {
    const gifData: SelectedGif = {
      provider: "giphy",
      providerId: String(gif.id),
      title: gif.title ?? "",
      url: gif.images.original.url,
      previewUrl:
        gif.images.fixed_width?.url ||
        gif.images.fixed_height?.url ||
        gif.images.original.url,
      width: Number(gif.images.original.width),
      height: Number(gif.images.original.height),
    };

    setSelectedGif(gifData);
  };

  const onRemoveGif = () => {
    setSelectedGif(null);
  };

  //PIN
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

  //Emoji
  const applyEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  //Emotion
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

  //Share Message
  const onHandleShare = async (targetConversationIds: string[], messageId: string) => {
    try {
      if (!targetConversationIds.length || !messageId) return;
      
      await ChatAPI.onForwardMessage(messageId, targetConversationIds);
    } catch (error) {
      console.log("ERROE SHARE: ", error);
    }
  };

  //Search Messages
  const navigateToSearchResult = async (index: number) => {
    if (index < 0 || index >= messagesSearch.length) return;
   
    const targetMsg = messagesSearch[index];
    
    setCurrentSearchIndex(index);
    const element = document.getElementById(`msg-${targetMsg.id}`);
    
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      
      setHighlightedMessageId(targetMsg.id);
     
      setTimeout(() => {
        setHighlightedMessageId((prev) => prev === targetMsg.id ? null : prev);
      }, 2000);
    } else {
      await autoFetchUntilFound(targetMsg);
    }
  };

  //Tải tin nhắn tự động khi không tìm thấy
  const autoFetchUntilFound = async (targetMsg: MessageType) => {
    if (!conversationId) return;

    // Lấy mốc thời gian tin nhắn cũ nhất hiện tại trong giao diện
    let currentOldestCreatedAt = messages[0]?.createdAt || new Date().toISOString();
    let accumulatedMessages: MessageType[] = [];
    let found = false;
    let hasMore = true;

    // Hiển thị trạng thái đang tải (Loading) để người dùng biết
    setIsLoadingMore(true);

    // Vòng lặp tải liên tục dưới nền
    while (!found && hasMore) {
      try {
        const res = await ConversationsAPI.getMoreMessagesConversations(
          conversationId,
          currentOldestCreatedAt
        );
        const fetched = res.data.data.messages;

        // Nếu không còn tin nhắn nào trên server
        if (fetched.length === 0) {
          hasMore = false;
          break;
        }

        // Tích lũy tin nhắn mới tải vào mảng tạm
        accumulatedMessages = [...fetched, ...accumulatedMessages];

        // Kiểm tra xem tin nhắn đích có trong nhóm vừa tải về không
        const isExist = fetched.some((m: MessageType) => m.id === targetMsg.id);
        if (isExist) {
          found = true;
          break; // Tìm thấy -> thoát vòng lặp
        }

        // Cập nhật mốc thời gian cũ nhất để lấy tiếp đợt sau
        currentOldestCreatedAt = fetched[0].createdAt;

        // Nếu số lượng tải về nhỏ hơn giới hạn phân trang (ví dụ 30) tức là đã hết tin nhắn trong DB
        if (fetched.length < 20) {
          hasMore = false;
        }
      } catch (error) {
        console.error("Lỗi tự động tải tin nhắn: ", error);
        hasMore = false;
      }
    }

    // Cập nhật React state duy nhất 1 lần sau khi lấy đủ tin nhắn
    if (accumulatedMessages.length > 0) {
      setMessages((prev) => [...accumulatedMessages, ...prev]);
    }

    setIsLoadingMore(false);

    // Cuộn tới phần tử vừa render thành công
    if (found) {
      setTimeout(() => {
        const element = document.getElementById(`msg-${targetMsg.id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          setHighlightedMessageId(targetMsg.id);
          setTimeout(() => {
            setHighlightedMessageId((prev) => prev === targetMsg.id ? null : prev);
          }, 2000);
        }
      }, 150);
    }
  };

  const goToNextSearch = () => {
    if (messagesSearch.length === 0) return;
    const nextIndex = currentSearchIndex === -1 ? messagesSearch.length - 1 : (currentSearchIndex + 1) % messagesSearch.length;
    navigateToSearchResult(nextIndex);
  };

  const goToPrevSearch = () => {
    if (messagesSearch.length === 0) return;
    const prevIndex = currentSearchIndex === -1 ? messagesSearch.length - 1 : (currentSearchIndex - 1 + messagesSearch.length) % messagesSearch.length;
    navigateToSearchResult(prevIndex);
  };

  const closeSearchDrawer = () => {
    setIsSearchDrawerOpen(false);
    setMessagesSearch([]);
    setSearchKeyword("");
    setCurrentSearchIndex(-1);
    setHighlightedMessageId(null);
  };

  const openProfileDrawer = () => {
    setIsProfileDrawerOpen(true);
    setIsSearchDrawerOpen(false);
  };

  const closeProfileDrawer = () => {
    setIsProfileDrawerOpen(false);
  };

  //Search
  const handleSearchMessage = async (keyword: string) => {
    try {
      if (!keyword || !conversationId) return;
      
      setSearchKeyword(keyword);
      const res = await ChatAPI.onSearchMessage(keyword, conversationId);
      const messages = res.data.data;
      
      setMessagesSearch(messages);
      setIsSearchDrawerOpen(true);
      setIsProfileDrawerOpen(false);
      
      if (messages && messages.length > 0) {
        const lastIndex = messages.length - 1;
        
        setCurrentSearchIndex(lastIndex);
        
        setTimeout(() => {
          const targetMsg = messages[lastIndex];
          const element = document.getElementById(`msg-${targetMsg.id}`);
         
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            setHighlightedMessageId(targetMsg.id);
            setTimeout(() => {
              setHighlightedMessageId((prev) => prev === targetMsg.id ? null : prev);
            }, 2000);
          }
        }, 150);
      } else {
        setCurrentSearchIndex(-1);
      }
    } catch (error) {
      console.log("ERROE SEARCH: ", error);
    }
  };

  // Reset search when switching conversations
  useEffect(() => {
    closeSearchDrawer();
    closeProfileDrawer();
    setIsHasMoreMessages(true);
    setIsLoadingMore(false);
  }, [conversationId]);

  //Scroll Load More Messages
  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    if(!conversationId) return;
    const target = e.currentTarget;
    
    if (target.scrollTop === 0 && isHasMoreMessages && !isLoadingMore) {
      setIsLoadingMore(true);
      // Lưu lại chiều cao hiện tại của scroll để sau khi render xong không bị giật màn hình
      const previousScrollHeight = target.scrollHeight;

      // Lấy tin nhắn cũ nhất hiện có
      const oldestMsg = messages[0];
      
      if (!oldestMsg) {
        setIsLoadingMore(false);
        return;
      };

      await handleLoadMoreMessages(oldestMsg.createdAt ?? "");

      // Giữ nguyên vị trí scroll sau khi danh sách được cập nhật
      setTimeout(() => {
        target.scrollTop = target.scrollHeight - previousScrollHeight;
        setIsLoadingMore(false);
      }, 50);
    }
  };

  const handleLoadMoreMessages = async (beforeTimestamp: string) => {
    if(!conversationId) return;
    
    try {
      const res = await ConversationsAPI.getMoreMessagesConversations(conversationId, beforeTimestamp);
      const newMessages = res.data.data.messages;
      
      setMessages((prev) => [...newMessages, ...prev]);

      if(newMessages.length < 20) {
        setIsHasMoreMessages(false);
      }

      setIsLoadingMore(false);
    } catch (error) {
      console.log("ERROE LOAD MORE: ", error);
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
      goToNextSearch,
      goToPrevSearch,
      handleScroll,
      openProfileDrawer,
      closeProfileDrawer,
    },

    ref: {
      messagesEndRef,
    },
  };
}
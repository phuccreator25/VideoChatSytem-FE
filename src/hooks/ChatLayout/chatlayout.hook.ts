import { useDispatch, useSelector } from "react-redux";
import type { RailKey } from "../../types/layout/layout.navigation.type";
import type { AppDispatch, RootState } from "../../redux/store";
import useApplyRelationState from "../../helpers/relationState.helper";
import { SelectcurrentUser } from "../../redux/auth.redux";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import type {
  InvitationActionSocket,
  InvitationReceived,
} from "../../types/invitation/invitation.socket.type";
import { useEffect } from "react";
import { connectSocket } from "../../socket/socket";
import { useSnackbar } from "notistack";
import {
  onGetCountReceivedInvitation,
  onGetCountSentInvitation,
  onGetListFriendRequests,
  onGetListSentInvitation,
  setIsPopoverInvitationOpen,
} from "../../redux/invitation.redux";
import type { MessageType } from "../../types/chat/chat.model.type";
import type { ConversationReadPayload } from "../../types/chat/chat.payload.type";
import {
  onGetConversations,
  resetUnread,
  updateConversationByMessage,
  updateNickNameConversation,
  updateStatusUsers,
} from "../../redux/conversation.redux";
import {
  onGetDataContact,
  onGetUserOnlines,
  setOnlineUsers,
  updateUserPresence,
} from "../../redux/contact.redux";
import type {
  ContactRemoveSocket,
  ContactUpdateNickNameSocket,
} from "../../types/contact/contact.socket.type";
import {
  bindInvitationAccept,
  bindInvitationCancel,
  bindInvitationCreated,
  bindInvitationDecline,
  bindInvitationSent,
  unbindInvitationAccept,
  unbindInvitationCancel,
  unbindInvitationCreated,
  unbindInvitationDecline,
  unbindInvitationSent,
} from "../../socket/invitationSocket.socket";
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
} from "../../socket/message.socket";
import {
  bindContactRemove,
  bindContactUpdateNickName,
  unbindContactRemove,
  unbindContactUpdateNickName,
} from "../../socket/contactSocket.socket";
import {
  setIsTyping,
  updateNickNameUser,
  updateStatusUser,
} from "../../redux/chat.redux";
import {
  bindOnlineUsers,
  bindUserPresenceChanged,
  unbindOnlineUsers,
  unbindUserPresenceChanged,
  type OnlineUserSocket,
} from "../../socket/authSocket.socket";
import type { TypingSocket } from "../../types/chat/chat.socket.type";
import {
  closeIncomingCall,
  openIncomingCall,
  setCallInfo,
  onEndCallAction,
  clearCallInfo,
  closeCallModal,
  onAcceptCallAction,
  addIceCandidate,
} from "../../redux/call.redux";
import {
  bindCallEnd,
  bindCallInitiated,
  bindCallOfferSuccess,
  unbindCallEnd,
  unbindCallInitiated,
  unbindCallOfferSuccess,
  bindCallCandidate,
  unbindCallCandidate,
} from "../../socket/callSocket.socket";
import type { CallEndPayload } from "../../types/call/call.type";
import type { CallOfferSuccessPayload } from "../../types/call/callSocket.type";
import { showTabNotification } from "../../helpers/tabNotification";
import { setBlockStatus } from "../../redux/block.redux";
import { bindBlockUser, bindUnblockUser, unbindBlockUser, unbindUnblockUser } from "../../socket/blockSocket.socket";

export default function useChatLayout(activeRail: RailKey) {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const { applyRelationState } = useApplyRelationState();

  const isPopoverInvitation = useSelector(
    (state: RootState) => state.invitation.isPopoverInvitationOpen,
  );
  const conversations = useSelector(
    (state: RootState) => state.conversation.conversations,
  );

  const currentUser = useSelector(SelectcurrentUser);
  const currentUserId = currentUser?._id || "";
  const { conversationId } = useParams();
  const userData = useSelector((state: RootState) => state.chat.userData); // DATA đang được chọn ở conversation
  const isFetchCountReceive = useSelector(
    (state: RootState) => state.invitation.isFetchCountReceive
  );

  const [searchParams] = useSearchParams();

  //VideoCall
  const incomingCall = useSelector(
    (state: RootState) => state.call.incomingCall,
  );
  const isCallModalOpen = useSelector(
    (state: RootState) => state.call.isCallModalOpen,
  );

  //Load more received
  const limitParam = Number(searchParams.get("resolvedLimit"));
  const resolvedLimit =
    Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 3;

  //Load more sent
  const limitSentParam = Number(searchParams.get("resolvedLimitSent"));
  const resolvedLimitSent =
    Number.isFinite(limitSentParam) && limitSentParam > 0 ? limitSentParam : 3;

  //Check sender and receiver
  const isSender = (payload: InvitationActionSocket) =>
    payload.senderId === currentUserId;

  const isReceiver = (payload: InvitationActionSocket) =>
    payload.receiverId === currentUserId;

  //Connect socket and fetch initial invitation count once on user load
  useEffect(() => {
    if (!currentUser) return;
    
    connectSocket();
    
    if(location.pathname !== "/invitation" && isFetchCountReceive === false) dispatch(onGetCountReceivedInvitation());    
   
    if(activeRail === "messages") dispatch(onGetUserOnlines());
  
  }, [currentUser, dispatch]);

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

    const getTargetUserId = (payload: InvitationActionSocket) => {
      if (payload.senderId && payload.receiverId) {
        return isSender(payload) ? payload.receiverId : payload.senderId;
      }

      return payload.senderId || payload.receiverId || null;
    };

    const refreshInvitationCount = async (payload: InvitationActionSocket) => {
      if (isSender(payload)) {
        const isViewingInvitations =
          activeRail === "contact" ||
          isPopoverInvitation === true ||
          location.pathname === "/invitation";
        if (isViewingInvitations) {
          await dispatch(onGetCountSentInvitation());
        }
        return;
      }

      if (isReceiver(payload)) await dispatch(onGetCountReceivedInvitation());
    };

    const handleInvitationSentEvent = (payload: InvitationActionSocket) => {
      if (isSender(payload)) {
        const isViewingInvitations =
          activeRail === "contact" ||
          isPopoverInvitation === true ||
          location.pathname === "/invitation";
        if (isViewingInvitations) {
          dispatch(onGetCountSentInvitation());
        }
      }

      if (!conversationId) return;

      const targetUserId = getTargetUserId(payload);
      if (!targetUserId) return;

      applyRelationState({
        relation: payload.status === "pending" ? "sent" : "none",
        invitationId: payload.invitationId || null,
        userId: targetUserId,
      });
    };

    const handleInvitationCreatedEvent = async (
      payload: InvitationReceived,
    ) => {
      if (isReceiver(payload)) await dispatch(onGetCountReceivedInvitation());

      if (!conversationId) return;
      if (!payload.senderId) return;

      applyRelationState({
        relation: payload.status === "pending" ? "received" : "add",
        invitationId: payload.invitationId || null,
        userId: payload.senderId,
      });
    };

    const handleInvitationCancelEvent = async (
      payload: InvitationActionSocket,
    ) => {
      await refreshInvitationCount(payload);

      if (!conversationId) return;

      const targetUserId = getTargetUserId(payload);
      if (!targetUserId) return;

      applyRelationState({
        relation: "add",
        invitationId: null,
        userId: targetUserId,
      });
    };

    const handleInvitationAcceptEvent = async (
      payload: InvitationActionSocket,
    ) => {
      await refreshInvitationCount(payload);

      await dispatch(onGetDataContact());
      if (!conversationId) return;

      const targetUserId = getTargetUserId(payload);
      if (!targetUserId) return;

      applyRelationState({
        relation: "none",
        invitationId: null,
        userId: targetUserId,
      });
    };

    const handleInvitationDeclineEvent = async (
      payload: InvitationActionSocket,
    ) => {
      await refreshInvitationCount(payload);

      if (!conversationId) return;

      const targetUserId = getTargetUserId(payload);
      if (!targetUserId) return;

      applyRelationState({
        relation: "add",
        invitationId: null,
        userId: targetUserId,
      });
    };

    const handleContactRemoveEvent = async (payload: ContactRemoveSocket) => {
      await dispatch(onGetDataContact());

      if (!conversationId) return;

      const targetUserId =
        payload.senderId === currentUserId
          ? payload.receiverId
          : payload.senderId;

      if (!targetUserId) return;

      applyRelationState({
        relation: "add",
        invitationId: null,
        userId: targetUserId,
      });
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

    const handleContactUpdateNickNameEvent = (
      payload: ContactUpdateNickNameSocket,
    ) => {
      if(activeRail !== "messages") {
        dispatch(onGetDataContact());
      }

      if(activeRail !== "messages") return;

      dispatch(
        updateNickNameUser({
          userId: payload.userId,
          nickname: payload.nickname,
        }),
      );

      dispatch(
        updateNickNameConversation({
          userId: payload.userId,
          nickname: payload.nickname,
        }),
      );
    };

    //Call Nhận Offer
    const handleCallOfferSuccessEvent = async (
      payload: CallOfferSuccessPayload,
    ) => {
      await dispatch(openIncomingCall(payload));
    };

    //Caller
    const handleCallInitiatedEvent = (payload: { callId: string }) => {
      console.log("Caller nhận được callId từ socket: ", payload);
      if (payload.callId) {
        dispatch(setCallInfo(payload.callId));
      }
    };

    const handleCallEndEvent = (payload: CallEndPayload) => {
      if (payload.shouldCloseUI) {
        // Hiển thị thông báo tương ứng dựa trên lý do kết thúc cuộc gọi
        if (payload.userIdWhoLeft !== currentUserId) {
          if (payload.reason === "rejected") {
            enqueueSnackbar("Đối phương đã từ chối cuộc gọi", {
              variant: "info",
            });
          } else if (payload.reason === "cancelled") {
            enqueueSnackbar("Cuộc gọi nhỡ", { variant: "warning" });
          } else {
            enqueueSnackbar("Cuộc gọi đã kết thúc", { variant: "info" });
          }
        }

        dispatch(closeIncomingCall());
        dispatch(clearCallInfo());
        dispatch(closeCallModal());
      }
    };

    const handleCallCandidateEvent = (payload: {
      candidate: RTCIceCandidate;
      conversationId: string;
    }) => {
      if (payload.candidate) {
        dispatch(addIceCandidate(payload.candidate));
      }
    };

    const handleBlock = (payload: {
      userId: string,
      isBlockedMe?: boolean,
      isBlockedByMe?: boolean
    }) => {
      
      if(payload) {
        dispatch(setBlockStatus({
          userId: payload.userId,
          isBlockedMe: payload.isBlockedMe,
          isBlockedByMe: payload.isBlockedByMe
        }))
      }
    }
    
    bindInvitationCreated(handleInvitationCreatedEvent);
    bindInvitationCancel(handleInvitationCancelEvent);
    bindInvitationAccept(handleInvitationAcceptEvent);
    bindInvitationDecline(handleInvitationDeclineEvent);
    bindInvitationSent(handleInvitationSentEvent);
    bindTypingMessageSuccess(handleTypingEvent);

    bindConversationReadSuccess(handleUpdateConversation);
    bindMessageNew(handleNewMessage);
    bindDeleteMessage(handleDeleteMessage);
    bindRevokeMessage(handleRevokeMessage);

    bindContactRemove(handleContactRemoveEvent);
    bindContactUpdateNickName(handleContactUpdateNickNameEvent);

    bindCallOfferSuccess(handleCallOfferSuccessEvent);
    bindCallInitiated(handleCallInitiatedEvent);
    bindCallEnd(handleCallEndEvent);
    bindCallCandidate(handleCallCandidateEvent);

    bindBlockUser(handleBlock)
    bindUnblockUser(handleBlock)

    return () => {
      unbindInvitationCreated(handleInvitationCreatedEvent);
      unbindInvitationCancel(handleInvitationCancelEvent);
      unbindInvitationAccept(handleInvitationAcceptEvent);
      unbindInvitationDecline(handleInvitationDeclineEvent);
      unbindInvitationSent(handleInvitationSentEvent);
      unbindTypingMessageSuccess(handleTypingEvent);

      unbindConversationReadSuccess(handleUpdateConversation);
      unbindMessageNew(handleNewMessage);
      unbindDeleteMessage(handleDeleteMessage);
      unbindRevokeMessage(handleRevokeMessage);

      unbindContactRemove(handleContactRemoveEvent);
      unbindContactUpdateNickName(handleContactUpdateNickNameEvent);

      unbindCallOfferSuccess(handleCallOfferSuccessEvent);
      unbindCallInitiated(handleCallInitiatedEvent);
      unbindCallEnd(handleCallEndEvent);
      unbindCallCandidate(handleCallCandidateEvent);

      unbindBlockUser(handleBlock);
      unbindUnblockUser(handleBlock);

      dispatch(setIsPopoverInvitationOpen(false)); // Tránh việc mở Popo sau đó đóng tab
    };
  }, [
    dispatch,
    currentUserId,
    conversationId,
    applyRelationState,
    currentUser,
    conversations,
  ]);

  useEffect(() => {
    if (!currentUser) return;

    const handleOnlineUsers = (users: OnlineUserSocket[]) => {
      dispatch(setOnlineUsers(users));

      if (!userData?.userId) return;

      const isUserOnline = users.some((u) => u.userId === userData.userId);

      dispatch(
        updateStatusUser({
          userId: userData.userId,
          isOnline: isUserOnline,
        }),
      );

      //Update conversation user online
      dispatch(
        updateStatusUsers({
          userId: userData.userId,
          isOnline: isUserOnline,
        }),
      );
    };

    const handlePresenceChanged = (payload: {
      userId: string;
      isOnline: boolean;
      lastSeenAt?: string | null;
      name: string;
      avatar: string;
    }) => {
      dispatch(
        updateStatusUser({
          userId: payload.userId,
          isOnline: payload.isOnline,
          lastSeenAt: payload.lastSeenAt,
        }),
      );

      dispatch(
        updateStatusUsers({
          userId: payload.userId,
          isOnline: payload.isOnline,
        }),
      );

      dispatch(
        updateUserPresence({
          userId: payload.userId,
          name: payload.name,
          avatar: payload.avatar,
          isOnline: payload.isOnline,
        }),
      );
    };

    bindOnlineUsers(handleOnlineUsers);
    bindUserPresenceChanged(handlePresenceChanged);

    return () => {
      unbindOnlineUsers(handleOnlineUsers);
      unbindUserPresenceChanged(handlePresenceChanged);
    };
  }, [dispatch, currentUser, userData?.userId]);

  useEffect(() => {
    const fetchSentInvitation = async () => {
      if (
        activeRail !== "contact" ||
        (location.pathname !== "/invitation" && isPopoverInvitation === false)
      )
        return;

      await dispatch(
        onGetListSentInvitation({
          pageSize: resolvedLimitSent,
          skip: 0,
        }),
      );
    };

    const fetchReceivedInvitation = async () => {
      if (
        activeRail !== "contact" ||
        (location.pathname !== "/invitation" && isPopoverInvitation === false)
      )
        return;

      await dispatch(
        onGetListFriendRequests({
          pageSize: resolvedLimit,
          skip: 0,
        }),
      );
    };

    const onReceived = async (payload: InvitationActionSocket) => {
      if (isReceiver(payload)) await fetchReceivedInvitation();
    };

    const onUpdateCancelAndUpdateAndDecline = async (
      payload: InvitationActionSocket,
    ) => {
      if (isSender(payload)) await fetchSentInvitation();

      if (isReceiver(payload)) await fetchReceivedInvitation();
    };

    const onSent = async (payload: InvitationActionSocket) => {
      if (isSender(payload)) await fetchSentInvitation();
    };

    bindInvitationCreated(onReceived);
    bindInvitationAccept(onUpdateCancelAndUpdateAndDecline);
    bindInvitationDecline(onUpdateCancelAndUpdateAndDecline);
    bindInvitationCancel(onUpdateCancelAndUpdateAndDecline);
    bindInvitationSent(onSent);

    return () => {
      unbindInvitationCreated(onReceived);
      unbindInvitationAccept(onUpdateCancelAndUpdateAndDecline);
      unbindInvitationDecline(onUpdateCancelAndUpdateAndDecline);
      unbindInvitationCancel(onUpdateCancelAndUpdateAndDecline);
      unbindInvitationSent(onSent);
    };
  }, [
    activeRail,
    resolvedLimit,
    resolvedLimitSent,
    dispatch,
    currentUserId,
    isPopoverInvitation,
    location.pathname,
  ]);

  const handleDeclineCall = async () => {
    try {
      if (incomingCall.callId) {
        await dispatch(onEndCallAction(incomingCall.callId));
      }
    } catch (error) {
      console.error("Lỗi khi từ chối cuộc gọi:", error);
    }
  };

  const handleAcceptCall = async () => {
    if (incomingCall.callId) {
      await dispatch(onAcceptCallAction(incomingCall.callId)).unwrap();
    }
  };

  return {
    ui: {
      incomingCall,
      isCallModalOpen,
      userData,
    },
    handler: {
      closeIncomingCall: () => dispatch(closeIncomingCall()),
      declineCall: handleDeclineCall,
      acceptCall: handleAcceptCall,
      closeCallModal: () => dispatch(closeCallModal()),
    },
  };
}

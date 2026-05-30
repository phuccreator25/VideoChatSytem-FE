import { useDispatch, useSelector } from "react-redux";
import type { RailKey } from "../../types/data.type";
import type { AppDispatch, RootState } from "../../redux/store";
import useApplyRelationState from "../../helpers/relationState.helper";
import { SelectcurrentUser } from "../../redux/auth.redux";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import type { InvitationActionSocket, InvitationReceived } from "../../types/Invitation";
import { useEffect } from "react";
import { connectSocket } from "../../socket/socket";
import { onGetCountReceivedInvitation, onGetCountSentInvitation, onGetListFriendRequests, onGetListSentInvitation, setIsPopoverInvitationOpen } from "../../redux/invitation.redux";
import type { ConversationReadPayload, MessageType } from "../../types/chat.type";
import { resetUnread, updateConversationByMessage, updateStatusUsers } from "../../redux/conversation.redux";
import { onGetDataContact } from "../../redux/contact.redux";
import type { ContactRemoveSocket } from "../../types/contact.type";
import { bindInvitationAccept, bindInvitationCancel, bindInvitationCreated, bindInvitationDecline, bindInvitationSent, unbindInvitationAccept, unbindInvitationCancel, unbindInvitationCreated, unbindInvitationDecline, unbindInvitationSent } from "../../socket/invitationSocket.socket";
import { bindConversationReadSuccess, bindMessageNew, unbindConversationReadSuccess, unbindMessageNew } from "../../socket/message.socket";
import { bindContactRemove, unbindContactRemove } from "../../socket/contactSocket.socket";
import { updateStatusUser } from "../../redux/chat.redux";
import { bindOnlineUsers, bindUserPresenceChanged, unbindOnlineUsers, unbindUserPresenceChanged } from "../../socket/authSocket.socket";

export default function useChatLayout(activeRail: RailKey) {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { applyRelationState } = useApplyRelationState();
  
  const isPopoverInvitation = useSelector((state: RootState) => state.invitation.isPopoverInvitationOpen);

  const currentUser = useSelector(SelectcurrentUser);
  const currentUserId = currentUser?._id || "";
  const { conversationId } = useParams();
  const userData = useSelector((state: RootState) => state.chat.userData); // DATA đang được chọn ở conversation

  const [searchParams] = useSearchParams();

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

  useEffect(() => {
    if (!currentUser) return;

    connectSocket();

    dispatch(onGetCountReceivedInvitation());

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
      dispatch(
        updateConversationByMessage({
          currentUserId,
          message: payload,
          openingConversationId: conversationId,
        }),
      );
    };

    const getTargetUserId = (payload: InvitationActionSocket) => {
      if (payload.senderId && payload.receiverId) {
        return isSender(payload) ? payload.receiverId : payload.senderId;
      }

      return payload.senderId || payload.receiverId || null;
    };

    const refreshInvitationCount = async (payload: InvitationActionSocket) => {
      if (isSender(payload)) {
        await dispatch(onGetCountSentInvitation());
        return;
      }

      if (isReceiver(payload)) await dispatch(onGetCountReceivedInvitation());
    };

    const handleInvitationSentEvent = (payload: InvitationActionSocket) => {
      if (isSender(payload)) dispatch(onGetCountSentInvitation());

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

    bindInvitationCreated(handleInvitationCreatedEvent);
    bindInvitationCancel(handleInvitationCancelEvent);
    bindInvitationAccept(handleInvitationAcceptEvent);
    bindInvitationDecline(handleInvitationDeclineEvent);
    bindInvitationSent(handleInvitationSentEvent);

    bindConversationReadSuccess(handleUpdateConversation);
    bindMessageNew(handleNewMessage);
    bindContactRemove(handleContactRemoveEvent);

    return () => {
      unbindInvitationCreated(handleInvitationCreatedEvent);
      unbindInvitationCancel(handleInvitationCancelEvent);
      unbindInvitationAccept(handleInvitationAcceptEvent);
      unbindInvitationDecline(handleInvitationDeclineEvent);
      unbindInvitationSent(handleInvitationSentEvent);

      unbindConversationReadSuccess(handleUpdateConversation);
      unbindMessageNew(handleNewMessage);
      unbindContactRemove(handleContactRemoveEvent);

      dispatch(setIsPopoverInvitationOpen(false)); // Tránh việc mở Popo sau đó đóng tab
    };
  }, [
    dispatch,
    currentUserId,
    conversationId,
    applyRelationState,
    currentUser,
  ]);

  useEffect(() => {
    if (!currentUser) return;

    const handleOnlineUsers = (userIds: string[]) => {
      if (!userData?.userId) return;

      const isUserOnline = userIds.includes(userData.userId);

      dispatch(
        updateStatusUser({
          userId: userData.userId,
          isOnline: isUserOnline,
        }),
      );

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
      if (activeRail !== "contact" || (location.pathname !== "/invitation" && isPopoverInvitation === false)) return;

      await dispatch(
        onGetListSentInvitation({
          pageSize: resolvedLimitSent,
          skip: 0,
        }),
      );
    };

    const fetchReceivedInvitation = async () => {
      if (activeRail !== "contact" || (location.pathname !== "/invitation" && isPopoverInvitation === false)) return;

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
  }, [activeRail, resolvedLimit, resolvedLimitSent, dispatch, currentUserId, isPopoverInvitation, location.pathname]);
}

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import type { RailKey } from "../../../types/layout/layout.navigation.type";
import type { AppDispatch, RootState } from "../../../redux/store";
import useApplyRelationState from "../../../helpers/relationState.helper";
import type {
  InvitationActionSocket,
  InvitationReceived,
} from "../../../types/invitation/invitation.socket.type";
import {
  onGetCountReceivedInvitation,
  onGetCountSentInvitation,
  onGetListFriendRequests,
  onGetListSentInvitation,
  setIsPopoverInvitationOpen,
} from "../../../redux/invitation.redux";
import { onGetDataContact } from "../../../redux/contact.redux";
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
} from "../../../socket/invitationSocket.socket";
import type { ProfileData } from "../../../types/data.type";

type UseInvitationSocketListenerProps = {
  activeRail: RailKey;
  currentUserId: string;
  conversationId?: string;
  currentUser: ProfileData;
};

export default function useInvitationSocketListener({
  activeRail,
  currentUserId,
  conversationId,
  currentUser,
}: UseInvitationSocketListenerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { applyRelationState } = useApplyRelationState();

  const isPopoverInvitation = useSelector(
    (state: RootState) => state.invitation.isPopoverInvitationOpen,
  );

  // Load more received
  const limitParam = Number(searchParams.get("resolvedLimit"));
  const resolvedLimit =
    Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 3;

  // Load more sent
  const limitSentParam = Number(searchParams.get("resolvedLimitSent"));
  const resolvedLimitSent =
    Number.isFinite(limitSentParam) && limitSentParam > 0 ? limitSentParam : 3;

  // Check sender and receiver
  const isSender = (payload: InvitationActionSocket) =>
    payload.senderId === currentUserId;

  const isReceiver = (payload: InvitationActionSocket) =>
    payload.receiverId === currentUserId;

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

  // Socket Listener #1: Event relation updates
  useEffect(() => {
    if (!currentUser) return;

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

    bindInvitationCreated(handleInvitationCreatedEvent);
    bindInvitationCancel(handleInvitationCancelEvent);
    bindInvitationAccept(handleInvitationAcceptEvent);
    bindInvitationDecline(handleInvitationDeclineEvent);
    bindInvitationSent(handleInvitationSentEvent);

    return () => {
      unbindInvitationCreated(handleInvitationCreatedEvent);
      unbindInvitationCancel(handleInvitationCancelEvent);
      unbindInvitationAccept(handleInvitationAcceptEvent);
      unbindInvitationDecline(handleInvitationDeclineEvent);
      unbindInvitationSent(handleInvitationSentEvent);

      dispatch(setIsPopoverInvitationOpen(false));
    };
  }, [
    dispatch,
    currentUserId,
    conversationId,
    applyRelationState,
    currentUser,
    activeRail,
    isPopoverInvitation,
    location.pathname,
  ]);

  // Socket Listener #2: Refresh list data when active on contact/invitation views
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
}

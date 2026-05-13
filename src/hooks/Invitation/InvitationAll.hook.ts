import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import InvitationsAPI from "../../api/Invitation.api";
import {
  onGetCountReceivedInvitation,
  onGetCountSentInvitation,
  onGetListFriendRequests,
  onGetListSentInvitation,
  setReceivedAllInvitations,
  setSentInvitations,
} from "../../redux/invitation.redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  bindInvitationAccept,
  bindInvitationCancel,
  bindInvitationCreated,
  bindInvitationDecline,
  unbindInvitationAccept,
  unbindInvitationCancel,
  unbindInvitationCreated,
  unbindInvitationDecline,
} from "../../socket/invitationSocket.socket";

export default function useInvitationAll({
  pageSize = 3,
}: {
  pageSize?: number;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const countReceived = useSelector(
    (state: RootState) => state.invitation.countReceived,
  );

  const countSent = useSelector(
    (state: RootState) => state.invitation.countSent,
  );

  const receivedAllInvitations = useSelector(
    (state: RootState) => state.invitation.receivedAllInvitations,
  );

  const sentInvitations = useSelector(
    (state: RootState) => state.invitation.sentInvitations,
  );

  const [loadingReceived, setLoadingReceived] = useState(false);
  const [loadingSent, setLoadingSent] = useState(false);

  const receivedSkip = useMemo(
    () => receivedAllInvitations.length,
    [receivedAllInvitations],
  );

  const sentSkip = useMemo(() => sentInvitations.length, [sentInvitations]);

  const hasMoreReceived = receivedAllInvitations.length < countReceived;
  const hasMoreSent = sentInvitations.length < countSent;

  const initializedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      try {
        setLoadingReceived(true);
        setLoadingSent(true);

        await Promise.all([
          dispatch(onGetCountSentInvitation()),
          dispatch(onGetListFriendRequests({ pageSize })),
          dispatch(onGetListSentInvitation({ pageSize })),
        ]);

        if (mounted) initializedRef.current = true;
      } finally {
        if (mounted) {
          setLoadingReceived(false);
          setLoadingSent(false);
        }
      }
    };

    fetchInitialData();
    return () => {
      mounted = false;
    };
  }, [dispatch, pageSize]);

  useEffect(() => {
    const onReceived = async () => {
      if (!initializedRef.current) return;
      await dispatch(onGetListFriendRequests({ pageSize }));
    };

    const onCancelled = async () => {
      if (!initializedRef.current) return;
      await dispatch(onGetListFriendRequests({ pageSize }));
    };

    const onAccepted = async () => {
      if (!initializedRef.current) return;
      await dispatch(onGetCountSentInvitation());
      await dispatch(onGetListSentInvitation({ pageSize }));
    };

    const onDeclined = async () => {
      if (!initializedRef.current) return;
      await dispatch(onGetCountSentInvitation());
      await dispatch(onGetListSentInvitation({ pageSize }));
    };

    bindInvitationCreated(onReceived);
    bindInvitationAccept(onAccepted);
    bindInvitationDecline(onDeclined);
    bindInvitationCancel(onCancelled);
    return () => {
      unbindInvitationCreated(onReceived);
      unbindInvitationAccept(onAccepted);
      unbindInvitationDecline(onDeclined);
      unbindInvitationCancel(onCancelled);
    };
  }, [dispatch, pageSize]);

  const handleLoadMoreReceived = async () => {
    if (loadingReceived || !hasMoreReceived) return;

    try {
      setLoadingReceived(true);

      const res = await InvitationsAPI.onGetFriendRequest({
        limit: pageSize,
        skip: receivedSkip,
      });

      const newItems = res?.data?.data || [];

      if (newItems.length > 0) {
        dispatch(
          setReceivedAllInvitations([...receivedAllInvitations, ...newItems]),
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingReceived(false);
    }
  };

  const handleLoadMoreSent = async () => {
    if (loadingSent || !hasMoreSent) return;

    try {
      setLoadingSent(true);
      console.log("2");

      const res = await InvitationsAPI.onGetSentInvitation({
        limit: pageSize,
        skip: sentSkip,
      });

      const newItems = res?.data?.data || [];

      if (newItems.length > 0) {
        dispatch(setSentInvitations([...sentInvitations, ...newItems]));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSent(false);
    }
  };

  return {
    receivedAllInvitations,
    sentInvitations,
    loadingReceived,
    loadingSent,
    hasMoreReceived,
    hasMoreSent,
    countReceived,
    countSent,
    handleLoadMoreReceived,
    handleLoadMoreSent,
  };
}

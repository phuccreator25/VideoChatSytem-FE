import { useEffect, useMemo, useState } from "react";
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

export default function useInvitationAll({
  pageSize = 3,
}: {
  pageSize?: number;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const countReceived = useSelector(
    (state: RootState) => state.invitation.countReceived
  );

  const countSent = useSelector(
    (state: RootState) => state.invitation.countSent
  );

  const receivedAllInvitations = useSelector(
    (state: RootState) => state.invitation.receivedAllInvitations
  );

  const sentInvitations = useSelector(
    (state: RootState) => state.invitation.sentInvitations
  );

  const [loadingReceived, setLoadingReceived] = useState(false);
  const [loadingSent, setLoadingSent] = useState(false);

  const receivedSkip = useMemo(
    () => receivedAllInvitations.length,
    [receivedAllInvitations]
  );

  const sentSkip = useMemo(
    () => sentInvitations.length,
    [sentInvitations]
  );

  const hasMoreReceived = receivedAllInvitations.length < countReceived;
  const hasMoreSent = sentInvitations.length < countSent;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingReceived(true);
        setLoadingSent(true);
        console.log('okokok 2');
        
        await Promise.all([
          dispatch(onGetCountReceivedInvitation()),
          dispatch(onGetCountSentInvitation()),
          dispatch(onGetListFriendRequests({ pageSize })),
          dispatch(onGetListSentInvitation({ pageSize })),
        ]);
      } finally {
        setLoadingReceived(false);
        setLoadingSent(false);
      }
    };

    fetchInitialData();
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
          setReceivedAllInvitations([
            ...receivedAllInvitations,
            ...newItems,
          ])
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

      const res = await InvitationsAPI.onGetSentInvitation({
        limit: pageSize,
        skip: sentSkip,
      });

      const newItems = res?.data?.data || [];

      if (newItems.length > 0) {
        dispatch(
          setSentInvitations([
            ...sentInvitations,
            ...newItems,
          ])
        );
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
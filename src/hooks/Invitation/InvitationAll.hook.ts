import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  onGetCountReceivedInvitation,
  onGetCountSentInvitation,
  onGetListFriendRequests,
  onGetListSentInvitation,
  setReceivedAllInvitations,
  setSentInvitations,
} from "../../redux/invitation.redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { useSearchParams } from "react-router-dom";

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

  const [searchParams, setSearchParams] = useSearchParams();

  const invitationTab = searchParams.get("invitationTab");

  //Load more received
  const limitParam = Number(searchParams.get("resolvedLimit"));
  const resolvedLimit =
    Number.isFinite(limitParam) && limitParam > 0 ? limitParam : pageSize;

  //Load more sent
  const limitSentParam = Number(searchParams.get("resolvedLimitSent"));
  const resolvedLimitSent =
    Number.isFinite(limitSentParam) && limitSentParam > 0
      ? limitSentParam
      : pageSize;

  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      try {
        setLoadingReceived(true);
        setLoadingSent(true);

        await Promise.all([
          dispatch(onGetCountSentInvitation()),
          dispatch(onGetCountReceivedInvitation()),
          dispatch(
            onGetListFriendRequests({
              pageSize: invitationTab === "received" ? resolvedLimit : pageSize,
              skip: 0,
            }),
          ),
          dispatch(
            onGetListSentInvitation({
              pageSize: invitationTab === "sent" ? resolvedLimitSent : pageSize,
              skip: 0,
            }),
          ),
        ]);

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
  }, [dispatch, pageSize, invitationTab, resolvedLimit, resolvedLimitSent]);

  const handleLoadMoreReceived = async () => {
    if (loadingReceived || !hasMoreReceived) return;

    try {
      setLoadingReceived(true);

      const res = await dispatch(
        onGetListFriendRequests({
          pageSize,
          skip: receivedSkip,
        }),
      ).unwrap();

      const newItems = res || [];

      if (newItems.length > 0) {
        dispatch(
          setReceivedAllInvitations([...receivedAllInvitations, ...newItems]),
        );
      }

      const nextSkip = receivedSkip + newItems.length;

      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("invitationTab", "received");
        next.set("resolvedLimit", String(nextSkip));
        return next;
      });
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

      const res = await dispatch(
        onGetListSentInvitation({
          pageSize,
          skip: sentSkip,
        }),
      ).unwrap();

      const newItems = res || [];

      if (newItems.length > 0) {
        dispatch(setSentInvitations([...sentInvitations, ...newItems]));
      }

      const nextSkip = sentSkip + newItems.length;

      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("invitationTab", "sent");
        next.set("resolvedLimitSent", String(nextSkip));
        return next;
      });
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

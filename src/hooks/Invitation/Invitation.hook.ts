import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import type {
  AddContactDataHook,
  HandleQuickActionParams,
  InvitationQuickAction,
  invitationSeachResult,
  UserOption,
} from "../../types/Invitation";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  clearInvitationActionStatus,
  onAcceptInvitation,
  onAddContact,
  onCancelSentInvitation,
  onDeclineInvitation,
  onGetCountSentInvitation,
  onGetListFriendRequests,
  onGetListSentInvitation,
  setInvitationActionStatus,
  setIsPopoverInvitationOpen,
} from "../../redux/invitation.redux";
import userApi from "../../api/User.api";
import {
  updateContactRelation,
  updateInvitationId,
} from "../../redux/chat.redux";

function useInvitation() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const location = useLocation();

  const receivedInvitations = useSelector(
    (state: RootState) => state.invitation.receivedAllInvitations,
  ).slice(0, 3);

  const sentInvitations = useSelector(
    (state: RootState) => state.invitation.sentInvitations,
  ).slice(0, 3);

  const openPopover = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();

  const invitationTab = searchParams.get("invitationTab");

  //Load more received
  const limitParam = Number(searchParams.get("resolvedLimit"));
  const skipParam = Number(searchParams.get("receivedSkip"));
  const resolvedLimit =
    Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 3;
  const resolvedSkip =
    Number.isFinite(skipParam) && skipParam >= 0 ? skipParam : 0;

  //Load more sent
  const limitSentParam = Number(searchParams.get("resolvedLimitSent"));
  const skipSentParam = Number(searchParams.get("resolvedSkipSent"));
  const resolvedLimitSent =
    Number.isFinite(limitSentParam) && limitSentParam > 0 ? limitSentParam : 3;
  const resolvedSkipSent =
    Number.isFinite(skipSentParam) && skipSentParam >= 0 ? skipSentParam : 0;

  useEffect(() => {
    const fetchInitialData = async () => {
      if (
        !openPopover ||
        (receivedInvitations.length > 0 && sentInvitations.length > 0)
      )
        return;

      await Promise.all([
        dispatch(onGetCountSentInvitation()),
        dispatch(
          onGetListFriendRequests({
            pageSize: invitationTab === "received" ? resolvedLimit : 3, // lấy từ URL để tránh ảnh hưởng khi mở cùng lúc với InvitationAll
            skip: invitationTab === "received" ? resolvedSkip : 0,
          }),
        ),
        dispatch(
          onGetListSentInvitation({
            pageSize: invitationTab === "sent" ? resolvedLimitSent : 3,
            skip: invitationTab === "sent" ? resolvedSkipSent : 0,
          }),
        ),
      ]);
    };

    fetchInitialData();
  }, [
    dispatch,
    openPopover,
    invitationTab,
    resolvedLimit,
    resolvedSkip,
    resolvedLimitSent,
    resolvedSkipSent,
  ]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenInvitationPopover = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setAnchorEl(event.currentTarget);
    dispatch(setIsPopoverInvitationOpen(true));
  };

  const handleCloseInvitationPopover = () => {
    setAnchorEl(null);
    dispatch(setIsPopoverInvitationOpen(false));
  };

  const handleOpenAddContactModal = () => {
    handleCloseInvitationPopover();
    handleOpenModal();
  };

  const onHandleAddContact = async (payload: AddContactDataHook) => {
    try {
      if (!payload?.userId) return false;

      const res = await dispatch(onAddContact(payload)).unwrap();

      if (res) {
        enqueueSnackbar("Đã gửi lời mời kết bạn thành công", {
          variant: "success",
        });

        await dispatch(
          updateContactRelation({ userId: payload.userId, relation: "sent" }),
        );
        await dispatch(
          updateInvitationId({
            userId: payload.userId,
            invitationId: res.invitationId,
          }),
        );
        handleCloseModal();
        return true;
      }

      return false;
    } catch (error: any) {
      console.log("ERROR ADD CONTACT:", error?.message);

      enqueueSnackbar(
        error?.response?.data?.message || "Gửi lời mời kết bạn thất bại",
        {
          variant: "error",
        },
      );

      return false;
    }
  };

  const handleViewAllRequests = async () => {
    navigate("/invitation");
    handleCloseInvitationPopover();
  };

  const handleRemoveReceivedInvitation = async (id: string) => {
    dispatch(clearInvitationActionStatus(id));
  };

  const handleRemoveSentInvitation = async (id: string) => {
    dispatch(clearInvitationActionStatus(id));
  };

  const getTimeAgo = (dateString: string) => {
    const now = Date.now();
    const sentTime = new Date(dateString).getTime();
    const diffMs = now - sentTime;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (seconds < 10) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleSearchUser = async (searchValue: string) => {
    const res = await userApi.onSearchUser(searchValue);
    console.log("res?.data?.data: ", res?.data?.data);

    const mappedOptions: UserOption[] = (res?.data?.data || []).map(
      (item: invitationSeachResult) => ({
        id: item._id,
        fullname: item.fullname,
        email: item.email,
        avatar: item.avatar || "",
        statusInvitation: item.relationStatus || "none",
        invitationId: item.invitationId,
      }),
    );

    return mappedOptions;
  };

  const handleQuickAction = async (
    action: InvitationQuickAction,
    { event, option, onUpdateOptionStatus }: HandleQuickActionParams,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!option.invitationId) {
      console.error("Missing invitationId", option);
      return;
    }

    try {
      setActionLoadingId(option.invitationId);

      if (action === "accept") {
        const result = await dispatch(
          onAcceptInvitation(option.invitationId),
        ).unwrap();

        if (result) {
          if (location.pathname === "/invitation") {
            await dispatch(
              setInvitationActionStatus({
                id: option.invitationId,
                status: "accepted",
              }),
            );

            setTimeout(() => {
              handleRemoveReceivedInvitation(option.invitationId);
            }, 700);
          }

          onUpdateOptionStatus?.(option.invitationId, "accepted");
          await dispatch(
            updateContactRelation({ userId: option.id, relation: "none" }),
          );

          enqueueSnackbar("Đã chấp nhận lời mời thành công", {
            variant: "success",
          });
        }

        return;
      }

      if (action === "decline") {
        const result = await dispatch(
          onDeclineInvitation(option.invitationId),
        ).unwrap();

        if (result) {
          if (location.pathname === "/invitation") {
            await dispatch(
              setInvitationActionStatus({
                id: option.invitationId,
                status: "declined",
              }),
            );

            setTimeout(() => {
              handleRemoveReceivedInvitation(option.invitationId);
            }, 700);
          }

          onUpdateOptionStatus?.(option.invitationId, "none");
          await dispatch(
            updateContactRelation({ userId: option.id, relation: "add" }),
          );

          enqueueSnackbar("Đã từ chối lời mời thành công", {
            variant: "success",
          });
        }

        return;
      }

      if (action === "cancel") {
        const result = await dispatch(
          onCancelSentInvitation(option.invitationId),
        ).unwrap();

        if (result) {
          if (location.pathname === "/invitation") {
            await dispatch(
              setInvitationActionStatus({
                id: option.invitationId,
                status: "cancelled",
              }),
            );

            setTimeout(() => {
              handleRemoveSentInvitation(option.invitationId);
            }, 700);
          }

          onUpdateOptionStatus?.(option.invitationId, "none");
          await dispatch(
            updateContactRelation({ userId: option.id, relation: "add" }),
          );

          enqueueSnackbar("Đã thu hồi lời mời thành công", {
            variant: "success",
          });
        }
      }
    } catch (error) {
      console.error("Invitation action failed:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  return {
    data: {
      receivedInvitations,
      sentInvitations,
    },
    ui: {
      openModal,
      anchorEl,
      openPopover,
      actionLoadingId,
    },
    helpers: {
      getTimeAgo,
    },
    handlers: {
      setActionLoadingId,

      handleOpenModal,
      handleCloseModal,

      handleOpenInvitationPopover,
      handleCloseInvitationPopover,

      handleOpenAddContactModal,
      handleViewAllRequests,

      onHandleAddContact,

      handleRemoveReceivedInvitation,
      handleRemoveSentInvitation,

      handleSearchUser,
      handleQuickAction,
    },
  };
}

export default useInvitation;

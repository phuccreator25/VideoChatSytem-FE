import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import type {
  AddContactDataHook,
  HandleQuickActionParams,
  invitationSeachResult,
  UserOption,
} from "../../types/invitation/invitation.form.type";
import type { InvitationQuickAction } from "../../types/invitation/invitation.model.type";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  clearInvitationActionStatus,
  onGetCountSentInvitation,
  onGetListFriendRequests,
  onGetListSentInvitation,
  setIsPopoverInvitationOpen,
} from "../../redux/invitation.redux";
import userApi from "../../api/User.api";
import useInvitationAction from "../../helpers/InvitationAction.helper";

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

  const {
    onHandleAcceptInvitation,
    onHandleDeclineInvitation,
    onHandleCancelInvitation,
    onHandleAddInvitation,
  } = useInvitationAction();

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

  //Thao tác nhanh trong khi search
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
        await onHandleAcceptInvitation(option.invitationId, option.id, {
          TimeClear: location.pathname === "/invitation" ? 700 : null,
          onUpdateOptionStatus,
        });
      }

      if (action === "decline") {
        await onHandleDeclineInvitation(option.invitationId, option.id, {
          TimeClear: location.pathname === "/invitation" ? 700 : null,
          onUpdateOptionStatus,
        });
      }

      if (action === "cancel") {
        await onHandleCancelInvitation(option.invitationId, option.id, {
          TimeClear: location.pathname === "/invitation" ? 700 : null,
          onUpdateOptionStatus,
        });
      }
    } catch (error) {
      console.error("Invitation action failed:", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const onHandleAddContact = async (payload: AddContactDataHook) => {
    try {
      if (!payload?.userId) return false;

      const res = await onHandleAddInvitation(
        payload.userId,
        payload.invitationMessage || "",
      );

      if (res) handleCloseModal();

      return res;
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

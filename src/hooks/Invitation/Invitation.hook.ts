import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import InvitationsAPI from "../../api/Invitation.api";
import type {
  AddContactDataHook,
  HandleQuickActionParams,
  InvitationItem,
  InvitationQuickAction,
  SentInvitationItem,
  UserOption,
} from "../../types/Invitation";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import {
  clearInvitationActionStatus,
  onAcceptInvitation,
  onCancelSentInvitation,
  onDeclineInvitation,
  onGetCountReceivedInvitation,
  onGetCountSentInvitation,
  onGetListFriendRequests,
  onGetListSentInvitation,
  setInvitationActionStatus,
} from "../../redux/invitation.redux";
import userApi from "../../api/User.api";
import { onGetDataContact } from "../../redux/contact.redux";

function useInvitation() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const location = useLocation();

  const [receivedInvitations, setReceivedInvitations] = useState<
    InvitationItem[]
  >([]);

  const [sentInvitations, setSentInvitations] = useState<SentInvitationItem[]>(
    [],
  );

  const openPopover = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

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
  };

  const handleCloseInvitationPopover = () => {
    setAnchorEl(null);
  };

  const handleOpenAddContactModal = () => {
    handleCloseInvitationPopover();
    handleOpenModal();
  };

  const onHandleAddContact = async (payload: AddContactDataHook) => {
    try {
      if (!payload?.userId) return false;

      const res = await InvitationsAPI.onAddContacts(payload);

      if (res?.data) {
        enqueueSnackbar("Đã gửi lời mời kết bạn thành công", {
          variant: "success",
        });

        if (location.pathname === "/invitation") {
          await dispatch(onGetListSentInvitation({ pageSize: 3 }));
        }
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

  const refreshPopoverReceivedInvitations = async () => {
    const friendRes = await InvitationsAPI.onGetFriendRequest({
      limit: 3,
      skip: 0,
    });

    setReceivedInvitations(friendRes.data.data || []);
  };

  const refreshPopoverSentInvitations = async () => {
    const sentRes = await InvitationsAPI.onGetSentInvitation({
      limit: 3,
      skip: 0,
    });

    setSentInvitations(sentRes.data.data || []);
  };

  useEffect(() => {
    if (!anchorEl) return;

    const fetchInvitationData = async () => {
      await Promise.all([
        refreshPopoverReceivedInvitations(),
        refreshPopoverSentInvitations(),
      ]);
    };

    fetchInvitationData();
  }, [anchorEl]);

  const handleViewAllRequests = async () => {
    navigate("/invitation");
    handleCloseInvitationPopover();
  };

  const handleRemoveReceivedInvitation = async (id: string) => {
    if (location.pathname === "/invitation") {
      await dispatch(onGetListFriendRequests({}));
    }
    if (openPopover) {
      await refreshPopoverReceivedInvitations();
    }
    await dispatch(onGetCountReceivedInvitation());
    dispatch(clearInvitationActionStatus(id));
  };

  const handleRemoveSentInvitation = async (id: string) => {
    if (location.pathname === "/invitation") {
      await dispatch(onGetListSentInvitation({}));
    }
    if (openPopover) {
      await refreshPopoverSentInvitations();
    }
    await dispatch(onGetCountSentInvitation());
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
      (item: any) => ({
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

            await dispatch(onGetDataContact());

            setTimeout(() => {
              handleRemoveReceivedInvitation(option.invitationId);
            }, 700);
          }

          onUpdateOptionStatus?.(option.invitationId, "accepted");

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
      setSentInvitations,
      setReceivedInvitations,
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

      refreshPopoverReceivedInvitations,
      refreshPopoverSentInvitations,

      handleSearchUser,
      handleQuickAction,
    },
  };
}

export default useInvitation;

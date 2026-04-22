import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import InvitationsAPI from "../../api/Invitation.api";
import type {
  AddContactDataHook,
  InvitationItem,
  SentInvitationItem,
} from "../../types/Invitation";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import {
  clearInvitationActionStatus,
  onGetCountReceivedInvitation,
  onGetCountSentInvitation,
  onGetListFriendRequests,
  onGetListSentInvitation,
} from "../../redux/invitation.redux";

function useInvitation() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [receivedInvitations, setReceivedInvitations] = useState<
    InvitationItem[]
  >([]);

  const [sentInvitations, setSentInvitations] = useState<SentInvitationItem[]>(
    []
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
    event: React.MouseEvent<HTMLElement>
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

        dispatch(onGetListSentInvitation({ pageSize: 3 }));
        await refreshPopoverSentInvitations();
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
        }
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
    await dispatch(onGetListFriendRequests({}));
    await refreshPopoverReceivedInvitations();
    await dispatch(onGetCountReceivedInvitation());
    dispatch(clearInvitationActionStatus(id));
  };

  const handleRemoveSentInvitation = async (id: string) => {
    await dispatch(onGetListSentInvitation({}));
    await refreshPopoverSentInvitations();
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

  return {
    data: {
      receivedInvitations,
      sentInvitations,
    },
    ui: {
      openModal,
      anchorEl,
      openPopover,
    },
    helpers: {
      getTimeAgo,
    },
    handlers: {
      setSentInvitations,
      setReceivedInvitations,

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
      refreshPopoverSentInvitations
    },
  };
}

export default useInvitation;
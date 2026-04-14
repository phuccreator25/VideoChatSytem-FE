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
import { clearInvitationActionStatus, onGetCountReceivedInvitation, onGetListSentInvitation, removeReceivedInvitation, removeSentInvitation } from "../../redux/invitation.redux";

function useInvitation() {
  const [openModal, setOpenModal] = useState<boolean>(false);

  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [receivedInvitations, setReceivedInvitations] = useState<
    InvitationItem[]
  >([]);

  const [sentInvitations, setSentInvitations] = useState<SentInvitationItem[]>(
    [],
  );

  const openPopover = Boolean(anchorEl);
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

 

  //Modal invitation
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  //Popover invitation
  const handleOpenInvitationPopover = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseInvitationPopover = () => {
    setAnchorEl(null);
  };

  //Handle
  const handleAcceptInvitation = async (id: string) => {
    try {
      const res = await InvitationsAPI.onAcceptInvitation({ id });
      return res.status === 200;
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Vui lòng thử lại", {
        variant: "error",
      });
      return false;
    }
  };

  const handleDeclineInvitation = async (id: string) => {
    try {
      const res = await InvitationsAPI.onDeclineInvitation({ id });
      return res.status === 200;
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Vui lòng thử lại", {
        variant: "error",
      });
      return false;
    }
  };

  const handleCancelSentInvitation = async (id: string) => {
    try {
      const res = await InvitationsAPI.onCancelSentInvitation({ id });
      return res.status === 200;
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Vui lòng thử lại", {
        variant: "error",
      });
      return false;
    }
  };

  const handleOpenAddContactModal = () => {
    handleCloseInvitationPopover();
    handleOpenModal();
  };

  const onHandleAddContact = async (payload: AddContactDataHook) => {
    try {
      if (!payload?.userId) return;

      const res = await InvitationsAPI.onAddContacts(payload);

      if (res?.data) {
        enqueueSnackbar("Đã gửi lời mời kết bạn thành công", {
          variant: "success",
        });
        dispatch(onGetListSentInvitation({pageSize: 3}))

        handleCloseModal();
      }
    } catch (error: any) {
      console.log("ERROR ADD CONTACT:", error?.message);

      enqueueSnackbar(
        error?.response?.data?.message || "Gửi lời mời kết bạn thất bại",
        {
          variant: "error",
        },
      );
    }
  };

  //Fetch Data API
  useEffect(() => {
    if (!anchorEl) return;

    const fetchInvitationData = async () => {
      const [friendRes, sentRes] = await Promise.all([
        InvitationsAPI.onGetFriendRequest({ limit: 3, skip: 0 }),
        InvitationsAPI.onGetSentInvitation({ limit: 3, skip: 0 }),
      ]);

      setReceivedInvitations(friendRes.data.data || []);
      setSentInvitations(sentRes.data.data || []);
    };

    fetchInvitationData();
  }, [anchorEl]);

  // OverView Invitation
  const handleViewAllRequests = async () => {
    navigate("/invitation");
    handleCloseInvitationPopover();
  };

  //Remove invitation When success

  const handleRemoveReceivedInvitation = (id: string) => {
    dispatch(removeReceivedInvitation(id));
    dispatch(clearInvitationActionStatus(id));
    dispatch(onGetCountReceivedInvitation())
  };

  const handleRemoveSentInvitation = (id: string) => {
    dispatch(removeSentInvitation(id));
    dispatch(clearInvitationActionStatus(id));
  };

  //Chuyển fortmat thời gian
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
    openModal,
    anchorEl,
    openPopover,
    receivedInvitations,
    sentInvitations,
    setSentInvitations,
    setReceivedInvitations,
    getTimeAgo,

    handleOpenModal,
    handleCloseModal,

    handleOpenInvitationPopover,
    handleCloseInvitationPopover,

    handleAcceptInvitation,
    handleDeclineInvitation,
    handleCancelSentInvitation,

    handleOpenAddContactModal,
    handleViewAllRequests,

    onHandleAddContact,

    handleRemoveReceivedInvitation,
    handleRemoveSentInvitation

  };
}

export default useInvitation;

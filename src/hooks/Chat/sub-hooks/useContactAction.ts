import { useState } from "react";
import useInvitationAction from "../../../helpers/InvitationAction.helper";
import type { ConversationUserInfo } from "../../../types/chat/chat.conversation.type";
import type { ProfileData } from "../../../types/data.type";

type ContactAction = "add" | "accept" | "decline" | "cancel";

export const useContactAction = ({
  userData,
  currentUser,
}: {
  userData: ConversationUserInfo | null;
  currentUser: ProfileData | null;
}) => {
  const [openAddContactModal, setOpenAddContactModal] = useState(false);
  const [invitationMessage, setInvitationMessage] = useState("");
  const [addContactSubmitting, setAddContactSubmitting] = useState(false);
  const [loadingAction, setLoadingAction] = useState<ContactAction | null>(
    null,
  );

  const {
    onHandleAcceptInvitation,
    onHandleDeclineInvitation,
    onHandleCancelInvitation,
    onHandleAddInvitation,
  } = useInvitationAction();

  const handleCancelInvitation = async () => {
    try {
      if (!userData?.invitationId) return;

      setLoadingAction("cancel");

      await onHandleCancelInvitation(userData.invitationId, userData?.userId);
    } catch (error) {
      console.log("Error occurred while canceling invitation:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeclineInvitation = async () => {
    try {
      if (!userData?.invitationId) return;

      setLoadingAction("decline");

      await onHandleDeclineInvitation(userData.invitationId, userData.userId);
    } catch (error) {
      console.log("Error occurred while declining invitation:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAcceptInvitation = async () => {
    try {
      if (!userData?.invitationId || !userData?.userId) return;

      setLoadingAction("accept");

      await onHandleAcceptInvitation(userData.invitationId, userData.userId);
    } catch (error) {
      console.log("Error occurred while accepting invitation:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleOpenAddContactModal = () => {
    if (!userData?.userId) return;

    const defaultMessage = `Xin chào, tôi là ${currentUser?.fullname ?? ""}`;

    setInvitationMessage(defaultMessage);
    setOpenAddContactModal(true);
  };

  const handleCloseAddContactModal = () => {
    setOpenAddContactModal(false);
    setInvitationMessage("");
  };

  const handleSubmitAddContact = async () => {
    if (!userData?.userId) return;

    try {
      setAddContactSubmitting(true);

      const res = await onHandleAddInvitation(
        userData.userId,
        invitationMessage.trim(),
      );

      if (res) handleCloseAddContactModal();
    } finally {
      setAddContactSubmitting(false);
    }
  };

  return {
    openAddContactModal,
    invitationMessage,
    addContactSubmitting,
    loadingAction,
    setInvitationMessage,
    handleCancelInvitation,
    handleDeclineInvitation,
    handleAcceptInvitation,
    handleOpenAddContactModal,
    handleCloseAddContactModal,
    handleSubmitAddContact,
  };
};

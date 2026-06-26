import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import {
  clearInvitationActionStatus,
  onAcceptInvitation,
  onAddContact,
  onCancelSentInvitation,
  onDeclineInvitation,
  setInvitationActionStatus,
} from "../redux/invitation.redux";
import useApplyRelationState from "./relationState.helper";
import { enqueueSnackbar } from "notistack";
import { updateContactRelation, updateInvitationId } from "../redux/chat.redux";

type AcceptInvitationOptions = {
  showSuccessToast?: boolean;
  onUpdateOptionStatus?: (
    invitationId: string,
    nextStatus: "accepted" | "none",
  ) => void;
  TimeClear?: number | null;
};

type DeclineInvitationOptions = {
  showSuccessToast?: boolean;
  onUpdateOptionStatus?: (invitationId: string, nextStatus: "none") => void;
  TimeClear?: number | null;
};

type CancelInvitationOptions = {
  showSuccessToast?: boolean;
  onUpdateOptionStatus?: (invitationId: string, nextStatus: "none") => void;
  TimeClear?: number | null;
};

export default function useInvitationAction() {
  const dispatch = useDispatch<AppDispatch>();
  const { applyRelationState } = useApplyRelationState();

  const onHandleAcceptInvitation = async (
    invitationId: string,
    targetUserId?: string,
    options: AcceptInvitationOptions = {},
  ) => {
    const {
      TimeClear = null,
      showSuccessToast = true,
      onUpdateOptionStatus,
    } = options;

    if (!invitationId) return false;

    try {
      const res = await dispatch(onAcceptInvitation(invitationId)).unwrap();
      if (!res) return false;

      await dispatch(
        setInvitationActionStatus({
          id: invitationId,
          status: "accepted",
        }),
      );

      if (targetUserId) {
        await applyRelationState({
          userId: targetUserId,
          relation: "none",
          invitationId: null,
        });
      }

      onUpdateOptionStatus?.(invitationId, "accepted");

      if (TimeClear) {
        window.setTimeout(() => {
          dispatch(clearInvitationActionStatus(invitationId));
        }, TimeClear);
      }

      if (showSuccessToast) {
        enqueueSnackbar("Đã chấp nhận lời mời thành công", {
          variant: "success",
        });
      }

      return true;
    } catch (error: any) {
      enqueueSnackbar(
        error?.response?.data?.message || "Chấp nhận lời mời thất bại",
        { variant: "error" },
      );

      return false;
    }
  };

  const onHandleDeclineInvitation = async (
    invitationId: string,
    targetUserId?: string,
    options: DeclineInvitationOptions = {},
  ) => {
    const {
      TimeClear = null,
      showSuccessToast = true,
      onUpdateOptionStatus,
    } = options;

    if (!invitationId) return false;

    try {
      const res = await dispatch(onDeclineInvitation(invitationId)).unwrap();
      if (!res) return false;

      await dispatch(
        setInvitationActionStatus({
          id: invitationId,
          status: "declined",
        }),
      );

      if (targetUserId) {
        await applyRelationState({
          userId: targetUserId,
          relation: "add",
          invitationId: null,
        });
      }

      onUpdateOptionStatus?.(invitationId, "none");

      if (TimeClear) {
        window.setTimeout(() => {
          dispatch(clearInvitationActionStatus(invitationId));
        }, TimeClear);
      }

      if (showSuccessToast) {
        enqueueSnackbar("Từ chối lời mời thành công", {
          variant: "success",
        });
      }

      return true;
    } catch (error: any) {
      enqueueSnackbar(
        error?.response?.data?.message || "Từ chối lời mời thất bại",
        { variant: "error" },
      );

      return false;
    }
  };

  const onHandleCancelInvitation = async (
    invitationId: string,
    targetUserId?: string,
    option: CancelInvitationOptions = {},
  ) => {
    const { TimeClear = null, showSuccessToast = true, onUpdateOptionStatus } = option;

    if (!invitationId) return false;

    try {
      const res = await dispatch(onCancelSentInvitation(invitationId)).unwrap();
      if (!res) return false;

      await dispatch(
        setInvitationActionStatus({
          id: invitationId,
          status: "cancelled",
        }),
      );

      if (targetUserId) {
        await applyRelationState({
          userId: targetUserId,
          relation: "add",
          invitationId: null,
        });
      }

      onUpdateOptionStatus?.(invitationId, "none");

      if (TimeClear) {
        window.setTimeout(() => {
          dispatch(clearInvitationActionStatus(invitationId));
        }, TimeClear);
      }

      if (showSuccessToast) {
        enqueueSnackbar("Đã thu hồi lời mời thành công", {
          variant: "success",
        });
      }

      return true;
    } catch (error: any) {
      enqueueSnackbar(
        error?.response?.data?.message || "Thu hồi lời mời thất bại",
        { variant: "error" },
      );

      return false;
    }
  };

  const onHandleAddInvitation = async (targetUserId: string, invitationMessage: string | undefined) => {

    if (!targetUserId) return false

    try {
      const res = await dispatch(onAddContact({ userId: targetUserId, invitationMessage })).unwrap();

      if (!res) return false

      await dispatch(
        updateContactRelation({ userId: targetUserId, relation: "sent" }),
      );

      await dispatch(
        updateInvitationId({
          userId: targetUserId,
          invitationId: res.invitationId,
        }),
      );

      enqueueSnackbar("Đã gửi lời mời thành công", {
          variant: "success",
        });

      return true
    } catch (error: any) {
      enqueueSnackbar(
        error?.response?.data?.message || "Gửi lời mời thất bại",
        { variant: "error" },
      );

      return false;
    }
  };

  return {
    onHandleAcceptInvitation,
    onHandleDeclineInvitation,
    onHandleCancelInvitation,
    onHandleAddInvitation
  };
}

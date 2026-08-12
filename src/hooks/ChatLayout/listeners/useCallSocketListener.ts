import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import type { AppDispatch, RootState } from "../../../redux/store";
import {
  closeIncomingCall,
  openIncomingCall,
  setCallInfo,
  onEndCallAction,
  clearCallInfo,
  closeCallModal,
  onAcceptCallAction,
  addIceCandidate,
} from "../../../redux/call.redux";
import {
  bindCallEnd,
  bindCallInitiated,
  bindCallOfferSuccess,
  unbindCallEnd,
  unbindCallInitiated,
  unbindCallOfferSuccess,
  bindCallCandidate,
  unbindCallCandidate,
} from "../../../socket/callSocket.socket";
import type { CallEndPayload } from "../../../types/call/call.type";
import type { CallOfferSuccessPayload } from "../../../types/call/callSocket.type";

export default function useCallSocketListener(currentUserId: string) {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();

  const incomingCall = useSelector(
    (state: RootState) => state.call.incomingCall,
  );
  const isCallModalOpen = useSelector(
    (state: RootState) => state.call.isCallModalOpen,
  );
  const userData = useSelector((state: RootState) => state.chat.userData);

  useEffect(() => {
    if (!currentUserId) return;

    const handleCallOfferSuccessEvent = async (
      payload: CallOfferSuccessPayload,
    ) => {
      await dispatch(openIncomingCall(payload));
    };

    const handleCallInitiatedEvent = (payload: { callId: string }) => {
      console.log("Caller nhận được callId từ socket: ", payload);
      if (payload.callId) {
        dispatch(setCallInfo(payload.callId));
      }
    };

    const handleCallEndEvent = (payload: CallEndPayload) => {
      if (payload.shouldCloseUI) {
        if (payload.userIdWhoLeft !== currentUserId) {
          if (payload.reason === "rejected") {
            enqueueSnackbar("Đối phương đã từ chối cuộc gọi", {
              variant: "info",
            });
          } else if (payload.reason === "cancelled") {
            enqueueSnackbar("Cuộc gọi nhỡ", { variant: "warning" });
          } else {
            enqueueSnackbar("Cuộc gọi đã kết thúc", { variant: "info" });
          }
        }

        dispatch(closeIncomingCall());
        dispatch(clearCallInfo());
        dispatch(closeCallModal());
      }
    };

    const handleCallCandidateEvent = (payload: {
      candidate: RTCIceCandidate;
      conversationId: string;
    }) => {
      if (payload.candidate) {
        dispatch(addIceCandidate(payload.candidate));
      }
    };

    bindCallOfferSuccess(handleCallOfferSuccessEvent);
    bindCallInitiated(handleCallInitiatedEvent);
    bindCallEnd(handleCallEndEvent);
    bindCallCandidate(handleCallCandidateEvent);

    return () => {
      unbindCallOfferSuccess(handleCallOfferSuccessEvent);
      unbindCallInitiated(handleCallInitiatedEvent);
      unbindCallEnd(handleCallEndEvent);
      unbindCallCandidate(handleCallCandidateEvent);
    };
  }, [dispatch, currentUserId, enqueueSnackbar]);

  const handleDeclineCall = async () => {
    try {
      if (incomingCall.callId) {
        await dispatch(onEndCallAction(incomingCall.callId));
      }
    } catch (error) {
      console.error("Lỗi khi từ chối cuộc gọi:", error);
    }
  };

  const handleAcceptCall = async () => {
    if (incomingCall.callId) {
      await dispatch(onAcceptCallAction(incomingCall.callId)).unwrap();
    }
  };

  return {
    incomingCall,
    isCallModalOpen,
    userData,
    handlers: {
      closeIncomingCall: () => dispatch(closeIncomingCall()),
      declineCall: handleDeclineCall,
      acceptCall: handleAcceptCall,
      closeCallModal: () => dispatch(closeCallModal()),
    },
  };
}

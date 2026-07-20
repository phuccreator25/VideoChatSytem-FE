import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  bindAcceptCall,
  bindCallAnswer,
  bindCallOffline,
  bindCallRinging,
  bindCallToggleMedia,
  bindCallToggleMediaError,
  unbindAcceptCall,
  unbindCallAnswer,
  unbindCallOffline,
  unbindCallRinging,
  unbindCallToggleMedia,
  unbindCallToggleMediaError,
} from "../../socket/callSocket.socket";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../redux/store";
import { onEndCallAction, clearIceCandidates } from "../../redux/call.redux";
import { enqueueSnackbar } from "notistack";
import { useMediaStream } from "./sub-hooks/useMediaStream";
import { useScreenShare } from "./sub-hooks/useScreenShare";
import { useWebRTC } from "./sub-hooks/useWebRTC";

export const useVideoCall = () => {
  // 1. Redux & Router Parameters
  const { conversationId } = useParams<{ conversationId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id,
  );
  const ortherUserId = useSelector(
    (state: RootState) => state.chat.userData?.userId,
  );

  const callInfo = useSelector((state: RootState) => state.call.callInfo);
  const incomingCall = useSelector(
    (state: RootState) => state.call.incomingCall,
  );
  const iceCandidates = useSelector(
    (state: RootState) => state.call.iceCandidates,
  );

  // 2. Sub-hooks
  const media = useMediaStream();
  const screen = useScreenShare();
  const webrtc = useWebRTC();

  // 3. UI States (Duration, FullScreen, Speaker)
  const [callDuration, setCallDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Giải phóng hoàn toàn phần cứng khi Cúp máy
  const closeUserMedia = () => {
    screen.closeScreenShare();
    media.closeLocalMedia();
    webrtc.closeWebRTC();
    setCallDuration(0);
    setIsFullScreen(false);
  };

  const isCallModalOpen = useSelector(
    (state: RootState) => state.call.isCallModalOpen,
  );
  const activeCallType = isCallModalOpen.type || incomingCall.type || "video";

  const startCallSession = async (
    stream: MediaStream | null,
    targetCalleeId?: string,
  ) => {
    if (incomingCall?.offer) {
      await webrtc.answerCall({
        stream,
        incomingCall,
        conversationId,
        currentUserId,
      });
    } else {
      await webrtc.makeCall({
        localStream: stream || media.localStream,
        targetCalleeId,
        ortherUserId,
        conversationId,
        currentUserId,
        callType: activeCallType,
      });
    }
  };

  const makeCall = async (
    stream?: MediaStream | null,
    targetCalleeId?: string,
  ) => {
    await webrtc.makeCall({
      localStream: stream || media.localStream,
      targetCalleeId,
      ortherUserId,
      conversationId,
      currentUserId,
      callType: activeCallType,
    });
  };

  const endCall = async () => {
    try {
      if (!callInfo) return;

      if (!callInfo) {
        console.error("Không tìm thấy callId hợp lệ để cúp máy:", callInfo);
        closeUserMedia();
        return;
      }

      await dispatch(onEndCallAction(callInfo));
      closeUserMedia();
    } catch (error) {
      closeUserMedia();
      console.error("Lỗi trong quá trình kết thúc cuộc gọi:", error);
    }
  };

  // ==========================================
  // IV. CÁC TÁC VỤ PHỤ (SIDE EFFECTS)
  // ==========================================

  // Bộ đếm thời gian cuộc gọi
  useEffect(() => {
    if (!webrtc.isAccepted) return;

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      setCallDuration(0);
    };
  }, [webrtc.isAccepted]);

  // Áp dụng các Ice Candidates được lưu tạm từ Redux khi peerConnection sẵn sàng
  useEffect(() => {
    const pc = webrtc.peerConnectionRef.current;

    if (pc && webrtc.isRemoteDescSet && iceCandidates.length > 0) {
      const candidatesToApply = [...iceCandidates];
      dispatch(clearIceCandidates());

      candidatesToApply.forEach(async (candidate) => {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("Đã add queued candidate thành công:", candidate);
        } catch (e) {
          console.error("Lỗi khi thêm queued ICE candidate:", e);
        }
      });
    }
  }, [iceCandidates, dispatch, webrtc.isRemoteDescSet]);

  // Đăng ký các sự kiện socket lắng nghe từ đối phương dùng cho Caller
  useEffect(() => {
    const handleCallAnswer = async (payload: {
      answer: RTCSessionDescriptionInit;
      conversationId: string;
    }) => {
      if (!payload.answer || !webrtc.peerConnectionRef.current) return;
      const remoteDesc = new RTCSessionDescription(payload.answer);
      await webrtc.peerConnectionRef.current.setRemoteDescription(remoteDesc);
      console.log("Đã nhận answer từ đối phương");
      webrtc.setIsRemoteDescSet(true);
    };

    const handleAcceptCall = () => {
      webrtc.setIsAccepted(true);
    };

    const handleCallOffline = (payload: { callId: string }) => {
      if (callInfo === payload.callId) {
        closeUserMedia();
      }
      console.log("Đối phương offline");
    };

    const handleCallRinging = (payload: { callId: string }) => {
      if (callInfo === payload.callId) {
        webrtc.setIsRinging(true);
      }
      console.log("Cuộc gọi đang đổ chuông");
    };

    const handleCallToggleMedia = (payload: {
      callId: string;
      userIdWhoToggled: string;
      mediaType: "audio" | "video" | "screen";
      enabled: boolean;
    }) => {
      if (
        callInfo !== payload.callId ||
        payload.userIdWhoToggled === currentUserId
      ) {
        return;
      }

      if (payload.mediaType === "audio") {
        webrtc.setIsRemoteAudioMuted(!payload.enabled);
      } else if (payload.mediaType === "video") {
        webrtc.setIsRemoteVideoMuted(!payload.enabled);
      } else if (payload.mediaType === "screen") {
        screen.setIsRemoteScreenSharing(payload.enabled);
      }
    };

    const handleCallToggleMediaError = (payload: { message: string }) => {
      enqueueSnackbar(payload.message || "Cannot toggle media.", {
        variant: "error",
      });
      screen.restoreCameraTrack(webrtc.peerConnectionRef, media.localStreamRef);
    };

    bindCallAnswer(handleCallAnswer);
    bindAcceptCall(handleAcceptCall);
    bindCallOffline(handleCallOffline);
    bindCallRinging(handleCallRinging);
    bindCallToggleMedia(handleCallToggleMedia);
    bindCallToggleMediaError(handleCallToggleMediaError);
    return () => {
      unbindCallAnswer(handleCallAnswer);
      unbindAcceptCall(handleAcceptCall);
      unbindCallOffline(handleCallOffline);
      unbindCallRinging(handleCallRinging);
      unbindCallToggleMedia(handleCallToggleMedia);
      unbindCallToggleMediaError(handleCallToggleMediaError);
    };
  }, [callInfo, currentUserId, webrtc.isRemoteDescSet]);

  // Cảnh báo chống bấm nhầm F5 hoặc tắt tab khi đang trong cuộc gọi
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (webrtc.isAccepted) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [webrtc.isAccepted]);

  // Giải phóng media thiết bị khi component unmount
  useEffect(() => {
    return () => {
      closeUserMedia();
    };
  }, []);

  return {
    ui: {
      isAudioMuted: media.isAudioMuted,
      isVideoStopped: media.isVideoStopped,
      isScreenSharing: screen.isScreenSharing,
      isRemoteScreenSharing: screen.isRemoteScreenSharing,
      isSharingScreen: screen.isScreenSharing || screen.isRemoteScreenSharing,
      isFullScreen,
      isRemoteVideoMuted: webrtc.isRemoteVideoMuted,
      isRemoteAudioMuted: webrtc.isRemoteAudioMuted,
      isAccepted: webrtc.isAccepted,
      callDuration,
      isRinging: webrtc.isRinging,
      isReconnecting: webrtc.isReconnecting,
      connectionStatusText: webrtc.connectionStatusText,
    },
    data: {
      localStream: media.localStream,
      remoteStream: webrtc.remoteStream,
      callInfo,
    },
    refs: {
      localVideoRef: media.localVideoRef,
      remoteVideoRef: webrtc.remoteVideoRef,
    },
    handler: {
      openUserMedia: media.openUserMedia,
      closeUserMedia,
      toggleAudio: () => media.toggleAudio(callInfo!, currentUserId),
      toggleVideo: () => media.toggleVideo(callInfo!, currentUserId),
      toggleShareScreen: () =>
        screen.toggleShareScreen(
          webrtc.peerConnectionRef,
          media.localStreamRef,
          callInfo!,
          currentUserId,
        ),
      makeCall,
      endCall,
      startCallSession,
      setIsScreenSharing: screen.setIsScreenSharing,
      setIsFullScreen,
      setIsRemoteVideoMuted: webrtc.setIsRemoteVideoMuted,
      setIsRemoteAudioMuted: webrtc.setIsRemoteAudioMuted,
    },
  };
};

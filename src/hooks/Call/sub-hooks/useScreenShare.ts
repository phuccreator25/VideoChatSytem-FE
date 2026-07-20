import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { emitToggleMedia } from "../../../socket/callSocket.socket";

export const useScreenShare = () => {
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRemoteScreenSharing, setIsRemoteScreenSharing] = useState(false);

  const startScreenSharing = async (
    peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
    localStreamRef: React.MutableRefObject<MediaStream | null>,
    callInfo: string,
    currentUserId?: string,
  ) => {
    try {
      const callId = callInfo;

      if (!callId || !currentUserId) return;

      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        enqueueSnackbar("Trình duyệt không hỗ trợ chia sẻ màn hình", {
          variant: "error",
        });
        return;
      }

      const pc = peerConnectionRef.current;
      if (!pc) {
        enqueueSnackbar("Chưa có kết nối cuộc gọi để chia sẻ màn hình.", {
          variant: "warning",
        });
        return;
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { max: 1920, ideal: 1920 },
          height: { max: 1080, ideal: 1080 },
          frameRate: { max: 30, ideal: 30 },
        },
        audio: false,
      });
      const screenTrack = stream.getVideoTracks()[0];

      let videoSender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (!videoSender) {
        videoSender = pc.getSenders().find((s) => s.track === null);
      }

      if (videoSender) {
        await videoSender.replaceTrack(screenTrack);
        setScreenStream(stream);
        setIsScreenSharing(true);
        enqueueSnackbar("Đã bắt đầu chia sẻ màn hình", { variant: "info" });

        emitToggleMedia({
          callId,
          currentUserId,
          mediaType: "screen",
          enabled: true,
        });

        screenTrack.onended = async () => {
          await stopScreenSharing(
            peerConnectionRef,
            localStreamRef,
            callInfo,
            currentUserId,
          );
        };
      } else {
        enqueueSnackbar(
          "Không tìm thấy kênh luồng video để chia sẻ màn hình.",
          {
            variant: "error",
          },
        );
      }
    } catch (error: any) {
      if (error.name !== "NotAllowedError" && error.name !== "AbortError") {
        console.error("Lỗi khi share screen:", error);
        enqueueSnackbar("Không thể chia sẻ màn hình.", { variant: "error" });
      }
    }
  };

  const restoreCameraTrack = async (
    peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
    localStreamRef: React.MutableRefObject<MediaStream | null>,
  ) => {
    const pc = peerConnectionRef.current;
    const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
    if (pc && cameraTrack) {
      const videoSender = pc
        .getSenders()
        .find((s) => s.track?.kind === "video" || s.track === null);
      if (videoSender) {
        await videoSender.replaceTrack(cameraTrack);
      }
    }

    setScreenStream((prevStream) => {
      if (prevStream) {
        prevStream.getTracks().forEach((track) => {
          track.onended = null;
          track.stop();
        });
      }
      return null;
    });

    setIsScreenSharing(false);
    enqueueSnackbar("Đã dừng chia sẻ màn hình", { variant: "info" });
    console.log("Đã dừng chia sẻ màn hình và khôi phục lại Camera.");
  };

  const stopScreenSharing = async (
    peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
    localStreamRef: React.MutableRefObject<MediaStream | null>,
    callInfo: string,
    currentUserId?: string,
  ) => {
    const callId = callInfo;
    await restoreCameraTrack(peerConnectionRef, localStreamRef);
    if (callId && currentUserId) {
      emitToggleMedia({
        callId,
        currentUserId,
        mediaType: "screen",
        enabled: false,
      });
    }
  };

  const toggleShareScreen = async (
    peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
    localStreamRef: React.MutableRefObject<MediaStream | null>,
    callInfo: string,
    currentUserId?: string,
  ) => {
    if (isScreenSharing) {
      await stopScreenSharing(
        peerConnectionRef,
        localStreamRef,
        callInfo,
        currentUserId,
      );
    } else {
      if (isRemoteScreenSharing) {
        enqueueSnackbar(
          "The other party is sharing their screen. Plesae wait for them to stop sharing.",
          {
            variant: "error",
          },
        );
        return;
      }

      await startScreenSharing(
        peerConnectionRef,
        localStreamRef,
        callInfo,
        currentUserId,
      );
    }
  };

  const closeScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => {
        track.onended = null;
        track.stop();
      });
      setScreenStream(null);
    }
    setIsScreenSharing(false);
    setIsRemoteScreenSharing(false);
  };

  return {
    screenStream,
    setScreenStream,
    isScreenSharing,
    setIsScreenSharing,
    isRemoteScreenSharing,
    setIsRemoteScreenSharing,
    startScreenSharing,
    stopScreenSharing,
    restoreCameraTrack,
    toggleShareScreen,
    closeScreenShare,
  };
};

import { useState, useRef } from "react";
import { enqueueSnackbar } from "notistack";
import { emitToggleMedia } from "../../../socket/callSocket.socket";

export const useMediaStream = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoStopped, setIsVideoStopped] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Khởi tạo media (camera/micro)
  const openUserMedia = async (callType: "voice" | "video") => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("SECURE_CONTEXT_REQUIRED");
      }

      const isMobileDevice = /Mobi|Android|iPhone|iPad/i.test(
        navigator.userAgent,
      );

      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true, //Loại bỏ tiếng vang từ đối phương
          noiseSuppression: true, // Giảm tiếng ồn
        },
        video:
          callType === "video"
            ? {
              width: isMobileDevice ? { ideal: 720 } : { ideal: 1280 },
              height: isMobileDevice ? { ideal: 1280 } : { ideal: 720 },
              facingMode: "user",
            }
            : false,
      };

      let stream: MediaStream;

      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (error: any) {
        if (
          (error.name === "NotFoundError" ||
            error.name === "DevicesNotFoundError") &&
          callType === "video"
        ) {
          console.warn(
            "Không tìm thấy camera, tự động hạ cấp xuống xin quyền mỗi Microphone...",
          );

          enqueueSnackbar(
            "Không tìm thấy camera. Hệ thống tự động chuyển sang cuộc gọi thoại.",
            {
              variant: "warning",
            },
          );

          constraints.video = false;
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } else {
          throw error;
        }
      }

      if (callType !== "video") {
        setIsVideoStopped(true);
      } else {
        setIsVideoStopped(false);
      }

      setLocalStream(stream);
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error: any) {
      console.error("Lỗi khi truy cập thiết bị Media:", error);

      if (error.message === "SECURE_CONTEXT_REQUIRED") {
        enqueueSnackbar(
          "HTTPS connection required to use camera/microphone.",
          { variant: "error" },
        );
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        enqueueSnackbar(
          "No Microphone or Camera devices found.",
          { variant: "error" },
        );
      } else if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        enqueueSnackbar(
          "Device access permission blocked. Please enable it in browser settings.",
          { variant: "error" },
        );
      } else if (
        error.name === "NotReadableError" ||
        error.name === "TrackStartError"
      ) {
        enqueueSnackbar("Device is currently in use by another application.", {
          variant: "error",
        });
      } else {
        enqueueSnackbar(
          `Device connection error: ${error.message || error.name}`,
          { variant: "error" },
        );
      }

      throw error;
    }
  };

  const toggleAudio = (callInfo: string, currentUserId?: string) => {
    const activeStream = localStreamRef.current || localStream;
    if (activeStream) {
      activeStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsAudioMuted(!track.enabled);

        if (callInfo && currentUserId) {
          emitToggleMedia({
            callId: callInfo,
            currentUserId,
            mediaType: "audio",
            enabled: track.enabled,
          });
        }
      });
    }
  };

  const toggleVideo = (callInfo: string, currentUserId?: string) => {
    const activeStream = localStreamRef.current || localStream;
    if (activeStream) {
      activeStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsVideoStopped(!track.enabled);

        if (callInfo && currentUserId) {
          emitToggleMedia({
            callId: callInfo,
            currentUserId,
            mediaType: "video",
            enabled: track.enabled,
          });
        }
      });
    }
  };

  const closeLocalMedia = () => {
    const activeStream = localStreamRef.current;
    if (activeStream) {
      activeStream.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
    setIsAudioMuted(false);
    setIsVideoStopped(false);
  };

  return {
    localStream,
    setLocalStream,
    isAudioMuted,
    setIsAudioMuted,
    isVideoStopped,
    setIsVideoStopped,
    localVideoRef,
    localStreamRef,
    openUserMedia,
    toggleAudio,
    toggleVideo,
    closeLocalMedia,
  };
};

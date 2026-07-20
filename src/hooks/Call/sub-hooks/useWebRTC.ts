import { useState, useRef } from "react";
import { enqueueSnackbar } from "notistack";
import callApi from "../../../api/Call.api";
import { emitCallAnswer, emitCallOffer, emitIceCandidate } from "../../../socket/callSocket.socket";

export const useWebRTC = () => {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isRemoteVideoMuted, setIsRemoteVideoMuted] = useState(false);
  const [isRemoteAudioMuted, setIsRemoteAudioMuted] = useState(false);
  const [isRemoteDescSet, setIsRemoteDescSet] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [connectionStatusText, setConnectionStatusText] = useState<string | null>(null);

  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const makeCall = async ({
    localStream,
    targetCalleeId,
    ortherUserId,
    conversationId,
    currentUserId,
  }: {
    localStream: MediaStream | null;
    targetCalleeId?: string;
    ortherUserId?: string;
    conversationId?: string;
    currentUserId?: string;
  }) => {
    const activeStream = localStream;
    const calleeId = targetCalleeId || ortherUserId;

    if (!calleeId) {
      console.error("❌ Không tìm thấy ID của người nhận cuộc gọi (calleeId).");
      enqueueSnackbar(
        "Không thể khởi tạo cuộc gọi: Thiếu thông tin người nhận.",
        { variant: "error" },
      );
      return;
    }

    if (!conversationId || !activeStream) {
      console.error("❌ Thiếu thông tin conversationId hoặc activeStream");
      return;
    }

    if (!currentUserId) {
      console.error(
        "❌ Không tìm thấy ID của người gửi cuộc gọi (currentUserId).",
      );
      enqueueSnackbar("Không thể khởi tạo cuộc gọi. Vui lòng thử lại", {
        variant: "error",
      });
      return;
    }

    try {
      const res = await callApi.onGetTurnCredentials();
      console.log("res", res.data);

      const configuration = { iceServers: res.data.data.iceServers };

      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;

      activeStream.getTracks().forEach((track) => {
        pc.addTrack(track, activeStream);
      });

      pc.ontrack = (event) => {
        console.log("ontrack nhận track:", event.track.kind);

        if (event.streams && event.streams[0]) {
          const incomingStream = event.streams[0];
          setRemoteStream(incomingStream);

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = incomingStream;

            remoteVideoRef.current.onloadedmetadata = () => {
              remoteVideoRef.current
                ?.play()
                .then(() =>
                  console.log(
                    "🔥 Phát stream trực tiếp từ ontrack thành công!",
                  ),
                )
                .catch((err) =>
                  console.warn("Chờ luồng dữ liệu ổn định:", err),
                );
            };
          }
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("candidate: ", event.candidate);
          emitIceCandidate(currentUserId, conversationId, event.candidate);
        }
      };

      pc.oniceconnectionstatechange = async () => {
        const state = pc.iceConnectionState;

        if (state === "disconnected") {
          setIsReconnecting(true);
          setConnectionStatusText(
            "Unstable connection. Attempting to reconnect...",
          );
          enqueueSnackbar("Unstable connection. Attempting to reconnect...", {
            variant: "warning",
          });
        } else if (state === "failed") {
          setIsReconnecting(true);
          setConnectionStatusText(
            "Connection interrupted. Attempting to restore...",
          );
          enqueueSnackbar("Connection interrupted. Attempting to restore...", {
            variant: "error",
          });

          try {
            if (pc.signalingState === "stable") {
              const offer = await pc.createOffer({ iceRestart: true });
              await pc.setLocalDescription(offer);
            }
          } catch (err) {
            console.error("Lỗi khi thực hiện ICE Restart:", err);
          }
        } else if (state === "connected" || state === "completed") {
          setIsReconnecting(false);
          setConnectionStatusText(null);
          console.log("✅ [WebRTC] Kết nối mạng ổn định!");
        }
      };

      pc.onconnectionstatechange = () => {
        console.log(`⚡ [WebRTC Peer Connection State]: ${pc.connectionState}`);
        if (pc.connectionState === "connected") {
          setIsReconnecting(false);
          setConnectionStatusText(null);
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log("offer: ", offer);

      const dataSocket = {
        conversationId,
        callerId: currentUserId,
        calleeId,
        type: "video",
        offer,
      };

      emitCallOffer(dataSocket);
    } catch (error) {
      console.error("Lỗi trong quá trình thiết lập cuộc gọi WebRTC:", error);
    }
  };

  const answerCall = async ({
    stream,
    incomingCall,
    conversationId,
    currentUserId,
  }: {
    stream: MediaStream | null;
    incomingCall: any;
    conversationId?: string;
    currentUserId?: string;
  }) => {
    if (!incomingCall?.offer || !incomingCall?.userData) {
      console.error("Không tìm thấy offer của cuộc gọi đến");
      return;
    }

    try {
      const res = await callApi.onGetTurnCredentials();
      console.log("res: ", res);

      const pc = new RTCPeerConnection({
        iceServers: res.data.data.iceServers,
      });
      peerConnectionRef.current = pc;

      stream?.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        console.log("ontrack nhận track:", event.track.kind);

        if (event.streams && event.streams[0]) {
          const incomingStream = event.streams[0];
          setRemoteStream(incomingStream);

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = incomingStream;

            remoteVideoRef.current.onloadedmetadata = () => {
              remoteVideoRef.current
                ?.play()
                .then(() =>
                  console.log(
                    "🔥 Phát stream trực tiếp từ ontrack thành công!",
                  ),
                )
                .catch((err) =>
                  console.warn("Chờ luồng dữ liệu ổn định:", err),
                );
            };
          }
        }
      };

      const activeConversationId =
        incomingCall.conversationId || conversationId || "";

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("candidate: ", event.candidate);
          emitIceCandidate(
            currentUserId || "",
            activeConversationId,
            event.candidate,
          );
        }
      };

      pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState;

        if (state === "disconnected") {
          setIsReconnecting(true);
          setConnectionStatusText(
            "Unstable connection. Attempting to reconnect...",
          );
          enqueueSnackbar("Unstable connection. Attempting to reconnect...", {
            variant: "warning",
          });
        } else if (state === "failed") {
          setIsReconnecting(true);
          setConnectionStatusText(
            "Connection interrupted. Attempting to restore...",
          );
          enqueueSnackbar("Connection interrupted. Attempting to restore...", {
            variant: "error",
          });
        } else if (state === "connected" || state === "completed") {
          setIsReconnecting(false);
          setConnectionStatusText(null);
          console.log("✅ [WebRTC Callee] Kết nối mạng ổn định!");
        }
      };

      pc.onconnectionstatechange = () => {
        console.log(`⚡ [WebRTC Callee Peer State]: ${pc.connectionState}`);
        if (pc.connectionState === "connected") {
          setIsReconnecting(false);
          setConnectionStatusText(null);
        }
      };

      const remoteDesc = new RTCSessionDescription(incomingCall?.offer);

      await pc.setRemoteDescription(remoteDesc);

      setIsRemoteDescSet(true);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      console.log("remoteStream: ", remoteStream);
      console.log("Đã có remoteStream chưa?", !!remoteStream);

      emitCallAnswer(
        activeConversationId,
        incomingCall.callerId || "",
        answer,
      );
    } catch (error) {
      console.error("Lỗi trong quá trình trả lời cuộc gọi:", error);
    }
  };

  const closeWebRTC = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setRemoteStream(null);
    setIsAccepted(false);
    setIsRinging(false);
    setIsRemoteVideoMuted(false);
    setIsRemoteAudioMuted(false);
    setIsRemoteDescSet(false);
    setIsReconnecting(false);
    setConnectionStatusText(null);
    remoteVideoRef.current = null;
  };

  return {
    remoteStream,
    setRemoteStream,
    isAccepted,
    setIsAccepted,
    isRinging,
    setIsRinging,
    isRemoteVideoMuted,
    setIsRemoteVideoMuted,
    isRemoteAudioMuted,
    setIsRemoteAudioMuted,
    isRemoteDescSet,
    setIsRemoteDescSet,
    isReconnecting,
    setIsReconnecting,
    connectionStatusText,
    setConnectionStatusText,
    remoteVideoRef,
    peerConnectionRef,
    makeCall,
    answerCall,
    closeWebRTC,
  };
};

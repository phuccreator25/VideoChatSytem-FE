import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  bindAcceptCall,
  bindCallAnswer,
  bindCloseAudioCall,
  bindCloseVideoCall,
  emitCallAnswer,
  emitCallOffer,
  emitCloseAudioCall,
  emitCloseVideoCall,
  emitIceCandidate,
  unbindAcceptCall,
  unbindCallAnswer,
  unbindCloseAudioCall,
  unbindCloseVideoCall,
} from "../../socket/callSocket.socket";
import callApi from "../../api/Call.api";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../redux/store";
import { onEndCallAction, clearIceCandidates } from "../../redux/call.redux";
import { enqueueSnackbar } from "notistack";

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

  // 2. React State Variables
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoStopped, setIsVideoStopped] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isRemoteVideoMuted, setIsRemoteVideoMuted] = useState(false);
  const [isRemoteAudioMuted, setIsRemoteAudioMuted] = useState(false);
  const [isRemoteDescSet, setIsRemoteDescSet] = useState(false);

  // 3. React Ref Variables
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // ==========================================
  // I. KHỞI TẠO & GIẢI PHÓNG MEDIA THIẾT BỊ
  // ==========================================

  // Khởi tạo media (camera/micro)
  const openUserMedia = async (callType: "voice" | "video") => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("SECURE_CONTEXT_REQUIRED");
      }

      const isMobileDevice = /Mobi|Android|iPhone|iPad/i.test(
        navigator.userAgent,
      );

      // Cấu hình ban đầu dựa theo mong muốn của user
      const constraints: MediaStreamConstraints = {
        audio: true,
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
        // Thử xin quyền theo cấu hình mong muốn đầu tiên
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (firstError: any) {
        // BẮT BÀI: Nếu lỗi là không tìm thấy thiết bị khi đang cố gọi Video
        if (
          (firstError.name === "NotFoundError" ||
            firstError.name === "DevicesNotFoundError") &&
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

          // Cấu hình lại: chỉ xin quyền Mic
          constraints.video = false;
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } else {
          // Nếu là lỗi khác (như bị từ chối quyền), ném lỗi ra ngoài cho block catch lớn xử lý
          throw firstError;
        }
      }

      console.log(
        "Local media tracks acquired:",
        stream
          .getTracks()
          .map(
            (t) =>
              `${t.kind}: enabled=${t.enabled}, readyState=${t.readyState}`,
          ),
      );

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
          "Yêu cầu kết nối bảo mật (HTTPS) để sử dụng camera/micro.",
          { variant: "error" },
        );
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        // Lúc này chắc chắn là máy không có cả mic lẫn camera
        enqueueSnackbar(
          "Không tìm thấy bất kỳ thiết bị Microphone hay Camera nào.",
          { variant: "error" },
        );
      } else if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        enqueueSnackbar(
          "Bạn đã chặn quyền truy cập thiết bị. Vui lòng mở lại trong cài đặt trình duyệt.",
          { variant: "error" },
        );
      } else if (
        error.name === "NotReadableError" ||
        error.name === "TrackStartError"
      ) {
        enqueueSnackbar("Thiết bị đang được sử dụng bởi một ứng dụng khác.", {
          variant: "error",
        });
      } else {
        enqueueSnackbar(
          `Lỗi kết nối thiết bị: ${error.message || error.name}`,
          { variant: "error" },
        );
      }

      throw error;
    }
  };

  // Giải phóng hoàn toàn phần cứng khi Cúp máy
  const closeUserMedia = () => {
    const activeStream = localStreamRef.current;
    if (activeStream) {
      activeStream.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setRemoteStream(null);
    setIsAccepted(false);
    setCallDuration(0);
    setIsAudioMuted(false);
    setIsVideoStopped(false);
    setIsScreenSharing(false);
    setIsFullScreen(false);
    setIsSpeakerOn(true);
    setIsRemoteVideoMuted(false);
    setIsRemoteAudioMuted(false);
  };

  // ==========================================
  // II. ĐIỀU KHIỂN THIẾT BỊ LÀM VIỆC (TOGGLES)
  // ==========================================

  const toggleAudio = () => {
    const activeStream = localStreamRef.current || localStream;
    if (activeStream) {
      activeStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsAudioMuted(!track.enabled);
      });

      const callId =
        typeof callInfo === "string" ? callInfo : (callInfo as any)?._id;
      if (callId && currentUserId) {
        emitCloseAudioCall(callId, currentUserId);
      }
    }
  };

  const toggleVideo = () => {
    const activeStream = localStreamRef.current || localStream;
    if (activeStream) {
      activeStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsVideoStopped(!track.enabled);
      });

      const callId =
        typeof callInfo === "string" ? callInfo : (callInfo as any)?._id;
      if (callId && currentUserId) {
        emitCloseVideoCall(callId, currentUserId);
      }
    }
  };

  // ==========================================
  // III. THIẾT LẬP KẾT NỐI WEBRTC (SIGNALING)
  // ==========================================

  const makeCall = async (stream?: MediaStream | null) => {
    const activeStream = stream || localStream;
    if (!conversationId || !activeStream || !ortherUserId || !currentUserId)
      return;

    try {
      // Gọi API lấy cấu hình TURN động từ service đã viết của bạn
      const res = await callApi.onGetTurnCredentials();
      console.log("res", res.data);

      const configuration = { iceServers: res.data.data.iceServers };

      // Lưu trữ instance kết nối vào Ref để bảo toàn bộ nhớ
      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;

      // Đẩy các Tracks của Local Stream vào Peer Connection trước khi tạo Offer
      activeStream.getTracks().forEach((track) => {
        pc.addTrack(track, activeStream);
      });

      // Lắng nghe luồng Media đổ về từ phía bên nhận
      pc.ontrack = (event) => {
        console.log("ontrack nhận track:", event.track.kind);

        if (event.streams && event.streams[0]) {
          const incomingStream = event.streams[0];
          setRemoteStream(incomingStream);

          // 🔥 Đổ thẳng trực tiếp vào Ref DOM ngay lập tức, không đợi React State re-render
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = incomingStream;

            // Lắng nghe sự kiện nạp xong cấu hình từ Internet để ép phát
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

      // Xử lý cơ chế thu thập các ICE Candidate khả thi có thể đi được sau đó truyền qua kênh Signaling
      pc.onicecandidate = (event) => {
        // Khi có ICE Candidate được sinh ra, hãy phát tín hiệu này đi
        if (event.candidate) {
          console.log("candidate: ", event.candidate);
          emitIceCandidate(currentUserId, conversationId, event.candidate); // Hàm emit tín hiệu Candidate của bạn
        }
      };

      // Tiến hành tạo và thiết lập Session Description Protocol (SDP)
      const offer = await pc.createOffer(); // Nó chứa cả SDP và type:offer
      await pc.setLocalDescription(offer); // Caller xác nhận gửi Offer đi, đồng nghĩa với việc xác nhận cấu hình của mình. Đồng thời thì candidate mới thực sự được kích hoạt

      console.log("offer: ", offer);

      const dataSocket = {
        conversationId,
        callerId: currentUserId,
        calleeId: ortherUserId,
        type: "video",
        offer,
      };

      // Phát tín hiệu kèm Offer chính thức tới đối phương
      emitCallOffer(dataSocket);
    } catch (error) {
      console.error("Lỗi trong quá trình thiết lập cuộc gọi WebRTC:", error);
    }
  };

  const answerCall = async (stream: MediaStream | null) => {
    if (!incomingCall?.offer || !incomingCall?.userData) {
      console.error("Không tìm thấy offer của cuộc gọi đến");
      return;
    }

    try {
      // 1. Khởi tạo PeerConnection với Turn/Stun
      const res = await callApi.onGetTurnCredentials();
      console.log("res: ", res);

      const pc = new RTCPeerConnection({
        iceServers: res.data.data.iceServers,
        iceTransportPolicy: "relay", // 🔥 BẮT BUỘC: Ép trình duyệt bỏ qua P2P, đi thẳng qua TURN Server
      });
      peerConnectionRef.current = pc;

      // 2. Add local camera/mic stream
      stream?.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 3. Đăng ký listener ontrack (để hiển thị video của Caller khi kết nối thành công)
      pc.ontrack = (event) => {
        console.log("ontrack nhận track:", event.track.kind);

        if (event.streams && event.streams[0]) {
          const incomingStream = event.streams[0];
          setRemoteStream(incomingStream);

          // 🔥 Đổ thẳng trực tiếp vào Ref DOM ngay lập tức, không đợi React State re-render
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = incomingStream;

            // Lắng nghe sự kiện nạp xong cấu hình từ Internet để ép phát
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

      // 4. Set Remote Description bằng SDP Offer của Caller (lấy từ Redux incomingCall.offer)
      const remoteDesc = new RTCSessionDescription(incomingCall?.offer);
      await pc.setRemoteDescription(remoteDesc); // Lưu cấu hình của máy đối phương vào máy của mình
      setIsRemoteDescSet(true);
      console.log("remoteStream: ", remoteStream);
      console.log("Đã có remoteStream chưa?", !!remoteStream);

      // 5. Tạo SDP Answer & set làm Local Description
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer); // Lưu cấu hình của máy mình vào máy của mình

      // 6. Phát socket "call:answer" trực tiếp cho Caller
      emitCallAnswer(
        activeConversationId,
        incomingCall.callerId || "", // ID của người gọi (lấy từ Redux)
        answer,
      );
    } catch (error) {
      console.error("Lỗi trong quá trình trả lời cuộc gọi:", error);
    }
  };

  const startCallSession = async (stream: MediaStream | null) => {
    const isCallee = !!incomingCall?.offer;

    if (isCallee) {
      console.log("-> Khởi động luồng Callee (Nhận cuộc gọi & tạo Answer)");
      setIsAccepted(true);
      await answerCall(stream); // <--- Xóa dấu ! ở đây
    } else {
      console.log("-> Khởi động luồng Caller (Bắt đầu gọi & tạo Offer)");
      await makeCall(stream); // <--- Xóa dấu ! ở đây (và cập nhật check stream trong hàm makeCall)
    }
  };

  const endCall = async () => {
    try {
      if (!callInfo) return;

      const callId =
        typeof callInfo === "string" ? callInfo : (callInfo as any)?._id;
      if (!callId) {
        console.error("Không tìm thấy callId hợp lệ để cúp máy:", callInfo);
        closeUserMedia();
        return;
      }

      await dispatch(onEndCallAction(callId));

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
    let interval: NodeJS.Timeout;
    if (isAccepted) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAccepted]);

  // Tự động gán localStream khi thẻ video hoặc stream thay đổi
  // useEffect(() => {
  //   if (localVideoRef.current && localStream) {
  //     if (localVideoRef.current.srcObject !== localStream) {
  //       localVideoRef.current.srcObject = localStream;
  //     }
  //     localVideoRef.current.play().catch((err) => {
  //       console.error("Lỗi tự động phát video cục bộ:", err);
  //     });
  //   }
  // }, [localStream]);

  // // Tự động gán remoteStream khi thẻ video hoặc stream thay đổi
  // useEffect(() => {
  //   console.log(
  //     "remoteStream changed state:",
  //     remoteStream?.id,
  //     "remoteVideoRef present:",
  //     !!remoteVideoRef.current,
  //   );
  //   // if (remoteVideoRef.current && remoteStream) {
  //   //   if (remoteVideoRef.current.srcObject !== remoteStream) {
  //   //     remoteVideoRef.current.srcObject = remoteStream;
  //   //     console.log("Gán remoteStream thành công cho remoteVideoRef");
  //   //   }
  //   //   // Gọi play() tường minh sau khi DOM cập nhật hiển thị để tránh lỗi autoplay do display: none
  //   //   remoteVideoRef.current
  //   //     .play()
  //   //     .then(() => {
  //   //       console.log("Phát stream từ xa thành công (có hình và tiếng)");
  //   //     })
  //   //     .catch((err) => {
  //   //       console.error("Lỗi tự động phát video/audio từ xa:", err);
  //   //     });
  //   // }
  //   if (remoteVideoRef.current && remoteStream) {
  //     // 💥 Bỏ cái if bọc ngoài đi, ép gán lại và ép gọi .play() liên tục mỗi khi state trigger
  //     remoteVideoRef.current.srcObject = remoteStream;

  //     remoteVideoRef.current
  //       .play()
  //       .then(() =>
  //         console.log("Phát stream từ xa thành công (có hình và tiếng)"),
  //       )
  //       .catch((err) => console.error("Lỗi tự động phát:", err));
  //   }
  // }, [remoteStream]);

  // Áp dụng các Ice Candidates được lưu tạm từ Redux khi peerConnection sẵn sàng
  useEffect(() => {
    const pc = peerConnectionRef.current;

    if (pc && isRemoteDescSet && iceCandidates.length > 0) {
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
  }, [iceCandidates, dispatch, isRemoteDescSet]);

  // Đăng ký các sự kiện socket lắng nghe từ đối phương
  useEffect(() => {
    const handleCallAnswer = async (payload: any) => {
      if (!payload.answer || !peerConnectionRef.current) return;
      // Tiếp nhận SDP của đối phương
      const remoteDesc = new RTCSessionDescription(payload.answer);
      await peerConnectionRef.current.setRemoteDescription(remoteDesc); // Browser sẽ tự động phân tácg SDP từ callee và kích hoạt pc.ontrack
      console.log("Đã nhận answer từ đối phương");
      setIsRemoteDescSet(true);
    };

    const handleAcceptCall = () => {
      setIsAccepted(true);
      console.log("Đã nhận accept từ đối phương");
    };

    const handleCallCloseVideo = (payload: {
      callId: string;
      userIdWhoClose: string;
    }) => {
      const callId =
        typeof callInfo === "string" ? callInfo : (callInfo as any)?._id;
      if (
        callId === payload.callId &&
        payload.userIdWhoClose !== currentUserId
      ) {
        setIsRemoteVideoMuted((prev) => !prev);
      }
      console.log("Đối phương tắt cam");
    };

    const handleCallCloseAudio = (payload: {
      callId: string;
      userIdWhoClose: string;
    }) => {
      const callId =
        typeof callInfo === "string" ? callInfo : (callInfo as any)?._id;
      if (
        callId === payload.callId &&
        payload.userIdWhoClose !== currentUserId
      ) {
        setIsRemoteAudioMuted((prev) => !prev);
      }
      console.log("Đối phương tắt mic");
    };

    bindCallAnswer(handleCallAnswer);
    bindAcceptCall(handleAcceptCall);
    bindCloseVideoCall(handleCallCloseVideo);
    bindCloseAudioCall(handleCallCloseAudio);
    return () => {
      unbindCallAnswer(handleCallAnswer);
      unbindAcceptCall(handleAcceptCall);
      unbindCloseVideoCall(handleCallCloseVideo);
      unbindCloseAudioCall(handleCallCloseAudio);
    };
  }, [callInfo, currentUserId, isRemoteDescSet]);

  // Giải phóng media thiết bị khi component unmount
  useEffect(() => {
    return () => {
      closeUserMedia();
    };
  }, []);

  return {
    ui: {
      isAudioMuted,
      isVideoStopped,
      isScreenSharing,
      isFullScreen,
      isSpeakerOn,
      isRemoteVideoMuted,
      isRemoteAudioMuted,
      isAccepted,
      callDuration,
    },
    data: {
      localStream,
      remoteStream,
      callInfo,
    },
    refs: {
      localVideoRef,
      remoteVideoRef,
    },
    handler: {
      openUserMedia,
      closeUserMedia,
      toggleAudio,
      toggleVideo,
      makeCall,
      endCall,
      startCallSession,
      setIsScreenSharing,
      setIsFullScreen,
      setIsSpeakerOn,
      setIsRemoteVideoMuted,
      setIsRemoteAudioMuted,
    },
  };
};

import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  bindCallAnswer,
  emitCallAnswer,
  emitCallOffer,
  emitIceCandidate,
  unbindCallAnswer,
} from "../../socket/callSocket.socket";
import callApi from "../../api/Call.api";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../redux/store";
import { onEndCallAction, clearIceCandidates } from "../../redux/call.redux";

export const useVideoCall = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
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

  // Quản lý States cho UI hiển thị
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoStopped, setIsVideoStopped] = useState(false);

  // Quản lý References cố định xuyên suốt cuộc gọi
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  // 1. Khởi tạo & xử lý Media Thiết bị
  const openUserMedia = async (callType: "voice" | "video") => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        throw new Error("SECURE_CONTEXT_REQUIRED");
      }

      // Liệt kê các thiết bị phần cứng để phục vụ debug
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log(
        "--- DANH SÁCH THIẾT BỊ PHẦN CỨNG ĐƯỢC TRÌNH DUYỆT NHẬN DIỆN ---",
      );
      console.table(
        devices.map((d) => ({
          Loai: d.kind,
          Ten: d.label || "Chưa cấp quyền (Trống)",
          ID: d.deviceId || "Chưa cấp quyền (Trống)",
        })),
      );

      const hasVideo = devices.some((d) => d.kind === "videoinput");
      const hasAudio = devices.some((d) => d.kind === "audioinput");

      console.log(
        `[Media Check] Webcam: ${hasVideo ? "CÓ" : "KHÔNG"}, Microphone: ${hasAudio ? "CÓ" : "KHÔNG"}`,
      );

      // Nếu không có cả camera lẫn mic
      if (!hasVideo && !hasAudio) {
        throw new Error("NO_DEVICES_FOUND");
      }

      // Xác định các thiết bị thực tế có thể yêu cầu
      const useVideo = callType === "video" && hasVideo;
      const useAudio = hasAudio; // Ưu tiên dùng mic nếu có

      if (callType === "video" && !hasVideo) {
        console.warn(
          "Máy không có Webcam! Tự động chuyển sang gọi thoại (chỉ lấy Micro)...",
        );
      }

      if (!useVideo && !useAudio) {
        throw new Error("NO_DEVICES_FOUND");
      }

      const constraints = {
        video: useVideo
          ? {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user",
            }
          : false,
        audio: useAudio,
      };

      console.log("Yêu cầu quyền truy cập media với constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (error: any) {
      console.error("Lỗi khi truy cập thiết bị Media:", error);

      // Hiển thị thông báo chi tiết cho người dùng
      if (error.message === "SECURE_CONTEXT_REQUIRED") {
        alert(
          "LỖI BẢO MẬT: WebRTC yêu cầu kết nối an toàn (HTTPS hoặc localhost) để truy cập Camera/Mic. Trình duyệt đã chặn cuộc gọi.",
        );
      } else if (
        error.message === "NO_DEVICES_FOUND" ||
        error.name === "NotFoundError"
      ) {
        alert(
          "LỖI THIẾT BỊ: Trình duyệt không tìm thấy bất kỳ Camera hay Microphone nào.\n\n" +
            "Cách khắc phục:\n" +
            "1. Kiểm tra xem Camera/Microphone đã cắm/kết nối đúng chưa.\n" +
            "2. Đảm bảo bạn đã cho phép ứng dụng truy cập camera/mic trong cài đặt Windows (Settings > Privacy > Camera/Microphone).",
        );
      } else if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        alert(
          "LỖI CẤP QUYỀN: Bạn đã từ chối quyền truy cập Camera/Microphone.\n\n" +
            "Cách khắc phục:\n" +
            "Hãy nhấn vào biểu tượng ổ khóa ở đầu thanh địa chỉ trình duyệt, chọn 'Cho phép (Allow)' quyền truy cập Camera và Microphone.",
        );
      } else {
        alert(`Lỗi khởi tạo thiết bị: ${error.message || error.name || error}`);
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
  };

  // 2. Các hàm Toggle Bật/Tắt Mute nhanh (Không hủy phần cứng)
  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsAudioMuted(!track.enabled);
      });
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsVideoStopped(!track.enabled);
      });
    }
  };

  // 3. Logic Đàm Phán Kết Nối WebRTC (Make Call)
  const makeCall = async (stream?: MediaStream) => {
    const activeStream = stream || localStream;
    if (!conversationId || !activeStream || !ortherUserId || !currentUserId)
      return;

    try {
      // Gọi API lấy cấu hình TURN động từ service đã viết của bạn
      const res = await callApi.onGetTurnCredentials();
      const configuration = { iceServers: res.data.iceServers };

      // Lưu trữ instance kết nối vào Ref để bảo toàn bộ nhớ
      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;

      // Đẩy các Tracks của Local Stream vào Peer Connection trước khi tạo Offer
      activeStream.getTracks().forEach((track) => {
        pc.addTrack(track, activeStream);
      });

      // Lắng nghe luồng Media đổ về từ phía bên nhận
      pc.ontrack = (event) => {
        console.log("event: ", event);

        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        }
      };

      // Xử lý cơ chế thu thập các ICE Candidate khả thi có thể đi được sau đó truyền qua kênh Signaling
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("candidate: ", event.candidate);
          emitIceCandidate(currentUserId, conversationId, event.candidate); // Hàm emit tín hiệu Candidate của bạn
        }
      };

      // Tiến hành tạo và thiết lập Session Description Protocol (SDP)
      const offer = await pc.createOffer(); // Nó chứa cả SDP và type:offer
      await pc.setLocalDescription(offer);

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

      // Chờ đợi tín hiệu Answer từ phía đối phương
      bindCallAnswer(async (payload: any) => {
        if (!payload.answer || !peerConnectionRef.current) return;
        // Tiếp nhận SDP của đối phương
        const remoteDesc = new RTCSessionDescription(payload.answer);
        await peerConnectionRef.current.setRemoteDescription(remoteDesc);
      });
    } catch (error) {
      console.error("Lỗi trong quá trình thiết lập cuộc gọi WebRTC:", error);
    }
  };

  const endCall = async () => {
    try {
      if (!callInfo) return;

      const callId = typeof callInfo === "string" ? callInfo : (callInfo as any)?._id;
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

  // Khi phát hiện là Callee và có Local Stream, chạy hàm answerCall:
  const answerCall = async (stream: MediaStream) => {
    if (!incomingCall?.offer || !incomingCall?.userData) {
      console.error("Không tìm thấy offer của cuộc gọi đến");
      return;
    }

    try {
      // 1. Khởi tạo PeerConnection với Turn/Stun
      const res = await callApi.onGetTurnCredentials();
      const pc = new RTCPeerConnection({ iceServers: res.data.iceServers });
      peerConnectionRef.current = pc;

      // 2. Add local camera/mic stream
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 3. Đăng ký listener ontrack (để hiển thị video của Caller khi kết nối thành công)
      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        }
      };

      // 4. Set Remote Description bằng SDP Offer của Caller (lấy từ Redux incomingCall.offer)
      const remoteDesc = new RTCSessionDescription(incomingCall?.offer);
      await pc.setRemoteDescription(remoteDesc);

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

      // 5. Tạo SDP Answer & set làm Local Description
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

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

  const startCallSession = async (stream: MediaStream) => {
    // Kiểm tra xem trong Redux có incomingCall.offer (nghĩa là có cuộc gọi đến gửi offer cho mình) hay không
    const isCallee = !!incomingCall?.offer;

    if (isCallee) {
      console.log("-> Khởi động luồng Callee (Nhận cuộc gọi & tạo Answer)");
      await answerCall(stream);
    } else {
      console.log("-> Khởi động luồng Caller (Bắt đầu gọi & tạo Offer)");
      await makeCall(stream);
    }
  };

  // Áp dụng các Ice Candidates được lưu tạm từ Redux khi peerConnection sẵn sàng
  useEffect(() => {
    if (peerConnectionRef.current && iceCandidates.length > 0) {
      const candidatesToApply = [...iceCandidates];
      dispatch(clearIceCandidates());

      candidatesToApply.forEach(async (candidate) => {
        try {
          await peerConnectionRef.current?.addIceCandidate(
            new RTCIceCandidate(candidate),
          );
          console.log("Đã add queued candidate:", candidate);
        } catch (e) {
          console.error("Lỗi khi thêm queued ICE candidate:", e);
        }
      });
    }
  }, [iceCandidates, dispatch]);

  // Dọn dẹp sự kiện tránh rò rỉ bộ nhớ (Memory Leak)
  useEffect(() => {
    const handleCallAnswerEvent = async (payload: any) => {
      if (!payload.answer || !peerConnectionRef.current) return;
      // Tiếp nhận SDP của đối phương
      const remoteDesc = new RTCSessionDescription(payload.answer);
      await peerConnectionRef.current.setRemoteDescription(remoteDesc);
    };

    bindCallAnswer(handleCallAnswerEvent);
    return () => {
      closeUserMedia();
      unbindCallAnswer(handleCallAnswerEvent);
    };
  }, []);

  return {
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    isAudioMuted,
    isVideoStopped,
    openUserMedia,
    closeUserMedia,
    toggleAudio,
    toggleVideo,
    makeCall,
    endCall,
    callInfo,
    startCallSession,
  };
};

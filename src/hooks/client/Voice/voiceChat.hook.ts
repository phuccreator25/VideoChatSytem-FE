import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useRef, useState } from "react";

type UseVoiceChatOptions = {
  onError?: (error: unknown) => void;
};

export function useVoiceChat({ onError }: UseVoiceChatOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const [recordedFile, setRecordedFile] = useState<File | null>(null); // Nơi lưu xong khi ghi xong

  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Dùng truyền vào thẻ audio để nghe 

  const recorderRef = useRef<MediaRecorder | null>(null); // start/stop voice
  const streamRef = useRef<MediaStream | null>(null); // Luồng âm thanh trực tiếp, đây là mắt mic hẳn
  const chunksRef = useRef<Blob[]>([]); // Lưu trữ các đoạn voice được chia nhỏ, sau khi dừng voice thì ghép lại thành 1 đoạn hoàn chỉnh

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatVoiceDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  const clearTimer = useCallback(() => {
    if (!timerRef.current) return;

    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const stopMicrophone = useCallback(() => {
    // Lấy audioTrack
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;
  }, []);

  const revokePreviewUrl = useCallback(() => {
    setPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return null;
    });
  }, []);

  const clearRecording = useCallback(() => {
    revokePreviewUrl();
    setRecordedFile(null);
    setRecordingDuration(0);
  }, [revokePreviewUrl]);

  //Chọn định dạng audio phù hợp với mỗi browser
  const getSupportedMimeType = () => {
    const mimeTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ];

    return (
      mimeTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ||
      ""
    );
  };

  //Tạo đuôi file theo định dạng phù hợp
  const getExtension = (mimeType: string) => {
    if (mimeType.includes("ogg")) return "ogg";
    if (mimeType.includes("mp4")) return "m4a";
    if (mimeType.includes("mpeg")) return "mp3";

    return "webm";
  };

  const startRecording = useCallback(async () => {
    if (isRecording) return;

    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      enqueueSnackbar('Browser does not support voice recording', {
        variant: 'error'
      })
      return;
    }

    try {
      // Ghi bản mới thì xóa preview cũ
      clearRecording();

      //Xin quyền mic
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
        },
      });

      const mimeType = getSupportedMimeType();

      //Nhận âm thành từ stream
      const recorder = mimeType
        ? new MediaRecorder(stream, {
            mimeType,
            audioBitsPerSecond: 128000,
          })
        : new MediaRecorder(stream, {
            audioBitsPerSecond: 128000,
          });

      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      
      //nhận dữ liệu chính thức
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      //Khi stop 
      recorder.onstop = () => {
        const finalMimeType =
          recorder.mimeType || chunksRef.current[0]?.type || "audio/webm";

        //Ghép file từ chunksRef
        const blob = new Blob(chunksRef.current, {
          type: finalMimeType,
        });

        if (blob.size > 0) {
          const extension = getExtension(finalMimeType);

          const file = new File([blob], `voice-${Date.now()}.${extension}`, {
            type: finalMimeType,
            lastModified: Date.now(),
          });

          const nextPreviewUrl = URL.createObjectURL(file);

          setRecordedFile(file);
          setPreviewUrl(nextPreviewUrl);
        }

        chunksRef.current = [];
        recorderRef.current = null;

        setIsRecording(false);
        clearTimer();
        stopMicrophone();
      };

      recorder.onerror = (event) => {
        console.error("VOICE RECORDING ERROR:", event);

        setIsRecording(false);
        clearTimer();
        stopMicrophone();

        onError?.(event);
      };

      recorder.start(250);

      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((current) => current + 1);
      }, 1000);
    } catch (error) {
      setIsRecording(false);
      clearTimer();
      stopMicrophone();
      onError?.(error);
    }
  }, [clearRecording, clearTimer, isRecording, onError, stopMicrophone]);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;

    if (!recorder || recorder.state === "inactive") {
      return;
    }

    clearTimer();
    recorder.stop();
  }, [clearTimer]);

  const handleVoiceClick = useCallback(() => {
    if (isRecording) {
      stopRecording();
      return;
    }

    void startRecording();
  }, [isRecording, startRecording, stopRecording]);

  useEffect(() => {
    return () => {
      const recorder = recorderRef.current;

      if (recorder) {
        recorder.ondataavailable = null;
        recorder.onstop = null;
        recorder.onerror = null;

        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      }

      clearTimer();
      stopMicrophone();

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [clearTimer, previewUrl, stopMicrophone]);

  return {
    voiceHandler: {
      startRecording,
      stopRecording,
      clearRecording,
      handleVoiceClick,
      formatVoiceDuration
    },

    voiceUi: {
      isRecording,
      recordingDuration,
      previewUrl,
    },

    voiceData: {
      recordedFile
    }
  };
}

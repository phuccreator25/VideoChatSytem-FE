import { enqueueSnackbar } from "notistack";
import { useState, useRef, useCallback } from "react";
import type { SpeechTranscriptItem } from "../../../types/call/call.type";
import { emitSpeedToText } from "../../../socket/callSocket.socket";

export function useCallSpeechToText() {
  const [isListening, setIsListening] = useState<boolean>(false);

  const transcriptRef = useRef<SpeechTranscriptItem[]>([]); // Hỗ trợ show phụ đề realtime trong cuộc gọi
  const recognitionRef = useRef<any>(null);

  // 1. Bắt đầu ghi âm lời thoại
  const startListening = useCallback((currentUserName: string, callId: string | null) => {

    if (!callId) {
      enqueueSnackbar("Không thể ghi âm cuộc gọi. Không tìm thấy cuộc gọi.", {
        variant: "error",
      });
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      enqueueSnackbar("Trình duyệt không hỗ trợ Web Speech API", {
        variant: "error",
      });
      return;
    }

    if (recognitionRef.current) return;

    const createRecognitionInstance = () => {
      const recognition = new SpeechRecognition();

      recognition.continuous = false; // Nghe xong câu dừng. Khong nghe liên tục
      recognition.interimResults = false; // Chỉ trả về chính thức khong trả về tạm thời
      recognition.maxAlternatives = 1;
      recognition.lang = "vi-VN"; // Tiếng Việt mặc định

      recognition.onresult = (event: any) => {
        const time = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // 1. Duyệt từ resultIndex (vị trí kết quả mới nhất vừa được xử lý)
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          
          if (result.isFinal) {
            
            const text = result[0]?.transcript?.trim();
            if (!text) continue;

            const lastIndex = transcriptRef.current.length - 1;
            const lastItem = transcriptRef.current[lastIndex];

            // 3. Nếu cùng 1 người nói liên tục các câu ngắn -> Nối tiếp vào câu cũ
            if (lastItem && lastItem.speaker === currentUserName) {
              
              lastItem.text = `${lastItem.text}. ${text}`;
              lastItem.timestamp = time; // Cập nhật lại thời gian mới nhất
            
            } else {
              // 4. Nếu là người khác nói hoặc câu đầu tiên -> Push item mới
              const newItem: SpeechTranscriptItem = {
                speaker: currentUserName,
                text: text,
                timestamp: time,
              };
              transcriptRef.current.push(newItem);
            }

            emitSpeedToText({
              callId,
              speakerName: currentUserName,
              text: text,
              timestamp: time,
            });

          }
        }
      };

      recognition.onerror = (err: any) => {
        if (
          err.error === "aborted" ||
          err.error === "no-speech" ||
          err.error === "network"
        ) {
          if (err.error === "network") {
            recognitionRef.current = null;
          }
          return;
        }
        console.error("Speech Recognition Error:", err);
      };

      recognition.onend = () => {
        // Nếu cuộc gọi vẫn đang diễn ra, tự tạo lượt lắng nghe câu tiếp theo
        if (recognitionRef.current) {
          try {
            const nextRec = createRecognitionInstance();
            nextRec.start();
            recognitionRef.current = nextRec;
          } catch (e) {
            console.log("Create instance error", e);
            recognitionRef.current = null;
          }
        }
      };

      return recognition;
    };

    try {
      const rec = createRecognitionInstance();
      rec.start();
      recognitionRef.current = rec;
      setIsListening(true);
      console.log("🎙️ Bắt đầu ghi âm Speech-to-Text thành công!");
    } catch (e) {
      console.error("Lỗi khi khởi chạy SpeechRecognition:", e);
    }
  }, []);

  // 2. Dừng ghi âm khi kết thúc cuộc gọi & trả về transcript
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      const rec = recognitionRef.current;
      recognitionRef.current = null;
      try {
        rec.stop();
      } catch (e) {
        console.log("Stop Error", e);
      }
    }
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    transcriptRef.current = [];
  }, []);

  const getLatestTranscript = useCallback(() => {
    return transcriptRef.current;
  }, []);

  return {
    transcriptRef,
    getLatestTranscript,
    isListening,
    startListening,
    stopListening,
    clearTranscript,
  };
}

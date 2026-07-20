import { useEffect } from "react";

export const useCallAudioTones = ({
  isOpen,
  isAccepted,
  isRingingState,
}: {
  isOpen: boolean;
  isAccepted: boolean;
  isRingingState: boolean;
}) => {
  // 1. Âm thanh khi CONNECTING (Đang kết nối đến người gọi - Sonar Beep pulse mỗi 1.5s)
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let intervalId: any = null;

    if (isOpen && !isAccepted && !isRingingState) {
      const playConnectingTone = () => {
        try {
          audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(330, audioCtx.currentTime);

          gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start();
          osc.stop(audioCtx.currentTime + 0.25);
        } catch (e) {
          // Ignore audio autoplay restrictions
        }
      };

      playConnectingTone();
      intervalId = setInterval(playConnectingTone, 1500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    };
  }, [isOpen, isAccepted, isRingingState]);

  // 2. Âm thanh khi RINGING (Đang đổ chuông - Chuông đôi "Ring-Ring" chuyên nghiệp)
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let intervalId: any = null;

    if (isOpen && !isAccepted && isRingingState) {
      const playDoubleRingTone = () => {
        try {
          audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

          const createBurst = (startTime: number) => {
            if (!audioCtx) return;
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc1.type = "sine";
            osc2.type = "sine";
            osc1.frequency.setValueAtTime(440, startTime);
            osc2.frequency.setValueAtTime(480, startTime);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(0.04, startTime + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(audioCtx.destination);

            osc1.start(startTime);
            osc2.start(startTime);
            osc1.stop(startTime + 0.4);
            osc2.stop(startTime + 0.4);
          };

          const now = audioCtx.currentTime;
          createBurst(now);
          createBurst(now + 0.5);
        } catch (e) {
          // Ignore audio autoplay restrictions
        }
      };

      playDoubleRingTone();
      intervalId = setInterval(playDoubleRingTone, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    };
  }, [isOpen, isAccepted, isRingingState]);
};

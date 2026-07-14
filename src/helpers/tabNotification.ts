let originalTitle = document.title || "VIDEOCHAT";
let originalFaviconHref = "";
let flashInterval: ReturnType<typeof setInterval> | null = null;
let isFlashing = false;
let audioContext: AudioContext | null = null;

// Throttling for sound to avoid spamming if multiple messages arrive at once
let lastSoundTime = 0;
const SOUND_THROTTLE_MS = 2000;

/**
 * Initializes the original title and sets up global listeners to clear notifications on focus.
 */
export const initTabNotification = () => {
  if (typeof window === "undefined") return;

  // Capture original title
  if (!originalTitle || originalTitle === "") {
    originalTitle = document.title || "VIDEOCHAT";
  }

  // Capture original favicon
  const faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
  if (faviconLink) {
    originalFaviconHref = faviconLink.href;
  }

  // Clear notification when window gets focus or document is clicked
  const clearOnInteraction = () => {
    clearTabNotification();
  };

  window.addEventListener("focus", clearOnInteraction);
  window.addEventListener("click", clearOnInteraction);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      clearTabNotification();
    }
  });
};

/**
 * Plays a pleasant modern notification chime using Web Audio API.
 * Synthesized dynamically to avoid loading static files and network delays.
 */
export const playNotificationSound = () => {
  try {
    const now = Date.now();
    if (now - lastSoundTime < SOUND_THROTTLE_MS) return; // Throttle
    lastSoundTime = now;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioContext || audioContext.state === "closed") {
      audioContext = new AudioContextClass();
    }

    const ctx = audioContext;
    const time = ctx.currentTime;

    // Pleasant double chime sound: C6 followed by E6/G6 chord
    // First chime (higher note, brief ping)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(1046.50, time); // C6
    osc1.frequency.exponentialRampToValueAtTime(1567.98, time + 0.08); // G6
    
    gain1.gain.setValueAtTime(0.0, time);
    gain1.gain.linearRampToValueAtTime(0.12, time + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start(time);
    osc1.stop(time + 0.3);

    // Second chime (chord, slightly delayed, warmer sound)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1318.51, time + 0.08); // E6
    
    gain2.gain.setValueAtTime(0.0, time + 0.08);
    gain2.gain.linearRampToValueAtTime(0.1, time + 0.11);
    gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.45);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    
    osc2.start(time + 0.08);
    osc2.stop(time + 0.5);

    // Subtle third harmonic for resonance
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(1567.98, time + 0.08); // G6
    
    gain3.gain.setValueAtTime(0.0, time + 0.08);
    gain3.gain.linearRampToValueAtTime(0.05, time + 0.11);
    gain3.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    
    osc3.start(time + 0.08);
    osc3.stop(time + 0.45);

  } catch (error) {
    console.error("Could not play synthesized chime:", error);
  }
};

/**
 * Renders a red dot badge onto the browser tab's favicon dynamically.
 */
export const setFaviconBadge = (hasBadge: boolean) => {
  if (typeof document === "undefined") return;

  let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
  
  if (!faviconLink) {
    // Dynamically insert a favicon link if it doesn't exist
    faviconLink = document.createElement("link");
    faviconLink.rel = "icon";
    faviconLink.type = "image/svg+xml";
    faviconLink.href = "/icons.svg";
    document.head.appendChild(faviconLink);
  }

  if (!originalFaviconHref) {
    originalFaviconHref = faviconLink.href || "/icons.svg";
  }

  if (!hasBadge) {
    faviconLink.href = originalFaviconHref;
    return;
  }

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = originalFaviconHref;
  img.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      const size = 32;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw original icon
      ctx.drawImage(img, 0, 0, size, size);

      // Draw shiny red dot badge in the top-right corner
      const radius = size * 0.25; // radius is 8
      const x = size - radius - 1; // 23
      const y = radius + 1; // 9

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = "#FF3B30"; // iOS red
      ctx.fill();

      // White outline border
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = "#FFFFFF";
      ctx.stroke();

      faviconLink.href = canvas.toDataURL("image/png");
    } catch (e) {
      console.error("Failed to render favicon badge:", e);
    }
  };
};

/**
 * Triggers a visual and audio tab notification.
 * Flashes the document title and adds a red badge dot to the favicon.
 */
export const showTabNotification = (senderName: string, messageText: string) => {
  if (typeof window === "undefined") return;

  // 1. Play chime sound
  playNotificationSound();

  // 2. Set favicon badge (red dot)
  setFaviconBadge(true);

  // 3. Setup title flashing
  if (isFlashing) {
    if (flashInterval) clearInterval(flashInterval);
  }

  isFlashing = true;
  let showNotificationTitle = true;

  const truncateMessage = (text: string, maxLen: number = 30) => {
    if (!text) return "đã gửi tin nhắn";
    return text.length > maxLen ? text.substring(0, maxLen) + "..." : text;
  };

  const cleanSenderName = senderName || "Ai đó";
  const notificationTitle = `🔴 ${cleanSenderName}: "${truncateMessage(messageText)}"`;

  // Start alternating titles
  flashInterval = setInterval(() => {
    document.title = showNotificationTitle ? notificationTitle : originalTitle;
    showNotificationTitle = !showNotificationTitle;
  }, 1500);

  // Set the title immediately
  document.title = notificationTitle;
};

/**
 * Clears any active title flashing and restores the original title and favicon.
 */
export const clearTabNotification = () => {
  if (flashInterval) {
    clearInterval(flashInterval);
    flashInterval = null;
  }
  isFlashing = false;
  
  if (typeof document !== "undefined") {
    // Restore original title
    if (originalTitle) {
      document.title = originalTitle;
    }
    
    // Restore original favicon
    setFaviconBadge(false);
  }
};

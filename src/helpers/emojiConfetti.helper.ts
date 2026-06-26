import type React from "react";

export function triggerEmojiConfetti(emoji: string, clickEvent: React.MouseEvent<HTMLElement>) {
  const rect = clickEvent.currentTarget.getBoundingClientRect();
  
  // Calculate center of clicked element in absolute page coordinates
  const startX = rect.left + rect.width / 2 + window.scrollX;
  const startY = rect.top + rect.height / 2 + window.scrollY;

  const particleCount = 12;
  const duration = 800; // ms

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");
    particle.innerText = emoji;
    
    // Styles
    particle.style.position = "absolute";
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.fontSize = `${16 + Math.random() * 10}px`;
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "99999";
    particle.style.userSelect = "none";

    // Physics
    const angle = Math.random() * Math.PI * 2; // Random direction
    const distance = 40 + Math.random() * 60; // Random distance
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance - 25; // Sway upwards slightly

    // Create unique keyframe animation
    const animName = `emoji-burst-${Math.random().toString(36).substr(2, 9)}`;
    const style = document.createElement("style");
    
    style.innerHTML = `
      @keyframes ${animName} {
        0% {
          transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
          opacity: 1;
        }
        50% {
          opacity: 0.9;
        }
        100% {
          transform: translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(1.3) rotate(${Math.random() * 360 - 180}deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    particle.style.animation = `${animName} ${duration}ms cubic-bezier(0.25, 1, 0.5, 1) forwards`;
    document.body.appendChild(particle);

    // Self-destruct
    setTimeout(() => {
      particle.remove();
      style.remove();
    }, duration + 50);
  }
}

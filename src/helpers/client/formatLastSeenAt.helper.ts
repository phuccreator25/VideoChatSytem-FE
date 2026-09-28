export const getLastSeenText = (lastSeenAt?: string | null) => {
    if (!lastSeenAt) return "Offline";

    const now = Date.now();
    const lastSeen = new Date(lastSeenAt).getTime();
    const diffMs = now - lastSeen;

    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (minutes < 1) return "Active just now";
    if (minutes < 60) return `Active ${minutes}m ago`;
    if (hours < 24) return `Active ${hours}h ago`;
    if (days < 7) return `Active ${days}d ago`;

    return `Last active ${new Date(lastSeenAt).toLocaleDateString("vi-VN")}`;
  };
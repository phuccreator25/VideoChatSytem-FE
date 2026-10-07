export const formatDate = (dateInput?: string | Date | null, includeTime: boolean = false) => {
  if (!dateInput) return "";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "Invalid date";
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      ...(includeTime ? { hour: "2-digit", minute: "2-digit", second: "2-digit" } : {}),
    };
    return d.toLocaleDateString("en-US", options);
  } catch {
    return "Never";
  }
};

export const formatDuration = (seconds: number, status: string): string => {
  if (seconds <= 0 || status === "ringing" || status === "missed" || status === "rejected") {
    return "--:--";
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

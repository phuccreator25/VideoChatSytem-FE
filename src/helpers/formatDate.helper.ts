export const formatDate = (dateInput?: string | Date | null, includeTime: boolean = false) => {
  if (!dateInput) return "";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "Invalid date";
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    };
    return d.toLocaleDateString("en-US", options);
  } catch {
    return "Never";
  }
};

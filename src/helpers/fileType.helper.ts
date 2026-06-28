export type FileVisualMeta = {
  extension: string;
  label: string;
  accent: string;
  soft: string;
  text: string;
  badgeBg: string;   // badge gradient start
  badgeEnd: string;  // badge gradient end
};

export function getFileExtension(fileName: string): string {
  const segments = fileName.split(".");
  return segments.length < 2 ? "" : segments[segments.length - 1].toLowerCase();
}

export function decodeFileName(fileName: string): string {
  try {
    return decodeURIComponent(fileName);
  } catch {
    return fileName;
  }
}

export function formatFileSize(value: string | number): string {
  if (typeof value === "string") return value;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(2)} MB`;
  return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function getFileVisualMeta(fileName: string, mimeType?: string | null): FileVisualMeta {
  const extension = getFileExtension(fileName);
  const mime = mimeType?.toLowerCase() || "";

  if (mime === "application/pdf" || extension === "pdf")
    return { extension: "PDF", label: "PDF", accent: "#ef4444", soft: "#fee2e2", text: "#b91c1c", badgeBg: "#ff6b6b", badgeEnd: "#dc2626" };
  if (mime.includes("word") || extension === "doc" || extension === "docx")
    return { extension: "DOC", label: "Word", accent: "#3b82f6", soft: "#dbeafe", text: "#1d4ed8", badgeBg: "#60a5fa", badgeEnd: "#2563eb" };
  if (mime.includes("excel") || mime.includes("spreadsheet") || ["xls", "xlsx", "csv"].includes(extension))
    return { extension: "XLS", label: "Excel", accent: "#22c55e", soft: "#dcfce7", text: "#15803d", badgeBg: "#4ade80", badgeEnd: "#16a34a" };
  if (mime.includes("powerpoint") || mime.includes("presentation") || ["ppt", "pptx"].includes(extension))
    return { extension: "PPT", label: "PowerPoint", accent: "#f97316", soft: "#ffedd5", text: "#c2410c", badgeBg: "#fb923c", badgeEnd: "#ea580c" };
  if (mime.startsWith("video/") || ["mp4", "webm", "mov"].includes(extension))
    return { extension: extension.toUpperCase() || "VID", label: "Video", accent: "#a855f7", soft: "#f3e4ff", text: "#7e22ce", badgeBg: "#c084fc", badgeEnd: "#9333ea" };
  if (mime === "application/zip" || ["zip", "rar", "7z"].includes(extension))
    return { extension: "ZIP", label: "Archive", accent: "#8b5cf6", soft: "#ede9fe", text: "#6d28d9", badgeBg: "#a78bfa", badgeEnd: "#7c3aed" };
  if (mime === "text/plain" || extension === "txt")
    return { extension: "TXT", label: "Text", accent: "#eab308", soft: "#fef9c3", text: "#a16207", badgeBg: "#facc15", badgeEnd: "#ca8a04" };

  return { extension: extension.toUpperCase() || "FILE", label: "File", accent: "#94a3b8", soft: "#f1f5f9", text: "#475569", badgeBg: "#cbd5e1", badgeEnd: "#64748b" };
}

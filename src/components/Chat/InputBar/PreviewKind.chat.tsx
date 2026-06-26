import { ACCEPTED_NON_IMAGE_FILE_TYPES } from "../../../data/FilesType.data";

type PreviewKind =
  | "image"
  | "video"
  | "pdf"
  | "word"
  | "excel"
  | "powerpoint"
  | "archive"
  | "text"
  | "document";

const ACCEPTED_NON_IMAGE_VALUES = ACCEPTED_NON_IMAGE_FILE_TYPES.split(",").map((item) =>
  item.trim().toLowerCase(),
);

function getFileExtension(fileName: string) {
  const segments = fileName.split(".");
  if (segments.length < 2) return "";

  return `.${segments[segments.length - 1].toLowerCase()}`;
}

export function getPreviewKind(file: File): PreviewKind {
  const mimeType = file.type.toLowerCase();
  const extension = getFileExtension(file.name);
  const isAcceptedNonImage =
    ACCEPTED_NON_IMAGE_VALUES.includes(mimeType) || ACCEPTED_NON_IMAGE_VALUES.includes(extension);

  if (mimeType.startsWith("image/")) return "image";
  if (
    mimeType.startsWith("video/") ||
    extension === ".mp4" ||
    extension === ".webm" ||
    extension === ".mov"
  ) {
    return "video";
  }
  if (mimeType === "application/pdf" || extension === ".pdf") return "pdf";
  if (
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === ".doc" ||
    extension === ".docx"
  ) {
    return "word";
  }
  if (
    mimeType === "application/vnd.ms-excel" ||
    mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    extension === ".xls" ||
    extension === ".xlsx"
  ) {
    return "excel";
  }
  if (
    mimeType === "application/vnd.ms-powerpoint" ||
    mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    extension === ".ppt" ||
    extension === ".pptx"
  ) {
    return "powerpoint";
  }
  if (
    mimeType === "application/zip" ||
    extension === ".zip" ||
    extension === ".rar" ||
    extension === ".7z"
  ) {
    return "archive";
  }
  if (
    mimeType === "text/plain" ||
    mimeType === "text/csv" ||
    extension === ".txt" ||
    extension === ".csv"
  ) {
    return "text";
  }
  if (isAcceptedNonImage) return "document";

  return "document";
}
import type { MessageAttachment, MessageType, TempPreviewFile } from "../types/chat/chat.model.type";
import type { ImageFrameItem } from "../components/Chat/Images/ImageFrame.chat";
import { uploadControllers } from "./uploadS3.helper";

export const getAttachments = (msg: MessageType) => {
  const attachments = (msg.attachments || []) as MessageAttachment[];
  return attachments.map((attachment) => {
    const tempId = attachment.tempAttachmentId;
    const isUploadingLocally = tempId ? uploadControllers.has(tempId) : false;

    // Nếu attachment có status pending/uploading/sending nhưng không có fileUrl, không được upload tích cực ở tab này và không có binary File
    const isAbandoned =
      (attachment.status === "pending" || attachment.status === "uploading" || msg.status === "sending") &&
      !attachment.fileUrl &&
      !isUploadingLocally &&
      !(attachment as MessageAttachment).file;

    return {
      ...attachment,
      status: isAbandoned ? "failed" : attachment.status,
      messageId: msg.id,
    };
  });
};

export const isAudioAttachment = (attachment: MessageAttachment) =>
  String(attachment.mimeType || "").startsWith("audio/") || attachment.resourceType === "audio";

export const isImageAttachment = (attachment: MessageAttachment) =>
  attachment.resourceType === "image" ||
  String(attachment.mimeType || "").startsWith("image/");

export const isVideoAttachment = (attachment: MessageAttachment) =>
  attachment.resourceType === "video" ||
  String(attachment.mimeType || "").startsWith("video/");

export const isRawAttachment = (attachment: MessageAttachment) =>
  !isImageAttachment(attachment) &&
  !isAudioAttachment(attachment) &&
  !isVideoAttachment(attachment);

export const parseImageItems = (msg: MessageType): ImageFrameItem[] => {
  if (msg.type !== "file") return [];

  const FilesBeforeUpload =
    (msg as MessageType & { attachments?: TempPreviewFile[] }).attachments || [];

  const imageAttachments = getAttachments(msg).filter((attachment) =>
    isImageAttachment(attachment),
  );

  if (imageAttachments.length > 0) {
    return imageAttachments.reduce<ImageFrameItem[]>((result, attachment) => {
      const attachmentBeforeUpload = FilesBeforeUpload.find(
        (item) =>
          item.tempAttachmentId &&
          item.tempAttachmentId === attachment.tempAttachmentId,
      );

      const urlBeforeUpload = attachmentBeforeUpload?.previewUrl;
      const fileUrl = attachment.fileUrl ? String(attachment.fileUrl) : "";
      const src = fileUrl || urlBeforeUpload || undefined;

      if (!src) return result;

      result.push({
        src,
        fileName: attachment.fileName || "",
        status: attachment.status || (fileUrl ? "done" : "pending"),
        isPreview: !fileUrl,
        attachmentId: attachment.attachmentId || "",
        messageId: msg.id || "",
      });

      return result;
    }, []);
  }

  return FilesBeforeUpload.reduce<ImageFrameItem[]>((result, item) => {
    if (!item.previewUrl || item.resourceType !== "image") return result;

    result.push({
      src: item.previewUrl,
      fileName: item.fileName || "",
      status: msg.status || "sending",
      isPreview: true,
    });

    return result;
  }, []);
};

export const getFileNote = (msg: MessageType) => {
  if (msg.type !== "file") return "";
  return String(msg.content || "").trim();
};

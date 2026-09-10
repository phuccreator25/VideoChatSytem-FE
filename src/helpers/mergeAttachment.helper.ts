import type { MessageType } from "../types/chat/chat.model.type";

const mergeAttachments = (
  currentAttachments: MessageType["attachments"] = [],
  payloadAttachments: MessageType["attachments"] = [],
) => {
  return payloadAttachments.map((payloadAttachment) => {
    const currentAttachment = currentAttachments.find((attachment) => {
      const sameTempId =
        attachment.tempAttachmentId &&
        payloadAttachment.tempAttachmentId &&
        attachment.tempAttachmentId === payloadAttachment.tempAttachmentId;

      const sameRealId =
        attachment.attachmentId &&
        payloadAttachment.attachmentId &&
        attachment.attachmentId === payloadAttachment.attachmentId;

      return sameTempId || sameRealId;
    });

    return {
      ...currentAttachment,
      ...payloadAttachment,

      // giữ dữ liệu local FE
      file: currentAttachment?.file,
      previewUrl: currentAttachment?.previewUrl,
    };
  });
};

export default mergeAttachments;

import type { MessageType } from "../types/chat/chat.model.type";

export default function useMergeAttachment() {
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
        previewUrl: currentAttachment?.previewUrl,
      };
    });
  };

  return {
    mergeAttachments,
  };
}

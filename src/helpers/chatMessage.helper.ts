import type { MessageType } from "../types/chat.type";
import mergeAttachments from "./mergeAttachment.helper";

export const updateNewMessage = (
    currentMessages: MessageType[],
    newMessage: MessageType,
    tempMessageId?: string
): MessageType[] => {
    const listMessages = currentMessages || [];
    const targetTempId = tempMessageId || newMessage.tempMessageId;

    const existingIndex = listMessages.findIndex(
        (msg) =>
            msg.id === newMessage.id ||
            (targetTempId && (msg.id === targetTempId || msg.tempMessageId === targetTempId))
    );

    if (existingIndex >= 0) {
        const nextMessages = [...listMessages];

        const existingMessage = nextMessages[existingIndex];

        nextMessages[existingIndex] = {
            ...existingMessage,
            ...newMessage,
            attachments: newMessage.attachments?.length
                ? mergeAttachments(existingMessage.attachments, newMessage.attachments)
                : existingMessage.attachments,
        };

        return nextMessages;
    }

    return [...listMessages, newMessage];
};
import { useEffect, useState, type ChangeEvent } from "react";
import {
  ChatItemTypes,
  type MessageType,
  type SelectedGif,
} from "../../../types/chat/chat.model.type";
import type {
  LinkPreviewData,
  SendMessagePayload,
} from "../../../types/chat/chat.payload.type";
import ChatAPI from "../../../api/Chat.api";
import useMergeAttachment from "../../../helpers/mergeAttachment.helper";
import type { IGif } from "@giphy/js-types";

export const useSendMessage = ({
  conversationId,
  currentUserId,
  voiceData,
  voiceUi,
  voiceHandler,
  setMessages,
}: {
  conversationId?: string;
  currentUserId?: string;
  voiceData: { recordedFile: File | null };
  voiceUi: {
    isRecording: boolean;
    recordingDuration: number;
    previewUrl: string | null;
  };
  voiceHandler: { clearRecording: () => void };
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}) => {
  const [inputText, setInputText] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [messageReplyed, setMessageReplyed] = useState<MessageType | null>(
    null,
  );
  const [selectedGif, setSelectedGif] = useState<SelectedGif | null>(null);

  const [linkPreview, setLinkPreview] = useState<LinkPreviewData | null>(null);
  const [isLoadingLinkPreview, setIsLoadingLinkPreview] = useState(false);
  const URL_REGEX = /(https?:\/\/[^\s]+)/g;
  const [previousUrl, setPreviousUrl] = useState<string | null>("");

  const { mergeAttachments } = useMergeAttachment();

  useEffect(() => {
    if (!conversationId || !inputText.trim()) {
      setLinkPreview(null);
      setPreviousUrl("");
      return;
    }

    const match = inputText.match(URL_REGEX);

    if (match && match.length === 1) {
      const currentUrl = match[0];

      if (currentUrl === previousUrl) return;

      setPreviousUrl(currentUrl);

      const timeout = setTimeout(() => {
        handleGetLinkPreview(currentUrl);
      }, 1000);

      return () => clearTimeout(timeout);
    } else {
      setLinkPreview(null);
      setPreviousUrl("");
    }
  }, [inputText, conversationId]);

  const handleGetLinkPreview = async (url: string) => {
    const isCurrentRequest = true;

    try {
      setIsLoadingLinkPreview(true);

      const response = await ChatAPI.onGetLinkPreview(url);

      if (response && isCurrentRequest) {
        setLinkPreview(response.data.data);
        setPreviousUrl(url);
      }
    } catch (error) {
      console.error("Get link preview failed:", error);
      setLinkPreview(null);
    } finally {
      setIsLoadingLinkPreview(false);
    }
  };

  const handleSend = async () => {
    if (
      !conversationId ||
      (!inputText.trim() &&
        files.length < 1 &&
        selectedGif === null &&
        !voiceData.recordedFile)
    ) {
      return;
    }

    if (!currentUserId) return;

    const content = inputText.trim();
    const voiceSnapshot = voiceData.recordedFile;
    const filesSnapshot = [...files, ...(voiceSnapshot ? [voiceSnapshot] : [])];
    const gifSnapshot = selectedGif;
    const replyMessageSnapshot = messageReplyed;

    const tempMessageId = `temp-${Date.now()}`;

    const hasFiles = filesSnapshot.length > 0;
    const hasGif = Boolean(gifSnapshot);

    const previewFiles = filesSnapshot.map((file) => {
      const isImage = file.type.startsWith("image/");
      const isAudio = file.type.startsWith("audio/");
      const isVideo = file.type.startsWith("video/");

      return {
        tempAttachmentId: `att-temp-${crypto.randomUUID()}`,
        file,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,

        resourceType: isImage
          ? "image"
          : isAudio
            ? "audio"
            : isVideo
              ? "video"
              : "raw",

        previewUrl:
          isImage || isVideo
            ? URL.createObjectURL(file)
            : isAudio
              ? voiceUi.previewUrl
              : null,

        recordDuration: isAudio ? voiceUi.recordingDuration : null,
      };
    });

    const previewLink = {
      title: linkPreview?.title || "",
      description: linkPreview?.description || "",
      image: linkPreview?.image || "",
      url: linkPreview?.url || "",
      siteName: linkPreview?.siteName || "",
      domain: linkPreview?.domain || "",
    };

    const tempMessage: MessageType = {
      id: tempMessageId,
      tempMessageId,
      conversationId,
      senderId: currentUserId,
      type: hasFiles
        ? ChatItemTypes.FILE
        : hasGif
          ? ChatItemTypes.GIF
          : ChatItemTypes.TEXT,
      content,
      gifUrl: gifSnapshot?.url || null,
      attachments: previewFiles,
      preview: previewLink,
      status: "sending",
      replyToMessageId: replyMessageSnapshot?.id ?? null,
      replyMessage: replyMessageSnapshot ?? null,
    };

    setMessages((prev) => [...(prev || []), tempMessage]);

    setInputText("");
    setFiles([]);
    setSelectedGif(null);
    setMessageReplyed(null);
    voiceHandler.clearRecording();

    try {
      let payload: SendMessagePayload | FormData;

      if (hasFiles) {
        const formData = new FormData();

        formData.append("tempMessageId", tempMessageId);
        formData.append("conversationId", conversationId);
        formData.append("type", ChatItemTypes.FILE);
        formData.append("content", content);

        previewFiles.forEach((item) => {
          formData.append("files", item.file);
          formData.append(
            "recordDuration",
            String(voiceUi?.recordingDuration ?? 0),
          );
          formData.append("tempAttachmentIds", item.tempAttachmentId);
        });

        payload = formData;
      } else if (hasGif) {
        payload = {
          tempMessageId,
          conversationId,
          type: ChatItemTypes.GIF,
          gifUrl: gifSnapshot?.url || null,
        };
      } else {
        payload = {
          tempMessageId,
          conversationId,
          type: ChatItemTypes.TEXT,
          content: inputText.trim() || "",
          replyToMessageId: replyMessageSnapshot?.id ?? null,
          preview: linkPreview?.url ? previewLink : null,
        };
      }

      const res = await ChatAPI.onSendMessage(payload, conversationId);

      const savedMessage = res.data.data;

      setMessages((prev) => {
        const currentMessages = prev || [];

        const currentTempMessage = currentMessages.find(
          (msg) => msg.id === tempMessageId,
        );

        const mergedSavedMessage = {
          ...savedMessage,
          attachments: savedMessage.attachments?.length
            ? mergeAttachments(
                currentTempMessage?.attachments,
                savedMessage.attachments,
              )
            : currentTempMessage?.attachments,
        };

        const withoutTemp = currentMessages.filter(
          (msg) =>
            msg.id !== tempMessageId && msg.tempMessageId !== tempMessageId,
        );

        if (withoutTemp.some((msg) => msg.id === mergedSavedMessage.id)) {
          return withoutTemp;
        }

        return [...withoutTemp, mergedSavedMessage];
      });
    } catch (error) {
      console.error(error);

      setMessages((prev) =>
        (prev || []).map((msg) =>
          msg.id === tempMessageId
            ? {
                ...msg,
                status: "failed",
              }
            : msg,
        ),
      );
    }
  };

  const handleResend = async (messageFailed: MessageType) => {
    if (!conversationId || !currentUserId) return;

    const tempMessageId = messageFailed.tempMessageId || messageFailed.id;
    const content = messageFailed.content || "";
    const type = messageFailed.type;
    const gifUrl = messageFailed.gifUrl;
    const replyToMessageId = messageFailed.replyToMessageId;

    setMessages((prev) =>
      (prev || []).map((msg) =>
        msg.id === messageFailed.id || msg.tempMessageId === tempMessageId
          ? {
              ...msg,
              status: "sending",
            }
          : msg,
      ),
    );

    try {
      let payload: SendMessagePayload | FormData;

      if (type === ChatItemTypes.FILE) {
        const formData = new FormData();

        formData.append("tempMessageId", tempMessageId);
        formData.append("conversationId", conversationId);
        formData.append("type", ChatItemTypes.FILE);
        formData.append("content", content);

        messageFailed.attachments?.forEach((item) => {
          if (item.file) {
            formData.append("files", item.file);
            formData.append("recordDuration", String(item.recordDuration ?? 0));
            formData.append("tempAttachmentIds", item.tempAttachmentId || "");
          }
        });

        payload = formData;
      } else if (type === ChatItemTypes.GIF) {
        payload = {
          tempMessageId,
          conversationId,
          type: ChatItemTypes.GIF,
          gifUrl: gifUrl || null,
        };
      } else {
        payload = {
          tempMessageId,
          conversationId,
          type: ChatItemTypes.TEXT,
          content: content,
          replyToMessageId: replyToMessageId ?? null,
          preview: messageFailed.preview as LinkPreviewData,
        };
      }

      const res = await ChatAPI.onSendMessage(payload, conversationId);

      const savedMessage = res.data.data;

      setMessages((prev) => {
        const currentMessages = prev || [];
        const currentTempMessage = currentMessages.find(
          (msg) => msg.id === tempMessageId || msg.id === messageFailed.id,
        );

        const mergedSavedMessage = {
          ...savedMessage,
          attachments: savedMessage.attachments?.length
            ? mergeAttachments(
                currentTempMessage?.attachments,
                savedMessage.attachments,
              )
            : currentTempMessage?.attachments,
        };

        const withoutTemp = currentMessages.filter(
          (msg) => msg.id !== tempMessageId && msg.id !== messageFailed.id,
        );

        if (withoutTemp.some((msg) => msg.id === mergedSavedMessage.id)) {
          return withoutTemp;
        }

        return [...withoutTemp, mergedSavedMessage];
      });
    } catch (error) {
      console.error("Resend error:", error);
      setMessages((prev) =>
        (prev || []).map((msg) =>
          msg.id === messageFailed.id || msg.tempMessageId === tempMessageId
            ? {
                ...msg,
                status: "failed",
              }
            : msg,
        ),
      );
    }
  };

  const handleDeleteFailedMessage = (msgId: string) => {
    setMessages((prev) =>
      (prev || []).filter(
        (msg) => msg.id !== msgId && msg.tempMessageId !== msgId,
      ),
    );
  };

  const handleUploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (!files.length || !conversationId) return;

    setFiles(files);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectGif = (gif: IGif) => {
    const gifData: SelectedGif = {
      provider: "giphy",
      providerId: String(gif.id),
      title: gif.title ?? "",
      url: gif.images.original.url,
      previewUrl:
        gif.images.fixed_width?.url ||
        gif.images.fixed_height?.url ||
        gif.images.original.url,
      width: Number(gif.images.original.width),
      height: Number(gif.images.original.height),
    };

    setSelectedGif(gifData);
  };

  const onRemoveGif = () => {
    setSelectedGif(null);
  };

  const applyEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  return {
    inputText,
    files,
    messageReplyed,
    selectedGif,
    linkPreview,
    isLoadingLinkPreview,
    setInputText,
    setMessageReplyed,
    setLinkPreview,
    handleSend,
    handleResend,
    handleDeleteFailedMessage,
    handleUploadFile,
    handleRemoveFile,
    handleSelectGif,
    onRemoveGif,
    applyEmoji,
  };
};

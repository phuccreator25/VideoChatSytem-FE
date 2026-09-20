import { useEffect, useState, type ChangeEvent } from "react";
import {
  ChatItemTypes,
  type MessageAttachment,
  type MessageType,
  type SelectedGif,
} from "../../../types/chat/chat.model.type";
import type {
  LinkPreviewData,
  SendMessagePayload,
} from "../../../types/chat/chat.payload.type";
import ChatAPI from "../../../api/Chat.api";
import type { IGif } from "@giphy/js-types";
import { handleCancelSingleFile, uploadMessageAttachments } from "../../../helpers/uploadS3.helper";
import { compressMultipleImagesHelper } from "../../../helpers/compressImage.helper";
import { enqueueSnackbar } from "notistack";
import { updateNewMessage } from "../../../helpers/chatMessage.helper";
import type { AbortMultipartParams } from "../../../types/upload.type";
import { validateChatFiles } from "../../../validations/upload.validation";

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

  const [isUploadingFiles, setIsUploadingFiles] = useState(false);


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

  const handleSendMessage = async (
    payload: SendMessagePayload,
    previewFiles: any[],
    tempMessageId: string,
    isResend: boolean = false
  ) => {
    try {
      if (payload.type === ChatItemTypes.FILE) {
        setIsUploadingFiles(true);
      }

      const res = isResend
        ? await ChatAPI.onResendMessage(payload, conversationId!)
        : await ChatAPI.onSendMessage(payload, conversationId!);
      const savedMessage = res.data.data;

      setMessages((prev) => updateNewMessage(prev, savedMessage, tempMessageId));

      if (savedMessage?.presignedUrls?.length > 0) {
        await uploadMessageAttachments(
          savedMessage.presignedUrls,
          savedMessage.id,
          previewFiles,
          tempMessageId
        );

        setIsUploadingFiles(false);
      }
    } catch (error: any) {
      console.error("Execute send message error:", error);
      enqueueSnackbar(error?.response?.data?.message || "Failed to send message", {
        variant: "error",
      });

      setMessages((prev) =>
        (prev || []).map((msg) =>
          msg.id === tempMessageId || msg.tempMessageId === tempMessageId
            ? {
              ...msg,
              status: "failed",
            }
            : msg
        )
      );
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
    const rawFiles = [...files, ...(voiceSnapshot ? [voiceSnapshot] : [])];

    const validation = validateChatFiles(rawFiles);
    if (!validation.isValid) return;

    const filesSnapshot = await compressMultipleImagesHelper(rawFiles);
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

    let payload: SendMessagePayload;

    if (hasFiles) {
      payload = {
        tempMessageId,
        conversationId,
        type: ChatItemTypes.FILE,
        content,
        replyToMessageId: replyMessageSnapshot?.id ?? null,
        tempAttachmentIds: previewFiles.map((item) => item.tempAttachmentId),
        attachments: previewFiles.map((item) => ({
          tempAttachmentId: item.tempAttachmentId,
          fileName: item.fileName,
          fileSize: item.fileSize,
          mimeType: item.mimeType,
          resourceType: item.resourceType,
          recordDuration: item.recordDuration,
        })),
      };
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

    await handleSendMessage(payload, previewFiles, tempMessageId);
  };

  const handleResend = async (messageFailed: MessageType) => {
    if (!conversationId || !currentUserId || !messageFailed) return;

    const hasFiles = messageFailed.attachments?.some((att: MessageAttachment) => att.file instanceof File);
    if (messageFailed.type === ChatItemTypes.FILE && !hasFiles) {
      enqueueSnackbar("File data was lost due to page refresh. Please reselect the file to send!", {
        variant: "error",
      });
      return;
    }

    const tempMessageId = messageFailed.tempMessageId || messageFailed.id;
    const content = messageFailed.content || "";
    const type = messageFailed.type;
    const gifUrl = messageFailed.gifUrl;
    const replyToMessageId = messageFailed.replyToMessageId;

    setMessages((prev) =>
      (prev || []).map((msg) => {
        if (msg.id === messageFailed.id || (tempMessageId && msg.tempMessageId === tempMessageId)) {
          const updatedAttachments = msg.attachments?.map((att: any) => ({
            ...att,
            status: att.status === "failed" ? "pending" : att.status,
          }));

          return {
            ...msg,
            status: "sending",
            attachments: updatedAttachments,
          };
        }
        return msg;
      })
    );

    let payload: SendMessagePayload;

    if (type === ChatItemTypes.FILE) {
      payload = {
        messageId: messageFailed?.id,
        tempMessageId,
        conversationId,
        type: ChatItemTypes.FILE,
        content,
        replyToMessageId: replyToMessageId ?? null,
        tempAttachmentIds: messageFailed.attachments?.map((item: any) => item.tempAttachmentId || ""),
        attachments: messageFailed.attachments?.map((item: any) => ({
          tempAttachmentId: item.tempAttachmentId,
          fileName: item.fileName,
          fileSize: item.fileSize,
          mimeType: item.mimeType,
          resourceType: item.resourceType,
          recordDuration: item.recordDuration,
        })),
      };
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
        content,
        replyToMessageId: replyToMessageId ?? null,
        preview: messageFailed.preview as LinkPreviewData,
      };
    }

    await handleSendMessage(payload, (messageFailed.attachments as any[]) || [], tempMessageId, true);
  };

  const handleUploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length || !conversationId) return;

    const validation = validateChatFiles(selectedFiles, files.length);
    if (!validation.isValid) {
      if (event.target) event.target.value = "";
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
    if (event.target) event.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancelUpload = (item: AbortMultipartParams) => {
    handleCancelSingleFile(item);

    if (!item.tempAttachmentId) return;

    setMessages((prev) =>
      (prev || []).map((msg) => {
        if (!msg.attachments?.length) return msg;

        const hasTarget = msg.attachments.some(
          (att: any) => att.tempAttachmentId === item.tempAttachmentId
        );

        if (!hasTarget) return msg;

        const updatedAttachments = msg.attachments.map((att: any) =>
          att.tempAttachmentId === item.tempAttachmentId
            ? { ...att, status: "failed" }
            : att
        );

        return {
          ...msg,
          attachments: updatedAttachments,
        };
      })
    );
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

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploadingFiles) {
        e.preventDefault();
        e.returnValue = "Files are currently uploading. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isUploadingFiles]);

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
    handleUploadFile,
    handleRemoveFile,
    handleSelectGif,
    onRemoveGif,
    applyEmoji,
    handleCancelUpload
  };
};

import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../../redux/store";
import { useState } from "react";
import ContactApi from "../../../api/Contact.api";
import { useNavigate, useParams } from "react-router-dom";
import ChatAPI from "../../../api/Chat.api";
import ConversationsAPI from "../../../api/Conversation.api";
import { enqueueSnackbar } from "notistack";
import { deleteConversation } from "../../../redux/conversation.redux";

type AttachmentType = {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  messageId: string;
  conversationId: string;
  createdAt: string;
};

type ShareLinkType = {
  id: string;
  url: string;
  title: string;
  domain: string;
  messageId: string;
  conversationId: string;
  createdAt: string;
};

export const useProfileDrawer = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const userData = useSelector((state: RootState) => state.chat.userData);
  const [nicknameInput, setNicknameInput] = useState<string | null>(null);
  const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false);
  const [shareMedia, setShareMedia] = useState<AttachmentType[]>([]);
  const [shareFiles, setShareFiles] = useState<AttachmentType[]>([]);
  const [shareLinks, setShareLinks] = useState<ShareLinkType[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<{
    fileUrl: string;
    fileName: string;
  }>();

  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { conversationId } = useParams();
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const displayName = userData?.nickname ?? userData?.fullname ?? "User";

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex);

    if (tabIndex === 0) onGetShareMedia();
    else if (tabIndex === 1) onGetShareFiles();
    else if (tabIndex === 2) onGetShareLinks();
  };

  const onUpdateNickName = async () => {
    try {
      if (!userData?.userId || nicknameInput === null) return;

      const res = await ContactApi.onUpdateContact({
        userId: userData.userId,
        nickname: nicknameInput,
      });

      if (res.status === 200) {
        setIsEditingNickname(false);
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  //Get Share File, Media, Link
  const onGetShareMedia = async () => {
    try {
      if (!conversationId) return;

      const res = await ChatAPI.onGetShareMedia(conversationId);

      if (res.status === 200) {
        setShareMedia(res.data.data);
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const onGetShareFiles = async () => {
    try {
      if (!conversationId) return;

      const res = await ChatAPI.onGetShareFiles(conversationId);

      if (res.status === 200) {
        setShareFiles(res.data.data);
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const onGetShareLinks = async () => {
    try {
      if (!conversationId) return;

      const res = await ChatAPI.onGetShareLinks(conversationId);

      if (res.status === 200) {
        setShareLinks(res.data.data);
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const formatFileSize = (fileSize: number) => {
    const sizeKB = fileSize / 1024;
    const sizeMB = sizeKB / 1024;

    if (sizeMB >= 1) {
      return sizeMB.toFixed(2) + "MB";
    } else if (sizeKB >= 1) {
      return sizeKB.toFixed(2) + "KB";
    }
    return fileSize + "bytes";
  };

  const onHandleDeleteConversation = async () => {
    try {
      if (!conversationId) return;

      setIsLoadingDelete(true);

      const res = await ConversationsAPI.onDeleteConversation(conversationId);

      if (res.status === 200) {
        await dispatch(deleteConversation({ conversationId }));
        enqueueSnackbar('Delete Conversation Success', { variant: 'success' })
        navigate('/chat')
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoadingDelete(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return {
    ui: {
      isEditingNickname,
      activeTab,
      isAvatarPreviewOpen,
      nicknameInput,
      displayName,
      userData,
      isLoadingDelete,
      isDeleteDialogOpen
    },

    data: {
      shareFiles,
      shareMedia,
      shareLinks,
      selectedMedia,
    },

    handlers: {
      handleTabChange,
      setIsEditingNickname,
      setNicknameInput,
      setIsAvatarPreviewOpen,
      onUpdateNickName,
      onGetShareFiles,
      onGetShareLinks,
      onGetShareMedia,
      formatFileSize,
      setSelectedMedia,
      onHandleDeleteConversation,
      setIsDeleteDialogOpen
    },
  };
};

import { useEffect, useState, type ChangeEvent } from "react";
import { enqueueSnackbar } from "notistack";
import { onGetProfile, onUpdateAvatar, onUpdateProfile } from "../../redux/auth.redux";
import type { AppDispatch } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { updateAvatarS3 } from "../../helpers/uploadS3.helper";
import { validateAvatarFile } from "../../validations/upload.validation";
import type { FileItem } from "../../types/data.type";
import ChatAPI from "../../api/Chat.api";

export const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const initialProfile = useSelector(
    (state: RootState) => state.user.currentUser
  );

  const [activeTab, setActiveTab] = useState<number>(0);
  const [openAvatarReview, setOpenAvatarReview] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  const [attachedFiles, setAttachedFiles] = useState<FileItem[]>([]);
  const [messageFile, setMessageFile] = useState<string>("");

  const [showAlert, setShowAlert] = useState<boolean>();
  const [loadingAttachedFiles, setLoadingAttachedFiles] = useState<boolean>(false);

  useEffect(() => {
    dispatch(onGetProfile()).unwrap();
  }, [dispatch]);


  const handleUpdateUser = async (payload: object) => {
    try {
      if (!payload) return;

      const res = await dispatch(onUpdateProfile(payload)).unwrap();

      if (res) {
        enqueueSnackbar("Profile updated successfully", {
          variant: "success",
        });
      }

      return res;
    } catch (error: any) {
      console.log(
        "Error update profile data:",
        error?.response?.data?.message || error?.message
      );
      enqueueSnackbar(error?.response?.data?.message || "Failed to update profile", {
        variant: "error",
      })
    }
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setShowAlert(false)
      const file = event.target.files?.[0]
      if (!file) return

      const avatarValidation = validateAvatarFile(file);
      if (!avatarValidation.isValid) {
        setShowAlert(true);
        setMessageFile(avatarValidation.errorMessage || "Invalid avatar image");
        return;
      }

      const avatar = await updateAvatarS3(file);

      if (avatar?.success && avatar?.fileName) {
        const res = await dispatch(onUpdateAvatar({ fileName: avatar.fileName })).unwrap()

        if (res) {
          enqueueSnackbar("Profile updated successfully", {
            variant: "success",
          });
        }
      }

    } catch (error: any) {
      setShowAlert(true)
      setMessageFile(error?.message || 'Failed to upload avatar')
    }
  }

  const onGetAllAttachedFiles = async (tab: number | null = null, page: number = 1) => {
    if (tab !== 1) return;

    setLoadingAttachedFiles(true);
    try {
      const res = await ChatAPI.onGetAllAttachedFiles(page, 5);

      if (res) {
        setAttachedFiles(res.data?.data || []);
        setTotalPage(res.data?.totalPages || 1);
        setCurrentPage(page);
      }
    } finally {
      setLoadingAttachedFiles(false);
    }
  }

  return {
    ui: {
      activeTab,
      openAvatarReview,
      currentPage,
      totalPage,
      loadingAttachedFiles,
    },
    data: {
      initialProfile,
    },
    handlers: {
      handleAvatarChange,
      setOpenAvatarReview,
      setActiveTab,
      messageFile,
      setMessageFile,
      showAlert,
      attachedFiles,
      handleUpdateUser,
      onGetAllAttachedFiles,
      setCurrentPage
    }
  }
}
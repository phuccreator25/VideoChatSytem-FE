import { useEffect, useState, type ChangeEvent } from "react";
import { enqueueSnackbar } from "notistack";
import { onGetProfile, onUpdateAvatar, onUpdateProfile } from "../../redux/auth.redux";
import type { AppDispatch } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

export const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const initialProfile = useSelector(
    (state: RootState) => state.user.currentUser
  );

  const MAX_SIZE = 2 * 1024 * 1024;
  const [messageFile, setMessageFile] = useState<string>("");

  const [showAlert, setShowAlert] = useState<boolean>();

  useEffect(() => {
    dispatch(onGetProfile()).unwrap();
  }, [dispatch]);

  const handleUpdateUser = async (payload: object) => {
    try {
      if (!payload) return;

      const res = await dispatch(onUpdateProfile(payload)).unwrap();

      if (res) {
        enqueueSnackbar("Cập nhật thông tin thành công", {
          variant: "success",
        });
      }

      return res;
    } catch (error: any) {
      console.log(
        "Error update profile data:",
        error?.response?.data?.message || error?.message
      );
      enqueueSnackbar(error?.response?.data?.message || "Cập nhật thông tin thất bại", {
        variant: "error",
      })
    }
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      if (file.size > MAX_SIZE) {
        setShowAlert(true)
        setMessageFile('Ảnh đại diện không được vượt quá 2MB')
        return
      }

      const formData = new FormData()
      formData.append('file', file)

      const res = await dispatch(onUpdateAvatar(formData)).unwrap()

      if (res) {
        enqueueSnackbar("Cập nhật thông tin thành công", {
          variant: "success",
        });
      }

    } catch (error: any) {
      setShowAlert(true)
      setMessageFile(error?.message || 'Upload avatar thất bại')
    } finally {
      setShowAlert(false)
    }
  }

  return {
    initialProfile,
    handleUpdateUser,
    handleAvatarChange,
    messageFile,
    setMessageFile,
    showAlert
  };
};
import { useEffect, useState, type ChangeEvent } from "react";
import { enqueueSnackbar } from "notistack";
import { onGetProfile, onUpdateAvatar, onUpdateProfile } from "../../redux/auth.redux";
import type { AppDispatch } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { updateAvatarS3 } from "../../helpers/uploadS3.helper";
import { validateAvatarFile } from "../../validations/upload.validation";

export const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const initialProfile = useSelector(
    (state: RootState) => state.user.currentUser
  );

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
      setShowAlert(false)
      const file = event.target.files?.[0]
      if (!file) return

      const avatarValidation = validateAvatarFile(file);
      if (!avatarValidation.isValid) {
        setShowAlert(true);
        setMessageFile(avatarValidation.errorMessage || "Ảnh đại diện không hợp lệ");
        return;
      }

      const avatar = await updateAvatarS3(file);

      if (avatar?.success && avatar?.fileName) {
        const res = await dispatch(onUpdateAvatar({ fileName: avatar.fileName })).unwrap()

        if (res) {
          enqueueSnackbar("Cập nhật thông tin thành công", {
            variant: "success",
          });
        }
      }

    } catch (error: any) {
      setShowAlert(true)
      setMessageFile(error?.message || 'Upload avatar thất bại')
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
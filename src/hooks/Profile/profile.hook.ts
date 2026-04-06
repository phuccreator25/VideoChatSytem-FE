import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { onGetProfile, onUpdateProfile } from "../../redux/auth.redux";
import type { AppDispatch } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@reduxjs/toolkit/query";

export const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const initialProfile = useSelector(
    (state: RootState) => state.user.currentUser,
  );

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
    } catch (error : any) {
      console.log(
        "Error update profile data:",
        error?.response?.data?.message || error?.message,
      );
      throw error;
    }
  };

  return {
    initialProfile,
    handleUpdateUser,
  };
};

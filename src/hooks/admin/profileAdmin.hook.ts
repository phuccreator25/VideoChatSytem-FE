import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { onGetProfileAdmin, onUpdateProfileAdmin } from "../../redux/admin/authAdmin.redux";
import type { typeUpdateAdmin } from "../../types/admin/profileAdmin.type";
import { updateAdminAvatarS3 } from "../../helpers/uploadS3.helper";
import { validateAvatarFile } from "../../validations/upload.validation";
import { enqueueSnackbar } from "notistack";

export function useProfileAdmin() {
    const profileAdmin = useSelector((state: RootState) => state.admin.currentAdmin);
    const [isLoading, setIsLoading] = useState(!profileAdmin);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const onUpdateProfile = async (payload: typeUpdateAdmin) => {
        try {
            if (!payload) return;

            setIsLoading(true);

            await dispatch(onUpdateProfileAdmin(payload));

        } catch (error) {
            setIsLoading(false);
            console.log('UPDATE PROFILE ERROR: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onUpdateAvatar = async (file: File) => {
        const validation = validateAvatarFile(file, true);
        if (!validation.isValid) return;

        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
        setIsUploadingAvatar(true);

        try {
            const uploadRes = await updateAdminAvatarS3(file);
            if (uploadRes?.success && uploadRes?.fileName) {
                await dispatch(onUpdateProfileAdmin({ filename: uploadRes.fileName })).unwrap();
                enqueueSnackbar("Admin avatar updated successfully", { variant: "success" });
            }
        } catch (error: any) {
            console.error("Update admin avatar error:", error);
            enqueueSnackbar(error?.message || "Failed to update avatar", { variant: "error" });
        } finally {
            setIsUploadingAvatar(false);
            setAvatarPreview(null);
        }
    };

    useEffect(() => {
        dispatch(onGetProfileAdmin()).finally(() => {
            setIsLoading(false);
        });
    }, [dispatch]);

    return {
        ui: {
            isLoading,
            isUploadingAvatar,
            avatarPreview
        },
        data: { profileAdmin },
        handler: {
            onUpdateProfile,
            onUpdateAvatar,
        }
    };
}

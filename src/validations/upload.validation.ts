import { enqueueSnackbar } from "notistack";

export const MAX_CHAT_FILE_SIZE = 1 * 1024 * 1024 * 1024;
export const MAX_CHAT_FILE_COUNT = 20;
export const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024;

export type ValidationResult = {
  isValid: boolean;
  errorMessage?: string;
}

export const validateChatFiles = (
  newFiles: File[],
  existingCount: number = 0,
): ValidationResult => {
  if (!newFiles || newFiles.length === 0) {
    return { isValid: true };
  }

  const totalCount = existingCount + newFiles.length;
  if (totalCount > MAX_CHAT_FILE_COUNT) {
    enqueueSnackbar(`Số lượng file gửi không được vượt quá tối đa ${MAX_CHAT_FILE_COUNT} file mỗi lần!`, { variant: "error" });

    return { isValid: false };
  }

  const oversizedFile = newFiles.find((f) => f.size > MAX_CHAT_FILE_SIZE);
  if (oversizedFile) {
    enqueueSnackbar(`File "${oversizedFile.name}" vượt quá dung lượng tối đa 1GB. Vui lòng chọn file nhỏ hơn!`, { variant: "error" });

    return { isValid: false };
  }

  return { isValid: true };
};


export const validateAvatarFile = (
  file: File,
  showErrorSnackbar: boolean = false
): ValidationResult => {
  if (!file) {
    return { isValid: false, errorMessage: "File không hợp lệ" };
  }

  if (file.size > MAX_AVATAR_FILE_SIZE) {
    const errorMessage = "Ảnh đại diện không được vượt quá 5MB";
    if (showErrorSnackbar) {
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
    return { isValid: false, errorMessage };
  }

  return { isValid: true };
};

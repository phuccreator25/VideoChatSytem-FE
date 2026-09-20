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
    enqueueSnackbar(`The number of sent files cannot exceed ${MAX_CHAT_FILE_COUNT} at a time!`, { variant: "error" });

    return { isValid: false };
  }

  const oversizedFile = newFiles.find((f) => f.size > MAX_CHAT_FILE_SIZE);
  if (oversizedFile) {
    enqueueSnackbar(`File "${oversizedFile.name}" exceeds the maximum size limit of 1GB. Please select a smaller file!`, { variant: "error" });

    return { isValid: false };
  }

  return { isValid: true };
};


export const validateAvatarFile = (
  file: File,
  showErrorSnackbar: boolean = false
): ValidationResult => {
  if (!file) {
    return { isValid: false, errorMessage: "Invalid file" };
  }

  if (file.size > MAX_AVATAR_FILE_SIZE) {
    const errorMessage = "Avatar image size cannot exceed 5MB";
    if (showErrorSnackbar) {
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
    return { isValid: false, errorMessage };
  }

  return { isValid: true };
};

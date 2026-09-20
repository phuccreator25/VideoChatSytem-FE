import { useMemo } from "react";
import type { OpenAvatarProps } from "../../../../types/data.type";
import { MediaPreviewModal, type MediaPreviewItem } from "../../../Chat/Dialog/MediaPreviewModal";
import useDownloadFile from "../../../../helpers/downloadFile.helper";

export default function OpenAvatar({
  openAvatarPreview,
  setOpenAvatarPreview,
  profile,
}: OpenAvatarProps) {
  const { onHandleDownloadFile } = useDownloadFile();

  const avatarItems: MediaPreviewItem[] = useMemo(() => {
    if (profile?.avatar) {
      return [
        {
          url: profile.avatar,
          fileName: `${profile.fullname || "avatar"}-avatar.jpg`,
        },
      ];
    }
    return [];
  }, [profile]);

  return (
    <MediaPreviewModal
      open={openAvatarPreview}
      items={avatarItems}
      currentIndex={0}
      onClose={() => setOpenAvatarPreview(false)}
      onDownload={onHandleDownloadFile}
    />
  );
}

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import type { ConversationUserInfo } from "../../../../types/chat/chat.conversation.type";
import { DialogDeleteConversation } from "../../Dialog/DeleteConversation";
import { MediaPreviewModal, type MediaPreviewItem } from "../../Dialog/MediaPreviewModal";

type AttachmentType = {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  resourceType?: string;
  messageId: string;
  conversationId: string;
  createdAt: string;
};

type ProfileDialogsProps = {
  isAvatarPreviewOpen: boolean;
  userData: ConversationUserInfo | null;
  displayName: string;
  selectedMedia?: AttachmentType;
  shareMedia?: AttachmentType[];
  isDeleteDialogOpen: boolean;
  isLoadingDelete: boolean;
  onCloseAvatarPreview: () => void;
  onCloseSelectedMedia: () => void;
  onSelectMedia?: (media: AttachmentType) => void;
  onCloseDeleteDialog: () => void;
  onConfirmDeleteConversation: () => void;
  onDownloadFile: (url: string, fileName: string) => void;
};

export function ProfileDialogs({
  isAvatarPreviewOpen,
  userData,
  displayName,
  selectedMedia,
  shareMedia,
  isDeleteDialogOpen,
  isLoadingDelete,
  onCloseAvatarPreview,
  onCloseSelectedMedia,
  onSelectMedia,
  onCloseDeleteDialog,
  onConfirmDeleteConversation,
  onDownloadFile,
}: ProfileDialogsProps) {
  const avatarItems: MediaPreviewItem[] = useMemo(() => {
    if (userData?.avatar) {
      return [{ url: userData.avatar, fileName: `${displayName}-avatar.jpg` }];
    }
    return [];
  }, [userData, displayName]);

  const selectedMediaIndex = useMemo(() => {
    if (!selectedMedia || !shareMedia) return 0;
    const idx = shareMedia.findIndex((m) => m.fileUrl === selectedMedia.fileUrl);
    return idx !== -1 ? idx : 0;
  }, [selectedMedia, shareMedia]);

  const mediaItems: MediaPreviewItem[] = useMemo(() => {
    if (!shareMedia || shareMedia.length === 0) {
      return selectedMedia
        ? [
            {
              url: selectedMedia.fileUrl,
              fileName: selectedMedia.fileName,
              mimeType: selectedMedia.mimeType,
              resourceType: selectedMedia.resourceType,
            },
          ]
        : [];
    }
    return shareMedia.map((m) => ({
      url: m.fileUrl,
      fileName: m.fileName,
      mimeType: m.mimeType,
      resourceType: m.resourceType,
    }));
  }, [shareMedia, selectedMedia]);

  return (
    <>
      {/* Avatar Preview Modal */}
      {userData?.avatar ? (
        <MediaPreviewModal
          open={isAvatarPreviewOpen}
          items={avatarItems}
          currentIndex={0}
          onClose={onCloseAvatarPreview}
          onDownload={onDownloadFile}
        />
      ) : (
        /* Fallback Initials Avatar Dialog if no avatar image uploaded */
        <Dialog
          open={isAvatarPreviewOpen}
          onClose={onCloseAvatarPreview}
          maxWidth="xs"
          PaperProps={{
            sx: {
              bgcolor: "transparent",
              boxShadow: "none",
              overflow: "visible",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
          slotProps={{
            backdrop: {
              sx: {
                bgcolor: "rgba(15, 23, 42, 0.8)",
                backdropFilter: "blur(12px)",
              },
            },
          }}
        >
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <IconButton
              onClick={onCloseAvatarPreview}
              sx={{
                position: "absolute",
                top: -46,
                right: 0,
                color: "#ffffff",
                bgcolor: "rgba(255, 255, 255, 0.15)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>

            <Avatar
              sx={{
                width: { xs: 260, sm: 320, md: 360 },
                height: { xs: 260, sm: 320, md: 360 },
                borderRadius: "20px",
                border: "6px solid rgba(255, 255, 255, 0.95)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                bgcolor: "#4f46e5",
                fontSize: 80,
                fontWeight: 700,
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        </Dialog>
      )}

      {/* Shared Media Preview Modal */}
      <MediaPreviewModal
        open={Boolean(selectedMedia)}
        items={mediaItems}
        currentIndex={selectedMediaIndex}
        onClose={onCloseSelectedMedia}
        onIndexChange={(newIndex) => {
          if (shareMedia && shareMedia[newIndex]) {
            onSelectMedia?.(shareMedia[newIndex]);
          }
        }}
        onDownload={onDownloadFile}
      />

      {/* Delete Conversation Dialog */}
      <DialogDeleteConversation
        isOpen={isDeleteDialogOpen}
        onClose={onCloseDeleteDialog}
        userData={userData}
        isLoading={isLoadingDelete}
        onConfirm={onConfirmDeleteConversation}
      />
    </>
  );
}

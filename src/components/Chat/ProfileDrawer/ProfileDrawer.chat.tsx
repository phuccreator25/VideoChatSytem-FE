import { useEffect } from "react";
import Box from "@mui/material/Box";

import type { ConversationUserInfo } from "../../../types/chat/chat.conversation.type";
import { customScrollbarSx } from "../../../utils/CustomScroll";
import { useProfileDrawer } from "../../../hooks/Chat/ProfileDrawer/ProfileDrawer.hook";
import useDownloadFile from "../../../helpers/downloadFile.helper";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { ProfileHeader, ProfileTopBar } from "./sub-components/ProfileHeader";
import { ProfileTabs } from "./sub-components/ProfileTabs";
import { ProfileDialogs } from "./sub-components/ProfileDialogs";

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  userData: ConversationUserInfo | null;
};

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const { ui, handlers, data } = useProfileDrawer()
  const { onHandleDownloadFile } = useDownloadFile()

  const isBlocked = useSelector((state: RootState) => Boolean(ui.userData?.userId && state.block.blockStatusMap[ui.userData?.userId]?.isBlockedByMe === true))
  const isMeBlocked = useSelector((state: RootState) => Boolean(ui.userData?.userId && state.block.blockStatusMap[ui.userData?.userId]?.isBlockedMe === true))

  useEffect(() => {
    if (isOpen) {
      handlers.handleTabChange(ui.activeTab);
    }
  }, [isOpen]);

  return (
    <Box
      sx={{
        width: isOpen ? { xs: "100%", sm: 330, md: 360 } : 0,
        opacity: isOpen ? 1 : 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: { xs: "#ffffff", md: "rgba(255, 255, 255, 0.72)" },
        backdropFilter: "blur(30px) saturate(190%)",
        webkitBackdropFilter: "blur(30px) saturate(190%)",
        borderLeft: isOpen ? "1px solid rgba(255, 255, 255, 0.45)" : "0px solid transparent",
        position: { xs: "absolute", md: "relative" },
        right: { xs: 0, md: "auto" },
        top: { xs: 0, md: "auto" },
        zIndex: 50,
        boxShadow: isOpen ? "-15px 0 45px rgba(15, 23, 42, 0.08)" : "none",
        transition: "all 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
        overflow: "hidden",
      }}
    >
      {/* Top Title Bar */}
      <ProfileTopBar onClose={onClose} />

      {/* Main Content Area (User Info & Shared Media/Files Tabs) */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: 2.5,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          ...customScrollbarSx,
        }}
      >
        <ProfileHeader
          userData={ui.userData}
          displayName={ui.displayName}
          isEditingNickname={ui.isEditingNickname}
          nicknameInput={ui.nicknameInput}
          isBlocked={isBlocked}
          isMeBlocked={isMeBlocked}
          onOpenAvatarPreview={() => handlers.setIsAvatarPreviewOpen(true)}
          onSetIsEditingNickname={handlers.setIsEditingNickname}
          onSetNicknameInput={handlers.setNicknameInput}
          onUpdateNickName={handlers.onUpdateNickName}
          onOpenDeleteDialog={() => handlers.setIsDeleteDialogOpen(true)}
          targetLanguage={data.targetLanguage}
          onSelectLanguage={handlers.onSelectLanguage}
        />

        {/* Shared Media & Files Segment */}
        <ProfileTabs
          activeTab={ui.activeTab}
          shareMedia={data.shareMedia}
          shareFiles={data.shareFiles}
          shareLinks={data.shareLinks}
          onTabChange={handlers.handleTabChange}
          onSelectMedia={handlers.setSelectedMedia}
          onDownloadFile={onHandleDownloadFile}
          formatFileSize={handlers.formatFileSize}
        />
      </Box>

      {/* All Preview & Delete Dialogs */}
      <ProfileDialogs
        isAvatarPreviewOpen={ui.isAvatarPreviewOpen}
        userData={ui.userData}
        displayName={ui.displayName}
        selectedMedia={data.selectedMedia}
        shareMedia={data.shareMedia}
        isDeleteDialogOpen={ui.isDeleteDialogOpen}
        isLoadingDelete={ui.isLoadingDelete}
        onCloseAvatarPreview={() => handlers.setIsAvatarPreviewOpen(false)}
        onCloseSelectedMedia={() => handlers.setSelectedMedia(undefined)}
        onSelectMedia={handlers.setSelectedMedia}
        onCloseDeleteDialog={() => handlers.setIsDeleteDialogOpen(false)}
        onConfirmDeleteConversation={handlers.onHandleDeleteConversation}
        onDownloadFile={onHandleDownloadFile}
      />

    </Box>
  );
}

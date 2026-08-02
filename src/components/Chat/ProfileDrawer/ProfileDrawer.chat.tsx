import { useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import InputBase from "@mui/material/InputBase";
import Dialog from "@mui/material/Dialog";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";

import type { ConversationUserInfo } from "../../../types/chat/chat.conversation.type";
import { customScrollbarSx } from "../../../utils/CustomScroll";
import { useProfileDrawer } from "../../../hooks/Chat/ProfileDrawer/ProfileDrawer.hook";
import { getLastSeenText } from "../../../helpers/formatLastSeenAt.helper";
import { formatDate } from "../../../helpers/formatDate.helper";
import useDownloadFile from "../../../helpers/downloadFile.helper";
import { getFileVisualMeta } from "../../../helpers/fileType.helper";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { openCallModal } from "../../../redux/call.redux";
import { onHandleBlockUser, onHandleUnBlockUser } from "../../../redux/block.redux";

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  userData: ConversationUserInfo | null;
};

const MOCK_MUTUAL_GROUPS = [
  { id: 1, name: "Design Team - UI/UX", members: 12, avatarBg: "linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)", short: "DT" },
  { id: 2, name: "Project VideoChat", members: 8, avatarBg: "linear-gradient(135deg, #c7d2fe 0%, #3b82f6 100%)", short: "VC" },
  { id: 3, name: "Chill Out & Coffee", members: 24, avatarBg: "linear-gradient(135deg, #fbcfe8 0%, #db2777 100%)", short: "CC" },
];

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {

  const { ui, handlers, data } = useProfileDrawer()
  const { onHandleDownloadFile } = useDownloadFile()

  const dispatch = useDispatch<AppDispatch>();
  const isBlocked = useSelector((state: RootState) => Boolean(ui.userData?.userId && state.block.blockStatusMap[ui.userData?.userId]?.isBlockedByMe === true))
  const isMeBlocked = useSelector((state: RootState) => Boolean(ui.userData?.userId && state.block.blockStatusMap[ui.userData?.userId]?.isBlockedMe === true))

  useEffect(() => {
    if (isOpen) {
      handlers.handleTabChange(ui.activeTab);
    }
  }, [isOpen]);

  const actionButtonSx = {
    width: 44,
    height: 44,
    borderRadius: "50%",
    color: "#64748b",
    backgroundColor: "rgba(241, 245, 249, 0.8)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    "&:hover": {
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      borderColor: "#4f46e5",
      transform: "scale(1.12) translateY(-2px)",
      boxShadow: "0 8px 16px rgba(79, 70, 229, 0.28)",
    },
  };

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
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a", fontSize: "16px" }}>
          Conversation Details
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: "#64748b",
            bgcolor: "rgba(0,0,0,0.03)",
            "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" },
            transition: "all 0.2s ease",
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2.5,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          ...customScrollbarSx,
        }}
      >
        {/* User Card Profile Cover & Avatar */}
        <Box
          sx={{
            position: "relative",
            borderRadius: 5,
            bgcolor: "rgba(255, 255, 255, 0.45)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
            pb: 2.5,
          }}
        >
          {/* Cover Photo - Dynamic mesh-like gradient */}
          <Box
            sx={{
              height: 95,
              background: "linear-gradient(224deg, #e0c3fc 0%, #8ec5fc 100%)",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
            }}
          />

          {/* Avatar placement */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: -5.5 }}>
            <Avatar
              src={ui.userData?.avatar}
              alt={ui.displayName}
              onClick={() => handlers.setIsAvatarPreviewOpen(true)}
              sx={{
                width: 86,
                height: 86,
                border: "4px solid rgba(255, 255, 255, 0.95)",
                boxShadow: "0 12px 28px -8px rgba(79, 70, 229, 0.25)",
                bgcolor: "#4f46e5",
                fontSize: 28,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "scale(1.08)",
                  boxShadow: "0 14px 32px -6px rgba(79, 70, 229, 0.35)",
                },
              }}
            >
              {ui.displayName.charAt(0).toUpperCase()}
            </Avatar>
          </Box>

          {/* Name & Active Status */}
          <Box sx={{ textAlign: "center", mt: 1.5, px: 2 }}>
            {ui.isEditingNickname ? (
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  mb: 0.5,
                }}
              >
                <InputBase
                  value={ui.nicknameInput}
                  onChange={(e) => handlers.setNicknameInput(e.target.value)}
                  autoFocus
                  placeholder="Enter nickname..."
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#0f172a",
                    borderBottom: "2px solid #4f46e5",
                    px: 0.5,
                    pb: 0.25,
                    width: "150px",
                    "& input": {
                      textAlign: "center",
                    },
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlers.setIsEditingNickname(false);
                      handlers.onUpdateNickName();
                    } else if (e.key === "Escape") {
                      handlers.setNicknameInput(ui.userData?.nickname ?? ui.userData?.fullname ?? "");
                      handlers.setIsEditingNickname(false);
                    }
                  }}
                />
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{
                    position: "absolute",
                    right: 4,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      handlers.setIsEditingNickname(false);
                      handlers.onUpdateNickName();
                    }}
                    sx={{
                      bgcolor: "rgba(34, 197, 94, 0.1)",
                      color: "#22c55e",
                      "&:hover": { bgcolor: "rgba(34, 197, 94, 0.2)" },
                      width: 24,
                      height: 24,
                    }}
                  >
                    <CheckRoundedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      handlers.setNicknameInput(ui.userData?.nickname ?? ui.userData?.fullname ?? "");
                      handlers.setIsEditingNickname(false);
                    }}
                    sx={{
                      bgcolor: "rgba(239, 68, 68, 0.1)",
                      color: "#ef4444",
                      "&:hover": { bgcolor: "rgba(239, 68, 68, 0.2)" },
                      width: 24,
                      height: 24,
                    }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Stack>
              </Box>
            ) : (
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 0.5,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", fontSize: 17, letterSpacing: "-0.2px" }}>
                  {ui.displayName}
                </Typography>
                <Tooltip title="Edit nickname" arrow>
                  <IconButton
                    size="small"
                    onClick={() => {
                      handlers.setNicknameInput(ui.userData?.nickname ?? ui.userData?.fullname ?? "");
                      handlers.setIsEditingNickname(true);
                    }}
                    sx={{
                      position: "absolute",
                      right: -32,
                      color: "#94a3b8",
                      p: 0.5,
                      "&:hover": { color: "#4f46e5", bgcolor: "rgba(79, 70, 229, 0.05)" },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <EditOutlinedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            <Stack direction="row" spacing={0.75} justifyContent="center" alignItems="center" sx={{ mt: 0.5 }}>
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: ui.userData?.isOnline === "online" ? "#22c55e" : "#94a3b8",
                  boxShadow: ui.userData?.isOnline === "online" ? "0 0 10px #22c55e" : "none",
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: ui.userData?.isOnline === "online" ? "#16a34a" : "#64748b",
                  fontWeight: 700,
                  fontSize: "11px",
                  display: "inline-block",
                  lineHeight: 1.4,
                }}
              >
                {ui.userData?.isOnline === 'online' ? "Active now" : getLastSeenText(ui.userData?.lastSeenAt)}
              </Typography>
            </Stack>

          </Box>
        </Box>

        {/* Quick Actions Panel */}
        <Stack direction="row" spacing={1.75} justifyContent="center">
          <Tooltip title="Audio Call" arrow>
            <IconButton disabled={isBlocked || isMeBlocked} sx={actionButtonSx} onClick={() => dispatch(openCallModal({ type: "voice" }))}>
              <CallOutlinedIcon  sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Video Call" arrow>
            <IconButton disabled={isBlocked || isMeBlocked} sx={actionButtonSx} onClick={() => dispatch(openCallModal({ type: "video" }))}>
              <VideocamOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={isBlocked ? "Unblock User" : "Block User"} arrow>
            <IconButton
              sx={{
                ...actionButtonSx,
                "&:hover": {
                  backgroundColor: isBlocked ? "#16a34a" : "#ef4444",
                  color: "#ffffff",
                  borderColor: isBlocked ? "#16a34a" : "#ef4444",
                  transform: "scale(1.12) translateY(-2px)",
                  boxShadow: isBlocked ? "0 8px 16px rgba(22, 163, 74, 0.28)" : "0 8px 16px rgba(239, 68, 68, 0.28)",
                },
              }}

              onClick={() => {
                if (!ui.userData?.userId) return;
                
                if (isBlocked) {
                  dispatch(onHandleUnBlockUser(ui.userData?.userId))
                } else {
                  dispatch(onHandleBlockUser(ui.userData?.userId))
                }
              }}
            >
              {isBlocked ? <LockOpenOutlinedIcon sx={{ fontSize: 18 }} /> : <BlockOutlinedIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Mutual Groups Card (Glassmorphic) */}
        <Paper
          elevation={0}
          sx={{
            p: 2.25,
            borderRadius: 4.5,
            bgcolor: "rgba(255, 255, 255, 0.45)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.01)",
            textAlign: "left",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: "#64748b",
              fontSize: 10.5,
              textTransform: "uppercase",
              letterSpacing: 1,
              display: "block",
              mb: 2,
              textAlign: "left",
            }}
          >
            Mutual Groups
          </Typography>

          <Stack spacing={1.75}>
            {MOCK_MUTUAL_GROUPS.map((group) => (
              <Stack key={group.id} direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: "12px",
                    fontWeight: 700,
                    background: group.avatarBg,
                    color: "#ffffff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  {group.short}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: "#334155",
                      fontSize: "13px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                    }}
                  >
                    {group.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", fontSize: "11px", fontWeight: 500 }}>
                    {group.members} members
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Paper>

        {/* Shared Media & Files Segment */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: "#64748b",
              fontSize: 10.5,
              textTransform: "uppercase",
              letterSpacing: 1,
              display: "block",
              mb: 1.5,
            }}
          >
            Shared Files & Media
          </Typography>

          {/* Segmented Control Pill Tabs */}
          <Tabs
            value={ui.activeTab}
            onChange={(event, newValue) => handlers.handleTabChange(newValue)}
            variant="fullWidth"
            sx={{
              minHeight: 38,
              height: 38,
              bgcolor: "rgba(0, 0, 0, 0.04)",
              borderRadius: "19px",
              p: 0.5,
              mb: 2,
              "& .MuiTabs-indicator": {
                height: "100%",
                borderRadius: "15px",
                bgcolor: "#ffffff",
                boxShadow: "0 3px 10px rgba(0, 0, 0, 0.06)",
                zIndex: 0,
              },
              "& .MuiTab-root": {
                minHeight: 28,
                height: 28,
                borderRadius: "15px",
                zIndex: 1,
                transition: "all 0.22s ease",
                color: "#64748b",
                fontWeight: 700,
                fontSize: "12px",
                textTransform: "none",
                p: 0,
                "&.Mui-selected": {
                  color: "#4f46e5 !important",
                },
              },
            }}
          >
            <Tab label="Media" />
            <Tab label="Docs" />
            <Tab label="Links" />
          </Tabs>

          {/* Tab 1: Photos & Videos Grid */}
          {ui.activeTab === 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1.25,
              }}
            >
              {data.shareMedia.map((photo) => (
                <Box
                  key={photo.messageId}
                  onClick={() => handlers.setSelectedMedia(photo)}
                  sx={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "100%",
                    borderRadius: 3.5,
                    background: `url(${photo.fileUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    "&:hover": {
                      transform: "scale(1.05) translateY(-2px)",
                      boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  {/* Photo Icon Symbol */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255, 255, 255, 0.65)",
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 22 }} />
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Tab 2: Files List */}
          {ui.activeTab === 1 && (
            <Stack spacing={1.25}>
              {data.shareFiles.map((file) => {
                const meta = getFileVisualMeta(file.fileName, file.mimeType);
                return (
                  <Paper
                    key={file.messageId}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 4,
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                      bgcolor: "rgba(255, 255, 255, 0.45)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.85)",
                        borderColor: "rgba(99, 102, 241, 0.25)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: meta.soft,
                          color: meta.text,
                          border: `1px solid ${meta.accent}20`,
                          fontSize: 10,
                          fontWeight: 800,
                        }}
                      >
                        {meta.extension}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1, textAlign: "left" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: "#334155",
                            fontSize: "13px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: { xs: 130, sm: 160 },
                          }}
                        >
                          {file.fileName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", fontSize: "11px", fontWeight: 500 }}>
                          {handlers.formatFileSize(file.fileSize)} • {formatDate(file.createdAt)}
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton
                      size="small"
                      sx={{
                        color: "#64748b",
                        "&:hover": { color: "#4f46e5", bgcolor: "rgba(79,70,229,0.05)" },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <DownloadForOfflineOutlinedIcon onClick={() => onHandleDownloadFile(file.fileUrl, file.fileName)} sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Paper>
                );
              })}
            </Stack>
          )}

          {/* Tab 3: Shared Links List */}
          {ui.activeTab === 2 && (
            <Stack spacing={1.25}>
              {data.shareLinks.map((link) => (
                <Paper
                  key={link.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 4,
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    bgcolor: "rgba(255, 255, 255, 0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.85)",
                      borderColor: "rgba(99, 102, 241, 0.25)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                    <Avatar
                      src={`https://www.google.com/s2/favicons?sz=64&domain=${link.domain}`}
                      variant="rounded"
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "#ffffff",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        p: 0.5,
                        "& img": {
                          objectFit: "contain",
                        }
                      }}
                    >
                      <LinkRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1, textAlign: "left" }}>
                      <Typography
                        variant="body2"
                        component="a"
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          fontWeight: 700,
                          color: "#0f172a",
                          fontSize: "13px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                          textDecoration: "none",
                          "&:hover": {
                            color: "#4f46e5",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {link.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#94a3b8",
                          display: "block",
                          fontSize: "11px",
                          fontWeight: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {link.url} • {formatDate(link.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>
                  <IconButton
                    size="small"
                    component="a"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "#64748b",
                      "&:hover": { color: "#4f46e5", bgcolor: "rgba(79,70,229,0.05)" },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <LaunchRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      </Box>

      {/* Avatar Preview Dialog */}
      <Dialog
        open={ui.isAvatarPreviewOpen}
        onClose={() => handlers.setIsAvatarPreviewOpen(false)}
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
          {/* Close Button */}
          <IconButton
            onClick={() => handlers.setIsAvatarPreviewOpen(false)}
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

          {ui.userData?.avatar ? (
            <Box
              component="img"
              src={ui.userData.avatar}
              alt={ui.displayName}
              sx={{
                maxWidth: { xs: 280, sm: 380, md: 450 },
                maxHeight: "75vh",
                borderRadius: "20px",
                border: "4px solid rgba(255, 255, 255, 0.95)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                display: "block",
              }}
            />
          ) : (
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
              {ui.displayName.charAt(0).toUpperCase()}
            </Avatar>
          )}
        </Box>
      </Dialog>

      {/* Media Preview Dialog */}
      <Dialog
        open={Boolean(data.selectedMedia)}
        onClose={() => handlers.setSelectedMedia(undefined)}
        maxWidth="md"
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
              bgcolor: "rgba(15, 23, 42, 0.82)",
              backdropFilter: "blur(12px)",
            },
          },
        }}
      >
        {data.selectedMedia && (
          <Box sx={{ position: "relative", display: "inline-block" }}>
            {/* Close Button */}
            <IconButton
              onClick={() => handlers.setSelectedMedia(undefined)}
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

            {/* Preview Container */}
            <Box sx={{ position: "relative", display: "block" }}>
              <Box
                component="img"
                src={data.selectedMedia.fileUrl}
                alt={data.selectedMedia.fileName}
                sx={{
                  maxWidth: { xs: "90vw", sm: "80vw", md: "70vw" },
                  maxHeight: "75vh",
                  borderRadius: "20px",
                  border: "4px solid rgba(255, 255, 255, 0.95)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                  display: "block",
                }}
              />

              {/* Floating Download Button inside the image preview */}
              <IconButton
                onClick={() => onHandleDownloadFile(data.selectedMedia?.fileUrl as string, data.selectedMedia?.fileName as string)}
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  color: "#ffffff",
                  bgcolor: "rgba(15, 23, 42, 0.65)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    bgcolor: "rgba(15, 23, 42, 0.85)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <DownloadForOfflineOutlinedIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}

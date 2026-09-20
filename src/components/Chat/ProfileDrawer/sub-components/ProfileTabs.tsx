import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import ImageIcon from "@mui/icons-material/Image";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";

import { getFileVisualMeta } from "../../../../helpers/fileType.helper";
import { formatDate } from "../../../../helpers/formatDate.helper";

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

type ShareLinkType = {
  id: string;
  url: string;
  title: string;
  domain: string;
  messageId: string;
  conversationId: string;
  createdAt: string;
};

type ProfileTabsProps = {
  activeTab: number;
  shareMedia: AttachmentType[];
  shareFiles: AttachmentType[];
  shareLinks: ShareLinkType[];
  onTabChange: (tabIndex: number) => void;
  onSelectMedia: (media: AttachmentType) => void;
  onDownloadFile: (url: string, fileName: string) => void;
  formatFileSize: (fileSize: number) => string;
};

export function ProfileTabs({
  activeTab,
  shareMedia,
  shareFiles,
  shareLinks,
  onTabChange,
  onSelectMedia,
  onDownloadFile,
  formatFileSize,
}: ProfileTabsProps) {
  return (
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
        value={activeTab}
        onChange={(_, newValue) => onTabChange(newValue)}
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
      {activeTab === 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1.25,
          }}
        >
          {shareMedia.map((photo) => {
            const isVideo =
              photo.mimeType?.startsWith("video/") ||
              photo.resourceType === "video";

            return (
              <Box
                key={photo.messageId}
                onClick={() => onSelectMedia(photo)}
                sx={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "100%",
                  borderRadius: 3.5,
                  ...(isVideo
                    ? { bgcolor: "#0f172a" }
                    : {
                        background: `url(${photo.fileUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }),
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
                {isVideo ? (
                  <>
                    <Box
                      component="video"
                      src={photo.fileUrl}
                      preload="none"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(0, 0, 0, 0.35)",
                        color: "#ffffff",
                      }}
                    >
                      <PlayArrowRoundedIcon sx={{ fontSize: 26 }} />
                    </Box>
                  </>
                ) : (
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
                )}
              </Box>
            );
          })}
        </Box>
      )}

      {/* Tab 2: Files List */}
      {activeTab === 1 && (
        <Stack spacing={1.25}>
          {shareFiles.map((file) => {
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
                      {formatFileSize(file.fileSize)} • {formatDate(file.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
                <IconButton
                  size="small"
                  onClick={() => onDownloadFile(file.fileUrl, file.fileName)}
                  sx={{
                    color: "#64748b",
                    "&:hover": { color: "#4f46e5", bgcolor: "rgba(79,70,229,0.05)" },
                    transition: "all 0.2s ease",
                  }}
                >
                  <DownloadForOfflineOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Paper>
            );
          })}
        </Stack>
      )}

      {/* Tab 3: Shared Links List */}
      {activeTab === 2 && (
        <Stack spacing={1.25}>
          {shareLinks.map((link) => (
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
                    },
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
  );
}

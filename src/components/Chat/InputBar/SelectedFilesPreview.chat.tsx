import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useEffect, useMemo } from "react";
import { getPreviewMeta } from "./PreviewData.chat";
import { getPreviewKind } from "./PreviewKind.chat";

type SelectedImagesPreviewProps = {
  files: File[];
  onRemoveFile?: (index: number) => void;
};

function getFileExtension(fileName: string) {
  const segments = fileName.split(".");
  if (segments.length < 2) return "";

  return `.${segments[segments.length - 1].toLowerCase()}`;
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function SelectedImagesPreview({
  files,
  onRemoveFile,
}: SelectedImagesPreviewProps) {
  const previewItems = useMemo(
    () =>
      files.map((file) => {
        const extension = getFileExtension(file.name);
        const kind = getPreviewKind(file);

        return {
          file,
          name: file.name,
          size: file.size,
          url: URL.createObjectURL(file),
          extension,
          kind,
          meta: getPreviewMeta(kind, extension),
        };
      }),
    [files],
  );

  useEffect(() => {
    return () => {
      previewItems.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewItems]);

  if (!files.length) return null;

  return (
    <Box sx={{ mb: 1.6 }}>
      <Typography
        sx={{
          mb: 1,
          fontSize: 12.5,
          fontWeight: 700,
          color: "#475569",
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        Selected files ({files.length})
      </Typography>

      <Stack
        direction="row"
        spacing={1.2}
        sx={{
          overflowX: "auto",
          pb: 0.4,
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(100,116,139,0.32)",
            borderRadius: 99,
          },
        }}
      >
        {previewItems.map((item, index) => (
          <Box
            key={`${item.name}-${index}`}
            sx={{
              position: "relative",
              width: 118,
              height: 118,
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid rgba(148, 163, 184, 0.28)",
              bgcolor: "#fff",
              flexShrink: 0,
              boxShadow: "0 8px 18px rgba(15, 23, 42, 0.12)",
            }}
          >
            {item.kind === "image" ? (
              <>
                <Box
                  component="img"
                  src={item.url}
                  alt={item.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: item.meta.bg,
                  }}
                />
              </>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  background: item.meta.bg,
                  px: 1.2,
                  pt: 1.6,
                  pb: 1.25,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.4,
                    bgcolor: item.meta.iconBg,
                    color: item.meta.iconColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.meta.icon}
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: "rgba(15, 23, 42, 0.86)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.meta.label}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.35,
                      fontSize: 10.5,
                      color: "rgba(15, 23, 42, 0.62)",
                    }}
                  >
                    {formatFileSize(item.size)}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box
              sx={{
                position: "absolute",
                insetInline: 0,
                bottom: 0,
                px: 1.1,
                py: 0.9,
                bgcolor:
                  item.kind === "image" ? "rgba(15, 23, 42, 0.72)" : "rgba(255, 255, 255, 0.82)",
                backdropFilter: "blur(6px)",
              }}
            >
              <Typography
                title={item.name}
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: item.kind === "image" ? "#f8fafc" : "#0f172a",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.name}
              </Typography>
              <Typography
                sx={{
                  mt: 0.2,
                  fontSize: 10,
                  color: item.kind === "image" ? "rgba(226, 232, 240, 0.82)" : "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {item.meta.badge}
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={() => onRemoveFile?.(index)}
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 24,
                height: 24,
                bgcolor: "rgba(15, 23, 42, 0.74)",
                color: "#fff",
                "&:hover": {
                  bgcolor: "rgba(15, 23, 42, 0.9)",
                },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

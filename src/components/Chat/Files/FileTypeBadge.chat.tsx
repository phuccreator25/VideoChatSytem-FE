import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import type { FileVisualMeta } from "../../../helpers/fileType.helper";

export type FileTypeBadgeProps = {
  meta: FileVisualMeta;
};

export function FileTypeBadge({ meta }: FileTypeBadgeProps) {
  return (
    <Box
      sx={{
        width: 50,
        height: 58,
        borderRadius: "10px",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(160deg, ${meta.badgeBg} 0%, ${meta.badgeEnd} 100%)`,
        boxShadow: `0 6px 18px ${meta.badgeEnd}55`,
        flexShrink: 0,
      }}
    >
      {/* folded corner */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 14,
          height: 14,
          bgcolor: "rgba(255,255,255,0.25)",
          clipPath: "polygon(100% 0, 0 0, 100% 100%)",
        }}
      />
      <Stack
        sx={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        spacing={0.3}
      >
        <InsertDriveFileOutlinedIcon
          sx={{ fontSize: 16, color: "rgba(255,255,255,0.9)" }}
        />
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.06em",
            color: "#fff",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {meta.extension}
        </Typography>
      </Stack>
    </Box>
  );
}

// Re-export FileTypeBadge as FileBadge as well for flexible usage
export { FileTypeBadge as FileBadge };

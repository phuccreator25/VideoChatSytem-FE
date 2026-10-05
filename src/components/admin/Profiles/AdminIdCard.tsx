import { useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import type { typeProfileAdmin } from "../../../types/admin/profileAdmin.type";
import { roleLabel } from "../../../data/user.data";
import { formatDate } from "../../../helpers/formatDate.helper";
import avatarDefault from "../../../assets/avatar_default.jpg";

export type AdminIdCardProps = {
  data: typeProfileAdmin | null;
  isUploading?: boolean;
  avatarPreview?: string | null;
  onUploadAvatar?: (file: File) => Promise<void> | void;
};

export const AdminIdCard = ({
  data,
  isUploading = false,
  avatarPreview = null,
  onUploadAvatar,
}: AdminIdCardProps) => {
  const avatar = avatarPreview || data?.avatar || avatarDefault;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUploadAvatar) {
      onUploadAvatar(file);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #17183B 0%, #1e1b4b 60%, #19183D 100%)",
        borderRadius: "18px",
        p: { xs: 2.5, sm: 3.5 },
        boxShadow: "0 10px 30px -5px rgba(30, 27, 75, 0.35)",
        border: "1px solid rgba(99, 102, 241, 0.2)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background glow effect */}
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -60, 
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Card Header Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        {/* Left: Chat App System */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "7px",
              bgcolor: "rgba(99, 102, 241, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#A5B4FC",
            }}
          >
            <AppsRoundedIcon sx={{ fontSize: 16 }} />
          </Box>
          <Typography
            sx={{
              color: "#E0E7FF",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
            }}
          >
            CHAT APP SYSTEM
          </Typography>
        </Box>

        {/* Right: Verified Admin Badge */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            border: "1px solid rgba(165, 180, 252, 0.35)",
            bgcolor: "rgba(99, 102, 241, 0.15)",
            borderRadius: "20px",
            px: 1.5,
            py: 0.4,
          }}
        >
          <Typography
            sx={{
              color: "#C7D2FE",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            VERIFIED ADMIN
          </Typography>
          <VerifiedUserRoundedIcon sx={{ fontSize: 14, color: "#818CF8" }} />
        </Box>
      </Box>

      {/* Card Middle: Profile Details */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2.75,
          my: { xs: 2.5, sm: 3 },
        }}
      >
        {/* Avatar with status indicator & upload trigger */}
        <Box sx={{ position: "relative" }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
            disabled={isUploading}
          />
          <Tooltip title={isUploading ? "Uploading avatar..." : "Click to change avatar"} arrow>
            <Box
              onClick={() => !isUploading && fileInputRef.current?.click()}
              sx={{
                position: "relative",
                cursor: isUploading ? "default" : "pointer",
                borderRadius: "50%",
                display: "inline-block",
                transition: "all 0.25s ease",
                "&:hover .avatar-hover-overlay": {
                  opacity: 1,
                },
              }}
            >
              <Avatar
                src={avatar}
                alt={data?.fullname}
                sx={{
                  width: 76,
                  height: 76,
                  bgcolor: "#4338CA",
                  color: "#FFFFFF",
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  border: "2.5px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.35)",
                  transition: "all 0.3s ease",
                  filter: isUploading ? "brightness(0.65)" : "none",
                }}
              >
              </Avatar>

              {/* Hover Dark Overlay with Camera Icon */}
              {!isUploading && (
                <Box
                  className="avatar-hover-overlay"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    bgcolor: "rgba(15, 23, 42, 0.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <CameraAltRoundedIcon sx={{ fontSize: 24, color: "#FFFFFF" }} />
                </Box>
              )}

              {/* Uploading Circular Progress */}
              {isUploading && (
                <CircularProgress
                  size={32}
                  thickness={4}
                  sx={{
                    color: "#818CF8",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-16px",
                    marginLeft: "-16px",
                  }}
                />
              )}
            </Box>
          </Tooltip>

          {/* Camera Upload Badge Button */}
          <IconButton
            size="small"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: "absolute",
              bottom: -2,
              right: -2,
              width: 26,
              height: 26,
              bgcolor: "#6366F1",
              color: "#FFFFFF",
              border: "2px solid #1e1b4b",
              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.5)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#4F46E5",
                transform: "scale(1.1)",
              },
              "&.Mui-disabled": {
                bgcolor: "#4338CA",
                color: "rgba(255, 255, 255, 0.6)",
              },
            }}
          >
            <CameraAltRoundedIcon sx={{ fontSize: 13 }} />
          </IconButton>

          {/* Green active dot at top-right */}
          <Box
            sx={{
              position: "absolute",
              top: 2,
              right: 2,
              width: 14,
              height: 14,
              borderRadius: "50%",
              bgcolor: "#10B981",
              border: "2.5px solid #1e1b4b",
              boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)",
            }}
          />
        </Box>

        {/* Name, Handle, Email & Status Badges */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            alignItems: "flex-start",
            textAlign: "left",
          }}
        >
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: { xs: "1.3rem", sm: "1.55rem" },
              fontWeight: 700,
              lineHeight: 1.2,
              textAlign: "left",
            }}
          >
            {data?.fullname}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#94A3B8",
              fontSize: "0.85rem",
              fontWeight: 500,
              flexWrap: "wrap",
            }}
          >
            <span>{data?.username}</span>
            <span>•</span>
            <span>{data?.email}</span>
          </Box>

          {/* Badges */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 0.75,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                bgcolor: "rgba(139, 92, 246, 0.2)",
                border: "1px solid rgba(168, 85, 247, 0.35)",
                color: "#DDD6FE",
                fontSize: "0.72rem",
                fontWeight: 600,
                borderRadius: "20px",
                px: 1.35,
                py: 0.35,
              }}
            >
              • {data && roleLabel[data.role]}
            </Box>

            <Box
              sx={{
                bgcolor: "rgba(16, 185, 129, 0.2)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                color: "#6EE7B7",
                fontSize: "0.72rem",
                fontWeight: 600,
                borderRadius: "20px",
                px: 1.35,
                py: 0.35,
              }}
            >
              • {data?.isActive ? "Active" : "Inactive"}
            </Box>

            <Box
              sx={{
                bgcolor: "rgba(6, 182, 212, 0.2)",
                border: "1px solid rgba(6, 182, 212, 0.35)",
                color: "#7DD3FC",
                fontSize: "0.72rem",
                fontWeight: 600,
                borderRadius: "20px",
                px: 1.35,
                py: 0.35,
              }}
            >
              • Normal
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Card Footer: Metadata Strip */}
      <Box
        sx={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          pt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "#94A3B8",
            letterSpacing: "0.3px",
          }}
        >
          Created By:{" "}
          <Box component="span" sx={{ color: "#E2E8F0", fontWeight: 700 }}>
            {data?.createdByUser?.fullname || 'System Root'}
          </Box>
        </Typography>

        <Typography
          sx={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "#94A3B8",
            letterSpacing: "0.3px",
          }}
        >
          JOINED DATE:{" "}
          <Box component="span" sx={{ color: "#E2E8F0", fontWeight: 700 }}>
            {formatDate(data?.createdAt)}
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminIdCard;

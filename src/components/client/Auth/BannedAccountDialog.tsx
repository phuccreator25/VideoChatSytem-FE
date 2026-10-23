import { useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Zoom from "@mui/material/Zoom";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { formatDate } from "../../../helpers/formatDate.helper";
import { EMAIL_ADDRESS } from "../../../data/user.data";

export type BannedAccountDialogProps = {
  open: boolean;
  onClose: () => void;
  banReason?: string;
  bannedAt?: string | Date | null;
  unBannedAt?: string | Date | null;
  onAppealClick?: () => void; // Hỗ trợ mở form ticket/khiếu nại trực tiếp nếu cần
}

export const BannedAccountDialog = ({
  open,
  onClose,
  banReason,
  bannedAt,
  unBannedAt,
  onAppealClick,
} : BannedAccountDialogProps) => {
  const isTemporary = Boolean(unBannedAt);

  // Tính toán thời gian còn lại
  const remainingText = useMemo(() => {
    if (!unBannedAt) return null;
    const target = new Date(unBannedAt).getTime();
    const diff = target - Date.now();

    if (diff <= 0) return "Soon to be unlocked";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} days ${hours} hours`;
    if (hours > 0) return `${hours} hours ${minutes} minutes`;
    return `${minutes} minutes`;
  }, [unBannedAt]);

  // Màu sắc chủ đạo linh hoạt theo hình thức khóa
  const themeColor = isTemporary
    ? {
        main: "#D97706",
        light: "#FEF3C7",
        border: "#FDE68A",
        bgBadge: "rgba(245, 158, 11, 0.12)",
        gradient: "linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)",
        shadow: "rgba(245, 158, 11, 0.2)",
      }
    : {
        main: "#DC2626",
        light: "#FEF2F2",
        border: "#FECACA",
        bgBadge: "rgba(239, 68, 68, 0.12)",
        gradient: "linear-gradient(90deg, #DC2626 0%, #991B1B 100%)",
        shadow: "rgba(220, 38, 38, 0.25)",
      };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Zoom}
      transitionDuration={250}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "24px",
          bgcolor: "#FFFFFF",
          border: `1.5px solid ${themeColor.border}`,
          boxShadow: `0 25px 50px -12px ${themeColor.shadow}`,
          overflow: "hidden",
          p: 0,
        },
      }}
    >
      {/* Top Banner Accent Line */}
      <Box
        sx={{
          height: 5,
          width: "100%",
          background: themeColor.gradient,
        }}
      />

      <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 }, pt: { xs: 3, sm: 3.5 } }}>
        {/* Header với Icon Badge phát sáng & Nút đóng */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2.5 }}>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Vòng hào quang nhẹ bao quanh */}
            <Box
              sx={{
                position: "absolute",
                width: 68,
                height: 68,
                borderRadius: "22px",
                bgcolor: themeColor.bgBadge,
                opacity: 0.6,
                transform: "scale(1.08)",
              }}
            />
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "18px",
                display: "grid",
                placeItems: "center",
                bgcolor: themeColor.bgBadge,
                color: themeColor.main,
                boxShadow: `0 8px 20px ${themeColor.shadow}`,
                zIndex: 1,
              }}
            >
              {isTemporary ? (
                <AccessTimeFilledRoundedIcon sx={{ fontSize: 30 }} />
              ) : (
                <BlockRoundedIcon sx={{ fontSize: 30 }} />
              )}
            </Box>
          </Box>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "#94A3B8",
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              transition: "all 0.15s ease",
              "&:hover": {
                color: "#0F172A",
                bgcolor: "#F1F5F9",
                transform: "rotate(90deg)",
              },
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Tiêu đề & Tag Trạng thái */}
        <Box sx={{ mb: 2.5 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75, flexWrap: "wrap", gap: 0.75 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#0F172A",
                fontSize: { xs: "1.25rem", sm: "1.4rem" },
                letterSpacing: "-0.02em",
              }}
            >
              {isTemporary ? "Account was temporary ban" : "Account was permanent ban"}
            </Typography>

            <Chip
              size="small"
              icon={
                isTemporary ? (
                  <AccessTimeFilledRoundedIcon sx={{ fontSize: "14px !important" }} />
                ) : (
                  <GavelRoundedIcon sx={{ fontSize: "14px !important" }} />
                )
              }
              label={isTemporary ? "Temporary" : "Permanent"}
              sx={{
                fontWeight: 700,
                fontSize: "0.72rem",
                bgcolor: themeColor.light,
                color: themeColor.main,
                border: `1px solid ${themeColor.border}`,
                height: 24,
              }}
            />
          </Stack>

          <Typography
            variant="body2"
            sx={{
              color: "#64748B",
              lineHeight: 1.6,
              fontSize: "0.85rem",
            }}
          >
            {isTemporary ? "The account has been temporarily suspended due to detection of violations of Community Standards or platform security policies." : "The account has been permanently suspended due to detection of violations of Community Standards or platform security policies."}
          </Typography>
        </Box>

        {/* Khối Thông Tin Chi Tiết (Violation Detail Card) */}
        <Box
          sx={{
            p: 2,
            borderRadius: "16px",
            bgcolor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            mb: 2,
          }}
        >
          {/* Lý do xử lý */}
          <Box sx={{ mb: 1.75 }}>
            <Typography
              variant="caption"
              sx={{
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#475569",
                fontSize: "0.7rem",
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 0.75,
              }}
            >
              <ShieldOutlinedIcon sx={{ fontSize: 14, color: themeColor.main }} />
              Reason for ban
            </Typography>

            <Box
              sx={{
                bgcolor: themeColor.light,
                p: 1.25,
                px: 1.5,
                borderRadius: "10px",
                border: `1px solid ${themeColor.border}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: isTemporary ? "#92400E" : "#991B1B",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                }}
              >
                {banReason?.trim() || "Violation of community standards rules."}
              </Typography>
            </Box>
          </Box>

          {/* Metadata thời gian */}
          <Stack spacing={1}>
            {bannedAt && (
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: "#64748B", display: "flex", alignItems: "center", gap: 0.6 }}>
                  <CalendarTodayRoundedIcon sx={{ fontSize: 14, color: "#94A3B8" }} />
                  Time of ban:
                </Typography>
                <Typography variant="caption" sx={{ color: "#1E293B", fontWeight: 600 }}>
                  {formatDate(bannedAt, true)}
                </Typography>
              </Box>
            )}

            {isTemporary && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pt: 1,
                  mt: 0.5,
                  borderTop: "1px solid #E2E8F0",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "#B45309", fontWeight: 700, display: "flex", alignItems: "center", gap: 0.6 }}
                  >
                    <AccessTimeFilledRoundedIcon sx={{ fontSize: 14 }} />
                    Unban time:
                  </Typography>
                  {remainingText && (
                    <Typography variant="caption" sx={{ color: "#D97706", display: "block", fontSize: "0.72rem", fontWeight: 500 }}>
                      (Remaining {remainingText})
                    </Typography>
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: "#B45309", fontWeight: 700 }}>
                  {formatDate(unBannedAt, true)}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        {/* Hộp hỗ trợ khiếu nại (Appeal Note) */}
        <Box
          sx={{
            display: "flex",
            gap: 1.25,
            p: 1.5,
            borderRadius: "12px",
            bgcolor: "#F8FAFC",
            border: "1px solid #E2E8F0",
          }}
        >
          <ErrorOutlineRoundedIcon sx={{ color: "#64748B", fontSize: 18, mt: 0.2, flexShrink: 0 }} />
          <Typography variant="caption" sx={{ color: "#64748B", lineHeight: 1.5, fontSize: "0.75rem" }}>
            If you believe this decision is a mistake or need support to unlock early, please contact the Support team.
          </Typography>
        </Box>
      </DialogContent>

      {/* Hành động dưới chân dialog */}
      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          pb: { xs: 2.5, sm: 3.5 },
          pt: 1,
          gap: 1.25,
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          startIcon={<SupportAgentRoundedIcon />}
          onClick={onAppealClick}
          href={!onAppealClick ? `mailto:${EMAIL_ADDRESS}?subject=Khieunai_KhoaTaiKhoan` : undefined}
          sx={{
            py: 1.1,
            borderRadius: "12px",
            borderColor: "#CBD5E1",
            color: "#334155",
            fontWeight: 600,
            fontSize: "0.85rem",
            textTransform: "none",
            "&:hover": {
              borderColor: "#94A3B8",
              bgcolor: "#F8FAFC",
            },
          }}
        >
          Send appeal
        </Button>

        <Button
          fullWidth
          variant="contained"
          onClick={onClose}
          sx={{
            py: 1.1,
            borderRadius: "12px",
            bgcolor: "#0F172A",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: "0.85rem",
            textTransform: "none",
            boxShadow: "0 4px 14px rgba(15, 23, 42, 0.15)",
            "&:hover": {
              bgcolor: "#1E293B",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.25)",
            },
          }}
        >
          I understand & Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BannedAccountDialog;
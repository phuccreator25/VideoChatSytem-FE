import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import type { IAdminReportItem } from "../../../../types/admin/reportAdmin.type";
import { formatDate } from "../../../../helpers/formatDate.helper";

type ReportReviewerBoxProps = {
  report: IAdminReportItem;
  isPending: boolean;
  isInProgress: boolean;
  isProgressing: boolean;
  isReleasing: boolean;
  canActOnReport: boolean;
  currentAdminId?: string;
  onProgress: () => void;
  onRelease: () => void;
}

export const ReportReviewerBox = ({
  report,
  isPending,
  isInProgress,
  isProgressing,
  isReleasing,
  canActOnReport,
  currentAdminId,
  onProgress,
  onRelease,
} : ReportReviewerBoxProps) => {
  return (
    <>
      {isPending ? (
        <Box
          sx={{
            p: 2,
            borderRadius: "14px",
            bgcolor: "#FFFBEB",
            border: "1.5px solid #FCD34D",
            boxShadow: "0 3px 12px rgba(217, 119, 6, 0.08)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                bgcolor: "#FEF3C7",
                color: "#D97706",
                border: "1px solid #FDE68A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <HourglassTopRoundedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#92400E" }}>
                Unassigned
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#B45309", mt: 0.25, lineHeight: 1.4 }}>
                This ticket is waiting to be accepted. You must click <b>Progress</b> before taking action.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            disabled={isProgressing}
            onClick={onProgress}
            startIcon={
              isProgressing ? (
                <CircularProgress size={16} sx={{ color: "#FFFFFF" }} />
              ) : (
                <PlayArrowRoundedIcon sx={{ fontSize: 19, transition: "transform 0.2s ease" }} />
              )
            }
            sx={{
              whiteSpace: "nowrap",
              alignSelf: { xs: "stretch", sm: "center" },
              flexShrink: 0,
              background: "linear-gradient(135deg, #EA580C 0%, #D97706 60%, #B45309 100%)",
              color: "#FFFFFF",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.825rem",
              letterSpacing: "0.01em",
              px: 2.6,
              py: 1,
              border: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 4px 12px rgba(217, 119, 6, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, #C2410C 0%, #B45309 60%, #92400E 100%)",
                boxShadow: "0 6px 18px rgba(217, 119, 6, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
                transform: "translateY(-1.5px)",
                "& .MuiSvgIcon-root": {
                  transform: "scale(1.15)",
                },
              },
              "&:active": {
                transform: "translateY(0px)",
                boxShadow: "0 2px 6px rgba(217, 119, 6, 0.3)",
              },
              "&.Mui-disabled": {
                background: "linear-gradient(135deg, #FDBA74 0%, #F59E0B 100%)",
                color: "rgba(255, 255, 255, 0.85)",
                opacity: 0.85,
                cursor: "not-allowed",
              },
            }}
          >
            {isProgressing ? "Processing..." : "Process"}
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            p: 2,
            bgcolor: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              Assigned reviewer:
            </Typography>

            <Box
              sx={{
                px: 1.25,
                py: 0.4,
                borderRadius: "8px",
                bgcolor: isInProgress ? "#EDE9FE" : "#DCFCE7",
                color: isInProgress ? "#7C3AED" : "#15803D",
                border: `1px solid ${isInProgress ? "#DDD6FE" : "#BBF7D0"}`,
                fontSize: "0.75rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {isInProgress ? (
                <ShieldOutlinedIcon sx={{ fontSize: 14 }} />
              ) : (
                <CheckCircleOutlineRoundedIcon sx={{ fontSize: 14 }} />
              )}
              {isInProgress ? "In Progress" : "Resolved"}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                <PersonOutlineRoundedIcon sx={{ fontSize: 16, color: "#6366F1" }} />
                <Typography
                  sx={{
                    fontSize: "0.825rem",
                    color: "#6366F1",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {report.assignedTo?.id === currentAdminId ? "(You)" : report.assignedTo?.name}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  color: "#64748B",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                • Assigned at: {formatDate(report.assignedTo?.assignedAt, true) || "--:--"}
              </Typography>
            </Box>

            {isInProgress && (
              <Button
                size="small"
                variant="outlined"
                disabled={isReleasing || !canActOnReport}
                onClick={onRelease}
                startIcon={
                  isReleasing ? (
                    <CircularProgress size={13} color="inherit" />
                  ) : (
                    <ReplayRoundedIcon sx={{ fontSize: 15 }} />
                  )
                }
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  py: 0.4,
                  px: 1.25,
                  color: "#D97706",
                  borderColor: "#FDE68A",
                  bgcolor: "#FFFBEB",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: "#FEF3C7",
                    borderColor: "#F59E0B",
                    color: "#B45309",
                  },
                  "&.Mui-disabled": {
                    pointerEvents: "auto",
                    cursor: "not-allowed",
                    bgcolor: "#F8FAFC",
                    borderColor: "#E2E8F0",
                    color: "#94A3B8",
                  },
                }}
              >
                {isReleasing ? "Releasing..." : "Release"}
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* Banner cảnh báo khi chưa Progress */}
      {isPending && (
        <Box
          sx={{
            p: 1.5,
            px: 2,
            borderRadius: "12px",
            bgcolor: "#FEF2F2",
            border: "1.5px dashed #FECACA",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 20, color: "#DC2626" }} />
          <Box>
            <Typography sx={{ fontSize: "0.825rem", fontWeight: 700, color: "#991B1B" }}>
              Resolution Locked
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#B91C1C", mt: 0.2 }}>
              Admin must <b>Start Progress</b> the ticket before taking action.
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

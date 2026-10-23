import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";

type ReportDrawerFooterProps = {
  isPending: boolean;
  isFinished: boolean;
  isResolved: boolean;
  canActOnReport: boolean;
  isProgressing: boolean;
  isReleasing: boolean;
  isResolving: boolean;
  hasSelectedActions: boolean;
  isCurrentAssignee: boolean;
  onClose: () => void;
  onProgress: () => void;
  onRelease: () => void;
  onResolve: (status: "resolved" | "rejected") => void;
}

export const ReportDrawerFooter = ({
  isPending,
  isFinished,
  isResolved,
  canActOnReport,
  isProgressing,
  isReleasing,
  isResolving,
  hasSelectedActions,
  isCurrentAssignee,
  onClose,
  onProgress,
  onRelease,
  onResolve,
} : ReportDrawerFooterProps) => {
  return (
    <Box
      sx={{
        p: 2.5,
        borderTop: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      {isPending ? (
        <>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: "#CBD5E1",
              color: "#475569",
              bgcolor: "#FFFFFF",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              px: 2.5,
              py: 1,
              "&:hover": {
                borderColor: "#94A3B8",
                bgcolor: "#F8FAFC",
              },
            }}
          >
            Cancel / Close
          </Button>

          <Button
            variant="contained"
            disabled={isProgressing}
            onClick={onProgress}
            startIcon={
              isProgressing ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <PlayArrowRoundedIcon sx={{ fontSize: 18 }} />
              )
            }
            sx={{
              background: "linear-gradient(90deg, #6366F1 0%, #7C3AED 100%)",
              color: "#FFFFFF",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              px: 3.5,
              py: 1.1,
              boxShadow: "0 4px 14px rgba(124, 58, 237, 0.35)",
              "&:hover": {
                background: "linear-gradient(90deg, #4F46E5 0%, #6D28D9 100%)",
                boxShadow: "0 6px 18px rgba(124, 58, 237, 0.45)",
              },
            }}
          >
            {isProgressing ? "Processing..." : "START PROGRESS"}
          </Button>
        </>
      ) : isFinished ? (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleOutlineRoundedIcon sx={{ fontSize: 18, color: isResolved ? "#16A34A" : "#64748B" }} />
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: isResolved ? "#15803D" : "#475569" }}>
              {isResolved ? "Report Completed & Resolved" : "Report Dismissed"}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: "#CBD5E1",
              color: "#475569",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              px: 3,
              py: 1,
            }}
          >
            Close
          </Button>
        </>
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: "#CBD5E1",
                color: "#475569",
                bgcolor: "#FFFFFF",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                px: 2,
                py: 1,
                "&:hover": {
                  borderColor: "#94A3B8",
                  bgcolor: "#F8FAFC",
                },
              }}
            >
              Close
            </Button>

            <Button
              variant="outlined"
              disabled={!canActOnReport || isReleasing || isResolving}
              onClick={onRelease}
              startIcon={
                isReleasing ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <ReplayRoundedIcon sx={{ fontSize: 16 }} />
                )
              }
              sx={{
                borderColor: "#FCD34D",
                color: "#B45309",
                bgcolor: "#FFFBEB",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.825rem",
                px: 2,
                py: 1,
                "&:hover": {
                  borderColor: "#F59E0B",
                  bgcolor: "#FEF3C7",
                },
                "&.Mui-disabled": {
                  pointerEvents: "auto",
                  cursor: "not-allowed",
                  bgcolor: "#F1F5F9",
                  borderColor: "#E2E8F0",
                  color: "#94A3B8",
                  boxShadow: "none",
                },
              }}
            >
              {isReleasing ? "Releasing..." : "Release ticket"}
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Button
              variant="outlined"
              disabled={!canActOnReport}
              loading={isResolving}
              onClick={() => onResolve("rejected")}
              sx={{
                borderColor: "#CBD5E1",
                color: "#475569",
                bgcolor: "#FFFFFF",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                px: 2.2,
                py: 1,
                "&:hover": {
                  borderColor: "#94A3B8",
                  bgcolor: "#F8FAFC",
                },
                "&.Mui-disabled": {
                  pointerEvents: "auto",
                  cursor: "not-allowed",
                  background: "#E2E8F0",
                  color: "#94A3B8",
                  boxShadow: "none",
                },
              }}
            >
              ⚪ Reject report
            </Button>

            <Button
              variant="contained"
              disabled={!canActOnReport || !hasSelectedActions}
              startIcon={<FlashOnRoundedIcon sx={{ fontSize: 18 }} />}
              loading={isResolving}
              onClick={() => onResolve("resolved")}
              sx={{
                background: "linear-gradient(90deg, #DC2626 0%, #EF4444 100%)",
                color: "#FFFFFF",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.85rem",
                px: 2.8,
                py: 1,
                boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)",
                "&:hover": {
                  ...(!isCurrentAssignee && {
                    background: "linear-gradient(90deg, #B91C1C 0%, #DC2626 100%)",
                    boxShadow: "0 6px 18px rgba(220, 38, 38, 0.45)",
                  }),
                },
                "&.Mui-disabled": {
                  pointerEvents: "auto",
                  cursor: "not-allowed",
                  background: "#E2E8F0",
                  color: "#94A3B8",
                  boxShadow: "none",
                },
              }}
            >
              RESOLVE
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

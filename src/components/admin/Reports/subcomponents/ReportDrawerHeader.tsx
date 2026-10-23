import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { IAdminReportItem } from "../../../../types/admin/reportAdmin.type";
import { formatDate } from "../../../../helpers/formatDate.helper";

type ReportDrawerHeaderProps = {
  report: IAdminReportItem;
  isPending: boolean;
  isInProgress: boolean;
  isResolved: boolean;
  onClose: () => void;
}

export const ReportDrawerHeader = ({
  report,
  isPending,
  isInProgress,
  isResolved,
  onClose,
} : ReportDrawerHeaderProps) => {
  return (
    <Box
      sx={{
        p: 3,
        pb: 2,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        borderBottom: "1px solid #F1F5F9",
      }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: "1.15rem",
              color: "#0F172A",
              letterSpacing: "-0.01em",
            }}
          >
            Report Review and Validation:
          </Typography>
          <Box
            sx={{
              px: 1.1,
              py: 0.3,
              borderRadius: "8px",
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              bgcolor: isPending
                ? "#FEF3C7"
                : isInProgress
                  ? "#EDE9FE"
                  : isResolved
                    ? "#DCFCE7"
                    : "#F1F5F9",
              color: isPending
                ? "#B45309"
                : isInProgress
                  ? "#6D28D9"
                  : isResolved
                    ? "#15803D"
                    : "#475569",
              border: `1px solid ${
                isPending
                  ? "#FDE68A"
                  : isInProgress
                    ? "#DDD6FE"
                    : isResolved
                      ? "#BBF7D0"
                      : "#CBD5E1"
              }`,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.6,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: isPending
                  ? "#D97706"
                  : isInProgress
                    ? "#7C3AED"
                    : isResolved
                      ? "#16A34A"
                      : "#64748B",
              }}
            />
            {report.status}
          </Box>
        </Box>
        <Typography
          sx={{
            fontSize: "0.78rem",
            color: "#64748B",
            mt: 0.4,
          }}
        >
          Type:{" "}
          {report.targetType === "message"
            ? "Message Violation"
            : "Account Violation"}{" "}
          • Created: {formatDate(report.createdAt, true)}
        </Typography>
      </Box>

      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          color: "#64748B",
          "&:hover": {
            bgcolor: "#F8FAFC",
            color: "#0F172A",
          },
        }}
      >
        <CloseRoundedIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
};

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import { MESSAGE_REASONS, ACCOUNT_REASONS } from "../../../../../data/Report.data";
import { formatDate } from "../../../../../helpers/formatDate.helper";
import type { ProfileData } from "../../../../../types/profile/profile.model.type";

type AccountWarningSectionProps = {
  profile: ProfileData | null;
}

const getWarningReasonMeta = (reasonId: string) => {
  if (!reasonId) return;
  const msgReason = MESSAGE_REASONS.find((r) => r.id === reasonId);
  if (msgReason) {
    return {
      label: msgReason.label,
      icon: msgReason.icon,
      category: "Tin nhắn",
    };
  }

  const accReason = ACCOUNT_REASONS.find((r) => r.id === reasonId);
  if (accReason) {
    return {
      label: accReason.label,
      icon: accReason.icon,
      category: "Tài khoản",
    };
  }

  return {
    label: reasonId || "Vi phạm quy chuẩn cộng đồng",
    icon: <WarningAmberRoundedIcon sx={{ fontSize: 15 }} />,
    category: "Quy chuẩn",
  };
};

export const AccountWarningSection = ({ profile } : AccountWarningSectionProps) => {
  const warningCount = profile?.warningAccount ?? (profile?.warning?.length || 0);
  const warnings = profile?.warning || [];

  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Không có cảnh báo thì không cần hiển thị alert để giao diện gọn gàng
  if (warningCount === 0) {
    return null;
  }

  const isLevel2 = warningCount >= 2;

  // Tooltip content khi hover vào icon info
  const tooltipContent = (
    <Box sx={{ p: 0.75, maxWidth: 280 }}>
      <Typography sx={{ fontSize: "11.5px", fontWeight: 700, mb: 0.75, color: "#FFFFFF" }}>
        Reason of violations ({warnings.length} times):
      </Typography>
      <Stack spacing={0.6}>
        {warnings.map((item, idx) => {
          const meta = getWarningReasonMeta(item.reason);
          return (
            <Box key={idx} sx={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.95)", lineHeight: 1.35 }}>
              <b>• Times {idx + 1}:</b> {meta?.label}
              {item.warningAt && (
                <Box component="span" sx={{ display: "block", fontSize: "10px", color: "rgba(255, 255, 255, 0.7)", pl: 1 }}>
                  {formatDate(item.warningAt, true)}
                </Box>
              )}
            </Box>
          );
        })}
      </Stack>
      <Typography sx={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.65)", mt: 1, fontStyle: "italic" }}>
        (Click to view details below)
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ mb: 2 }}>
      {/* 1 Alert ngắn gọn, trực quan: màu warning khi 1 lần, màu error khi 2 lần */}
      <Alert
        severity={isLevel2 ? "error" : "warning"}
        icon={
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: "6px",
              bgcolor: isLevel2 ? "rgba(225, 29, 72, 0.12)" : "rgba(217, 119, 6, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isLevel2 ? "#E11D48" : "#D97706",
              flexShrink: 0,
            }}
          >
            {isLevel2 ? (
              <ReportProblemRoundedIcon sx={{ fontSize: 16 }} />
            ) : (
              <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />
            )}
          </Box>
        }
        action={
          warnings.length > 0 ? (
            <Tooltip title={showDetails ? "Close details" : tooltipContent} arrow placement="left">
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails((prev) => !prev);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.3,
                  color: isLevel2 ? "#BE123C" : "#B45309",
                  bgcolor: isLevel2 ? "rgba(225, 29, 72, 0.08)" : "rgba(217, 119, 6, 0.08)",
                  borderRadius: "6px",
                  py: 0.35,
                  px: 0.7,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  flexShrink: 0,
                  "&:hover": {
                    bgcolor: isLevel2 ? "rgba(225, 29, 72, 0.16)" : "rgba(217, 119, 6, 0.16)",
                  },
                }}
              >
                <Typography sx={{ fontSize: "0.68rem", fontWeight: 700 }}>
                  {showDetails ? "Close" : "Details"}
                </Typography>
                <KeyboardArrowDownRoundedIcon
                  sx={{
                    fontSize: 15,
                    transform: showDetails ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s ease",
                  }}
                />
              </Box>
            </Tooltip>
          ) : undefined
        }
        onClick={() => {
          if (warnings.length > 0) setShowDetails((prev) => !prev);
        }}
        sx={{
          borderRadius: "10px",
          border: isLevel2 ? "1px solid #FECDD3" : "1px solid #FDE68A",
          bgcolor: isLevel2 ? "#FFF1F2" : "#FFFBEB",
          color: isLevel2 ? "#9F1239" : "#92400E",
          boxShadow: isLevel2
            ? "0 2px 8px rgba(225, 29, 72, 0.06)"
            : "0 2px 8px rgba(217, 119, 6, 0.04)",
          alignItems: "center",
          py: 0.55,
          px: 1.2,
          cursor: warnings.length > 0 ? "pointer" : "default",
          transition: "all 0.15s ease",
          "&:hover": warnings.length > 0 ? {
            bgcolor: isLevel2 ? "#FFE4E6" : "#FEF3C7",
          } : {},
          "& .MuiAlert-icon": {
            p: 0,
            mr: 1,
            display: "flex",
            alignItems: "center",
          },
          "& .MuiAlert-message": {
            p: 0,
            overflow: "hidden",
            flex: 1,
            minWidth: 0,
          },
          "& .MuiAlert-action": {
            p: 0,
            mr: 0,
            ml: 0.8,
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, flexWrap: "nowrap" }}>
          <Typography
            sx={{
              fontSize: "0.68rem",
              fontWeight: 800,
              lineHeight: 1.25,
              color: isLevel2 ? "#881337" : "#78350F",
              whiteSpace: "nowrap",
            }}
          >
            {isLevel2 ? "Warning level 2" : "Warning level 1"}
          </Typography>
          <Box
            component="span"
            sx={{
              fontSize: "0.525rem",
              fontWeight: 700,
              px: 0.6,
              py: 0.1,
              borderRadius: "4px",
              bgcolor: isLevel2 ? "#FFE4E6" : "#FEF3C7",
              color: isLevel2 ? "#E11D48" : "#B45309",
              border: isLevel2 ? "1px solid #FDA4AF" : "1px solid #FDE68A",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            {isLevel2 ? "Accounts will be locked" : "Need to note"}
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: "0.665rem",
            fontWeight: 500,
            lineHeight: 1.25,
            mt: 0.2,
            color: isLevel2 ? "#BE123C" : "#B45309",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {isLevel2
            ? "Accounts will be locked permanently!"
            : "Account has 1 violation of community standards."}
        </Typography>
      </Alert>

      {/* Chi tiết lý do mở ra khi click vào icon details */}
      <Collapse in={showDetails}>
        <Box
          sx={{
            mt: 1,
            p: 1.25,
            borderRadius: "10px",
            bgcolor: "#FFFFFF",
            border: isLevel2 ? "1px solid #FECDD3" : "1px solid #FDE68A",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.74rem",
              fontWeight: 700,
              color: "#334155",
              mb: 0.8,
            }}
          >
            Details of violations recorded:
          </Typography>

          <Stack spacing={0.75}>
            {warnings.map((item, idx) => {
              const meta = getWarningReasonMeta(item.reason);
              const isItemLevel2 = idx >= 1;

              return (
                <Box
                  key={`${item.reason}-${idx}`}
                  sx={{
                    p: 0.9,
                    px: 1.2,
                    borderRadius: "8px",
                    bgcolor: isItemLevel2 ? "#FFF1F2" : "#F8FAFC",
                    border: isItemLevel2 ? "1px solid #FFE4E6" : "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: "6px",
                        bgcolor: isItemLevel2 ? "#E11D48" : "#D97706",
                        color: "#FFFFFF",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      #{idx + 1}
                    </Box>

                    <Box sx={{ color: isItemLevel2 ? "#E11D48" : "#D97706", display: "flex", flexShrink: 0 }}>
                      {meta?.icon}
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "0.775rem",
                          fontWeight: 700,
                          color: "#0F172A",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {meta?.label}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.4,
                      flexShrink: 0,
                      color: "#64748B",
                    }}
                  >
                    <AccessTimeFilledRoundedIcon sx={{ fontSize: 12, color: "#94A3B8" }} />
                    <Typography sx={{ fontSize: "0.68rem", fontWeight: 500, color: "#64748B" }}>
                      {formatDate(item.warningAt, true) || "--:--"}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};

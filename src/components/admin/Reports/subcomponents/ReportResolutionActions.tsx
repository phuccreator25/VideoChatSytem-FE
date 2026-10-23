import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import type { AdminResolutionAction } from "../../../../types/admin/reportAdmin.type";
import { ACTION_META, reportResolutionActions } from "../../../../data/Report.data";
import { ReportBanDurationBox } from "./ReportBanDurationBox";

type ReportResolutionActionsProps = {
  reportTargetType: "message" | "account";
  selectedActions: AdminResolutionAction[];
  onToggleAction: (actionId: AdminResolutionAction) => void;
  isFinished: boolean;
  // Props for Ban Duration
  banDurationType: "permanent" | "temporary";
  setBanDurationType: (type: "permanent" | "temporary") => void;
  banPreset: string;
  setBanPreset: (preset: string) => void;
  customUnbanDate: string;
  setCustomUnbanDate: (date: string) => void;
  computedUnbanDate: Date | null;
  reportUnBannedAt?: string | null;
}

export const ReportResolutionActions = ({
  reportTargetType,
  selectedActions,
  onToggleAction,
  isFinished,
  banDurationType,
  setBanDurationType,
  banPreset,
  setBanPreset,
  customUnbanDate,
  setCustomUnbanDate,
  computedUnbanDate,
  reportUnBannedAt,
} : ReportResolutionActionsProps) => {
  const actionOptions: {
    id: AdminResolutionAction;
    title: string;
    code: string;
    icon: React.ReactNode;
    desc: string;
    badge: string;
    accent: string;
    lightBg: string;
    activeBorder: string;
  }[] = Object.entries(reportResolutionActions).map(([key, title]) => {
    const meta = ACTION_META[key] || {
      icon: <FlashOnRoundedIcon sx={{ fontSize: 18 }} />,
      desc: "Thực thi giải pháp xử lý báo cáo",
      badge: "Xử lý",
      accent: "#7C3AED",
      lightBg: "#F5F3FF",
      activeBorder: "#7C3AED",
    };
    return {
      id: key as AdminResolutionAction,
      title,
      code: key,
      ...meta,
    };
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.25,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#0F172A",
              letterSpacing: "-0.01em",
            }}
          >
            2. SELECT RESOLUTION ACTIONS:
          </Typography>
          <Typography
            sx={{
              fontSize: "0.72rem",
              color: "#64748B",
              fontWeight: 500,
            }}
          >
            (Max 3 action)
          </Typography>
        </Box>

        <Chip
          size="small"
          label={`${selectedActions.length}/3 Đã chọn`}
          sx={{
            fontSize: "0.72rem",
            fontWeight: 700,
            height: 24,
            bgcolor: selectedActions.length > 0 ? "rgba(124, 58, 237, 0.1)" : "#F1F5F9",
            color: selectedActions.length > 0 ? "#7C3AED" : "#64748B",
            border: `1px solid ${selectedActions.length > 0 ? "rgba(124, 58, 237, 0.25)" : "#E2E8F0"}`,
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {actionOptions.map((opt) => {
          const isSelected = selectedActions.includes(opt.id);
          const isMaxReached = selectedActions.length >= 3 && !isSelected;
          const selectionIndex = isSelected ? selectedActions.indexOf(opt.id) + 1 : null;
          const isExclusive = opt.id === "none" || opt.id === "dismissed";
          const isDisabled = !isFinished && isMaxReached && !isExclusive;

          return (
            <React.Fragment key={opt.id}>
              <Box
                onClick={() => !isDisabled && onToggleAction(opt.id)}
                sx={{
                  p: 1.35,
                  px: 1.6,
                  borderRadius: "12px",
                  border: isSelected
                    ? `1.5px solid ${opt.activeBorder}`
                    : "1px solid #E2E8F0",
                  bgcolor: isSelected ? opt.lightBg : "#FFFFFF",
                  cursor: isFinished ? "default" : isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.55 : 1,
                  transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                  ...(reportTargetType === "account" && opt.id === "deleted_message" && {
                    opacity: 0.45,
                    pointerEvents: "none",
                    userSelect: "none",
                    filter: "grayscale(30%)",
                  }),
                  boxShadow: isSelected
                    ? `0 3px 12px ${opt.accent}1A`
                    : "0 1px 2px rgba(15, 23, 42, 0.02)",
                  "&:hover": {
                    borderColor: isFinished || isDisabled ? undefined : isSelected ? opt.activeBorder : "#CBD5E1",
                    bgcolor: isFinished || isDisabled ? undefined : isSelected ? opt.lightBg : "#F8FAFC",
                    transform: isFinished || isDisabled ? "none" : "translateY(-1px)",
                  },
                }}
              >
                {/* Left: Icon + Text Info */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.35,
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: isSelected ? "#FFFFFF" : opt.lightBg,
                      color: opt.accent,
                      border: isSelected
                        ? `1px solid ${opt.activeBorder}40`
                        : "1px solid transparent",
                      boxShadow: isSelected
                        ? "0 2px 6px rgba(0,0,0,0.04)"
                        : "none",
                      flexShrink: 0,
                      transition: "all 0.18s ease",
                    }}
                  >
                    {opt.icon}
                  </Box>

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "0.835rem",
                          fontWeight: isSelected ? 700 : 600,
                          color: isSelected ? "#0F172A" : "#1E293B",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {opt.title}
                      </Typography>

                      <Box
                        component="span"
                        sx={{
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          px: 0.8,
                          py: 0.15,
                          borderRadius: "5px",
                          bgcolor: isSelected
                            ? `${opt.accent}18`
                            : "#F1F5F9",
                          color: isSelected ? opt.accent : "#64748B",
                          textTransform: "uppercase",
                          letterSpacing: "0.03em",
                          lineHeight: 1.3,
                        }}
                      >
                        {opt.badge}
                      </Box>

                      {selectionIndex && selectedActions.length > 1 && (
                        <Box
                          component="span"
                          sx={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            px: 0.6,
                            py: 0.1,
                            borderRadius: "4px",
                            bgcolor: opt.accent,
                            color: "#FFFFFF",
                            lineHeight: 1.2,
                          }}
                        >
                          #{selectionIndex}
                        </Box>
                      )}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "0.74rem",
                        color: isSelected ? "#475569" : "#64748B",
                        mt: 0.25,
                        lineHeight: 1.35,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {opt.desc}
                    </Typography>
                  </Box>
                </Box>

                {/* Right: Custom Checkbox Indicator */}
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "7px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    border: isSelected
                      ? `2px solid ${opt.accent}`
                      : "1.5px solid #CBD5E1",
                    bgcolor: isSelected ? opt.accent : "transparent",
                    transition: "all 0.18s ease",
                  }}
                >
                  {isSelected && (
                    <CheckRoundedIcon
                      sx={{
                        fontSize: 14,
                        color: "#FFFFFF",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.8,
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* Nếu chọn action banned_user thì cho admin chọn thời gian unban hoặc chọn vĩnh viễn */}
              {opt.id === "banned_user" && isSelected && (
                <ReportBanDurationBox
                  isFinished={isFinished}
                  banDurationType={banDurationType}
                  setBanDurationType={setBanDurationType}
                  banPreset={banPreset}
                  setBanPreset={setBanPreset}
                  customUnbanDate={customUnbanDate}
                  setCustomUnbanDate={setCustomUnbanDate}
                  computedUnbanDate={computedUnbanDate}
                  reportUnBannedAt={reportUnBannedAt}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

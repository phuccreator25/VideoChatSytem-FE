import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import DoNotDisturbOnRoundedIcon from "@mui/icons-material/DoNotDisturbOnRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import type { IAdminReportKpi } from "../../../types/admin/reportAdmin.type";
import { useSearchParams } from "react-router-dom";

type ReportKpiCardsProps = {
  kpis?: IAdminReportKpi;
  selectedStatus?: string;
}

export const ReportKpiCards = ({ kpis, selectedStatus }: ReportKpiCardsProps) => {
  const cards = [
    {
      id: "pending",
      label: "Pending",
      subtitle: "Reports to be reviewed",
      count: String(kpis?.pendingCount).padStart(2, "0"),
      badgeText: "Pending",
      themeColor: "#D97706",
      numberColor: "#B45309",
      bgGradient: "linear-gradient(135deg, #FFFFFF 0%, #FFFDF7 55%, #FEF9EE 100%)",
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
      iconShadow: "rgba(217, 119, 6, 0.2)",
      borderColor: "#FDE68A",
      hoverGlow: "rgba(245, 158, 11, 0.16)",
      tagBg: "#FFFBEB",
      tagBorder: "#FDE68A",
      tagColor: "#B45309",
      IconComponent: HourglassTopRoundedIcon,
    },
    {
      id: "in_progress",
      label: "In Progress",
      subtitle: "Reports being reviewed",
      count: String(kpis?.inProgressCount).padStart(2, "0"),
      badgeText: "In Progress",
      themeColor: "#2563EB",
      numberColor: "#1D4ED8",
      bgGradient: "linear-gradient(135deg, #FFFFFF 0%, #F9FBFF 55%, #EFF6FF 100%)",
      iconBg: "#EFF6FF",
      iconColor: "#2563EB",
      iconShadow: "rgba(37, 99, 235, 0.2)",
      borderColor: "#BFDBFE",
      hoverGlow: "rgba(37, 99, 235, 0.16)",
      tagBg: "#EFF6FF",
      tagBorder: "#BFDBFE",
      tagColor: "#1D4ED8",
      IconComponent: ManageSearchRoundedIcon,
    },
    {
      id: "resolved",
      label: "Resolved",
      subtitle: "Reports resolved today",
      count: String(kpis?.resolvedTodayCount).padStart(2, "0"),
      badgeText: "Resolved",
      themeColor: "#059669",
      numberColor: "#059669",
      bgGradient: "linear-gradient(135deg, #FFFFFF 0%, #F8FDFB 55%, #ECFDF5 100%)",
      iconBg: "#ECFDF5",
      iconColor: "#059669",
      iconShadow: "rgba(16, 185, 129, 0.2)",
      borderColor: "#A7F3D0",
      hoverGlow: "rgba(16, 185, 129, 0.16)",
      tagBg: "#ECFDF5",
      tagBorder: "#A7F3D0",
      tagColor: "#059669",
      IconComponent: TaskAltRoundedIcon,
    },
    {
      id: "rejected",
      label: "Rejected",
      subtitle: "Reports rejected",
      count: String(kpis?.rejectedCount).padStart(2, "0"),
      badgeText: "Rejected",
      themeColor: "#64748B",
      numberColor: "#475569",
      bgGradient: "linear-gradient(135deg, #FFFFFF 0%, #FAFBFD 55%, #F1F5F9 100%)",
      iconBg: "#F1F5F9",
      iconColor: "#64748B",
      iconShadow: "rgba(100, 116, 139, 0.2)",
      borderColor: "#CBD5E1",
      hoverGlow: "rgba(100, 116, 139, 0.16)",
      tagBg: "#F8FAFC",
      tagBorder: "#CBD5E1",
      tagColor: "#475569",
      IconComponent: DoNotDisturbOnRoundedIcon,
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  const handleSelectStatus = (status: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (status === 'all') {
      newParams.delete('status');
    } else {
      newParams.set('status', status);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: { xs: 2, sm: 2.25 },
      }}
    >
      {cards.map((card) => {
        const isSelected = selectedStatus === card.id;
        const Icon = card.IconComponent;

        return (
          <Box
            key={card.id}
            onClick={() => handleSelectStatus(isSelected ? "all" : card.id)}
            sx={{
              position: "relative",
              overflow: "hidden",
              background: card.bgGradient,
              borderRadius: "16px",
              border: isSelected
                ? `2px solid ${card.themeColor}`
                : `1px solid ${card.borderColor}`,
              p: { xs: 2.25, md: 2.5 },
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isSelected
                ? `0 10px 25px -4px ${card.hoverGlow}, 0 2px 6px rgba(0, 0, 0, 0.04)`
                : "0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
              transform: isSelected ? "translateY(-4px)" : "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 145,
              "&:hover": {
                transform: "translateY(-4px)",
                borderColor: card.themeColor,
                boxShadow: `0 12px 28px -6px ${card.hoverGlow}, 0 4px 10px rgba(0, 0, 0, 0.04)`,
                "& .kpi-arrow-icon": {
                  opacity: 1,
                  transform: "translateX(2px)",
                },
                "& .kpi-watermark-icon": {
                  transform: "scale(1.1) rotate(5deg)",
                  opacity: 0.1,
                },
              },
            }}
          >
            <Box
              className="kpi-watermark-icon"
              sx={{
                position: "absolute",
                right: -10,
                bottom: -10,
                color: card.themeColor,
                opacity: 0.05,
                pointerEvents: "none",
                transition: "all 0.35s ease",
              }}
            >
              <Icon sx={{ fontSize: 96 }} />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1.5,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "#0F172A",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                  }}
                >
                  {card.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                    fontWeight: 500,
                    mt: 0.35,
                  }}
                >
                  {card.subtitle}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  bgcolor: card.iconBg,
                  color: card.iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${card.iconShadow}`,
                  border: `1px solid ${card.borderColor}`,
                  transition: "transform 0.25s ease",
                }}
              >
                <Icon sx={{ fontSize: 22 }} />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                mt: 2.25,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "2rem", md: "2.35rem" },
                  fontWeight: 800,
                  color: card.numberColor,
                  lineHeight: 1,
                  letterSpacing: "-0.035em",
                  fontFeatureSettings: '"tnum"',
                }}
              >
                {card.count}
              </Typography>

              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1.25,
                  py: 0.45,
                  borderRadius: "20px",
                  bgcolor: card.tagBg,
                  border: `1px solid ${card.tagBorder}`,
                  color: card.tagColor,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                }}
              >
                <span>{card.badgeText}</span>
                <ArrowForwardRoundedIcon
                  className="kpi-arrow-icon"
                  sx={{
                    fontSize: 12,
                    opacity: isSelected ? 1 : 0.6,
                    transition: "all 0.2s ease",
                  }}
                />
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

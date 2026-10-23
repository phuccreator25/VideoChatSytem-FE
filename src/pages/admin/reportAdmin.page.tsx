import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { keyframes } from "@emotion/react";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

import { ReportKpiCards } from "../../components/admin/Reports/ReportKpiCards";
import { ReportFilters } from "../../components/admin/Reports/ReportFilters";
import { ReportTable } from "../../components/admin/Reports/ReportTable";
import { ReportInspectorDrawer } from "../../components/admin/Reports/ReportInspectorDrawer";
import { useReportAdmin } from "../../hooks/admin/reportAdmin.hook";

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.7);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 6px rgba(217, 119, 6, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(217, 119, 6, 0);
  }
`;

export function ReportAdminPage() {
  const { ui, data, handler } = useReportAdmin();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.35rem", sm: "1.5rem" },
              letterSpacing: "-0.02em",
              color: "#0F172A",
            }}
          >
            Reports Queue
          </Typography>
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1.25,
            px: 2,
            py: 0.85,
            borderRadius: "10px",
            bgcolor: "#FFFBEB",
            border: "1px solid #FDE68A",
            boxShadow: "0 1px 3px rgba(245, 158, 11, 0.08)",
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#D97706",
              animation: `${pulseAnimation} 1.8s infinite ease-in-out`,
            }}
          />
          <ShieldOutlinedIcon sx={{ fontSize: 16, color: "#B45309" }} />
          <Typography
            sx={{
              fontSize: "0.825rem",
              fontWeight: 700,
              color: "#B45309",
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            {data.kpis?.pendingCount || 0} Pending
          </Typography>
        </Box>
      </Box>

      <ReportKpiCards
        kpis={data.kpis}
        selectedStatus={data.query.status}
      />

      <ReportFilters
        query={data.query}
        onRefresh={handler.onGetData}
      />

      <ReportTable
        reports={data.reports}
        selectedReportId={ui.isDrawerOpen ? ui.selectedReport?.id : null}
        onViewDetail={handler.handleSelectReport}
        page={ui.page}
        limit={ui.limit}
        pagination={ui.pagination}
        loading={ui.loading}
      />

      <ReportInspectorDrawer
        open={ui.isDrawerOpen}
        report={ui.selectedReport}
        onClose={handler.handleCloseDrawer}
        onProgress={handler.onProgress}
        onResolve={handler.onResolve}
        onRelease={handler.onRelease}
      />
    </Box>
  );
}

export default ReportAdminPage;

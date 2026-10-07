import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { keyframes } from "@emotion/react";
import { useCallAdmin } from "../../hooks/admin/callAdmin.hook";
import { CallFilters } from "../../components/admin/Calls/CallFilters";
import { CallTable } from "../../components/admin/Calls/CallTable";
import { CallDetailModal } from "../../components/admin/Calls/CallDetailModal";

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
`;

export function CallAdminPage() {

  const { ui, data, handler } = useCallAdmin();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Top Header & Metrics Badge (Đã bỏ button Live WebRTC theo yêu cầu) */}
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
              fontWeight: 700,
              fontSize: { xs: "1.35rem", sm: "1.5rem" },
              letterSpacing: "-0.02em",
              color: "#0F172A",
            }}
          >
            Calls Management
          </Typography>
        </Box>

        {/* Quick Metrics Badge: Thẻ 🟢 3 Active Calls (Đã bỏ nút Live WebRTC) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.9,
              borderRadius: "10px",
              bgcolor: "#ECFDF5",
              border: "1px solid #A7F3D0",
              boxShadow: "0 1px 2px rgba(16, 185, 129, 0.05)",
            }}
          >
            <Box
              sx={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                bgcolor: "#10B981",
                animation: `${pulseAnimation} 1.8s infinite ease-in-out`,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#059669",
                letterSpacing: "0.01em",
                lineHeight: 1,
              }}
            >
              {data.activeCallsCount} Active Calls
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Toolbar & Filter Bar */}
      <CallFilters
        filters={ui.query}
        onGetData={handler.onFetchData}
      />

      {/* Data Table (Bỏ Cột ID trong table theo yêu cầu) */}
      <CallTable
        calls={data.calls}
        onViewDetail={handler.setSelectedCallForDetail}
        page={ui.page}
        total={data.pagination.total}
        limit={ui.limit}
        loading={ui.loading}
      />

      {/* Modal Xem chi tiết phiên gọi */}
      <CallDetailModal
        open={Boolean(ui.selectedCallForDetail)}
        call={ui.selectedCallForDetail}
        onClose={() => handler.setSelectedCallForDetail(null)}
      />
    </Box>
  );
}

export default CallAdminPage;

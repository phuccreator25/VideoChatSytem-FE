import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { customScrollbarSx } from '../../../../utils/CustomScroll';
import ReportDetailsDrawer from './Reports/ReportDetailsDrawer';
import { useTicket } from '../../../../hooks/client/Ticket/ticket.hook';
import ListReportSkeleton from '../../Sketon/sketon.report';
import ReportListHeader from './Reports/SubComponents/ReportListHeader';
import ReportEmptyState from './Reports/SubComponents/ReportEmptyState';
import ReportCard from './Reports/SubComponents/ReportCard';
import ReportPagination from './Reports/SubComponents/ReportPagination';

export default function ReportFrame() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { ui, data, handler } = useTicket();

  const activeReport = () => {
    if (!data.selectedReportId) return null;
    return data?.tickets?.find((r) => r.id === data.selectedReportId) || null;
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#F8FAFC',
        borderRadius: { xs: '10px', sm: '20px' },
        border: { xs: 'none', sm: '1px solid #E2E8F0' },
        boxShadow: { xs: 'none', sm: '0 10px 30px -5px rgba(15, 23, 42, 0.05)' },
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: ui.isDrawerOpen
              ? { xs: '0%', md: '38%' }
              : '100%',
            minWidth: ui.isDrawerOpen
              ? { xs: 0, md: '380px' }
              : '100%',
            maxWidth: ui.isDrawerOpen
              ? { xs: 0, md: '460px' }
              : '100%',
            opacity: ui.isDrawerOpen ? { xs: 0, md: 1 } : 1,
            pointerEvents: ui.isDrawerOpen && isMobile ? 'none' : 'auto',
            bgcolor: '#FFFFFF',
            borderRight: ui.isDrawerOpen ? { md: '1px solid #E2E8F0' } : 'none',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
            flexShrink: 0,
            transition: 'all 1.0s cubic-bezier(0.32, 0.72, 0, 1)',
            overflow: 'hidden',
          }}
        >
          <ReportListHeader
            isDrawerOpen={ui.isDrawerOpen}
            query={data.query}
            searchQuery={data.searchQuery}
            searchParams={data.searchParams}
            setSearchParams={handler.setSearchParams}
            setSearchQuery={handler.setSearchQuery}
          />

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              p: { xs: 2, sm: 2.5, md: 3 },
              display: 'grid',
              gridTemplateColumns: ui.isDrawerOpen
                ? '1fr'
                : { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gridAutoRows: { xs: 'auto', md: ui.isDrawerOpen ? 'auto' : '204px' },
              gap: { xs: 2.25, sm: 2.5 },
              alignContent: 'flex-start',
              textAlign: 'left',
              ...customScrollbarSx,
            }}
          >
            {ui.loading ? (
              <ListReportSkeleton count={data?.pagination?.limit ?? 10} isDrawerOpen={ui.isDrawerOpen} />
            ) : data.tickets.length === 0 ? (
              <ReportEmptyState />
            ) : (
              data.tickets.map((item) => (
                <ReportCard
                  item={item}
                  isSelected={activeReport()?.id === item.id}
                  isDrawerOpen={ui.isDrawerOpen}
                  onSelect={(id: string) => {
                    handler.setSelectedReportId(id);
                    handler.setIsDrawerOpen(true);
                  }}
                />
              ))
            )}
          </Box>

          <ReportPagination
            pagination={data.pagination}
          />
        </Box>

        <Box
          sx={{
            flex: ui.isDrawerOpen ? 1 : 0,
            width: ui.isDrawerOpen ? { xs: '100%', md: '62%' } : 0,
            minWidth: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#F8FAFC',
            overflow: 'hidden',
            opacity: ui.isDrawerOpen ? 1 : 0,
            transform: ui.isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'all 1.0s cubic-bezier(0.32, 0.72, 0, 1)',
            visibility: ui.isDrawerOpen ? 'visible' : 'hidden',
          }}
        >
          {activeReport && (
            <ReportDetailsDrawer
              report={activeReport()}
              onClose={() => {
                handler.setIsDrawerOpen(false);
                handler.setSelectedReportId(null);
              }}
              onCancelReport={async (id) => {
                const res = await handler.onCancel(id);
                if (res) {
                  handler.setIsDrawerOpen(false);
                  handler.setSelectedReportId(null);
                }
                return res;
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

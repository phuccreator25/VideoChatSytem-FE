import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { customScrollbarSx } from '../../../utils/CustomScroll';

export type ReportCardSkeletonProps = {
  isDrawerOpen?: boolean;
};

/**
 * Skeleton cho từng thẻ Báo cáo trong ListReport
 */
export function ReportCardSkeleton({ isDrawerOpen = false }: ReportCardSkeletonProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.25, sm: 2.5 },
        borderRadius: '16px',
        position: 'relative',
        textAlign: 'left',
        height: { xs: 'auto', md: isDrawerOpen ? 'auto' : '204px' },
        minHeight: { xs: '200px', md: isDrawerOpen ? '204px' : '204px' },
        minWidth: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
      }}
    >
      {/* KHỐI NỘI DUNG CHÍNH (MAIN BODY) */}
      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Hàng 1: Icon + [ID & Ngày giờ] + [Status Badge ở góc phải] */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
          {/* Icon loại báo cáo */}
          <Skeleton
            variant="rounded"
            width={40}
            height={40}
            animation="wave"
            sx={{ borderRadius: '11px', flexShrink: 0, bgcolor: 'rgba(0, 0, 0, 0.06)' }}
          />

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            {/* ID & Ngày giờ */}
            <Box sx={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton
                variant="text"
                width={70}
                height={18}
                animation="wave"
                sx={{ bgcolor: 'rgba(0, 0, 0, 0.08)' }}
              />
              <Skeleton
                variant="text"
                width={85}
                height={14}
                animation="wave"
                sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)' }}
              />
            </Box>

            {/* Status Badge pill */}
            <Skeleton
              variant="rounded"
              width={88}
              height={22}
              animation="wave"
              sx={{ borderRadius: '12px', flexShrink: 0, bgcolor: 'rgba(0, 0, 0, 0.06)' }}
            />
          </Box>
        </Stack>

        {/* Hàng 2: Tiêu đề vi phạm */}
        <Skeleton
          variant="text"
          width="80%"
          height={20}
          animation="wave"
          sx={{ mt: 1.5, bgcolor: 'rgba(0, 0, 0, 0.08)' }}
        />

        {/* Hàng 3: Chip lý do vi phạm */}
        <Box sx={{ mt: 1 }}>
          <Skeleton
            variant="rounded"
            width={120}
            height={22}
            animation="wave"
            sx={{ borderRadius: '7px', bgcolor: 'rgba(0, 0, 0, 0.06)' }}
          />
        </Box>

        {/* Hàng 4: Trích dẫn nội dung hoặc mô tả */}
        <Skeleton
          variant="text"
          width="92%"
          height={16}
          animation="wave"
          sx={{ mt: 1, bgcolor: 'rgba(0, 0, 0, 0.05)' }}
        />
      </Box>

      {/* KHỐI CHÂN THẺ CỐ ĐỊNH (BOTTOM FOOTER ZONE) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          mt: 'auto',
          pt: 1.25,
          borderTop: '1px solid #F1F5F9',
          minHeight: '28px',
          minWidth: 0,
        }}
      >
        <Skeleton
          variant="rounded"
          width={130}
          height={18}
          animation="wave"
          sx={{ borderRadius: '6px', bgcolor: 'rgba(0, 0, 0, 0.05)' }}
        />

        <Skeleton
          variant="circular"
          width={18}
          height={18}
          animation="wave"
          sx={{ bgcolor: 'rgba(0, 0, 0, 0.06)', flexShrink: 0 }}
        />
      </Box>
    </Paper>
  );
}

export type ListReportSkeletonProps = {
  count?: number;
  isDrawerOpen?: boolean;
};

/**
 * Skeleton Grid cho danh sách thẻ báo cáo trong ListReport
 */
export function ListReportSkeleton({ count = 6, isDrawerOpen = false }: ListReportSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ReportCardSkeleton key={index} isDrawerOpen={isDrawerOpen} />
      ))}
    </>
  );
}

/**
 * Standalone Skeleton View cho toàn bộ phần danh sách Report
 */
export function ListReportContainerSkeleton({ count = 6, isDrawerOpen = false }: ListReportSkeletonProps) {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        p: { xs: 2, sm: 2.5, md: 3 },
        display: 'grid',
        gridTemplateColumns: isDrawerOpen
          ? '1fr'
          : { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        gridAutoRows: { xs: 'auto', md: isDrawerOpen ? 'auto' : '204px' },
        gap: { xs: 2.25, sm: 2.5 },
        alignContent: 'flex-start',
        textAlign: 'left',
        ...customScrollbarSx,
      }}
    >
      <ListReportSkeleton count={count} isDrawerOpen={isDrawerOpen} />
    </Box>
  );
}

export default ListReportSkeleton;

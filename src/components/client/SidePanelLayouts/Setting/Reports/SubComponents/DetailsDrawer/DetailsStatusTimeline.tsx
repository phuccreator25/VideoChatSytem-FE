import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { IReportTicket } from '../../../../../../../types/Report.type';
import { formatDate } from '../../../../../../../helpers/formatDate.helper';
  
type DetailsStatusTimelineProps = {
  report: IReportTicket;
};

export default function DetailsStatusTimeline({
  report,
}: DetailsStatusTimelineProps) {
  const isPending = report.status === 'pending';
  const isInProgress = report.status === 'in_progress';
  const isFinished = report.status === 'resolved' || report.status === 'rejected';

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        bgcolor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
      }}
    >
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#334155',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          pb: 2,
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        2. STATUS TIMELINE
      </Typography>

      <Box sx={{ mt: 3, px: { xs: 1, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '14px',
              left: '16%',
              width: '34%',
              height: '3px',
              bgcolor: !isPending ? '#10B981' : '#E2E8F0',
              zIndex: 0,
              transition: 'background-color 0.3s ease',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              top: '14px',
              left: '50%',
              width: '34%',
              height: '3px',
              bgcolor: isFinished ? '#10B981' : '#E2E8F0',
              zIndex: 0,
              transition: 'background-color 0.3s ease',
            }}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
              width: '33%',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: '#10B981',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 700,
                boxShadow: '0 0 0 4px #ECFDF5',
              }}
            >
              ✓
            </Box>
            <Typography sx={{ mt: 1, fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
              1. Sent report
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#64748B', mt: 0.25 }}>
              {formatDate(report.createdAt, true)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
              width: '33%',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: isFinished ? '#10B981' : isInProgress ? '#3B82F6' : '#F1F5F9',
                color: isFinished || isInProgress ? '#FFFFFF' : '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isFinished ? '14px' : '12px',
                fontWeight: 700,
                boxShadow: isFinished
                  ? '0 0 0 4px #ECFDF5'
                  : isInProgress
                    ? '0 0 0 4px #EFF6FF, 0 0 12px rgba(59, 130, 246, 0.4)'
                    : 'none',
                animation: isInProgress ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.6)' },
                  '70%': { transform: 'scale(1.06)', boxShadow: '0 0 0 8px rgba(59, 130, 246, 0)' },
                  '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' },
                },
              }}
            >
              {isFinished ? '✓' : '2'}
            </Box>
            <Typography sx={{ mt: 1, fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
              2. Receipt & Verification
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#64748B', mt: 0.25 }}>
              {formatDate(report.assignedAt, true) || (isPending ? 'Đang xếp hàng duyệt' : 'Chưa tiếp nhận')}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
              width: '33%',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: isFinished ? '#10B981' : '#F1F5F9',
                color: isFinished ? '#FFFFFF' : '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isFinished ? '14px' : '12px',
                fontWeight: 700,
                boxShadow: isFinished ? '0 0 0 4px #ECFDF5' : 'none',
              }}
            >
              {isFinished ? '✓' : '3'}
            </Box>
            <Typography sx={{ mt: 1, fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
              3. Completion
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#64748B', mt: 0.25 }}>
              {formatDate(report.resolvedAt, true) || 'Chờ kết luận'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

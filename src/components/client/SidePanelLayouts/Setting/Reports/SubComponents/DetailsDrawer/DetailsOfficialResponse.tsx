import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { IReportTicket } from '../../../../../../../types/Report.type';
import { reportResolutionActions } from '../../../../../../../data/Report.data';
import { formatDate } from '../../../../../../../helpers/formatDate.helper';

type DetailsOfficialResponseProps = {
  report: IReportTicket;
};

export default function DetailsOfficialResponse({
  report,
}: DetailsOfficialResponseProps) {
  const isResolved = report.status === 'resolved';

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: '16px',
        bgcolor: isResolved ? '#F0FDF4' : '#F8FAFC',
        border: `1.5px solid ${isResolved ? '#86EFAC' : '#CBD5E1'}`,
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
      }}
    >
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 700,
          color: isResolved ? '#166534' : '#475569',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
        }}
      >
        3. CONCLUSION & OFFICIAL RESPONSE
      </Typography>

      {report.resolutionActions && report.resolutionActions.length > 0 && (
        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {report.resolutionActions.map((act) => (
            <Box
              key={act}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6,
                px: 1.25,
                py: 0.4,
                borderRadius: '8px',
                bgcolor: isResolved ? '#DCFCE7' : '#E2E8F0',
                color: isResolved ? '#15803D' : '#334155',
                border: `1px solid ${isResolved ? '#BBF7D0' : '#CBD5E1'}`,
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {reportResolutionActions[act] || act}
            </Box>
          ))}
        </Box>
      )}

      {report.feedbackToReporter && (
        <Box sx={{ mt: 1.5 }}>
          <Typography
            sx={{
              fontSize: '12.5px',
              fontWeight: 700,
              color: isResolved ? '#166534' : '#334155',
            }}
          >
            Feedback:
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              fontSize: '13px',
              lineHeight: 1.5,
              textAlign: 'justify',
              color: isResolved ? '#15803D' : '#475569',
            }}
          >
            “ {report.feedbackToReporter} ”
          </Typography>
        </Box>
      )}

      <Typography
        sx={{
          mt: 2,
          fontSize: '11px',
          color: isResolved ? '#166534' : '#64748B',
          opacity: 0.9,
        }}
      >
        Time completed: {formatDate(report.resolvedAt,true)} • Policy: User protection & Fraud prevention
      </Typography>
    </Box>
  );
}

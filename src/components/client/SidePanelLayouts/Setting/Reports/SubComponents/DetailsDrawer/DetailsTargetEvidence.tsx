import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import type { IReportTicket } from '../../../../../../../types/Report.type';
import { ACCOUNT_REASONS, MESSAGE_REASONS } from '../../../../../../../data/Report.data';
import { formatDate } from '../../../../../../../helpers/formatDate.helper';

type DetailsTargetEvidenceProps = {
  report: IReportTicket;
  onOpenLightbox: (index: number) => void;
};

export default function DetailsTargetEvidence({
  report,
  onOpenLightbox,
}: DetailsTargetEvidenceProps) {
  
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
          pb: 1.75,
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        1. TARGET USER & EVIDENCE
      </Typography>

      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1.75 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: '#4F46E5',
            fontSize: '18px',
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          {report.targetUser.fullname.charAt(0).toUpperCase()}
        </Avatar>

        <Box>
          <Typography sx={{ fontSize: '14.5px', fontWeight: 700, color: '#0F172A' }}>
            Target user: {report.targetUser.fullname}
          </Typography>
          <Typography sx={{ fontSize: '12.5px', color: '#64748B', mt: 0.25 }}>
            Email: @{report.targetUser.email}
          </Typography>
        </Box>
      </Box>

      {report.targetType === 'message' && report.reportedMessageSnapshot && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: '12px',
            bgcolor: '#2E1065',
            border: '1px solid #7C3AED',
            color: '#FFFFFF',
          }}
        >
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#D8B4FE',
              letterSpacing: '0.03em',
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
            }}
          >
            <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 14 }} />
            REPORTED MESSAGE SNAPSHOT:
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: '13.5px',
              lineHeight: 1.5,
              color: '#FFFFFF',
              fontFamily: 'inherit',
            }}
          >
            {report.reportedMessageSnapshot.mediaUrl ? (
              <Box
                component="a"
                href={report.reportedMessageSnapshot?.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                sx={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: 'monospace',
                  display: 'inline-block',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: '#90caf9',
                    textDecoration: 'underline',
                    opacity: 0.85,
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                [ View evidence file ]
              </Box>
            ) : (
              'Content: ' + report.reportedMessageSnapshot.content
            )}
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              textAlign: 'right',
              fontSize: '11px',
              color: '#C084FC',
              fontFamily: 'monospace',
            }}
          >
            Sent at: {formatDate(report.reportedMessageSnapshot.sentAt, true)}
          </Typography>
        </Box>
      )}

      {report.targetType === 'account' && (
        <Box sx={{ mt: 2 }}>
          <Typography
            sx={{
              fontSize: '11.5px',
              fontWeight: 700,
              color: '#6366F1',
              letterSpacing: '0.02em',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
            EVIDENCE IMAGES:
          </Typography>

          {report.evidenceAttachments && report.evidenceAttachments.length > 0 ? (
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              {report.evidenceAttachments.map((imgUrl, idx) => (
                <Box
                  key={idx}
                  onClick={() => onOpenLightbox(idx)}
                  sx={{
                    width: 110,
                    height: 80,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1.5px solid #E2E8F0',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)',
                      borderColor: '#7C3AED',
                    },
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`Evidence ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography sx={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
              No evidence image
            </Typography>
          )}
        </Box>
      )}

      <Box sx={{ mt: 2.25 }}>
        {report.targetType === 'message'
          ? MESSAGE_REASONS.map((r) => {
              if (r.id === report.reason) {
                return (
                  <Typography
                    key={r.id}
                    sx={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#7C3AED',
                    }}
                  >
                    Reason: {r.label}
                  </Typography>
                );
              }
              return null;
            })
          : ACCOUNT_REASONS.map((r) => {
              if (r.id === report.reason) {
                return (
                  <Typography
                    key={r.id}
                    sx={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#7C3AED',
                    }}
                  >
                    Reason: {r.label}
                  </Typography>
                );
              }
              return null;
            })}

        {report.description && (
          <Typography
            sx={{
              mt: 1.5,
              fontSize: '13px',
              color: '#475569',
              lineHeight: 1.45,
            }}
          >
            Your message: “{report.description}”
          </Typography>
        )}
      </Box>
    </Box>
  );
}

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

// Icons
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import type { IReportTicket } from '../../../../../../types/Report.type';
import { ACCOUNT_REASONS, MESSAGE_REASONS, statusLabel } from '../../../../../../data/Report.data';
import { formatDate } from '../../../../../../helpers/formatDate.helper';
import { getStatusBadgeStyle } from '../../../../../../helpers/client/reportBadge.helper';

type ReportCardProps = {
  item: IReportTicket;
  isSelected: boolean;
  isDrawerOpen: boolean;
  onSelect: (id: string) => void;
}

export default function ReportCard({
  item,
  isSelected,
  isDrawerOpen,
  onSelect,
}: ReportCardProps) {
  const statusStyle = getStatusBadgeStyle(item.status);
  const isMessage = item.targetType === 'message';

  return (
    <Paper
      elevation={0}
      onClick={() => onSelect(item.id)}
      sx={{
        p: { xs: 2.25, sm: 2.5 },
        borderRadius: '16px',
        cursor: 'pointer',
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
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        bgcolor: isSelected ? '#F5F3FF' : '#FFFFFF',
        border: isSelected ? '2px solid #7C3AED' : '1px solid #E2E8F0',
        boxShadow: isSelected
          ? '0 4px 20px -2px rgba(124, 58, 237, 0.12)'
          : '0 1px 3px rgba(15, 23, 42, 0.02)',
        '&:hover': {
          borderColor: isSelected ? '#7C3AED' : '#CBD5E1',
          transform: 'translateY(-2px)',
          boxShadow: isSelected
            ? '0 6px 22px -2px rgba(124, 58, 237, 0.16)'
            : '0 6px 16px rgba(15, 23, 42, 0.06)',
        },
      }}
    >
      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor: isMessage ? '#F3E8FF' : '#FEE2E2',
              color: isMessage ? '#7C3AED' : '#EF4444',
            }}
          >
            {isMessage ? (
              <ChatBubbleRoundedIcon sx={{ fontSize: 20 }} />
            ) : (
              <PersonRoundedIcon sx={{ fontSize: 22 }} />
            )}
          </Box>

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
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  rowGap: 0.25,
                  columnGap: 0.75,
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    color: isMessage ? '#7C3AED' : '#334155',
                    lineHeight: 1.2,
                  }}
                >
                  Report
                </Typography>
                <Typography
                  sx={{
                    fontSize: '11px',
                    color: '#64748B',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  • {formatDate(item.createdAt, true)}
                </Typography>
              </Box>
            </Box>

            {/* Status Badge đặt ở góc trên bên phải */}
            <Box
              sx={{
                px: 1.2,
                py: 0.35,
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600,
                color: statusStyle.color,
                bgcolor: statusStyle.bg,
                border: `1px solid ${statusStyle.border}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                alignSelf: 'flex-start',
              }}
            >
              <FiberManualRecordRoundedIcon
                sx={{ fontSize: 7, color: statusStyle.dot, flexShrink: 0 }}
              />
              <span>{statusLabel[item.status]}</span>
            </Box>
          </Box>
        </Stack>

        <Typography
          sx={{
            mt: 1.5,
            fontSize: { xs: '13.5px', sm: '14px' },
            fontWeight: 700,
            color: '#0F172A',
            lineHeight: 1.35,
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {isMessage
            ? `Report message from ${item.targetUser.fullname} (@${item.targetUser.email})`
            : `Report account ${item.targetUser.fullname} (@${item.targetUser.email})`}
        </Typography>

        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.1,
              py: 0.3,
              borderRadius: '7px',
              bgcolor: '#F5F3FF',
              border: '1px solid #DDD6FE',
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#7C3AED',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.targetType === 'message'
              ? MESSAGE_REASONS.map((r) => {
                  if (r.id === item.reason) {
                    return (
                      <Box
                        key={r.id}
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, overflow: 'hidden' }}
                      >
                        {r.icon}
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.label}
                        </span>
                      </Box>
                    );
                  }
                  return null;
                })
              : ACCOUNT_REASONS.map((r) => {
                  if (r.id === item.reason) {
                    return (
                      <Box
                        key={r.id}
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, overflow: 'hidden' }}
                      >
                        {r.icon}
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.label}
                        </span>
                      </Box>
                    );
                  }
                  return null;
                })}
          </Box>
        </Box>

        <Typography
          sx={{
            mt: 1,
            fontSize: '12.5px',
            color: '#64748B',
            lineHeight: 1.45,
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontStyle: isMessage ? 'italic' : 'normal',
          }}
        >
          {isMessage ? (
            item.reportedMessageSnapshot?.content ? (
              `Quote: “${item.reportedMessageSnapshot?.content}”`
            ) : (
              <>
                Media:{' '}
                <a
                  href={item.reportedMessageSnapshot?.mediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.reportedMessageSnapshot?.mediaUrl}
                </a>
              </>
            )
          ) : (
            `Description: “${item.description || 'No description'}”`
          )}
        </Typography>
      </Box>

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
        <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
          {item.status === 'resolved' && item.feedbackToReporter ? (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 0.8,
                py: 0.2,
                borderRadius: '6px',
                bgcolor: '#ECFDF5',
                color: '#059669',
                border: '1px solid #A7F3D0',
                fontSize: '11px',
                fontWeight: 600,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <CheckCircleRoundedIcon sx={{ fontSize: 13, flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.feedbackToReporter}
              </span>
            </Box>
          ) : !isMessage && item.evidenceAttachments && item.evidenceAttachments.length > 0 ? (
            <Typography
              sx={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#6366F1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                whiteSpace: 'nowrap',
              }}
            >
              <AttachFileRoundedIcon sx={{ fontSize: 14 }} />
              {item.evidenceAttachments.length} proof photos
            </Typography>
          ) : (
            <Typography
              sx={{
                fontSize: '11px',
                color: '#94A3B8',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.status === 'pending'
                ? '• Awaiting allocation approval'
                : item.status === 'in_progress'
                ? '• A moderator is reviewing this.'
                : '• Case file concluded'}
            </Typography>
          )}
        </Box>

        <ChevronRightRoundedIcon
          sx={{
            color: '#94A3B8',
            fontSize: 18,
            opacity: 0.7,
            flexShrink: 0,
          }}
        />
      </Box>
    </Paper>
  );
}

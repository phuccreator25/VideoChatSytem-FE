import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { formatDate } from '../../../../../../../helpers/formatDate.helper';

type DetailsDrawerHeaderProps = {
  createdAt: string;
  onClose?: () => void;
};

export default function DetailsDrawerHeader({
  createdAt,
  onClose,
}: DetailsDrawerHeaderProps) {
  return (
    <Box
      sx={{
        px: { xs: 2.5, sm: 3.5 },
        py: 2,
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: { xs: '1.05rem', sm: '1.15rem' },
            fontWeight: 700,
            color: '#0F172A',
            letterSpacing: '-0.02em',
          }}
        >
          Report Details
        </Typography>
        <Typography
          sx={{
            fontSize: '12px',
            color: '#64748B',
            mt: 0.3,
          }}
        >
          Created at: {formatDate(createdAt, true)} (by you)
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.5} alignItems="center">
        {onClose && (
          <Tooltip title="Đóng chi tiết">
            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                color: '#64748B',
                bgcolor: '#F1F5F9',
                borderRadius: '8px',
                p: 0.75,
                '&:hover': {
                  bgcolor: '#E2E8F0',
                  color: '#0F172A',
                },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
}

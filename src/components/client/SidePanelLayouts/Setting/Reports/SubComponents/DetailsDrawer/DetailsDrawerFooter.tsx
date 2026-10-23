import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

type DetailsDrawerFooterProps = {
  isPending: boolean;
  isRevoking: boolean;
  onOpenRevokeConfirm: () => void;
  onClose?: () => void;
};

export default function DetailsDrawerFooter({
  isPending,
  isRevoking,
  onOpenRevokeConfirm,
  onClose,
}: DetailsDrawerFooterProps) {
  return (
    <Box
      sx={{
        px: { xs: 2.5, sm: 3.5 },
        py: 2,
        bgcolor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      {isPending ? (
        <>
          <Typography sx={{ fontSize: '12.5px', color: '#64748B' }}>
            The profile is queued for review by a moderator.
          </Typography>
          <Button
            size="small"
            onClick={onOpenRevokeConfirm}
            disabled={isRevoking}
            startIcon={
              isRevoking ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
              )
            }
            sx={{
              textTransform: 'none',
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              minWidth: 'fit-content',
              color: '#DC2626',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              px: 1.2,
              py: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#FEF2F2',
                borderColor: '#EF4444',
              },
              '&.Mui-disabled': {
                color: '#F87171',
                borderColor: '#FECACA',
                bgcolor: '#FFF5F5',
              },
            }}
          >
            {isRevoking ? 'Revoking...' : 'Revoke Report'}
          </Button>
        </>
      ) : (
        <>
          <Typography sx={{ fontSize: '12px', color: '#64748B', maxWidth: '75%' }}>
            Your report has been closed.
          </Typography>
          <Button
            size="small"
            onClick={onClose}
            sx={{
              textTransform: 'none',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#334155',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              px: 2.5,
              py: 0.6,
              '&:hover': {
                bgcolor: '#F8FAFC',
                borderColor: '#94A3B8',
              },
            }}
          >
            Close
          </Button>
        </>
      )}
    </Box>
  );
}

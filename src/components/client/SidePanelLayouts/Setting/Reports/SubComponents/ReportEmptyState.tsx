import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export default function ReportEmptyState() {
  return (
    <Box
      sx={{
        gridColumn: '1 / -1',
        py: 10,
        textAlign: 'center',
        color: '#94A3B8',
      }}
    >
      <SearchRoundedIcon sx={{ fontSize: 40, mb: 1, color: '#CBD5E1' }} />
      <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
        No matching reports found
      </Typography>
      <Typography sx={{ fontSize: 13, mt: 0.5 }}>
        Try searching with a different keyword or adjusting the filter
      </Typography>
    </Box>
  );
}

import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import type { TicketPagination } from '../../../../../../types/Report.type';

type ReportPaginationProps = {
  pagination?: TicketPagination;
  defaultLimit?: number;
}

export default function ReportPagination({
  pagination,
  defaultLimit = 10,
}: ReportPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', (newPage + 1).toString());
    setSearchParams(nextParams);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('limit', event.target.value);
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const totalCount = pagination?.total ?? 0;
  const rowsPerPage = pagination?.limit ?? defaultLimit;
  const currentPage = Math.max(
    0,
    (pagination?.page || Number(searchParams.get('page')) || 1) - 1
  );
  const safePage =
    totalCount > 0 && currentPage * rowsPerPage >= totalCount
      ? Math.max(0, Math.ceil(totalCount / rowsPerPage) - 1)
      : currentPage;

  const rowsPerPageOptions = useMemo(() => {
    const base = [5, 10, 20, 50];
    return base.includes(rowsPerPage) ? base : [...base, rowsPerPage].sort((a, b) => a - b);
  }, [rowsPerPage]);

  return (
    <Box
      sx={{
        borderTop: '1px solid #F1F5F9',
        bgcolor: '#FFFFFF',
        flexShrink: 0,
      }}
    >
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={safePage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '& .MuiTablePagination-toolbar': {
            minHeight: '52px',
            px: { xs: 1, sm: 2 },
            justifyContent: 'flex-end',
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.8rem',
            color: '#64748B',
          },
          '& .MuiTablePagination-select': {
            fontSize: '0.85rem',
            color: '#1E293B',
            fontWeight: 600,
            py: 0.5,
          },
          '& .MuiTablePagination-actions': {
            ml: { xs: 0.5, sm: 1.5 },
            '& .MuiIconButton-root': {
              color: '#334155',
              p: 0.75,
              '&.Mui-disabled': {
                color: '#CBD5E1',
              },
              '&:hover:not(.Mui-disabled)': {
                bgcolor: '#F1F5F9',
              },
            },
          },
        }}
      />
    </Box>
  );
}

import {useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

import { customScrollbarSx } from '../../../../../../utils/CustomScroll';

type ReportListHeaderProps = {
  isDrawerOpen: boolean;
  query: {
    search?: string;
    targetType?: string;
    status?: string;
  };
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
  setSearchQuery: (searchQuery: string) => void;
  searchQuery: string;
}

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: '🟡 Pending' },
  { key: 'in_progress', label: '🔵 In Progress' },
  { key: 'resolved', label: '🟢 Resolved' },
  { key: 'rejected', label: '⚪ Rejected' },
];

export default function ReportListHeader({
  isDrawerOpen,
  query,
  searchParams,
  setSearchParams,
  setSearchQuery,
  searchQuery,
}: ReportListHeaderProps) {
  const navigate = useNavigate();

  useEffect(() => {
    setSearchQuery(query.search || '');
  }, [query.search]);

  useEffect(() => {
    const currentFilterSearch = query.search || '';

    if (currentFilterSearch === searchQuery.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      if (!searchQuery.trim()) {
        nextParams.delete('search');
      } else {
        nextParams.set('search', searchQuery.trim());
      }
      nextParams.set('page', '1');
      setSearchParams(nextParams);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchQuery, query.search, searchParams, setSearchParams]);

  const handleSelectChange = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (!value || value === 'all') {
      nextParams.delete(String(key));
    } else {
      nextParams.set(String(key), value);
    }

    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleBackToSettings = () => {
    navigate('/chat', { state: { rail: 'settings' } });
  };

  const currentTargetType = query.targetType || '';
  const currentStatus = query.status || 'all';

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        pb: 2,
        borderBottom: '1px solid #F1F5F9',
        flexShrink: 0,
        textAlign: 'left',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isDrawerOpen ? 'column' : { xs: 'column', md: 'row' },
          alignItems: isDrawerOpen ? 'flex-start' : { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          textAlign: 'left',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textAlign: 'left' }}>
          <IconButton
            onClick={handleBackToSettings}
            size="small"
            aria-label="Quay lại cài đặt"
            sx={{
              color: '#4b5563',
              mr: 0.5,
              p: 0.5,
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <Box sx={{ textAlign: 'left' }}>
            <Typography
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.35rem' },
                fontWeight: 700,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
                textAlign: 'left',
              }}
            >
              My Reports
            </Typography>
            <Typography
              sx={{
                fontSize: '0.85rem',
                color: '#64748B',
                mt: 0.5,
                lineHeight: 1.4,
                textAlign: 'left',
              }}
            >
              Track the status of the audit and the results from the Board
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: isDrawerOpen ? '100%' : { xs: '100%', md: '360px', lg: '400px' },
            display: 'flex',
            alignItems: 'center',
            height: '40px',
            px: 1.5,
            borderRadius: '10px',
            border: '1px solid #CBD5E1',
            bgcolor: '#FFFFFF',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            '&:focus-within': {
              borderColor: '#7C3AED',
              boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)',
            },
          }}
        >
          <SearchRoundedIcon sx={{ color: '#94A3B8', fontSize: 20, mr: 1, flexShrink: 0 }} />
          <InputBase
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by full name, email, reason,..."
            sx={{
              fontSize: '13px',
              color: '#0F172A',
              '& input::placeholder': {
                color: '#94A3B8',
                opacity: 1,
              },
            }}
          />
          {searchQuery && (
            <IconButton
              size="small"
              onClick={() => setSearchQuery('')}
              sx={{ p: 0.5, color: '#94A3B8' }}
            >
              <ClearRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: isDrawerOpen ? 'column' : { xs: 'column', md: 'row' },
          alignItems: isDrawerOpen ? 'flex-start' : { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 1.75,
          borderBottom: '1px solid #F1F5F9',
          pb: isDrawerOpen ? 1.5 : 0,
          textAlign: 'left',
        }}
      >
        <Stack
          direction="row"
          spacing={3}
          sx={{
            textAlign: 'left',
          }}
        >
          <Box
            onClick={() => handleSelectChange('targetType', 'all')}
            sx={{
              pb: 1.25,
              cursor: 'pointer',
              fontWeight: currentTargetType === '' ? 700 : 500,
              fontSize: '13.5px',
              color: currentTargetType === '' ? '#7C3AED' : '#64748B',
              position: 'relative',
              transition: 'color 0.2s ease',
              '&:after': currentTargetType === '' ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                borderRadius: '3px 3px 0 0',
                background: 'linear-gradient(90deg, #7C3AED 0%, #6366F1 100%)',
              } : {},
            }}
          >
            All
          </Box>

          <Box
            onClick={() => handleSelectChange('targetType', 'message')}
            sx={{
              pb: 1.25,
              cursor: 'pointer',
              fontWeight: currentTargetType === 'message' ? 700 : 500,
              fontSize: '13.5px',
              color: currentTargetType === 'message' ? '#7C3AED' : '#64748B',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              transition: 'color 0.2s ease',
              '&:after': currentTargetType === 'message' ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                borderRadius: '3px 3px 0 0',
                background: 'linear-gradient(90deg, #7C3AED 0%, #6366F1 100%)',
              } : {},
            }}
          >
            Messages
          </Box>

          <Box
            onClick={() => handleSelectChange('targetType', 'account')}
            sx={{
              pb: 1.25,
              cursor: 'pointer',
              fontWeight: currentTargetType === 'account' ? 700 : 500,
              fontSize: '13.5px',
              color: currentTargetType === 'account' ? '#7C3AED' : '#64748B',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              transition: 'color 0.2s ease',
              '&:after': currentTargetType === 'account' ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                borderRadius: '3px 3px 0 0',
                background: 'linear-gradient(90deg, #7C3AED 0%, #6366F1 100%)',
              } : {},
            }}
          >
            Accounts
          </Box>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pb: isDrawerOpen ? 0.5 : 1,
            maxWidth: '100%',
            ...customScrollbarSx,
          }}
        >
          {STATUS_FILTERS.map((pill) => {
            const isActive = currentStatus === pill.key;
            return (
              <Chip
                key={pill.key}
                label={pill.label}
                size="small"
                onClick={() => handleSelectChange('status', pill.key)}
                sx={{
                  height: '28px',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 500,
                  borderRadius: '14px',
                  cursor: 'pointer',
                  bgcolor: isActive ? '#F5F3FF' : '#FFFFFF',
                  color: isActive ? '#7C3AED' : '#64748B',
                  border: isActive ? '1px solid #7C3AED' : '1px solid #E2E8F0',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  '&:hover': {
                    bgcolor: isActive ? '#EDE9FE' : '#F8FAFC',
                    borderColor: isActive ? '#7C3AED' : '#CBD5E1',
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";

import { customScrollbarSx } from "../../../utils/CustomScroll";
import type { GroupItem } from "../../../types/data.type";
import { GroupRow } from "./GroupRow/GroupRow.group";

const groupItems: GroupItem[] = [
  {
    key: 'general',
    name: '#General',
    initials: 'G',
    onClick: () => {
      console.log('general');
    },
  },
  {
    key: 'reporting',
    name: '#Reporting',
    initials: 'R',
    badge: '23+',
    onClick: () => {
      console.log('reporting');
    },
  },
  {
    key: 'designer',
    name: '#Designer',
    initials: 'D',
    badge: 'New',
    onClick: () => {
      console.log('designer');
    },
  },
  {
    key: 'developers',
    name: '#Developers',
    initials: 'D',
    onClick: () => {
      console.log('developers');
    },
  },
  {
    key: 'project-alpha',
    name: '#Project-alpha',
    initials: 'P',
    badge: 'New',
    onClick: () => {
      console.log('project-alpha');
    },
  },
  {
    key: 'snacks',
    name: '#Snacks',
    initials: 'S',
    onClick: () => {
      console.log('snacks');
    },
  },
];

export function GroupsView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        height: '100%',
        minHeight: 0,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          height: '100%',
          borderRadius: { xs: 0, sm: 4 },
          bgcolor: '#ffffff',
          border: { xs: 'none', sm: '1px solid #ebecef' },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            pb: 2,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography
              sx={{
                fontSize: { xs: 22, sm: 26 },
                fontWeight: 700,
                color: '#1f2430',
                lineHeight: 1.1,
              }}
            >
              Groups
            </Typography>

            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7d84a0',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(111, 99, 246, 0.08)',
                  color: '#6f63f6',
                },
              }}
            >
              <Groups2OutlinedIcon sx={{ fontSize: 22 }} />
            </Box>
          </Stack>

          <Box
            sx={{
              mt: 3,
              height: 46,
              px: 2,
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              bgcolor: '#f3f5fb',
              border: '1px solid transparent',
              transition: 'all 0.2s ease',
              '&:focus-within': {
                borderColor: 'rgba(111, 99, 246, 0.35)',
                bgcolor: '#ffffff',
              },
            }}
          >
            <SearchRoundedIcon
              sx={{
                fontSize: 20,
                color: '#8a91a3',
              }}
            />

            <InputBase
              placeholder="Search groups..."
              fullWidth
              sx={{
                fontSize: 15,
                color: '#1f2430',
                '& input::placeholder': {
                  color: '#8a91a3',
                  opacity: 1,
                },
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            px: { xs: 1.25, sm: 2 },
            pb: { xs: 1.25, sm: 2 },
            ...customScrollbarSx,
          }}
        >
          <List disablePadding sx={{ pt: 1 }}>
            {groupItems.map((item) => (
              <GroupRow key={item.key} item={item} />
            ))}
          </List>

          {isMobile && <Box sx={{ height: 12 }} />}
        </Box>
      </Paper>
    </Box>
  );
}
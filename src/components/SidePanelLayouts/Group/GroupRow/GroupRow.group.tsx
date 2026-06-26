import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";

import type { GroupItem } from "../../../../types/group/group.type";

export function GroupRow({ item }: { item: GroupItem }) {
  return (
    <ListItemButton
      onClick={item.onClick}
      sx={{
        minHeight: 68,
        borderRadius: 3,
        px: 1.5,
        py: 1,
        mb: 1,
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: 'rgba(111, 99, 246, 0.08)',
          transform: 'translateX(2px)',
        },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          mr: 2,
          bgcolor: 'rgba(111, 99, 246, 0.12)',
          color: '#6f63f6',
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {item.initials}
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Typography
        
          sx={{
            fontSize: 16,
            fontWeight: 600,
            color: '#1f2430',
            lineHeight: 1.2,
          }}
        >
          {item.name}
        </Typography>
      </Box>

      {item.badge && (
        <Chip
          label={item.badge}
          size="small"
          sx={{
            ml: 1,
            height: 22,
            minWidth: 36,
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            bgcolor: 'rgba(255, 105, 135, 0.14)',
            color: '#ef5a7b',
          }}
        />
      )}
    </ListItemButton>
  );
}

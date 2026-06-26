import Chip from "@mui/material/Chip";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { SettingItem } from "../../../../types/setting/setting.ui.type";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export function SettingRow({ item }: { item: SettingItem }) {
  return (
    <ListItemButton
      onClick={item.onClick}
      sx={{
        minHeight: 76,
        borderRadius: 3,
        px: 1.5,
        py: 1,
        mb: 1,
        alignItems: 'center',
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: item.danger ? 'rgba(211, 47, 47, 0.08)' : 'rgba(111, 99, 246, 0.08)',
          transform: 'translateX(2px)',
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: 1.75,
          width: 42,
          height: 42,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: item.danger ? '#d32f2f' : '#6f63f6',
          bgcolor: item.danger ? 'rgba(211, 47, 47, 0.12)' : 'rgba(111, 99, 246, 0.12)',
        }}
      >
        {item.icon}
      </ListItemIcon>

      <ListItemText
        primary={
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 700,
                color: item.danger ? '#d32f2f' : '#1f2430',
                lineHeight: 1.2,
              }}
            >
              {item.label}
            </Typography>

            {item.badge && (
              <Chip
                label={item.badge}
                size="small"
                sx={{
                  height: 22,
                  borderRadius: 999,
                  fontWeight: 700,
                  bgcolor: item.danger ? 'rgba(211, 47, 47, 0.1)' : 'rgba(111, 99, 246, 0.1)',
                  color: item.danger ? '#d32f2f' : '#6f63f6',
                }}
              />
            )}
          </Stack>
        }
        secondary={
          item.description ? (
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 13.5,
                color: '#7b8190',
                lineHeight: 1.4,
              }}
            >
              {item.description}
            </Typography>
          ) : null
        }
      />

      {item.showArrow !== false && (
        <ChevronRightRoundedIcon
          sx={{
            ml: 1,
            fontSize: 22,
            color: item.danger ? '#d32f2f' : '#9aa0ad',
          }}
        />
      )}
    </ListItemButton>
  );
}

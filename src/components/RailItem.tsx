import { IconButton, Tooltip } from "@mui/material";
import type { RailItemProps } from "../types/data.type";
import { COLORS } from "../utils/Colors";

export function RailItem({ title, icon, active = false, onClick }: RailItemProps) {
  return (
    <Tooltip title={title} placement="right">
      <IconButton
        onClick={onClick}
        sx={{
          width: { xs: 52, sm: 68, md: 64 },
          height: { xs: 52, sm: 58, md: 64 },
          borderRadius: { xs: 2.5, sm: 3, md: 3.5 },
          color: active ? COLORS.primary : COLORS.icon,
          bgcolor: active ? COLORS.primarySoft : 'transparent',
          '&:hover': {
            bgcolor: active ? COLORS.primarySoft : 'rgba(0,0,0,0.03)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";

import type { ContactItem } from "../../../../types/data.type";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

export function ContactRow({ item }: { item: ContactItem }) {
  return (
    <ListItemButton
      onClick={item.onClick}
      sx={{
        minHeight: 52,
        borderRadius: 3,
        px: 1.5,
        py: 0.75,
        mb: 0.5,
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: 'rgba(111, 99, 246, 0.08)',
          transform: 'translateX(2px)',
        },
      }}
    >
      <Typography
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: 16,
          fontWeight: 500,
          color: '#1f2430',
          lineHeight: 1.2,
        }}
      >
        {item.name}
      </Typography>

      <IconButton
        size="small"
        onClick={(event) => {
          event.stopPropagation();
          console.log(`more-${item.key}`);
        }}
        sx={{
          ml: 1,
          color: '#7d84a0',
        }}
      >
        <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </ListItemButton>
  );
}
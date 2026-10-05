import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AdminNavItem, type NavItemConfig } from "./AdminNavItem";

export type NavGroupConfig = {
  id: string;
  subheader?: string;
  items: NavItemConfig[];
};

type AdminNavGroupProps = {
  group: NavGroupConfig;
  collapsed?: boolean;
  onItemClick?: () => void;
};

export const AdminNavGroup = ({
  group,
  collapsed = false,
  onItemClick,
}: AdminNavGroupProps) => {
  return (
    <Box sx={{ mb: 1.5 }}>
      {group.subheader && !collapsed && (
        <Typography
          variant="caption"
          sx={{
            px: 2,
            pt: 1.5,
            pb: 0.75,
            display: "block",
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#94A3B8",
          }}
        >
          {group.subheader}
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {group.items.map((item) => (
          <AdminNavItem
            key={item.title}
            item={item}
            collapsed={collapsed}
            onItemClick={onItemClick}
          />
        ))}
      </Box>
    </Box>
  );
};

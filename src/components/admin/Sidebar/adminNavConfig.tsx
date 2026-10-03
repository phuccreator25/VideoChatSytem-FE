import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import type { NavGroupConfig } from "./AdminNavGroup";

export const adminNavConfig: NavGroupConfig[] = [
  {
    id: "management",
    subheader: "MANAGEMENT",
    items: [
      {
        title: "User Management",
        path: "/admin/users",
        icon: <PeopleOutlineRoundedIcon sx={{ fontSize: 22 }} />,
      },
    ],
  },
];

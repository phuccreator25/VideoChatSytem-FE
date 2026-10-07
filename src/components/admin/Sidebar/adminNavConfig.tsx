import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import type { NavGroupConfig } from "./AdminNavGroup";

export const adminNavConfig: NavGroupConfig[] = [
  {
    id: "management",
    subheader: "MANAGEMENT",
    items: [
      {
        title: "Users Management",
        path: "/admin/users",
        icon: <PeopleOutlineRoundedIcon sx={{ fontSize: 22 }} />,
      },
      {
        title: "Calls Management",
        path: "/admin/calls",
        icon: <PhoneInTalkRoundedIcon sx={{ fontSize: 22 }} />,
      },
    ],
  },
];

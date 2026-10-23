import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
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
      {
        title: "Report & Safety",
        path: "/admin/reports",
        icon: <ReportProblemRoundedIcon sx={{ fontSize: 22 }} />,
      },
    ],
  },
];

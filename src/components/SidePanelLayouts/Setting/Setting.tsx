import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { customScrollbarSx } from "../../../utils/CustomScroll";
import type { SettingItem } from "../../../types/setting/setting.ui.type";
import { SettingRow } from "./SettingRow/SettingRow.setting";

const menuItems: SettingItem[] = [
  {
    key: "edit-name",
    label: "Chỉnh sửa tên người dùng",
    description: "Cập nhật tên hiển thị của bạn",
    icon: <TextFieldsRoundedIcon />,
    onClick: () => {
      console.log("edit-name");
    },
  },
  {
    key: "restricted-account",
    label: "Tài khoản đã hạn chế",
    description: "Xem trạng thái và thông tin hạn chế tài khoản",
    icon: <BlockRoundedIcon />,
    onClick: () => {
      console.log("restricted-account");
    },
  },
  {
    key: "privacy-security",
    label: "Quyền riêng tư và an toàn",
    description: "Quản lý quyền riêng tư, chặn, bảo mật",
    icon: <ShieldOutlinedIcon />,
    showArrow: true,
    onClick: () => {
      console.log("privacy-security");
    },
  },
  {
    key: "accessibility",
    label: "Trợ năng",
    description: "Điều chỉnh hiển thị và hỗ trợ truy cập",
    icon: <AccessibilityNewRoundedIcon />,
    onClick: () => {
      console.log("accessibility");
    },
  },
  {
    key: "family-center",
    label: "Trung tâm gia đình",
    description: "Quản lý liên kết và giám sát gia đình",
    icon: <Groups2RoundedIcon />,
    onClick: () => {
      console.log("family-center");
    },
  },
  {
    key: "help",
    label: "Trợ giúp",
    description: "Xem hướng dẫn, FAQ và hỗ trợ",
    icon: <HelpOutlineRoundedIcon />,
    onClick: () => {
      console.log("help");
    },
  },
  {
    key: "report",
    label: "Báo cáo sự cố",
    description: "Gửi phản hồi hoặc báo lỗi hệ thống",
    icon: <ReportProblemOutlinedIcon />,
    onClick: () => {
      console.log("report");
    },
  },
  {
    key: "logout",
    label: "Đăng xuất",
    description: "Thoát khỏi tài khoản trên thiết bị này",
    icon: <LogoutRoundedIcon />,
    danger: true,
    badge: "Bảo mật",
    onClick: () => {
      console.log("logout");
    },
  },
];

export function Setting() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 0,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: { xs: 0, sm: 4 },
          bgcolor: "#ffffff",
          border: { xs: "none", sm: "1px solid #ebecef" },
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            pb: 2,
            background:
              "linear-gradient(180deg, rgba(111,99,246,0.08) 0%, rgba(111,99,246,0.02) 100%)",
            borderBottom: "1px solid #f0f1f4",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box minWidth={0}>
              <Typography
                sx={{
                  fontSize: { xs: 22, sm: 26 },
                  fontWeight: 700,
                  color: "#1f2430",
                  lineHeight: 1.1,
                }}
              >
                Tùy chọn
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: { xs: 13, sm: 14 },
                  color: "#727887",
                }}
              >
                Quản lý tài khoản, quyền riêng tư và các thiết lập hệ thống
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            px: { xs: 1.25, sm: 2 },
            py: { xs: 1.25, sm: 2 },
            ...customScrollbarSx,
          }}
        >
          <Typography
            sx={{
              px: 1.5,
              pb: 1,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              color: "#8d93a1",
            }}
          >
            Cài đặt tài khoản
          </Typography>

          <List disablePadding>
            {menuItems.slice(0, 5).map((item) => (
              <SettingRow key={item.key} item={item} />
            ))}
          </List>

          <Divider sx={{ my: 1.5 }} />

          <Typography
            sx={{
              px: 1.5,
              pb: 1,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              color: "#8d93a1",
            }}
          >
            Hỗ trợ & bảo mật
          </Typography>

          <List disablePadding>
            {menuItems.slice(5).map((item) => (
              <SettingRow key={item.key} item={item} />
            ))}
          </List>

          {isMobile && <Box sx={{ height: 12 }} />}
        </Box>
      </Paper>
    </Box>
  );
}

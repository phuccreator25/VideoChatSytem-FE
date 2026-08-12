import { useState } from "react";
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
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { customScrollbarSx } from "../../../utils/CustomScroll";
import type { SettingItem } from "../../../types/setting/setting.ui.type";
import type { RailKey } from "../../../types/layout/layout.navigation.type";
import { SettingRow } from "./SettingRow/SettingRow.setting";
import { RestrictedAccountsModal } from "./RestrictedAccountsModal";
import { ActiveSessionsModal } from "./ActiveSessionsModal";
import { PrivacySecurityModal } from "./PrivacySecurityModal";
import useAuth from "../../../hooks/Auth/auth.hook";

type SettingProps = {
  onRailChange?: (key: RailKey) => void;
};

export function Setting({ onRailChange }: SettingProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openRestrictedModal, setOpenRestrictedModal] = useState<boolean>(false);
  const [openSessionsModal, setOpenSessionsModal] = useState<boolean>(false);
  const [openPrivacyModal, setOpenPrivacyModal] = useState<boolean>(false);

  const handleOpenRestrictedModal = async () => {
    setOpenRestrictedModal(true);
  };

  const { handleLogOut } = useAuth()

  const menuItems: SettingItem[] = [
    {
      key: "edit-name",
      label: "Edit name",
      description: "Update your display name",
      icon: <TextFieldsRoundedIcon />,
      onClick: () => {
        onRailChange?.("profile");
      },
    },
    {
      key: "restricted-account",
      label: "Accounts blocked",
      description: "View account status and restriction information",
      icon: <BlockRoundedIcon />,
      onClick: handleOpenRestrictedModal,
    },
    {
      key: "privacy-security",
      label: "Privacy and security",
      description: "Manage privacy, blocking, and security settings",
      icon: <ShieldOutlinedIcon />,
      showArrow: true,
      onClick: () => setOpenPrivacyModal(true),
    },
    {
      key: "help",
      label: "Help",
      description: "View guides, FAQs, and support resources",
      icon: <HelpOutlineRoundedIcon />,
      onClick: () => {
        console.log("help");
      },
    },
    {
      key: "report",
      label: "Report a problem",
      description: "Submit feedback or report system errors",
      icon: <ReportProblemOutlinedIcon />,
      onClick: () => {
        console.log("report");
      },
    },
    {
      key: "logout",
      label: "Logout",
      description: "Log out of your account on this device",
      icon: <LogoutRoundedIcon />,
      danger: true,
      badge: "Security",
      onClick: handleLogOut,
    },
  ];

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
            {menuItems.slice(0, 3).map((item) => (
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
            {menuItems.slice(3).map((item) => (
              <SettingRow key={item.key} item={item} />
            ))}
          </List>

          {isMobile && <Box sx={{ height: 12 }} />}
        </Box>
      </Paper>

      {/* Modal Privacy and Security Hub */}
      <PrivacySecurityModal
        open={openPrivacyModal}
        onClose={() => setOpenPrivacyModal(false)}
      />

      {/* Modal hiển thị danh sách tài khoản đã hạn chế */}
      <RestrictedAccountsModal
        open={openRestrictedModal}
        onClose={() => setOpenRestrictedModal(false)}
      />

      {/* Modal hiển thị danh sách phiên đăng nhập Active Sessions */}
      <ActiveSessionsModal
        open={openSessionsModal}
        onClose={() => setOpenSessionsModal(false)}
      />
    </Box>
  );
}

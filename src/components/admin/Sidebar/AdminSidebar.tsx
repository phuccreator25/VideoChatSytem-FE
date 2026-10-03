import React from "react";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { AdminLogo } from "./AdminLogo";
import { AdminNavGroup } from "./AdminNavGroup";
import { adminNavConfig } from "./adminNavConfig";

type AdminSidebarProps = {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export const ADMIN_SIDEBAR_WIDTH = 250;
export const ADMIN_SIDEBAR_COLLAPSED_WIDTH = 76;

export const AdminSidebar = ({
  collapsed = false,
  mobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const drawerWidth = collapsed
    ? ADMIN_SIDEBAR_COLLAPSED_WIDTH
    : ADMIN_SIDEBAR_WIDTH;

  const sidebarContent = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#FFFFFF",
        color: "#0F172A",
        borderRight: "1px solid #E2E8F0",
        boxSizing: "border-box",
      }}
    >
      {/* Brand Header */}
      <AdminLogo collapsed={collapsed && isDesktop} />

      {/* Navigation List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          px: 2,
          py: 1.5,
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(0, 0, 0, 0.06)",
            borderRadius: "4px",
          },
        }}
      >
        {adminNavConfig.map((group) => (
          <AdminNavGroup
            key={group.id}
            group={group}
            collapsed={collapsed && isDesktop}
            onItemClick={onItemClickWrapper}
          />
        ))}
      </Box>
    </Box>
  );

  function onItemClickWrapper() {
    if (onMobileClose) {
      onMobileClose();
    }
  }

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      {isDesktop ? (
        <Box
          component="nav"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Box
            sx={{
              width: drawerWidth,
              height: "100vh",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 1200,
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }}
          >
            {sidebarContent}
          </Box>
        </Box>
      ) : (
        /* Mobile Drawer */
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: ADMIN_SIDEBAR_WIDTH,
              bgcolor: "#FFFFFF",
              borderRight: "1px solid #E2E8F0",
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}
    </>
  );
};

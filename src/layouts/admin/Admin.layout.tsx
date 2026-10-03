import React, { useState } from "react";
import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../../components/admin/Sidebar/AdminSidebar";
import { AdminHeader } from "../../components/admin/Header/AdminHeader";

// Orbit Admin Clean Light Theme Definition
const orbitAdminLightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7C3AED",
      light: "#A78BFA",
      dark: "#5B21B6",
    },
    secondary: {
      main: "#06B6D4",
      light: "#22D3EE",
      dark: "#0891B2",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
    divider: "#E2E8F0",
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleOpenMobileSidebar = () => {
    setMobileOpen(true);
  };

  const handleCloseMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <ThemeProvider theme={orbitAdminLightTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "#F8FAFC",
          color: "#0F172A",
        }}
      >
        {/* Sidebar Component */}
        <AdminSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onMobileClose={handleCloseMobileSidebar}
        />

        {/* Main Content Wrapper */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            transition: (theme) =>
              theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }}
        >
          {/* Sticky Header Topbar */}
          <AdminHeader
            collapsed={collapsed}
            onToggleSidebar={handleToggleSidebar}
            onOpenMobileSidebar={handleOpenMobileSidebar}
          />

          {/* Main View Area */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3, md: 4 },
              maxWidth: "100%",
              overflowX: "hidden",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

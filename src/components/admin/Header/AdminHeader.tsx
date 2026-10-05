import React, { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popover from "@mui/material/Popover";
import InputBase from "@mui/material/InputBase";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { AdminNotifications } from "./AdminNotifications";
import { AdminProfileMenu } from "./AdminProfileMenu";
import { useLocation, Link } from "react-router-dom";

type AdminHeaderProps = {
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
  onLogOut: () => void;
};

export const ADMIN_HEADER_HEIGHT = 62;

export const AdminHeader = ({
  onToggleSidebar,
  onOpenMobileSidebar,
  onLogOut,
}: AdminHeaderProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const location = useLocation();

  // Search popover state for sleek search button
  const [searchAnchor, setSearchAnchor] = useState<HTMLButtonElement | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const handleOpenSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSearchAnchor(e.currentTarget);
  };

  const handleCloseSearch = () => {
    setSearchAnchor(null);
  };

  // Determine current page title from route
  const getPageTitle = () => {
    if (location.pathname.includes("/admin/profile")) return "Admin Profile";
    if (location.pathname.includes("/admin/users")) return "User Management";
    if (location.pathname.includes("/admin/analytics")) return "Analytics";
    if (location.pathname.includes("/admin/settings")) return "Settings";
    if (location.pathname.includes("/admin/calls")) return "Calls";
    return "User Management";
  };

  return (
    <Box
      component="header"
      sx={{
        height: ADMIN_HEADER_HEIGHT,
        position: "sticky",
        top: 0,
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, sm: 3, md: 3.5 },
        bgcolor: "#FFFFFF",
        borderBottom: "1px solid #F1F5F9",
      }}
    >
      {/* Left Section: Menu Toggle + Orbit / Breadcrumb */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
        <IconButton
          onClick={isDesktop ? onToggleSidebar : onOpenMobileSidebar}
          size="small"
          sx={{
            color: "#64748B",
            p: 0.75,
            borderRadius: "8px",
            "&:hover": {
              bgcolor: "#F8FAFC",
              color: "#0F172A",
            },
          }}
        >
          <MenuRoundedIcon sx={{ fontSize: 22 }} />
        </IconButton>

        {/* Breadcrumb text: Orbit / PageTitle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            component={Link}
            to="/admin/users"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#94A3B8",
              textDecoration: "none",
              "&:hover": { color: "#64748B" },
            }}
          >
            Orbit
          </Typography>
          <Typography sx={{ color: "#CBD5E1", fontSize: "0.875rem" }}>/</Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#0F172A",
              letterSpacing: "-0.01em",
            }}
          >
            {getPageTitle()}
          </Typography>
        </Box>
      </Box>

      {/* Right Section: Search + Notification Bell + Theme Mode Moon + Profile Avatar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
        {/* Search Action Icon */}
        <Tooltip title="Search" arrow>
          <IconButton
            onClick={handleOpenSearch}
            size="small"
            sx={{
              color: "#64748B",
              p: 0.85,
              borderRadius: "50%",
              "&:hover": {
                bgcolor: "#F8FAFC",
                color: "#0F172A",
              },
            }}
          >
            <SearchRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        {/* Quick Search Dropdown / Popover */}
        <Popover
          open={Boolean(searchAnchor)}
          anchorEl={searchAnchor}
          onClose={handleCloseSearch}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              mt: 1.5,
              p: 1.25,
              width: 320,
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E2E8F0",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              px: 1.5,
              py: 0.5,
            }}
          >
            <SearchRoundedIcon sx={{ color: "#94A3B8", fontSize: 18, mr: 1 }} />
            <InputBase
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              autoFocus
              sx={{ fontSize: "0.85rem", width: "100%", color: "#0F172A" }}
            />
          </Box>
        </Popover>

        {/* Notification Bell with Sky Dot */}
        <AdminNotifications />

        {/* Dark / Light Mode Toggle Button (Moon Icon) */}
        <Tooltip title="Toggle Theme" arrow>
          <IconButton
            size="small"
            sx={{
              color: "#64748B",
              p: 0.85,
              borderRadius: "50%",
              "&:hover": {
                bgcolor: "#F8FAFC",
                color: "#0F172A",
              },
            }}
          >
            <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        {/* Profile Avatar with Orbit Gradient */}
        <AdminProfileMenu onLogOut={onLogOut}/>
      </Box>
    </Box>
  );
};

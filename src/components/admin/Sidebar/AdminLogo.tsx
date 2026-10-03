import React from "react";
import { Box, Typography } from "@mui/material";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import { Link } from "react-router-dom";

type AdminLogoProps = {
  collapsed?: boolean;
};

export const AdminLogo = ({ collapsed = false }: AdminLogoProps) => {
  return (
    <Box
      sx={{
        px: collapsed ? 1.5 : 2.5,
        py: 2.25,
        borderBottom: "1px solid #F1F5F9",
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
      }}
    >
      <Box
        component={Link}
        to="/admin/users"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.75,
          textDecoration: "none",
          color: "inherit",
        }}
      >
        {/* Soft Purple Pill Logo Box matching Orbit */}
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 16px rgba(124, 58, 237, 0.28)",
            flexShrink: 0,
          }}
        >
          <BlurOnIcon sx={{ color: "#ffffff", fontSize: 23 }} />
        </Box>

        {!collapsed && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.25rem",
              letterSpacing: "-0.02em",
              color: "#0F172A",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Orbit
          </Typography>
        )}
      </Box>
    </Box>
  );
};

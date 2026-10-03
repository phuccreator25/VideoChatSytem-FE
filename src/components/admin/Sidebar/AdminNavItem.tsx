import React, { useState } from "react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Collapse,
  List,
  Tooltip,
  Box,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Link, useLocation } from "react-router-dom";

export type NavSubItem = {
  title: string;
  path: string;
  badge?: string | number;
};

export type NavItemConfig = {
  title: string;
  path?: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  children?: NavSubItem[];
};

type AdminNavItemProps = {
  item: NavItemConfig;
  collapsed?: boolean;
  onItemClick?: () => void;
};

export const AdminNavItem = ({
  item,
  collapsed = false,
  onItemClick,
}: AdminNavItemProps) => {
  const location = useLocation();
  const hasChildren = Boolean(item.children && item.children.length > 0);

  const isChildActive = hasChildren
    ? item.children?.some((child) => location.pathname === child.path)
    : false;
  const isDirectActive = item.path ? location.pathname === item.path : false;
  const isActive = isDirectActive || isChildActive;

  const [open, setOpen] = useState(isChildActive);

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setOpen((prev) => !prev);
    } else if (onItemClick) {
      onItemClick();
    }
  };

  const navButton = (
    <ListItemButton
      component={item.path && !hasChildren ? Link : "div"}
      to={item.path && !hasChildren ? item.path : undefined}
      onClick={handleClick}
      disableRipple
      sx={{
        minHeight: 46,
        px: collapsed ? 1.5 : 2,
        py: 1.1,
        mb: 0.5,
        borderRadius: "12px",
        position: "relative",
        transition: "all 0.18s ease",
        color: isActive ? "#0F172A" : "#334155",
        bgcolor: isActive ? "#F0EBFE" : "transparent",
        "&:hover": {
          bgcolor: isActive ? "#EDE9FE" : "#F8FAFC",
          color: "#0F172A",
          "& .nav-icon": {
            color: isActive ? "#7C3AED" : "#0F172A",
          },
        },
        justifyContent: collapsed ? "center" : "flex-start",
      }}
    >
      {/* Active Vertical Accent Line on the Left */}
      {isActive && (
        <Box
          sx={{
            position: "absolute",
            left: "6px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "3.5px",
            height: "22px",
            borderRadius: "4px",
            bgcolor: "#7C3AED",
          }}
        />
      )}

      {/* Icon */}
      <ListItemIcon
        className="nav-icon"
        sx={{
          minWidth: collapsed ? 0 : 36,
          color: isActive ? "#7C3AED" : "#64748B",
          transition: "color 0.18s ease",
          display: "flex",
          justifyContent: "center",
          "& svg": {
            fontSize: 22,
          },
        }}
      >
        {item.icon}
      </ListItemIcon>

      {/* Label */}
      {!collapsed && (
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{
            fontSize: "0.915rem",
            fontWeight: isActive ? 600 : 500,
            color: isActive ? "#0F172A" : "#334155",
            letterSpacing: "-0.01em",
            noWrap: true,
          }}
        />
      )}

      {/* Badge / Pill and Dropdown Chevron */}
      {!collapsed && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {item.badge !== undefined && (
            <Chip
              label={item.badge}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.68rem",
                fontWeight: 700,
                bgcolor:
                  item.badgeColor === "error"
                    ? "#FEE2E2"
                    : "#E0F2FE",
                color:
                  item.badgeColor === "error" ? "#EF4444" : "#0284C7",
                borderRadius: "10px",
                px: 0.4,
              }}
            />
          )}
          {hasChildren && (
            <Box
              sx={{
                color: "#94A3B8",
                display: "flex",
                alignItems: "center",
                transition: "transform 0.2s",
              }}
            >
              {open ? (
                <ExpandMoreRoundedIcon sx={{ fontSize: 20 }} />
              ) : (
                <ChevronRightRoundedIcon sx={{ fontSize: 20 }} />
              )}
            </Box>
          )}
        </Box>
      )}
    </ListItemButton>
  );

  return (
    <>
      {collapsed ? (
        <Tooltip title={item.title} placement="right" arrow>
          {navButton}
        </Tooltip>
      ) : (
        navButton
      )}

      {/* Submenu Accordion */}
      {hasChildren && !collapsed && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4.5, my: 0.5 }}>
            {item.children?.map((subItem) => {
              const isSubActive = location.pathname === subItem.path;
              return (
                <ListItemButton
                  key={subItem.path}
                  component={Link}
                  to={subItem.path}
                  onClick={onItemClick}
                  disableRipple
                  sx={{
                    py: 0.85,
                    px: 1.5,
                    mb: 0.25,
                    borderRadius: "10px",
                    color: isSubActive ? "#7C3AED" : "#64748B",
                    bgcolor: isSubActive ? "#F0EBFE" : "transparent",
                    "&:hover": {
                      bgcolor: "#F8FAFC",
                      color: "#0F172A",
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        bgcolor: isSubActive ? "#7C3AED" : "#CBD5E1",
                      }}
                    />
                    <ListItemText
                      primary={subItem.title}
                      primaryTypographyProps={{
                        fontSize: "0.85rem",
                        fontWeight: isSubActive ? 600 : 500,
                      }}
                    />
                  </Box>

                  {subItem.badge !== undefined && (
                    <Chip
                      label={subItem.badge}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        bgcolor: "#F1F5F9",
                        color: "#64748B",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
};

import React, { useState } from "react";
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import { clearCurrentUser } from "../../../redux/client/auth.redux";
import { useNavigate } from "react-router-dom";

export const AdminProfileMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(clearCurrentUser());
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    handleClose();
    navigate(path);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ml: 0.5,
          transition: "transform 0.15s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        <Avatar
          src={currentUser?.avatar || undefined}
          alt={currentUser?.fullName || "Admin"}
          sx={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
            color: "#FFFFFF",
            fontSize: "0.85rem",
            fontWeight: 700,
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.25)",
          }}
        >
          {currentUser?.fullName?.charAt(0)?.toUpperCase() || "A"}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 240,
            bgcolor: "#FFFFFF",
            color: "#0F172A",
            border: "1px solid #E2E8F0",
            borderRadius: "14px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            backgroundImage: "none",
            p: 1,
          },
        }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 1.5, py: 1.25 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
              {currentUser?.fullName || "Super Admin"}
            </Typography>
            <Chip
              label="Admin"
              size="small"
              sx={{
                height: 18,
                fontSize: "0.65rem",
                fontWeight: 700,
                bgcolor: "rgba(124, 58, 237, 0.1)",
                color: "#7C3AED",
                border: "1px solid rgba(124, 58, 237, 0.2)",
                borderRadius: "4px",
              }}
            />
          </Box>
          <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.75rem" }}>
            {currentUser?.email || "admin@orbit.dev"}
          </Typography>
        </Box>

        <Divider sx={{ my: 1, borderColor: "#F1F5F9" }} />

        <MenuItem
          onClick={() => handleNavigate("/admin/users")}
          sx={{
            borderRadius: "8px",
            py: 1,
            "&:hover": { bgcolor: "#F8FAFC" },
          }}
        >
          <ListItemIcon sx={{ color: "#64748B", minWidth: 32 }}>
            <PersonRoundedIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText primary="Admin Profile" primaryTypographyProps={{ fontSize: "0.85rem" }} />
        </MenuItem>

        <MenuItem
          onClick={() => handleNavigate("/chat")}
          sx={{
            borderRadius: "8px",
            py: 1,
            "&:hover": { bgcolor: "rgba(6, 182, 212, 0.08)", color: "#0891B2" },
          }}
        >
          <ListItemIcon sx={{ color: "#0891B2", minWidth: 32 }}>
            <ChatRoundedIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText
            primary="Back to Chat App"
            primaryTypographyProps={{ fontSize: "0.85rem", color: "#0891B2", fontWeight: 600 }}
          />
        </MenuItem>

        <Divider sx={{ my: 1, borderColor: "#F1F5F9" }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            borderRadius: "8px",
            py: 1,
            color: "#EF4444",
            "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" },
          }}
        >
          <ListItemIcon sx={{ color: "#EF4444", minWidth: 32 }}>
            <LogoutRoundedIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText primary="Log Out" primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 600 }} />
        </MenuItem>
      </Menu>
    </>
  );
};
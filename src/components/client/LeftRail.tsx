import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";

import type { LeftRailProps } from "../../types/layout/layout.navigation.type";
import { COLORS } from "../../utils/Colors";
import { RailItem } from "./RailItem";
import useAuth from "../../hooks/client/Auth/auth.hook";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

import Badge from "@mui/material/Badge";

export default function LeftRail({ activeRail, onChange }: LeftRailProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const user = useSelector((state: RootState) => state.user.currentUser)
  const warningCount = user?.warningAccount ?? (user?.warning?.length || 0);
  const hasWarning = Boolean(warningCount && warningCount > 0);
  const isLevel2 = warningCount >= 2;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { handleLogOut } = useAuth();

  const open = Boolean(anchorEl);
  const id = open ? "avatar-popover" : undefined;

  const countReceived = useSelector(
    (state: RootState) => state.invitation.countReceived
  );

  return (
    <Box
      sx={{
        position: "fixed",
        top: isMobile ? "auto" : 0,
        bottom: 0,
        left: 0,
        right: isMobile ? 0 : "auto",
        width: isMobile ? "100%" : { sm: 88, md: 96 },
        height: isMobile ? 64 : "100dvh",
        bgcolor: COLORS.railBg,
        borderRight: isMobile ? "none" : `1px solid ${COLORS.railBorder}`,
        borderTop: isMobile ? `1px solid ${COLORS.railBorder}` : "none",
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        alignItems: "center",
        justifyContent: isMobile ? "space-around" : "flex-start",
        zIndex: 1200,
      }}
    >
      <Stack
        alignItems="center"
        direction={isMobile ? "row" : "column"}
        justifyContent={isMobile ? "space-around" : "flex-start"}
        sx={{
          width: "100%",
          height: "100%",
          pt: isMobile ? 0 : { sm: 2, md: 2.5 },
          pb: isMobile ? 0 : { sm: 2, md: 2.5 },
          px: isMobile ? 1 : 0,
        }}
      >
        {!isMobile && (
          <IconButton
            aria-label="Logo"
            sx={{
              width: { xs: 32, sm: 30, md: 38 },
              height: { xs: 32, sm: 30, md: 38 },
              borderRadius: "50%",
              bgcolor: COLORS.primary,
              color: "#fff",
              "&:hover": {
                bgcolor: COLORS.primary,
                opacity: 0.96,
              },
            }}
          >
            <GraphicEqRoundedIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />
          </IconButton>
        )}

        {!isMobile && <Box sx={{ height: { xs: 36, sm: 54, md: 72 } }} />}

        <Stack
          direction={isMobile ? "row" : "column"}
          spacing={isMobile ? 0 : { sm: 4.5, md: 5.5 }}
          alignItems="center"
          justifyContent={isMobile ? "space-around" : "flex-start"}
          sx={{ width: "100%", flex: isMobile ? 1 : "initial" }}
        >
          <RailItem
            title={hasWarning ? `Profile (${warningCount} Warning)` : "Profile"}
            active={activeRail === "profile"}
            onClick={() => onChange("profile")}
            icon={
              <Badge
                overlap="circular"
                invisible={!hasWarning}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                badgeContent={
                  isLevel2 ? (
                    <ReportProblemRoundedIcon sx={{ fontSize: 10, color: "#FFFFFF" }} />
                  ) : (
                    <WarningAmberRoundedIcon sx={{ fontSize: 10, color: "#FFFFFF" }} />
                  )
                }
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: isLevel2 ? "#E11D48" : "#F59E0B",
                    minWidth: 16,
                    height: 16,
                    width: 16,
                    padding: 0,
                    borderRadius: "50%",
                    border: "2px solid #FFFFFF",
                    boxShadow: isLevel2
                      ? "0 0 8px rgba(225, 29, 72, 0.45)"
                      : "0 0 8px rgba(245, 158, 11, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              >
                <PersonOutlineRoundedIcon
                  sx={{ fontSize: { xs: 23, sm: 25, md: 27 } }}
                />
              </Badge>
            }
          />

          <RailItem
            title="Messages"
            active={activeRail === "messages"}
            onClick={() => onChange("messages")}
            icon={
              <ChatBubbleOutlineRoundedIcon
                sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }}
              />
            }
          />

          <RailItem
            title="Groups"
            active={activeRail === "groups"}
            onClick={() => onChange("groups")}
            icon={
              <GroupOutlinedIcon
                sx={{ fontSize: { xs: 22, sm: 24, md: 26 } }}
              />
            }
          />

          <RailItem
            title="Contact"
            active={activeRail === "contact"}
            onClick={() => onChange("contact")}
            icon={
              <Badge
                badgeContent={countReceived || 0}
                color="error"
                max={99}
                overlap="circular"
                invisible={!countReceived}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: 10,
                    minWidth: 16,
                    height: 16,
                    padding: "0 4px",
                    fontWeight: 700,
                  },
                }}
              >
                <ManageAccountsOutlinedIcon
                  sx={{ fontSize: { xs: 22, sm: 24, md: 26 } }}
                />
              </Badge>
            }
          />

          <RailItem
            title="Settings"
            active={activeRail === "settings"}
            onClick={() => onChange("settings")}
            icon={
              <SettingsOutlinedIcon
                sx={{ fontSize: { xs: 22, sm: 24, md: 26 } }}
              />
            }
          />
        </Stack>

        {!isMobile && <Box sx={{ flex: 1 }} />}

        <Stack
          direction={isMobile ? "row" : "column"}
          spacing={isMobile ? 1.5 : { sm: 3, md: 3.5 }}
          alignItems="center"
          sx={{ width: isMobile ? "auto" : "100%", ml: isMobile ? 1 : 0 }}
        >
          {!isMobile && (
            <RailItem
              title="Language"
              icon={
                <LanguageOutlinedIcon
                  sx={{ fontSize: { xs: 22, sm: 24, md: 26 } }}
                />
              }
            />
          )}

          <Avatar
            aria-describedby={id}
            onClick={handleClick}
            alt={user?.fullname || "User Avatar"}
            src={user?.avatar}
            sx={{
              width: { xs: 36, sm: 40, md: 44 },
              height: { xs: 36, sm: 40, md: 44 },
              cursor: "pointer",
            }}
          />
        </Stack>
      </Stack>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              width: 200,
              borderRadius: "14px",
              mt: -1,
              ml: 1.5,
              boxShadow: "0px 8px 30px rgba(0,0,0,0.12)",
              border: "1px solid #ECECF3",
              overflow: "hidden",
            },
          },
        }}
      >
        <MenuList sx={{ py: 1 }}>
          <MenuItem
            onClick={() => {
              onChange("profile")
              handleClose()
            }}
            sx={{
              px: 2,
              py: 1.5,
              minHeight: 48,
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>Profile</span>
                  {hasWarning && (
                    <Box
                      sx={{
                        fontSize: "10px",
                        fontWeight: 700,
                        px: 0.6,
                        py: 0.1,
                        borderRadius: "4px",
                        bgcolor: isLevel2 ? "#FFE4E6" : "#FEF3C7",
                        color: isLevel2 ? "#E11D48" : "#B45309",
                        border: isLevel2 ? "1px solid #FECDD3" : "1px solid #FDE68A",
                        display: "inline-flex",
                        alignItems: "center",
                        lineHeight: 1.2,
                      }}
                    >
                      {warningCount} Warning
                    </Box>
                  )}
                </Box>
              }
              primaryTypographyProps={{
                fontSize: 16,
                fontWeight: 500,
              }}
            />
            <ListItemIcon sx={{ minWidth: 32, justifyContent: "flex-end" }}>
              <WidgetsOutlinedIcon
                sx={{
                  fontSize: 20,
                }}
              />
            </ListItemIcon>
          </MenuItem>

          <MenuItem
            onClick={() => {
              onChange("settings")
              handleClose()
            }}
            sx={{
              px: 2,
              py: 1.5,
              minHeight: 48,
            }}
          >
            <ListItemText
              primary="Setting"
              primaryTypographyProps={{
                fontSize: 16,
                fontWeight: 500,
                color: "#4A4F63",
              }}
            />
            <ListItemIcon sx={{ minWidth: 32, justifyContent: "flex-end" }}>
              <SettingsOutlinedIcon sx={{ fontSize: 20, color: "#7E8499" }} />
            </ListItemIcon>
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={handleLogOut}
            sx={{
              px: 2,
              py: 1.5,
              minHeight: 48,
            }}
          >
            <ListItemText
              primary="Log out"
              primaryTypographyProps={{
                fontSize: 16,
                fontWeight: 500,
                color: "#4A4F63",
              }}
            />
            <ListItemIcon sx={{ minWidth: 32, justifyContent: "flex-end" }}>
              <LogoutRoundedIcon sx={{ fontSize: 20, color: "#7E8499" }} />
            </ListItemIcon>
          </MenuItem>
        </MenuList>
      </Popover>
    </Box>
  );
}

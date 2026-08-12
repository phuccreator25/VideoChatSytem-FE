import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import LaptopMacRoundedIcon from "@mui/icons-material/LaptopMacRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import PhoneAndroidRoundedIcon from "@mui/icons-material/PhoneAndroidRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { formatDate } from "../../../helpers/formatDate.helper";
import { customScrollbarSx } from "../../../utils/CustomScroll";
import useActiveSessions from "../../../hooks/Setting/activeSessions.hook";
import { parseDeviceDetails } from "../../../helpers/parseDevice.helper";

type ActiveSessionsModalProps = {
  open: boolean;
  onClose: () => void;
};

function DeviceIcon({ osType }: { osType: string }) {
  switch (osType) {
    case "mac":
      return <LaptopMacRoundedIcon sx={{ fontSize: 26, color: "#475569" }} />;
    case "ios":
      return <PhoneIphoneRoundedIcon sx={{ fontSize: 26, color: "#0284c7" }} />;
    case "android":
      return <PhoneAndroidRoundedIcon sx={{ fontSize: 26, color: "#16a34a" }} />;
    case "linux":
      return <LanguageRoundedIcon sx={{ fontSize: 26, color: "#ea580c" }} />;
    case "windows":
    default:
      return <DesktopWindowsRoundedIcon sx={{ fontSize: 26, color: "#2563eb" }} />;
  }
}

export function ActiveSessionsModal({ open, onClose }: ActiveSessionsModalProps) {
  const { ui, handlers } = useActiveSessions(open);
  const {
    sessions,
    filteredSessions,
    isLoading,
    searchQuery,
    errorMsg,
    banningSessionId,
    isBanningAll,
  } = ui;

  const {
    fetchListSession,
    handleBanSession,
    handleBanAllOtherSessions,
    setSearchQuery,
  } = handlers;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "#ffffff",
          backgroundImage: "none",
          boxShadow: "0 24px 48px rgba(15, 23, 42, 0.16)",
          overflow: "hidden",
          border: "1px solid rgba(148, 163, 184, 0.18)",
        },
      }}
    >
      {/* header  */}
      <DialogTitle
        sx={{
          p: { xs: 2.5, sm: 3 },
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
          bgcolor: "rgba(248, 250, 252, 0.6)",
        }}
      >
        <Stack direction="row" spacing={1.75} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: "rgba(79, 70, 229, 0.08)",
              color: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.12)",
            }}
          >
            <ShieldOutlinedIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                }}
              >
                Active Sessions
              </Typography>
              <Chip
                label={`${sessions.length} Active`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: 11,
                  fontWeight: 700,
                  bgcolor: "rgba(34, 197, 94, 0.1)",
                  color: "#16a34a",
                  border: "1px solid rgba(34, 197, 94, 0.25)",
                }}
              />
            </Stack>
            <Typography
              sx={{
                fontSize: 13,
                color: "#64748b",
                mt: 0.25,
              }}
            >
              Manage devices currently logged into your account
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="Refresh sessions list" arrow placement="top">
            <IconButton
              onClick={fetchListSession}
              disabled={isLoading}
              size="small"
              sx={{
                color: "#64748b",
                "&:hover": { bgcolor: "rgba(148, 163, 184, 0.14)" },
              }}
            >
              <RefreshRoundedIcon
                sx={{
                  fontSize: 20,
                  animation: isLoading ? "spin 1s linear infinite" : "none",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              />
            </IconButton>
          </Tooltip>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "#64748b",
              "&:hover": { bgcolor: "rgba(148, 163, 184, 0.14)", color: "#0f172a" },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* body  */}
      <DialogContent
        sx={{
          p: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* search  */}
        {sessions.length > 1 && (
          <Stack spacing={1.5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by browser, OS, IP address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2.5,
                  fontSize: 13.5,
                  bgcolor: "#f8fafc",
                  "& fieldset": { borderColor: "rgba(148, 163, 184, 0.22)" },
                  "&:hover fieldset": { borderColor: "rgba(79, 70, 229, 0.4)" },
                },
              }}
            />

            <Button
              variant="outlined"
              fullWidth
              disabled={isBanningAll || isLoading}
              onClick={handleBanAllOtherSessions}
              startIcon={
                isBanningAll ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <LogoutRoundedIcon sx={{ fontSize: 18 }} />
                )
              }
              sx={{
                borderRadius: 2.5,
                py: 1,
                fontSize: 13,
                fontWeight: 700,
                color: "#dc2626",
                borderColor: "rgba(220, 38, 38, 0.25)",
                bgcolor: "rgba(254, 242, 242, 0.6)",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#dc2626",
                  color: "#ffffff",
                  borderColor: "#dc2626",
                  boxShadow: "0 4px 14px rgba(220, 38, 38, 0.22)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Log out all other sessions
            </Button>
          </Stack>
        )}

        {/* list session  */}
        <Box
          sx={{
            maxHeight: 400,
            overflowY: "auto",
            pr: 0.5,
            ...customScrollbarSx,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {isLoading ? (
            // skeletons
            Array.from({ length: 3 }).map((_, idx) => (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid rgba(148, 163, 184, 0.14)",
                  bgcolor: "#f8fafc",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="circular" width={44} height={44} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="40%" height={18} />
                  </Box>
                </Stack>
              </Paper>
            ))
          ) : errorMsg ? (
            <Box sx={{ textAling: "center", py: 4, px: 2 }}>
              <Typography sx={{ fontSize: 14, color: "#ef4444", mb: 1.5, textAlign: "center" }}>
                {errorMsg}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={fetchListSession}
                  startIcon={<RefreshRoundedIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Retry
                </Button>
              </Box>
            </Box>
          ) : filteredSessions.length > 0 ? (
            filteredSessions.map((session, index) => {
              const { osName, browserName, osType } = parseDeviceDetails(
                session.userAgent || ""
              );
              const isCurrentSession = Boolean(
                session.isCurrentSession ||
                  (index === 0 && !filteredSessions.some((s) => s.isCurrentSession))
              );

              return (
                <Paper
                  key={session.sessionId || session._id || index}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: isCurrentSession ? "rgba(240, 249, 255, 0.7)" : "#ffffff",
                    border: isCurrentSession
                      ? "1px solid rgba(56, 189, 248, 0.35)"
                      : "1px solid rgba(148, 163, 184, 0.18)",
                    boxShadow: isCurrentSession
                      ? "0 4px 14px rgba(56, 189, 248, 0.08)"
                      : "0 2px 8px rgba(15, 23, 42, 0.02)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: isCurrentSession
                        ? "rgba(56, 189, 248, 0.5)"
                        : "rgba(99, 102, 241, 0.3)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={1.75} alignItems="center" minWidth={0}>
                      <Box
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: 2.5,
                          bgcolor: isCurrentSession
                            ? "rgba(14, 165, 233, 0.1)"
                            : "rgba(241, 245, 249, 0.9)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          border: "1px solid rgba(148, 163, 184, 0.15)",
                        }}
                      >
                        <DeviceIcon osType={osType} />
                      </Box>

                      {/* info device  */}
                      <Box minWidth={0}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            sx={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: "#0f172a",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {browserName} on {osName}
                          </Typography>

                          {isCurrentSession && (
                            <Chip
                              icon={
                                <CheckCircleRoundedIcon
                                  sx={{
                                    fontSize: "14px !important",
                                    color: "#0284c7 !important",
                                  }}
                                />
                              }
                              label="Current Device"
                              size="small"
                              sx={{
                                height: 22,
                                borderRadius: "999px",
                                fontWeight: 700,
                                fontSize: 11,
                                bgcolor: "rgba(224, 242, 254, 0.9)",
                                color: "#0369a1",
                                border: "1px solid rgba(56, 189, 248, 0.3)",
                                px: 0.5,
                              }}
                            />
                          )}
                        </Stack>

                        {/* info device  */}
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          flexWrap="wrap"
                          sx={{ mt: 0.5 }}
                        >
                          <Stack direction="row" spacing={0.4} alignItems="center">
                            <LocationOnOutlinedIcon
                              sx={{ fontSize: 13, color: "#94a3b8" }}
                            />
                            <Typography
                              sx={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}
                            >
                              IP: {session.ipAddress || "Localhost"}
                            </Typography>
                          </Stack>

                          <Typography sx={{ color: "#cbd5e1", fontSize: 12 }}>•</Typography>

                          <Stack direction="row" spacing={0.4} alignItems="center">
                            <AccessTimeRoundedIcon
                              sx={{ fontSize: 13, color: "#94a3b8" }}
                            />
                            <Typography
                              sx={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}
                            >
                              Last active: {formatDate(session.lastSeenAt || session.createdAt)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>

                    {/* Action Revoke Button for Other Devices */}
                    {!isCurrentSession && (
                      <Tooltip title="Revoke access for this session" arrow placement="top">
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={banningSessionId === session.sessionId}
                          onClick={() => handleBanSession(session.sessionId)}
                          startIcon={
                            banningSessionId === session.sessionId ? (
                              <CircularProgress size={14} color="inherit" />
                            ) : (
                              <LogoutRoundedIcon sx={{ fontSize: 16 }} />
                            )
                          }
                          sx={{
                            borderRadius: 2.5,
                            px: 1.75,
                            py: 0.6,
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#ef4444",
                            borderColor: "rgba(239, 68, 68, 0.3)",
                            bgcolor: "rgba(254, 242, 242, 0.6)",
                            textTransform: "none",
                            flexShrink: 0,
                            "&:hover": {
                              bgcolor: "#ef4444",
                              color: "#ffffff",
                              borderColor: "#ef4444",
                              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          Revoke
                        </Button>
                      </Tooltip>
                    )}
                  </Stack>
                </Paper>
              );
            })
          ) : (
            <Box
              sx={{
                py: 6,
                px: 2,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  bgcolor: "rgba(241, 245, 249, 0.8)",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldOutlinedIcon sx={{ fontSize: 30 }} />
              </Box>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#334155" }}>
                {searchQuery ? "No matching sessions found" : "No active sessions"}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#64748b", maxWidth: 320 }}>
                {searchQuery
                  ? "Try searching with a different browser name, OS, or IP address."
                  : "Active login sessions will be displayed here for monitoring and management."}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

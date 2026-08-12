import { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { customScrollbarSx } from "../../../utils/CustomScroll";
import { useBlock } from "../../../hooks/Block/block.hook";
import { formatDate } from "../../../helpers/formatDate.helper";
import type { AppDispatch } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { onGetListBlockUser } from "../../../redux/block.redux";
import type { userBlocked } from "../../../types/contact/contact.socket.type";

type RestrictedAccountsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function RestrictedAccountsModal({
  open,
  onClose,
}: RestrictedAccountsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch<AppDispatch>()

  const { data, handlers } = useBlock();

  useEffect(() => {
    if (!open) return;
    dispatch(onGetListBlockUser())
  }, [open]);

  const handleUnblockClick = async (user: userBlocked) => {
    try {
      await handlers.handleUnblock(user);
    } catch (error) {
      console.error("Lỗi khi bỏ hạn chế:", error);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return data.blockUsers;
    const query = searchQuery.toLowerCase().trim();
    return data.blockUsers.filter((u) => u.name?.toLowerCase().includes(query));
  }, [data.blockUsers, searchQuery]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Fade}
      transitionDuration={250}
      PaperProps={{
        elevation: 24,
        sx: {
          borderRadius: 4,
          bgcolor: "#ffffff",
          backgroundImage: "none",
          overflow: "hidden",
          border: "1px solid rgba(235, 236, 239, 0.8)",
          boxShadow: "0px 20px 60px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: { xs: 2.5, sm: 3 },
          background:
            "linear-gradient(135deg, rgba(111,99,246,0.06) 0%, rgba(245,246,250,0.4) 100%)",
          borderBottom: "1px solid #f0f1f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1.75} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 4px 12px rgba(239, 68, 68, 0.25)",
            }}
          >
            <BlockRoundedIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                sx={{
                  fontSize: { xs: 18, sm: 20 },
                  fontWeight: 700,
                  color: "#1f2430",
                  letterSpacing: "-0.02em",
                }}
              >
                Accounts blocked
              </Typography>
              <Chip
                label={data.blockUsers.length}
                size="small"
                sx={{
                  height: 22,
                  fontWeight: 700,
                  fontSize: 12,
                  bgcolor: "rgba(239, 68, 68, 0.1)",
                  color: "#dc2626",
                  borderRadius: "999px",
                }}
              />
            </Stack>
            <Typography
              sx={{
                fontSize: 13,
                color: "#727887",
                mt: 0.25,
              }}
            >
              List accounts that you have blocked from interacting
            </Typography>
          </Box>
        </Stack>

        <IconButton
          onClick={onClose}
          sx={{
            color: "#8d93a1",
            bgcolor: "rgba(0,0,0,0.03)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.08)",
              color: "#1f2430",
            },
            transition: "all 0.2s ease",
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: "#fafbfe",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {data.blockUsers.length > 1 && (
          <TextField
            fullWidth
            size="small"
            placeholder="Search accounts that you have blocked from interacting..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: "#9aa0ad", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#ffffff",
                fontSize: 14,
                "& fieldset": {
                  borderColor: "#e5e7eb",
                },
                "&:hover fieldset": {
                  borderColor: "#cbd5e1",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#6f63f6",
                },
              },
            }}
          />
        )}

        <Box
          sx={{
            maxHeight: 380,
            overflowY: "auto",
            pr: 0.5,
            ...customScrollbarSx,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Paper
                key={user.blockId}
                elevation={0}
                sx={{
                  p: 1.75,
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  border: "1px solid #edf0f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "rgba(111,99,246,0.3)",
                    boxShadow: "0px 6px 20px rgba(111,99,246,0.06)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" minWidth={0}>
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "14px",
                      bgcolor: "rgba(111,99,246,0.1)",
                      color: "#6f63f6",
                      fontWeight: 700,
                      fontSize: 18,
                      border: "2px solid #ffffff",
                      boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                  </Avatar>

                  <Box minWidth={0}>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#1f2430",
                        lineHeight: 1.3,
                      }}
                    >
                      {user.name || "User"}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                      sx={{ mt: 0.5 }}
                    >
                      <AccessTimeRoundedIcon
                        sx={{ fontSize: 13, color: "#9aa0ad" }}
                      />
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "#7b8190",
                          fontWeight: 500,
                        }}
                      >
                        {formatDate(user.blockAt)}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                {data.unblockedIds.includes(user.userId) ? (
                  <Chip
                    icon={
                      <CheckCircleRoundedIcon
                        sx={{
                          fontSize: "16px !important",
                          color: "#16a34a !important",
                        }}
                      />
                    }
                    label="Đã bỏ hạn chế"
                    size="small"
                    sx={{
                      height: 32,
                      borderRadius: "999px",
                      fontWeight: 700,
                      fontSize: 12.5,
                      bgcolor: "rgba(34, 197, 94, 0.1)",
                      color: "#16a34a",
                      border: "1px solid rgba(34, 197, 94, 0.25)",
                      px: 1,
                    }}
                  />
                ) : (
                  <Tooltip title="Unblock this account" arrow placement="top">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<LockOpenRoundedIcon sx={{ fontSize: 16 }} />}
                      onClick={() => handleUnblockClick(user)}
                      sx={{
                        borderRadius: 2.5,
                        px: 2,
                        py: 0.75,
                        fontSize: 13,
                        fontWeight: 700,
                        textTransform: "none",
                        color: "#6f63f6",
                        borderColor: "rgba(111,99,246,0.3)",
                        bgcolor: "rgba(111,99,246,0.03)",
                        "&:hover": {
                          bgcolor: "#6f63f6",
                          color: "#ffffff",
                          borderColor: "#6f63f6",
                          boxShadow: "0px 4px 12px rgba(111,99,246,0.25)",
                        },
                        transition: "all 0.25s ease",
                        flexShrink: 0,
                      }}
                    >
                      Unblock
                    </Button>
                  </Tooltip>
                )}
              </Paper>
            ))
          ) : (
            <Box
              sx={{
                py: 6,
                px: 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "rgba(111,99,246,0.08)",
                  color: "#6f63f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <ShieldOutlinedIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#1f2430",
                  mb: 0.5,
                }}
              >
                {searchQuery
                  ? "No matching accounts found"
                  : "No accounts are blocked"}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13.5,
                  color: "#727887",
                  maxWidth: 320,
                  lineHeight: 1.5,
                }}
              >
                {searchQuery
                  ? "Please try searching again with a different keyword."
                  : "This list helps you view and unblock accounts you have previously restricted."}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

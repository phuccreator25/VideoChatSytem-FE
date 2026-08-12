import { useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { ActiveSessionsModal } from "./ActiveSessionsModal";
import { ChangePasswordModal } from "./ChangePasswordModal";

type PrivacySecurityModalProps = {
  open: boolean;
  onClose: () => void;
};

export function PrivacySecurityModal({ open, onClose }: PrivacySecurityModalProps) {
  const [openSessionsModal, setOpenSessionsModal] = useState<boolean>(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState<boolean>(false);

  return (
    <>
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
        {/* Header */}
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
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-0.01em",
                }}
              >
                Privacy and Security
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#64748b", mt: 0.2 }}>
                Manage account security, sessions, and privacy settings
              </Typography>
            </Box>
          </Stack>

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
        </DialogTitle>

        {/* Content list */}
        <DialogContent
          sx={{
            p: { xs: 2.5, sm: 3 },
            display: "flex",
            flexDirection: "column",
            gap: 1.75,
          }}
        >

          {/* Active Sessions */}
          <Paper
            elevation={0}
            onClick={() => setOpenSessionsModal(true)}
            sx={{
              p: 2.25,
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.02)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "rgba(79, 70, 229, 0.35)",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 18px rgba(79, 70, 229, 0.08)",
                bgcolor: "rgba(248, 250, 252, 0.5)",
              },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    bgcolor: "rgba(14, 165, 233, 0.08)",
                    color: "#0284c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DevicesRoundedIcon sx={{ fontSize: 22 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                    Active Sessions
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: "#64748b", mt: 0.2 }}>
                    View and manage devices logged into your account
                  </Typography>
                </Box>
              </Stack>
              <ChevronRightRoundedIcon sx={{ color: "#94a3b8", fontSize: 22 }} />
            </Stack>
          </Paper>

          {/* Change Password */}
          <Paper
            elevation={0}
            onClick={() => setOpenChangePasswordModal(true)}
            sx={{
              p: 2.25,
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.02)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "rgba(99, 102, 241, 0.35)",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 18px rgba(99, 102, 241, 0.08)",
                bgcolor: "rgba(248, 250, 252, 0.5)",
              },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    bgcolor: "rgba(99, 102, 241, 0.08)",
                    color: "#6366f1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LockResetRoundedIcon sx={{ fontSize: 22 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                    Change Password
                  </Typography>
                  <Typography sx={{ fontSize: 12.5, color: "#64748b", mt: 0.2 }}>
                    Update your account password and security credentials
                  </Typography>
                </Box>
              </Stack>
              <ChevronRightRoundedIcon sx={{ color: "#94a3b8", fontSize: 22 }} />
            </Stack>
          </Paper>
        </DialogContent>
      </Dialog>

      {/* Nested Modals */}
      <ActiveSessionsModal
        open={openSessionsModal}
        onClose={() => setOpenSessionsModal(false)}
      />

      <ChangePasswordModal
        open={openChangePasswordModal}
        onClose={() => setOpenChangePasswordModal(false)}
      />
    </>
  );
}


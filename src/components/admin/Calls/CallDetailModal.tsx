import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import { CallStatusBadge } from "./CallStatusBadge";
import { CallTypeBadge } from "./CallTypeBadge";
import type { CallItem } from "../../../types/admin/callAdmin.type";
import { participantJoinStatusDisplay } from "../../../data/callAdmin.data";
import { formatDate } from "../../../helpers/formatDate.helper";
import { maskEmail } from "../../../helpers/admin/userAdmin.helper";

type CallDetailModalProps = {
  open: boolean;
  call: CallItem | null;
  onClose: () => void;
};

export const CallDetailModal = ({ open, call, onClose }: CallDetailModalProps) => {

  if (!call) return null;

  const caller = call.participants.find((p) => p.role === "caller") || call.participants[0];
  const callee = call.participants.find((p) => p.role === "callee") || call.participants[1];

  const callerJoinStatus = participantJoinStatusDisplay.find((s) => s.value === caller?.joinStatus);
  const calleeJoinStatus = participantJoinStatusDisplay.find((s) => s.value === callee?.joinStatus);

  const getLeaveReason = (participant: typeof caller, isCaller: boolean) => {
    if (!participant) return { text: "—", color: "#64748B" };

    if (call.status === "active") {
      return { text: "In a call (Active)", color: "#059669" };
    }

    // Nếu là Callee (Người nhận)
    if (!isCaller) {
      if (participant.joinStatus === "rejected") {
        return { text: "Rejected (Declined call)", color: "#DC2626" };
      }
      if (participant.joinStatus === "missed") {
        return { text: "Missed (No answer)", color: "#D97706" };
      }
      if (participant.joinStatus === "pending") {
        return { text: "Pending (No response)", color: "#64748B" };
      }
    }

    // Nếu là Caller (Người gọi)
    if (isCaller) {
      if (callee?.joinStatus === "rejected") {
        return { text: "Callee declined call", color: "#DC2626" };
      }
      if (callee?.joinStatus === "missed") {
        return { text: "Callee missed call", color: "#D97706" };
      }
    }

    // Các trường hợp kết thúc phiên
    if (call.endReason === "network_lost") {
      return { text: "Network Lost", color: "#D97706" };
    }
    if (call.endReason === "timeout") {
      return { text: "Ringing Timeout", color: "#64748B" };
    }

    return { text: participant.leaveReason || "Normal Exit", color: "#334155" };
  };

  const callerLeaveInfo = getLeaveReason(caller, true);
  const calleeLeaveInfo = getLeaveReason(callee, false);

  const formatSecs = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(15, 23, 42, 0.4)",
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          bgcolor: "#FFFFFF",
          color: "#0F172A",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        },
      }}
    >
      {/* Modal Header đồng bộ với UserDetailModal */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          px: 3,
          pt: 3,
          pb: 2,
          borderBottom: "1px solid #F1F5F9",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              minWidth: 42,
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #6366F1 0%, #7C3AED 60%, #8B5CF6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              boxShadow: "0 6px 16px -2px rgba(124, 58, 237, 0.35)",
            }}
          >
            <PhoneInTalkRoundedIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  color: "#0F172A",
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em",
                }}
              >
                Call Information
              </Typography>
              <CallStatusBadge status={call.status} />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                fontSize: "0.85rem",
                fontWeight: 400,
                lineHeight: 1.4,
                mt: 0.25,
              }}
            >
              Specific details about the call
            </Typography>
          </Box>
        </Box>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: "#94A3B8",
            "&:hover": { color: "#475569", bgcolor: "#F1F5F9" },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 }, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* 1. Session IDs & Overview Banner */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            bgcolor: "#F8FAFC",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            mt: 2
          }}
        >
          {/* Cột 1: Loại phiên gọi (Chiếm 50%, căn giữa) */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                mb: 0.75,
              }}
            >
              Type of call
            </Typography>
            <CallTypeBadge type={call.type} />
          </Box>

          {/* Đường vạch chia mảnh ở giữa giúp phân tách tinh tế */}
          <Divider orientation="vertical" flexItem sx={{ borderColor: "#E2E8F0", height: 36, my: "auto" }} />

          {/* Cột 2: Thời lượng đàm thoại (Chiếm 50%, căn giữa) */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                mb: 0.75,
              }}
            >
              Duration
            </Typography>
            <Typography
              sx={{
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#0F172A",
                fontFamily: "monospace",
                lineHeight: 1.2,
              }}
            >
              {call.duration > 0 ? formatSecs(call.duration) : "--:--"}
            </Typography>
          </Box>
        </Box>
        {/* 2. Connection Journey Timeline */}
        <Box>
          <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F172A", mb: 2 }}>
            Connection Journey
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" },
              gap: 1.5,
              position: "relative",
            }}
          >
            {/* Step 1: Initiated */}
            <Box sx={{ p: 2, borderRadius: "10px", bgcolor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <FiberManualRecordRoundedIcon sx={{ fontSize: 12, color: "#7C3AED" }} />
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#0F172A" }}>
                  1. Initiated
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontFamily: "monospace" }}>
                {formatDate(call.timeline?.initiatedAt, true)}
              </Typography>
            </Box>

            {/* Step 2: Ringing */}
            <Box sx={{ p: 2, borderRadius: "10px", bgcolor: "#FFFFFF", border: "1px solid #E2E8F0" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <FiberManualRecordRoundedIcon sx={{ fontSize: 12, color: "#D97706" }} />
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#0F172A" }}>
                  2. Ringing
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontFamily: "monospace" }}>
                {formatDate(call.timeline?.ringingAt, true)}
              </Typography>
            </Box>

            {/* Step 3: Connected */}
            <Box
              sx={{
                p: 2,
                borderRadius: "10px",
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                opacity: call.status === "ringing" || call.status === "missed" || call.status === "rejected" ? 0.6 : 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <FiberManualRecordRoundedIcon
                  sx={{
                    fontSize: 12,
                    color: call.status === "ringing" || call.status === "missed" || call.status === "rejected" ? "#CBD5E1" : "#10B981",
                  }}
                />
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#0F172A" }}>
                  3. Connected
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontFamily: "monospace" }}>
                {formatDate(call.timeline?.connectedAt, true) || (call.status === "active" || call.status === "completed" ? formatDate(call.timeline?.ringingAt, true) : "--")}
              </Typography>
            </Box>

            {/* Step 4: Ended */}
            <Box
              sx={{
                p: 2,
                borderRadius: "10px",
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                opacity: call.status === "active" || call.status === "ringing" ? 0.6 : 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <FiberManualRecordRoundedIcon
                  sx={{
                    fontSize: 12,
                    color: call.status === "active" || call.status === "ringing" ? "#CBD5E1" : "#DC2626",
                  }}
                />
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#0F172A" }}>
                  4. Ended
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "0.75rem", color: "#64748B", fontFamily: "monospace" }}>
                {formatDate(call.timeline?.endedAt, true) || (call.status === "completed" || call.status === "rejected" || call.status === "missed" ? "" : "Processing")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 3. Participants: Caller & Callee Cards */}
        <Box>
          <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#0F172A", mb: 2 }}>
            Participant status
          </Typography>

          {/* Tự động 1 cột ở mobile/drawer và 2 cột khi màn hình đủ rộng */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            {/* ================= Caller Card ================= */}
            <Box
              sx={{
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                bgcolor: "#FAFAFA",
                minWidth: 0, // Quan trọng: cho phép container co lại mà không bị con tràn
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
                <Avatar
                  src={caller.avatar}
                  alt={caller?.fullname?.trim().slice(-1) || "C"}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#EEF2FF",
                    color: "#4F46E5",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  {/* Header tên và Badges: cho phép rớt dòng mềm dẻo nếu hẹp */}
                  <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.75, mb: 0.25 }}>
                    <Typography
                      sx={{
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        color: "#0F172A",
                        lineHeight: 1.3,
                        wordBreak: "break-word",
                      }}
                    >
                      {caller?.fullname || "Caller"}
                    </Typography>

                    <Box
                      sx={{
                        px: 0.85,
                        py: 0.2,
                        bgcolor: "#EDE9FE",
                        color: "#7C3AED",
                        borderRadius: "4px",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      CALLER
                    </Box>

                    {callerJoinStatus && (
                      <Tooltip title={callerJoinStatus.description} arrow placement="top">
                        <Box
                          sx={{
                            px: 0.85,
                            py: 0.2,
                            bgcolor: callerJoinStatus.bgColor,
                            color: callerJoinStatus.textColor,
                            border: `1px solid ${callerJoinStatus.borderColor}`,
                            borderRadius: "4px",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.02em",
                            cursor: "help",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {callerJoinStatus.label}
                        </Box>
                      </Tooltip>
                    )}
                  </Box>

                  {/* Email tự động rút gọn dấu 3 chấm nếu quá dài */}
                  <Typography
                    sx={{
                      fontSize: "0.76rem",
                      color: "#64748B",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {maskEmail(caller?.email)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1.25, borderColor: "#F1F5F9" }} />

              {/* Thông số timeline */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ color: "#64748B", fontSize: "0.76rem", flexShrink: 0 }}>
                    Joined time:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#0F172A",
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      textAlign: "right",
                      wordBreak: "break-all",
                    }}
                  >
                    {formatDate(caller?.joinedAt, true) ||
                      (call.status === "active" || call.status === "completed"
                        ? formatDate(call.timeline?.ringingAt, true)
                        : "--")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ color: "#64748B", fontSize: "0.76rem", flexShrink: 0 }}>
                    Left time:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#0F172A",
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      textAlign: "right",
                      wordBreak: "break-all",
                    }}
                  >
                    {formatDate(caller?.leftAt, true) || (call.status === "active" ? "In a call" : "--")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ color: "#64748B", fontSize: "0.76rem", flexShrink: 0 }}>
                    Reason for leaving:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: callerLeaveInfo.color,
                      fontSize: "0.76rem",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {callerLeaveInfo.text}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* ================= Callee Card ================= */}
            <Box
              sx={{
                p: { xs: 1.75, sm: 2.25 },
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                bgcolor: "#FAFAFA",
                minWidth: 0,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
                <Avatar
                  src={callee.avatar}
                  alt={callee?.fullname?.trim().slice(-1) || "R"}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#ECFDF5",
                    color: "#059669",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  {/* Header tên và Badges */}
                  <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.75, mb: 0.25 }}>
                    <Typography
                      sx={{
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        color: "#0F172A",
                        lineHeight: 1.3,
                        wordBreak: "break-word",
                      }}
                    >
                      {callee?.fullname || "Callee"}
                    </Typography>

                    <Box
                      sx={{
                        px: 0.85,
                        py: 0.2,
                        bgcolor: "#D1FAE5",
                        color: "#059669",
                        borderRadius: "4px",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      CALLEE
                    </Box>

                    {calleeJoinStatus && (
                      <Tooltip title={calleeJoinStatus.description} arrow placement="top">
                        <Box
                          sx={{
                            px: 0.85,
                            py: 0.2,
                            bgcolor: calleeJoinStatus.bgColor,
                            color: calleeJoinStatus.textColor,
                            border: `1px solid ${calleeJoinStatus.borderColor}`,
                            borderRadius: "4px",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.02em",
                            cursor: "help",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {calleeJoinStatus.label}
                        </Box>
                      </Tooltip>
                    )}
                  </Box>

                  {/* Email */}
                  <Typography
                    sx={{
                      fontSize: "0.76rem",
                      color: "#64748B",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {maskEmail(callee?.email)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1.25, borderColor: "#F1F5F9" }} />

              {/* Thông số timeline */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ color: "#64748B", fontSize: "0.76rem", flexShrink: 0 }}>
                    Joined time:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#0F172A",
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      textAlign: "right",
                      wordBreak: "break-all",
                    }}
                  >
                    {formatDate(callee?.joinedAt, true) ||
                      (call.status === "ringing" ? "Chưa vào phòng" : "--")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ color: "#64748B", fontSize: "0.76rem", flexShrink: 0 }}>
                    Left time:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#0F172A",
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      textAlign: "right",
                      wordBreak: "break-all",
                    }}
                  >
                    {formatDate(callee?.leftAt, true) || (call.status === "active" ? "In a call" : "--")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ color: "#64748B", fontSize: "0.76rem", flexShrink: 0 }}>
                    Reason for leaving:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: calleeLeaveInfo.color,
                      fontSize: "0.76rem",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {calleeLeaveInfo.text}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>


        {/* 5. WebRTC Security Compliance Notice */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            bgcolor: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: "10px",
          }}
        >
          <SecurityRoundedIcon sx={{ fontSize: 18, color: "#16A34A" }} />
          <Typography sx={{ fontSize: "0.78rem", color: "#166534", fontWeight: 500 }}>
            All peer-to-peer audio/video streams are End-to-End Encrypted (E2EE). Only connection telemetry and session metadata are processed; media streams and transcripts are never recorded or stored.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #F1F5F9", bgcolor: "#FAFAFA" }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: "#7C3AED",
            color: "#FFFFFF",
            borderRadius: "8px",
            px: 3,
            fontWeight: 600,
            textTransform: "none",
            "&:hover": { bgcolor: "#6D28D9" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

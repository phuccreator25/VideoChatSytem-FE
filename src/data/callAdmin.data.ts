
export const statusCallAdmin = [
  { label: "Status: All", value: "all" },
  { label: "Status: Active", value: "active", color: "#10B981" },
  { label: "Status: Ringing", value: "ringing", color: "#F59E0B" },
  { label: "Status: Completed", value: "completed", color: "#059669" },
  { label: "Status: Missed", value: "missed", color: "#EF4444" },
  { label: "Status: Rejected", value: "rejected", color: "#DC2626" },
  { label: "Status: Cancelled", value: "cancelled", color: "#94A3B8" },
];

export const typeCallAdmin = [
  { label: "Type: All", value: "all" },
  { label: "Type: Video", value: "video", color: "#7C3AED" },
  { label: "Type: Audio", value: "voice", color: "#2563EB" },
];

export const endReasonCallAdmin = [
  { label: "End Reason: All", value: "all" },
  { label: "End: Normal", value: "normal", color: "#10B981" },
  { label: "End: Network Lost", value: "network_lost", color: "#F59E0B" },
  { label: "End: Timeout", value: "timeout", color: "#F59E0B" },
];

export const endReasonDisplay = [
  {
    value: "normal",
    label: "Normal",
    color: "success", // Green
    description: "Call ended naturally by participant",
  },
  {
    value: "network_lost",
    label: "Network Lost",
    color: "warning", // Yellow / Orange
    description: "Connection dropped due to network or ICE failure",
  },
  {
    value: "timeout",
    label: "Timeout",
    color: "default", // Grey
    description: "Ringing timed out with no answer",
  },
];

export const participantJoinStatusDisplay = [
  {
    value: "accepted",
    label: "Accepted",
    labelVi: "Đã tham gia",
    color: "success",
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    textColor: "#059669",
    description: "User answered and joined the call room",
  },
  {
    value: "rejected",
    label: "Rejected",
    labelVi: "Từ chối",
    color: "error",
    bgColor: "#FEF2F2",
    borderColor: "#FECACA",
    textColor: "#DC2626",
    description: "User actively declined the incoming call",
  },
  {
    value: "missed",
    label: "Missed",
    labelVi: "Cuộc gọi nhỡ",
    color: "warning",
    bgColor: "#FFFBEB",
    borderColor: "#FDE68A",
    textColor: "#D97706",
    description: "Call ringing timed out with no response",
  },
  {
    value: "pending",
    label: "Pending",
    labelVi: "Đang chờ",
    color: "default",
    bgColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    textColor: "#64748B",
    description: "Call is ringing or awaiting response",
  },
];
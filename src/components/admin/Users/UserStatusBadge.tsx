import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type BadgeVariant =
  | "online"
  | "offline"
  | "active"
  | "pending"
  | "normal"
  | "banned"
  | "supper_admin"
  | "admin"
  | "client";

type UserStatusBadgeProps = { 
  variant: BadgeVariant;
  label?: string;
};

const badgeStyles: Record<
  BadgeVariant,
  { bg: string; dot: string; text: string; defaultLabel: string }
> = {
  online: {
    bg: "#ECFDF5",
    dot: "#10B981",
    text: "#059669",
    defaultLabel: "Online",
  },
  offline: {
    bg: "#F1F5F9",
    dot: "#94A3B8",
    text: "#64748B",
    defaultLabel: "Offline",
  },
  active: {
    bg: "#ECFDF5",
    dot: "#10B981",
    text: "#059669",
    defaultLabel: "Active",
  },
  pending: {
    bg: "#FEF3C7",
    dot: "#F59E0B",
    text: "#D97706",
    defaultLabel: "Pending",
  },
  normal: {
    bg: "#F8FAFC",
    dot: "#06B6D4",
    text: "#0891B2",
    defaultLabel: "Normal",
  },
  banned: {
    bg: "#FEE2E2",
    dot: "#EF4444",
    text: "#DC2626",
    defaultLabel: "Banned",
  },
  supper_admin: {
    bg: "#FEF2F2",
    dot: "#DC2626",
    text: "#B91C1C",
    defaultLabel: "SUPER ADMIN",
  },
  admin: {
    bg: "#F5F3FF",
    dot: "#7C3AED",
    text: "#6D28D9",
    defaultLabel: "ADMIN",
  },
  client: {
    bg: "#F0F9FF",
    dot: "#0284C7",
    text: "#0284C7",
    defaultLabel: "CLIENT",
  },
};

export const UserStatusBadge = ({
  variant,
  label,
}: UserStatusBadgeProps) => {
  const config = badgeStyles[variant] || badgeStyles.normal;
  const displayLabel = label || config.defaultLabel;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.35,
        borderRadius: "16px",
        bgcolor: config.bg,
        border: "1px solid transparent",
        width: "fit-content",
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: config.dot,
          flexShrink: 0,
        }}
      />
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: config.text,
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}
      >
        {displayLabel}
      </Typography>
    </Box>
  );
};

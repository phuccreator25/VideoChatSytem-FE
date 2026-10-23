import React from "react";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ReportGmailerrorredRoundedIcon from "@mui/icons-material/ReportGmailerrorredRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";

import type {
  ReportMessageReason,
  ReportAccountReason,
} from "../types/Report.type";

export type MessageReasonItem = {
  id: ReportMessageReason;
  label: string;
  icon: React.ReactNode;
};

export type AccountReasonItem = {
  id: ReportAccountReason;
  label: string;
  icon: React.ReactNode;
};

// Config danh sách lý do cho Message
export const MESSAGE_REASONS: MessageReasonItem[] = [
  {
    id: "spam",
    label: "Spam / Unauthorized advertising",
    icon: <CampaignOutlinedIcon sx={{ fontSize: 17 }} />,
  },
  {
    id: "harassment",
    label: "Harassment / Insult",
    icon: <WarningAmberRoundedIcon sx={{ fontSize: 17 }} />,
  },
  {
    id: "fraud",
    label: "Scam / Fraudulent activity",
    icon: <ShieldOutlinedIcon sx={{ fontSize: 17 }} />,
  },
  {
    id: "inappropriate_media",
    label: "Inappropriate media",
    icon: <VisibilityOffOutlinedIcon sx={{ fontSize: 17 }} />,
  },
  {
    id: "hate_speech",
    label: "Hate speech / Violence",
    icon: <ReportGmailerrorredRoundedIcon sx={{ fontSize: 17 }} />,
  },
  {
    id: "other",
    label: "Other",
    icon: <HelpOutlineRoundedIcon sx={{ fontSize: 17 }} />,
  },
];

// Config danh sách lý do cho Account
export const ACCOUNT_REASONS: AccountReasonItem[] = [
  {
    id: "fake_identity",
    label: "Fake identity",
    icon: <PersonOutlineRoundedIcon sx={{ fontSize: 17 }} />,
  },
  {
    id: "scam_account",
    label: "Scam account",
    icon: <WarningAmberRoundedIcon sx={{ fontSize: 17 }} />,
  },
  {
    id: "bot_spam",
    label: "Bot account",
    icon: <SmartToyOutlinedIcon sx={{ fontSize: 17 }} />,
  },
  {
    id: "harassment_behavior",
    label: "Harassment behavior",
    icon: <ReportGmailerrorredRoundedIcon sx={{ fontSize: 17 }} />,
  },
  {
    id: "other",
    label: "Other",
    icon: <HelpOutlineRoundedIcon sx={{ fontSize: 17 }} />,
  },
];

export const statusLabel = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
}


export const reportResolutionActions: Record<string, string> = {
  none: 'None',
  warned_user: 'Warned user',
  banned_user: 'Banned user',
  deleted_message: 'Deleted message',
  dismissed: 'Dismissed',
};

export const ACTION_META: Record<
    string,
    {
      icon: React.ReactNode;
      desc: string;
      badge: string;
      accent: string;
      lightBg: string;
      activeBorder: string;
    }
  > = {
    none: {
      icon: <RemoveCircleOutlineRoundedIcon sx={{ fontSize: 18 }} />,
      desc: "No action has been taken yet, keep the verification status as is",
      badge: "Default",
      accent: "#64748B",
      lightBg: "#F8FAFC",
      activeBorder: "#94A3B8",
    },
    warned_user: {
      icon: <WarningAmberRoundedIcon sx={{ fontSize: 18 }} />,
      desc: "Sends a warning about violation of community standards to the account",
      badge: "Warning",
      accent: "#D97706",
      lightBg: "#FFFBEB",
      activeBorder: "#F59E0B",
    },
    deleted_message: {
      icon: <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />,
      desc: "Revokes & permanently deletes violating messages from the conversation",
      badge: "Message deletion",
      accent: "#E11D48",
      lightBg: "#FFF1F2",
      activeBorder: "#F43F5E",
    },
    banned_user: {
      icon: <BlockOutlinedIcon sx={{ fontSize: 18 }} />,
      desc: "Suspends / locks the violating account's access",
      badge: "Account ban",
      accent: "#DC2626",
      lightBg: "#FEF2F2",
      activeBorder: "#EF4444",
    },
    dismissed: {
      icon: <CloseRoundedIcon sx={{ fontSize: 18 }} />,
      desc: "Rejects the report because no violation of the rules was found",
      badge: "Dismissed",
      accent: "#4F46E5",
      lightBg: "#EEF2FF",
      activeBorder: "#6366F1",
    },
  };

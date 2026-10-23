import type { ReportAccountReason, ReportMessageReason, ReportStatus, ReportTargetType } from "../Report.type";

export type AdminResolutionAction =
  | "none"
  | "warned_user"
  | "banned_user"
  | "deleted_message"
  | "dismissed";

export type IAdminReportItem = {
  id: string;
  targetType: ReportTargetType;
  createdAt: string;
  createdAtShort: string;
  reporterName: string;
  reporterNote?: string;
  targetUser: {
    id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  reason: string;
  reasonLabel: string;
  status: ReportStatus;

  messageSnapshot?: {
    messageId: string;
    conversationId: string;
    content?: string;
    sentAt: string;
    mediaUrl?: string;
  };

  evidenceAttachments?: string[];

  assignedTo?: {
    id: string;
    name: string;
    assignedAt: string;
  };
  resolutionActions?: AdminResolutionAction[];
  feedbackToReporter?: string;
  adminNotes?: string;
  resolvedAt?: string;
  unBannedAt?: string | null;
}

export type IAdminReportKpi = {
  pendingCount: number;
  inProgressCount: number;
  resolvedTodayCount: number;
  rejectedCount: number;
  totalCount: number;
}


export type typeQueryReportAdmin = {
  targetType?: ReportTargetType | 'all'
  status?: ReportStatus | 'all'
  reason?: ReportMessageReason | ReportAccountReason | 'all'
  search?: string
  page?: number
  limit?: number
}
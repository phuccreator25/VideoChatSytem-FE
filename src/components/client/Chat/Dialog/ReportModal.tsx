import Dialog from "@mui/material/Dialog";

import { MessageReport } from "./sub-components/MessageReport";
import { AccountReport } from "./sub-components/AccountReport";
import { useTicket } from "../../../../hooks/client/Ticket/ticket.hook";
import type { ICreateReportAccountPayload, ICreateReportMessagePayload, IReportTargetMessage, IReportTargetUser, ReportTargetType } from "../../../../types/Report.type";
export type ReportModalProps = {
  open: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetUser?: IReportTargetUser;
  targetMessage?: IReportTargetMessage | null;
  onSubmit?: (
    payload: ICreateReportMessagePayload | ICreateReportAccountPayload
  ) => Promise<any> | void;
};

export function ReportModal({
  open,
  onClose,
  targetType,
  targetUser,
  targetMessage,
}: ReportModalProps) {
  const { handler } = useTicket()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 3, sm: 4 },
          bgcolor: "#ffffff",
          backgroundImage: "none",
          boxShadow: "0 24px 48px rgba(15, 23, 42, 0.16)",
          overflow: "hidden",
          border: "1px solid rgba(148, 163, 184, 0.18)",
          m: { xs: 1.5, sm: 2 },
          maxHeight: { xs: "calc(100% - 32px)", sm: "calc(100% - 64px)" },
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {targetType === "message" ? (
        <MessageReport
          onClose={onClose}
          targetMessage={targetMessage}
          onSubmit={handler.onCreateTicket}
        />
      ) : targetUser && (
        <AccountReport
          onClose={onClose}
          targetUser={targetUser}
          onSubmit={handler.onCreateTicket}
        />
      )}
    </Dialog>
  );
}

export default ReportModal;

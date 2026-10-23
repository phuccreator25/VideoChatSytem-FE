import { useState } from 'react';
import Box from '@mui/material/Box';

import { customScrollbarSx } from '../../../../../utils/CustomScroll';
import { MediaPreviewModal } from '../../../Chat/Dialog/MediaPreviewModal';
import useDownloadFile from '../../../../../helpers/client/downloadFile.helper';
import type { IReportTicket } from '../../../../../types/Report.type';
import DialogConfirmCancel from './confimDialog';
import DetailsDrawerHeader from './SubComponents/DetailsDrawer/DetailsDrawerHeader';
import DetailsDrawerFooter from './SubComponents/DetailsDrawer/DetailsDrawerFooter';
import DetailsOfficialResponse from './SubComponents/DetailsDrawer/DetailsOfficialResponse';
import DetailsStatusTimeline from './SubComponents/DetailsDrawer/DetailsStatusTimeline';
import DetailsTargetEvidence from './SubComponents/DetailsDrawer/DetailsTargetEvidence';

type ReportDetailsDrawerProps = {
  report?: IReportTicket | null;
  onClose?: () => void;
  onCancelReport?: (reportId: string) => Promise<any> | void;
};

export default function ReportDetailsDrawer({
  report,
  onClose,
  onCancelReport,
}: ReportDetailsDrawerProps) {
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [openRevokeDialog, setOpenRevokeDialog] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const { onHandleDownloadFile } = useDownloadFile();

  const handleOpenLightbox = (index: number) => {
    if (report && report.evidenceAttachments && report.evidenceAttachments.length > 0) {
      setAttachments(report.evidenceAttachments);
      setCurrentAttachmentIndex(index);
    }
  };

  const handleOpenRevokeConfirm = () => {
    if (isRevoking) return;
    setOpenRevokeDialog(true);
  };

  const handleCloseRevokeDialog = () => {
    if (isRevoking) return;
    setOpenRevokeDialog(false);
  };

  const handleConfirmRevoke = async () => {
    if (!report?.id || isRevoking) return;
    try {
      setIsRevoking(true);
      await onCancelReport?.(report.id);
      setOpenRevokeDialog(false);
    } catch (error) {
      console.error('Failed to revoke report:', error);
    } finally {
      setIsRevoking(false);
    }
  };

  if (!report) return null;

  const isPending = report.status === 'pending';
  const isFinished = report.status === 'resolved' || report.status === 'rejected';

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#F8FAFC',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <DetailsDrawerHeader
        createdAt={report.createdAt}
        onClose={onClose}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          p: { xs: 2, sm: 3, md: 3.5 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          ...customScrollbarSx,
        }}
      >
        <DetailsTargetEvidence
          report={report}
          onOpenLightbox={handleOpenLightbox}
        />

        <DetailsStatusTimeline report={report} />

        {isFinished && <DetailsOfficialResponse report={report} />}
      </Box>

      <DetailsDrawerFooter
        isPending={isPending}
        isRevoking={isRevoking}
        onOpenRevokeConfirm={handleOpenRevokeConfirm}
        onClose={onClose}
      />

      <MediaPreviewModal
        open={attachments.length > 0}
        items={attachments.map((url) => {
          const extracted = url.split("/").pop()?.split("?")[0] || "evidence.jpg";
          return {
            url,
            fileName: decodeURIComponent(extracted),
            type: "image",
          };
        })}
        currentIndex={currentAttachmentIndex}
        onClose={() => setAttachments([])}
        onIndexChange={(newIndex) => setCurrentAttachmentIndex(newIndex)}
        onDownload={(url, fileName) => onHandleDownloadFile(url, fileName)}
      />

      <DialogConfirmCancel
        openRevokeDialog={openRevokeDialog}
        handleCloseRevokeDialog={handleCloseRevokeDialog}
        handleConfirmRevoke={handleConfirmRevoke}
        isRevoking={isRevoking}
        report={report}
      />
    </Box>
  );
}

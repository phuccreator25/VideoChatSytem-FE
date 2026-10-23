import React, { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import type { IAdminReportItem, AdminResolutionAction } from "../../../types/admin/reportAdmin.type";
import { MediaPreviewModal } from "../../client/Chat/Dialog/MediaPreviewModal";
import useDownloadFile from "../../../helpers/client/downloadFile.helper";

// Subcomponents
import { ReportDrawerHeader } from "./subcomponents/ReportDrawerHeader";
import { ReportEvidenceSection } from "./subcomponents/ReportEvidenceSection";
import { ReportReviewerBox } from "./subcomponents/ReportReviewerBox";
import { ReportResolutionActions } from "./subcomponents/ReportResolutionActions";
import { ReportFeedbackAndNotes } from "./subcomponents/ReportFeedbackAndNotes";
import { ReportDrawerFooter } from "./subcomponents/ReportDrawerFooter";

type ReportInspectorDrawerProps = {
  open: boolean;
  report: IAdminReportItem | null;
  onClose: () => void;
  onProgress: (id: string) => Promise<any> | void;
  onResolve: (id: string, data: {
    resolutionActions: AdminResolutionAction[];
    status: string;
    feedbackToReporter: string;
    adminNotes: string;
    unBannedAt?: string | null;
  }) => Promise<any> | void;
  onRelease: (id: string) => Promise<any> | void;
};

export const ReportInspectorDrawer: React.FC<ReportInspectorDrawerProps> = ({
  open,
  report,
  onClose,
  onProgress,
  onResolve,
  onRelease,
}) => {
  const [selectedActions, setSelectedActions] = useState<AdminResolutionAction[]>([]);
  const [feedbackText, setFeedbackText] = useState(report?.feedbackToReporter || "");
  const [internalNotes, setInternalNotes] = useState(report?.adminNotes || "");
  const [banDurationType, setBanDurationType] = useState<"permanent" | "temporary">("permanent");
  const [banPreset, setBanPreset] = useState<string>("7d");
  const [customUnbanDate, setCustomUnbanDate] = useState<string>("");

  const [openMediaPreview, setOpenMediaPreview] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { onHandleDownloadFile } = useDownloadFile();

  const [isProgressing, setIsProgressing] = useState<boolean>(false);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [isReleasing, setIsReleasing] = useState<boolean>(false);

  const currentAdmin = useSelector((state: RootState) => state.admin.currentAdmin);
  const currentAdminId = currentAdmin?._id;

  const isPending = report?.status === "pending";
  const isInProgress = report?.status === "in_progress";
  const isResolved = report?.status === "resolved";
  const isRejected = report?.status === "rejected";
  const isFinished = isResolved || isRejected;

  const isSuperAdmin = currentAdmin?.role?.toLowerCase() === "supper_admin";
  const isCurrentAssignee = report?.assignedTo?.id === currentAdminId;
  const canActOnReport = isCurrentAssignee || isSuperAdmin;

  useEffect(() => {
    if (report) {
      if (report.resolutionActions && report.resolutionActions.length > 0) {
        setSelectedActions(report.resolutionActions);
      } else {
        setSelectedActions([]);
      }

      setFeedbackText(report.feedbackToReporter || "");
      setInternalNotes(report.adminNotes || "");

      if (report.unBannedAt) {
        setBanDurationType("temporary");
        setBanPreset("custom");
        const dateStr = new Date(report.unBannedAt).toISOString().slice(0, 16);
        setCustomUnbanDate(dateStr);
      } else {
        setBanDurationType("permanent");
        setBanPreset("7d");
        const defaultCustom = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
        setCustomUnbanDate(defaultCustom);
      }
    }
  }, [report?.id, report?.resolutionActions, report?.feedbackToReporter, report?.adminNotes, report?.unBannedAt]);

  const handleToggleAction = (actionId: AdminResolutionAction) => {
    if (isFinished) return;

    setSelectedActions((prev) => {
      // Nếu chọn "none" hoặc "dismissed" thì chỉ chọn duy nhất 1 action đó
      if (actionId === "none" || actionId === "dismissed") {
        return prev.includes(actionId) ? [] : [actionId];
      }

      // Gỡ bỏ "none" và "dismissed" khi chọn các action kỷ luật
      const active = prev.filter((a) => a !== "none" && a !== "dismissed");

      if (active.includes(actionId)) {
        // Bỏ chọn
        return active.filter((a) => a !== actionId);
      } else {
        // Tối đa 3 actions
        if (active.length >= 3) {
          return active;
        }
        return [...active, actionId];
      }
    });
  };

  const isBannedSelected = selectedActions.includes("banned_user");

  const computedUnbanDate = useMemo(() => {
    if (!isBannedSelected || banDurationType === "permanent") {
      return null;
    }
    const now = new Date();
    if (banPreset === "1d") {
      return new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    }
    if (banPreset === "3d") {
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    }
    if (banPreset === "7d") {
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
    if (banPreset === "14d") {
      return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    }
    if (banPreset === "30d") {
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
    if (banPreset === "custom") {
      return customUnbanDate ? new Date(customUnbanDate) : null;
    }
    return null;
  }, [isBannedSelected, banDurationType, banPreset, customUnbanDate]);

  if (!report) return null;

  const handleProgress = async () => {
    try {
      setIsProgressing(true);
      await onProgress(report.id);
    } catch (error) {
      console.error("Progress report error:", error);
    } finally {
      setIsProgressing(false);
    }
  };

  const handleRelease = async () => {
    try {
      setIsReleasing(true);
      await onRelease(report.id);
    } catch (error) {
      console.error("Release report error:", error);
    } finally {
      setIsReleasing(false);
    }
  };

  const handleResolve = async (status: "resolved" | "rejected") => {
    try {
      setIsResolving(true);
      const unBannedAt =
        status === "resolved" && isBannedSelected && banDurationType === "temporary" && computedUnbanDate
          ? computedUnbanDate.toISOString()
          : null;

      const actionsToSubmit =
        status === "rejected"
          ? (["dismissed" as AdminResolutionAction])
          : selectedActions.length > 0
          ? selectedActions
          : (["none" as AdminResolutionAction]);

      await onResolve(report.id, {
        resolutionActions: actionsToSubmit,
        status,
        feedbackToReporter: feedbackText,
        adminNotes: internalNotes,
        unBannedAt,
      });
    } catch (error) {
      console.error("Resolve report error:", error);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
            bgcolor: "rgba(15, 23, 42, 0.35)",
          },
        },
      }}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "580px", md: "640px" },
          bgcolor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-10px 0 35px -5px rgba(124, 58, 237, 0.12)",
          borderLeft: "1.5px solid #EDE9FE",
        },
      }}
    >
      {/* 1. Header */}
      <ReportDrawerHeader
        report={report}
        isPending={isPending}
        isInProgress={isInProgress}
        isResolved={isResolved}
        onClose={onClose}
      />

      {/* 2. Scrollable Body Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2.75,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#E2E8F0",
            borderRadius: "6px",
          },
        }}
      >
        {/* Section 1: Bằng chứng vi phạm */}
        <ReportEvidenceSection
          report={report}
          onPreviewImage={(index) => {
            setCurrentIndex(index);
            setOpenMediaPreview(true);
          }}
        />

        {/* Section 2: Kiểm duyệt viên phụ trách & Tiến trình */}
        <ReportReviewerBox
          report={report}
          isPending={isPending}
          isInProgress={isInProgress}
          isProgressing={isProgressing}
          isReleasing={isReleasing}
          canActOnReport={canActOnReport}
          currentAdminId={currentAdminId}
          onProgress={handleProgress}
          onRelease={handleRelease}
        />

        {/* Khối Section 3, 4, 5 bị khóa nếu ticket isPending */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.75,
            ...(isPending && {
              opacity: 0.45,
              pointerEvents: "none",
              userSelect: "none",
              filter: "grayscale(30%)",
            }),
            ...(isFinished && {
              pointerEvents: "none",
            }),
          }}
        >
          {/* Section 3: Chọn biện pháp xử lý */}
          <ReportResolutionActions
            reportTargetType={report.targetType}
            selectedActions={selectedActions}
            onToggleAction={handleToggleAction}
            isFinished={isFinished}
            banDurationType={banDurationType}
            setBanDurationType={setBanDurationType}
            banPreset={banPreset}
            setBanPreset={setBanPreset}
            customUnbanDate={customUnbanDate}
            setCustomUnbanDate={setCustomUnbanDate}
            computedUnbanDate={computedUnbanDate}
            reportUnBannedAt={report.unBannedAt}
          />

          {/* Section 4 & 5: Phản hồi & Ghi chú nội bộ */}
          <ReportFeedbackAndNotes
            feedbackText={feedbackText}
            setFeedbackText={setFeedbackText}
            internalNotes={internalNotes}
            setInternalNotes={setInternalNotes}
          />
        </Box>
      </Box>

      {/* 3. Sticky Action Footer */}
      <ReportDrawerFooter
        isPending={isPending}
        isFinished={isFinished}
        isResolved={isResolved}
        canActOnReport={canActOnReport}
        isProgressing={isProgressing}
        isReleasing={isReleasing}
        isResolving={isResolving}
        hasSelectedActions={selectedActions.length > 0}
        isCurrentAssignee={isCurrentAssignee}
        onClose={onClose}
        onProgress={handleProgress}
        onRelease={handleRelease}
        onResolve={handleResolve}
      />

      {/* Media Preview Modal */}
      <MediaPreviewModal
        open={openMediaPreview}
        items={
          report.evidenceAttachments?.map((url) => {
            const extracted = url.split("/").pop()?.split("?")[0] || "evidence.jpg";
            return {
              url,
              fileName: decodeURIComponent(extracted),
              type: "image",
            };
          }) || []
        }
        currentIndex={currentIndex}
        onClose={() => setOpenMediaPreview(false)}
        onIndexChange={(newIndex) => setCurrentIndex(newIndex)}
        onDownload={(url, fileName) => onHandleDownloadFile(url, fileName)}
      />
    </Drawer>
  );
};

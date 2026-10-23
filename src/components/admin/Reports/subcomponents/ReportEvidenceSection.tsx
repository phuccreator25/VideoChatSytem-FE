import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { IAdminReportItem } from "../../../../types/admin/reportAdmin.type";
import { ACCOUNT_REASONS, MESSAGE_REASONS } from "../../../../data/Report.data";
import { formatDate } from "../../../../helpers/formatDate.helper";

type ReportEvidenceSectionProps = {
  report: IAdminReportItem;
  onPreviewImage: (index: number) => void;
}

export const ReportEvidenceSection = ({
  report,
  onPreviewImage,
} : ReportEvidenceSectionProps) => {
  const reasonLabel =
    report.targetType === "message"
      ? MESSAGE_REASONS.find((r) => r.id === report.reason)?.label
      : ACCOUNT_REASONS.find((r) => r.id === report.reason)?.label;

  return (
    <Box
      sx={{
        border: "1px solid #E2E8F0",
        borderRadius: "14px",
        p: 2.5,
        bgcolor: "#FFFFFF",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.85rem",
          fontWeight: 700,
          color: "#0F172A",
          mb: 0.75,
        }}
      >
        1. EVIDENCE ({report.targetType === "message" ? "MESSAGE" : "ACCOUNT"}):
      </Typography>

      <Typography
        sx={{
          fontSize: "0.825rem",
          fontWeight: 600,
          color: "#1E293B",
          mb: 0.35,
        }}
      >
        Target user: {report.targetUser.fullName} ({report.targetUser.email})
      </Typography>

      <Typography
        sx={{
          fontSize: "0.78rem",
          color: "#7C3AED",
          mb: 1.75,
        }}
      >
        Reason: {reasonLabel}
      </Typography>

      {/* Deep Violet Message Bubble Snapshot */}
      {report.targetType === "message" && report.messageSnapshot && (
        <Box
          sx={{
            bgcolor: "#2E1065",
            borderRadius: "12px",
            p: 2,
            color: "#FFFFFF",
            position: "relative",
            boxShadow: "0 8px 24px -6px rgba(46, 16, 101, 0.4)",
            mb: 1.5,
          }}
        >
          <Typography
            sx={{
              mt: 1,
              fontSize: "13.5px",
              lineHeight: 1.5,
              color: "#FFFFFF",
              fontFamily: "inherit",
            }}
          >
            {report.messageSnapshot.mediaUrl ? (
              <Box
                component="a"
                href={report.messageSnapshot?.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                sx={{
                  color: "#fff",
                  textDecoration: "none",
                  fontFamily: "monospace",
                  display: "inline-block",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    color: "#90caf9",
                    textDecoration: "underline",
                    opacity: 0.85,
                    transform: "translateY(-1px)",
                  },
                }}
              >
                [ View evidence file ]
              </Box>
            ) : (
              `Content: " ${report.messageSnapshot.content} "`
            )}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 1.25,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "#E9D5FF",
                fontFamily: "monospace",
              }}
            >
              Sent at: {formatDate(report.messageSnapshot.sentAt, true)}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Account Evidence Attachments */}
      {report.targetType === "account" &&
        report.evidenceAttachments &&
        report.evidenceAttachments.length > 0 && (
          <Box sx={{ mb: 1.5 }}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#64748B",
                mb: 1,
                fontWeight: 600,
              }}
            >
              Evidence photos ({report.evidenceAttachments.length}):
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              {report.evidenceAttachments.map((imgUrl, index) => (
                <Box
                  key={index}
                  component="img"
                  src={imgUrl}
                  alt={`Evidence ${index + 1}`}
                  onClick={() => onPreviewImage(index)}
                  sx={{
                    width: 100,
                    height: 75,
                    borderRadius: "8px",
                    objectFit: "cover",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.04)",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

      {/* Reporter description note */}
      {report.reporterNote && (
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "#475569",
            fontStyle: "italic",
            mt: 1,
            bgcolor: "#F8FAFC",
            p: 1.25,
            borderRadius: "8px",
            border: "1px dashed #E2E8F0",
          }}
        >
          Reporter note: &ldquo;{report.reporterNote}&rdquo;
        </Typography>
      )}
    </Box>
  );
};

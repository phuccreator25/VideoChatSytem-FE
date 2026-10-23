import React, { useState, useRef } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { customScrollbarSx } from "../../../../../utils/CustomScroll";
import type {
  IReportTargetUser,
  ICreateReportAccountPayload,
  ReportAccountReason,
} from "../../../../../types/Report.type";
import { ACCOUNT_REASONS } from "../../../../../data/Report.data";
import { uploadReportAttachments } from "../../../../../helpers/uploadS3.helper";
import { enqueueSnackbar } from "notistack";

type typeVidenceImageItem = {
  name: string;
  url: string;
  s3Key: string;
  file: File;
  isFailed: boolean;
}

type AccountReportProps = {
  onClose: () => void;
  targetUser?: IReportTargetUser | null;
  onSubmit?: (payload: ICreateReportAccountPayload) => void;
};

export function AccountReport({
  onClose,
  targetUser,
  onSubmit,
}: AccountReportProps) {
  const [selectedReason, setSelectedReason] = useState<ReportAccountReason | "">("");
  const [description, setDescription] = useState<string>("");
  const [evidenceImages, setEvidenceImages] = useState<typeVidenceImageItem[]>([]);
  const [uploadSessionId, setUploadSessionId] = useState<string | undefined>();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddImage = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 3 - evidenceImages.length;

    if(remainingSlots <= 0) {
      enqueueSnackbar("You can only upload 3 files", { variant: "warning" });
      return;
    }

    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    const uploadResult = await uploadReportAttachments(filesToAdd);
    if(!uploadResult) return

    const {uploadSessionId, successFiles, failedFiles} = uploadResult;

    setUploadSessionId(uploadSessionId);

    const successList = successFiles?.map((item) => ({
      name: item.file.name,
      url: URL.createObjectURL(item.file),
      s3Key: item.s3Key,
      file: item.file,
      isFailed: false,
    }));

    const failList = failedFiles && failedFiles.length > 0 ? failedFiles?.map((item) => ({
      name: item.file.name,
      url: URL.createObjectURL(item.file),
      s3Key: item.s3Key,
      file: item.file,
      isFailed: true,
    })) : [];

    setEvidenceImages((prev) => [...prev, ...(successList ?? []), ...(failList ?? [])]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const item = evidenceImages[index];
    if (item?.url && item.url.startsWith("blob:")) {
      URL.revokeObjectURL(item.url);
    }
    setEvidenceImages((prev) => prev.filter((_, index) => index !== index));
  };

  const handleSubmit = () => {
    if (!selectedReason || evidenceImages.length === 0) return;

    const payload: ICreateReportAccountPayload = {
      targetType: "account",
      targetUserId: targetUser?.userId || "",
      reason: selectedReason as ReportAccountReason,
      description: description.trim() || undefined,
      uploadSessionId: uploadSessionId ?? "",
      evidenceAttachments: evidenceImages.filter((img) => !img.isFailed).map((img) => img.s3Key),
    };

    onSubmit?.(payload);
    onClose();
  };

  return (
    <>
      {/* Header */}
      <DialogTitle
        sx={{
          p: { xs: 2, sm: 2.5 },
          px: { xs: 2.5, sm: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
          bgcolor: "rgba(248, 250, 252, 0.6)",
          gap: 1.5,
        }}
      >
        <Stack
          direction="row"
          spacing={{ xs: 1.5, sm: 1.75 }}
          alignItems="center"
          sx={{ minWidth: 0, flex: 1 }}
        >
          <Box
            sx={{
              width: { xs: 40, sm: 44 },
              height: { xs: 40, sm: 44 },
              borderRadius: 3,
              bgcolor: "rgba(239, 68, 68, 0.08)",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.12)",
              flexShrink: 0,
            }}
          >
            <PersonOutlineRoundedIcon sx={{ fontSize: 24 }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: 16, sm: 18 },
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
              }}
            >
              Report Violating Accounts
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                color: "#64748b",
                mt: 0.2,
                lineHeight: 1.35,
              }}
            >
              Report the comprehensive violations of the account to the Chat app Moderation Team
            </Typography>
          </Box>
        </Stack>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "#64748b",
            "&:hover": {
              bgcolor: "rgba(148, 163, 184, 0.14)",
              color: "#0f172a",
            },
            transition: "all 0.15s ease",
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      {/* Main Content Area */}
      <DialogContent
        sx={{
          p: { xs: 2.25, sm: 3 },
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2.25,
          mt: 2,
          ...customScrollbarSx,
        }}
      >
        {/* Khung Card thông tin tài khoản bị báo cáo */}
        <Box
          sx={{
            p: 1.75,
            borderRadius: 3,
            bgcolor: "#f8fafc",
            border: "1px solid rgba(226, 232, 240, 0.85)",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            src={targetUser?.avatar}
            sx={{
              width: 42,
              height: 42,
              bgcolor: "#ef4444",
              color: "#ffffff",
              fontSize: 17,
              fontWeight: 700,
              boxShadow: "0 3px 10px rgba(239, 68, 68, 0.2)",
              flexShrink: 0,
            }}
          >
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: "13.5px", color: "#1e293b" }}>
              Account to be reported:{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "#0f172a" }}>
                {targetUser?.fullname || "Unknown User"}
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: "11.5px",
                color: "#64748b",
                mt: 0.3,
                fontWeight: 500,
              }}
            >
              Username: {targetUser?.username ? `@${targetUser.username.replace(/^@/, "")}` : "N/A"}
            </Typography>

            <Typography
              sx={{
                fontSize: "11.5px",
                color: "#64748b",
                mt: 0.15,
                fontWeight: 500,
              }}
            >
              Status: {targetUser?.isOnline ? "Online" : "Offline"}
              {targetUser?.lastSeen ? ` • Last seen: ${targetUser.lastSeen}` : ""}
            </Typography>
          </Box>
        </Box>

        {/* Section: Danh sách lý do vi phạm (BẮT BUỘC) */}
        <Box>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            REASON FOR ACCOUNT REPORT (MANDATORY):
          </Typography>

          <Stack spacing={0.8}>
            {ACCOUNT_REASONS.map((item) => {
              const isSelected = selectedReason === item.id;
              return (
                <Box
                  key={item.id}
                  onClick={() => setSelectedReason(item.id)}
                  sx={{
                    px: 1.75,
                    py: 1.05,
                    borderRadius: 2.5,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: isSelected
                      ? "rgba(239, 68, 68, 0.05)"
                      : "#ffffff",
                    border: isSelected
                      ? "1.5px solid #ef4444"
                      : "1px solid rgba(226, 232, 240, 0.85)",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: isSelected
                        ? "rgba(239, 68, 68, 0.08)"
                        : "rgba(248, 250, 252, 0.85)",
                      borderColor: isSelected
                        ? "#ef4444"
                        : "rgba(203, 213, 225, 0.9)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        color: isSelected ? "#ef4444" : "#64748b",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? "#dc2626" : "#334155",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>

                  {isSelected && (
                    <CheckRoundedIcon
                      sx={{
                        fontSize: 18,
                        color: "#ef4444",
                        ml: 1,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Section: Mô tả chi tiết hành vi (TÙY CHỌN) */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 0.75,
            }}
          >
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#64748b",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              DETAILED DESCRIPTION OF VIOLATING BEHAVIOR (OPTIONAL):
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#4f46e5",
              }}
            >
              {description.length} / 500
            </Typography>
          </Box>

          <Box
            component="textarea"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (e.target.value.length <= 500) {
                setDescription(e.target.value);
              }
            }}
            placeholder="This account uses the administrator's profile picture to send messages scamming people into depositing money through public groups. Many members have been harassed by this individual."
            rows={3}
            sx={{
              width: "100%",
              boxSizing: "border-box",
              borderRadius: 2.5,
              border: "1px solid rgba(226, 232, 240, 0.85)",
              bgcolor: "#ffffff",
              p: 1.25,
              fontSize: "13px",
              fontFamily: "inherit",
              color: "#0f172a",
              lineHeight: 1.5,
              resize: "none",
              outline: "none",
              transition: "border-color 0.18s ease, box-shadow 0.18s ease",
              "&:focus": {
                borderColor: "#ef4444",
                boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.08)",
              },
              "&::placeholder": {
                color: "#94a3b8",
                fontSize: "12.5px",
              },
            }}
          />
        </Box>

        {/* Section: Bằng chứng đính kèm (TỐI ĐA 3 ẢNH) */}
        <Box>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            ATTACHED EVIDENCE (MAXIMUM 3 IMAGES - MAXIMUM 5MB/IMAGE):
          </Typography>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleAddImage}
          />

          <Stack direction="row" spacing={1.25}>
            {evidenceImages.map((img, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 90,
                  height: 80,
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <Avatar
                  src={img.url}
                  alt={img.name}
                  variant="rounded"
                  sx={{
                    width: 90,
                    height: 80,
                    borderRadius: 2.5,
                    border: img.isFailed ? "1.5px solid #ef4444" : "1.5px solid #818cf8",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    bgcolor: "rgba(79, 70, 229, 0.04)",
                    "& .MuiAvatar-img": {
                      objectFit: "cover",
                    },
                  }}
                >
                  <InsertDriveFileOutlinedIcon sx={{ fontSize: 24, color: "#818cf8" }} />
                </Avatar>

                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(idx)}
                  sx={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 19,
                    height: 19,
                    bgcolor: "#ef4444",
                    color: "#ffffff",
                    "&:hover": { bgcolor: "#dc2626" },
                    boxShadow: "0 2px 6px rgba(239, 68, 68, 0.35)",
                    zIndex: 2,
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Box>
            ))}

            {Array.from({ length: Math.max(0, 3 - evidenceImages.length) }).map((_, idx) => (
              <Box
                key={idx}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  width: 90,
                  height: 80,
                  borderRadius: 2.5,
                  bgcolor: "#ffffff",
                  border: "1px dashed rgba(203, 213, 225, 0.95)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.16s ease",
                  "&:hover": {
                    bgcolor: "rgba(248, 250, 252, 0.9)",
                    borderColor: "#94a3b8",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <AddPhotoAlternateOutlinedIcon
                  sx={{ fontSize: 20, color: "#64748b", mb: 0.4 }}
                />
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  Add Image
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3 },
          py: 1.75,
          borderTop: "1px solid rgba(148, 163, 184, 0.12)",
          bgcolor: "rgba(248, 250, 252, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 1.25,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            px: 2.5,
            py: 0.75,
            fontSize: "13px",
            fontWeight: 600,
            color: "#475569",
            borderColor: "rgba(203, 213, 225, 0.8)",
            bgcolor: "#ffffff",
            "&:hover": {
              bgcolor: "rgba(241, 245, 249, 0.8)",
              borderColor: "#94a3b8",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!selectedReason || evidenceImages.length === 0}
          onClick={handleSubmit}
          endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />}
          sx={{
            textTransform: "uppercase",
            borderRadius: "10px",
            px: 2.75,
            py: 0.75,
            fontSize: "12.5px",
            fontWeight: 700,
            color: "#ffffff",
            bgcolor: "#ef4444",
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)",
            "&:hover": {
              bgcolor: "#dc2626",
              boxShadow: "0 6px 16px rgba(239, 68, 68, 0.35)",
            },
            "&.Mui-disabled": {
              bgcolor: "rgba(148, 163, 184, 0.22)",
              color: "rgba(148, 163, 184, 0.75)",
              boxShadow: "none",
            },
          }}
        >
          REPORT NOW
        </Button>
      </DialogActions>
    </>
  );
}

export default AccountReport;

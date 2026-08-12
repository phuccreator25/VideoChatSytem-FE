import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { enqueueSnackbar } from "notistack";
import type { SpeechTranscriptItem } from "../../../types/call/call.type";

interface CallSummaryModalProps {
  open: boolean;
  onClose: () => void;
  aiSummary?: {
    summary?: string;
    keyPoints?: string[];
    actionItems?: string[];
    createdAt?: string;
  } | null;
  transcript?: SpeechTranscriptItem[];
  isLoading?: boolean;
  onGenerateAI?: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export const CallSummaryModal = ({
  open,
  onClose,
  aiSummary,
  transcript = [],
  isLoading = false,
  onGenerateAI,
}: CallSummaryModalProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleCopySummary = () => {
    if (!aiSummary) return;
    const textToCopy = `📌 TÓM TẮT CUỘC GỌI AI:\n${aiSummary.summary || ""}\n\n🎯 Ý CHÍNH:\n${(aiSummary.keyPoints || []).map((k) => `• ${k}`).join("\n")}\n\n✅ VIỆC CẦN LÀM:\n${(aiSummary.actionItems || []).map((a) => `• ${a}`).join("\n")}`;
    navigator.clipboard.writeText(textToCopy);
    enqueueSnackbar("Đã sao chép nội dung tóm tắt vào clipboard!", { variant: "success" });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)",
          color: "#f8fafc",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          boxShadow: "0 24px 60px rgba(124, 58, 237, 0.35)",
          overflow: "hidden",
        },
      }}
    >
      {/* ── HEADER GIẢI TRÍ CAO CẤP AI ── */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(90deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)",
          borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)",
              animation: "pulse 2s infinite ease-in-out",
            }}
          >
            <AutoAwesomeIcon sx={{ color: "#ffffff", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: 17,
                fontWeight: 700,
                background: "linear-gradient(90deg, #c084fc 0%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Trí Tuệ Nhân Tạo Tóm Tắt
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", fontSize: 11.5 }}>
              Powered by Gemini AI Intelligence
            </Typography>
          </Box>
        </Stack>

        <IconButton
          onClick={onClose}
          sx={{
            color: "#94a3b8",
            "&:hover": { color: "#ffffff", bgcolor: "rgba(255, 255, 255, 0.1)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, minHeight: 320 }}>
        {/* TRẠNG THÁI LOADING AI */}
        {isLoading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2.5}
            sx={{ py: 6 }}
          >
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                size={64}
                thickness={4}
                sx={{ color: "#a855f7" }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AutoAwesomeIcon sx={{ color: "#38bdf8", fontSize: 26 }} />
              </Box>
            </Box>
            <Typography sx={{ color: "#cbd5e1", fontWeight: 600, fontSize: 15 }}>
              Gemini AI đang phân tích hội thoại...
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", fontSize: 12 }}>
              Vui lòng chờ trong giây lát
            </Typography>
          </Stack>
        ) : !aiSummary && onGenerateAI ? (
          /* TRẠNG THÁI CHƯA TẠO TÓM TẮT */
          <Stack alignItems="center" justifyContent="center" spacing={2.5} sx={{ py: 4 }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: "rgba(139, 92, 246, 0.12)",
                border: "1px dashed rgba(139, 92, 246, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 36, color: "#c084fc" }} />
            </Box>
            <Box textAlign="center">
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>
                Cuộc gọi có bản ghi lời thoại
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5, maxWidth: 360 }}>
                Nhấn vào nút bên dưới để AI tự động phân tích ý chính và trích xuất danh sách công việc cần làm.
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={onGenerateAI}
              startIcon={<AutoAwesomeIcon />}
              sx={{
                borderRadius: 3,
                px: 3.5,
                py: 1.2,
                fontSize: 14,
                fontWeight: 700,
                textTransform: "none",
                background: "linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%)",
                boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)",
                  boxShadow: "0 12px 30px rgba(139, 92, 246, 0.6)",
                },
              }}
            >
              Tạo Tóm Tắt Bằng AI
            </Button>
          </Stack>
        ) : (
          /* NỘI DUNG TÓM TẮT ĐÃ CÓ */
          <>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{
                minHeight: 40,
                borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 13.5,
                  color: "#94a3b8",
                  minHeight: 40,
                  px: 2,
                  "&.Mui-selected": {
                    color: "#c084fc",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#c084fc",
                  height: 3,
                  borderRadius: 1.5,
                },
              }}
            >
              <Tab label="📌 Tóm tắt" />
              <Tab label={`✅ Việc cần làm (${aiSummary?.actionItems?.length || 0})`} />
              <Tab label={`💬 Hội thoại (${transcript.length})`} />
            </Tabs>

            {/* TAB 0: TÓM TẮT CHUNG */}
            <CustomTabPanel value={activeTab} index={0}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "rgba(139, 92, 246, 0.08)",
                    borderLeft: "4px solid #8b5cf6",
                  }}
                >
                  <Typography sx={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.6 }}>
                    {aiSummary?.summary || "Không có tóm tắt."}
                  </Typography>
                </Box>

                {aiSummary?.keyPoints && aiSummary.keyPoints.length > 0 && (
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.2 }}>
                      <LightbulbOutlinedIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#cbd5e1" }}>
                        Các ý chính đã thống nhất:
                      </Typography>
                    </Stack>
                    <Stack spacing={1}>
                      {aiSummary.keyPoints.map((item, idx) => (
                        <Stack key={idx} direction="row" spacing={1.2} alignItems="flex-start">
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: "#38bdf8",
                              mt: 0.9,
                              flexShrink: 0,
                            }}
                          />
                          <Typography sx={{ fontSize: 13.5, color: "#94a3b8", lineHeight: 1.5 }}>
                            {item}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </CustomTabPanel>

            {/* TAB 1: VIỆC CẦN LÀM (ACTION ITEMS) */}
            <CustomTabPanel value={activeTab} index={1}>
              {aiSummary?.actionItems && aiSummary.actionItems.length > 0 ? (
                <Stack spacing={1.2}>
                  {aiSummary.actionItems.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 1.5,
                        borderRadius: 2.5,
                        bgcolor: "rgba(30, 41, 59, 0.7)",
                        border: "1px solid rgba(148, 163, 184, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <CheckCircleOutlineIcon sx={{ color: "#10b981", fontSize: 20 }} />
                      <Typography sx={{ fontSize: 13.5, color: "#e2e8f0", flexGrow: 1 }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography sx={{ color: "#64748b", fontSize: 13.5, fontStyle: "italic", py: 2 }}>
                  Không có công việc cụ thể được ghi nhận.
                </Typography>
              )}
            </CustomTabPanel>

            {/* TAB 2: HỘI THOẠI (TRANSCRIPT) */}
            <CustomTabPanel value={activeTab} index={2}>
              {transcript && transcript.length > 0 ? (
                <Stack spacing={1.2} sx={{ maxHeight: 260, overflowY: "auto", pr: 0.5 }}>
                  {transcript.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 1.2,
                        px: 1.8,
                        borderRadius: 2.5,
                        bgcolor: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(148, 163, 184, 0.08)",
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.4 }}>
                        <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#c084fc" }}>
                          {item.speaker}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: "#64748b" }}>
                          {item.timestamp}
                        </Typography>
                      </Stack>
                      <Typography sx={{ fontSize: 13, color: "#cbd5e1" }}>
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Stack alignItems="center" sx={{ py: 3 }}>
                  <RecordVoiceOverIcon sx={{ color: "#64748b", fontSize: 32, mb: 1 }} />
                  <Typography sx={{ color: "#64748b", fontSize: 13 }}>
                    Chưa có dữ liệu bản ghi lời thoại.
                  </Typography>
                </Stack>
              )}
            </CustomTabPanel>
          </>
        )}
      </DialogContent>

      <Divider sx={{ borderColor: "rgba(139, 92, 246, 0.15)" }} />

      {/* FOOTER ACTIONS */}
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {aiSummary && (
          <Button
            size="small"
            startIcon={<ContentCopyIcon fontSize="small" />}
            onClick={handleCopySummary}
            sx={{
              color: "#94a3b8",
              textTransform: "none",
              fontSize: 12.5,
              "&:hover": { color: "#c084fc", bgcolor: "rgba(192, 132, 252, 0.08)" },
            }}
          >
            Sao Chép Tóm Tắt
          </Button>
        )}
        <Button
          onClick={onClose}
          sx={{
            ml: "auto",
            color: "#cbd5e1",
            bgcolor: "rgba(255, 255, 255, 0.08)",
            textTransform: "none",
            borderRadius: 2.5,
            px: 2.5,
            fontSize: 13,
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.15)" },
          }}
        >
          Đóng
        </Button>
      </Box>
    </Dialog>
  );
};

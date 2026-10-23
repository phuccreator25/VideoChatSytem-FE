import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import { formatDate } from "../../../../helpers/formatDate.helper";

type ReportBanDurationBoxProps = {
  isFinished: boolean;
  banDurationType: "permanent" | "temporary";
  setBanDurationType: (type: "permanent" | "temporary") => void;
  banPreset: string;
  setBanPreset: (preset: string) => void;
  customUnbanDate: string;
  setCustomUnbanDate: (date: string) => void;
  computedUnbanDate: Date | null;
  reportUnBannedAt?: string | null;
}

const PRESET_OPTIONS = [
  { label: "1 day", value: "1d" },
  { label: "3 days", value: "3d" },
  { label: "7 days", value: "7d" },
  { label: "14 days", value: "14d" },
  { label: "30 days", value: "30d" },
  { label: "Custom date", value: "custom" },
];

export const ReportBanDurationBox = ({
  isFinished,
  banDurationType,
  setBanDurationType,
  banPreset,
  setBanPreset,
  customUnbanDate,
  setCustomUnbanDate,
  computedUnbanDate,
  reportUnBannedAt,
} : ReportBanDurationBoxProps) => {
  return (
    <Box
      sx={{
        mt: 0.5,
        mb: 0.5,
        p: 2,
        borderRadius: "14px",
        bgcolor: "#FFF1F2",
        border: "1.5px solid #FECDD3",
        boxShadow: "0 4px 14px rgba(225, 29, 72, 0.08)",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccessTimeFilledRoundedIcon sx={{ fontSize: 18, color: "#E11D48" }} />
          <Typography sx={{ fontSize: "0.825rem", fontWeight: 700, color: "#9F1239" }}>
            BAN DURATION
          </Typography>
        </Box>
        <Chip
          size="small"
          label={banDurationType === "permanent" ? "Permanent" : "Temporary"}
          sx={{
            height: 22,
            fontSize: "0.7rem",
            fontWeight: 700,
            bgcolor: banDurationType === "permanent" ? "#FFE4E6" : "#FEF3C7",
            color: banDurationType === "permanent" ? "#BE123C" : "#B45309",
            border: `1px solid ${banDurationType === "permanent" ? "#FDA4AF" : "#FDE68A"}`,
          }}
        />
      </Box>

      {/* Radio Choice: Permanent vs Temporary */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mb: 1.5 }}>
        {/* Permanent */}
        <Box
          onClick={() => !isFinished && setBanDurationType("permanent")}
          sx={{
            p: 1.25,
            borderRadius: "10px",
            border: banDurationType === "permanent" ? "1.5px solid #E11D48" : "1px solid #E2E8F0",
            bgcolor: banDurationType === "permanent" ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
            cursor: isFinished ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
            transition: "all 0.15s ease",
            "&:hover": {
              bgcolor: "#FFFFFF",
              borderColor: isFinished ? undefined : "#E11D48",
            },
          }}
        >
          <Radio
            size="small"
            disabled={isFinished}
            checked={banDurationType === "permanent"}
            sx={{ p: 0, color: "#FDA4AF", "&.Mui-checked": { color: "#E11D48" } }}
          />
          <Box>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
              Permanent Ban
            </Typography>
            <Typography sx={{ fontSize: "0.68rem", color: "#64748B", mt: 0.25 }}>
              No auto-release
            </Typography>
          </Box>
        </Box>

        {/* Có thời hạn */}
        <Box
          onClick={() => !isFinished && setBanDurationType("temporary")}
          sx={{
            p: 1.25,
            borderRadius: "10px",
            border: banDurationType === "temporary" ? "1.5px solid #E11D48" : "1px solid #E2E8F0",
            bgcolor: banDurationType === "temporary" ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
            cursor: isFinished ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
            transition: "all 0.15s ease",
            "&:hover": {
              bgcolor: "#FFFFFF",
              borderColor: isFinished ? undefined : "#E11D48",
            },
          }}
        >
          <Radio
            size="small"
            disabled={isFinished}
            checked={banDurationType === "temporary"}
            sx={{ p: 0, color: "#FDA4AF", "&.Mui-checked": { color: "#E11D48" } }}
          />
          <Box>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
              Temporary Ban
            </Typography>
            <Typography sx={{ fontSize: "0.68rem", color: "#64748B", mt: 0.25 }}>
              Auto-release when expired
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Chi tiết thời hạn khi chọn temporary */}
      {banDurationType === "temporary" && (
        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px dashed #FECDD3" }}>
          {!isFinished && (
            <>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569", mb: 1 }}>
                Set ban duration:
              </Typography>

              {/* Preset Chips */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1.5 }}>
                {PRESET_OPTIONS.map((preset) => {
                  const isPresetActive = banPreset === preset.value;
                  return (
                    <Button
                      key={preset.value}
                      size="small"
                      onClick={() => setBanPreset(preset.value)}
                      sx={{
                        borderRadius: "8px",
                        fontSize: "0.74rem",
                        fontWeight: isPresetActive ? 700 : 500,
                        textTransform: "none",
                        py: 0.35,
                        px: 1.2,
                        bgcolor: isPresetActive ? "#E11D48" : "#FFFFFF",
                        color: isPresetActive ? "#FFFFFF" : "#334155",
                        border: isPresetActive ? "1px solid #E11D48" : "1px solid #CBD5E1",
                        "&:hover": {
                          bgcolor: isPresetActive ? "#BE123C" : "#FFF1F2",
                          borderColor: "#E11D48",
                        },
                      }}
                    >
                      {preset.label}
                    </Button>
                  );
                })}
              </Box>

              {/* Ô chọn ngày tùy chỉnh */}
              {banPreset === "custom" && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: "0.72rem", color: "#64748B", mb: 0.5, fontWeight: 600 }}>
                    Exact unban date:
                  </Typography>
                  <TextField
                    type="datetime-local"
                    size="small"
                    fullWidth
                    value={customUnbanDate}
                    onChange={(e) => setCustomUnbanDate(e.target.value)}
                    inputProps={{
                      min: new Date(Date.now() + 60000).toISOString().slice(0, 16),
                    }}
                    sx={{
                      bgcolor: "#FFFFFF",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        "& fieldset": { borderColor: "#CBD5E1" },
                        "&:hover fieldset": { borderColor: "#E11D48" },
                        "&.Mui-focused fieldset": { borderColor: "#E11D48" },
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}

          {/* Banner thông tin thời gian mở khóa */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.2,
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
              border: "1px solid #FDA4AF",
            }}
          >
            <EventBusyRoundedIcon sx={{ fontSize: 18, color: "#E11D48" }} />
            <Typography sx={{ fontSize: "0.775rem", color: "#881337", fontWeight: 600 }}>
              Account will be unbanned at:{" "}
              <Box component="span" sx={{ fontWeight: 800, color: "#BE123C" }}>
                {computedUnbanDate
                  ? formatDate(computedUnbanDate, true)
                  : reportUnBannedAt
                  ? formatDate(reportUnBannedAt, true)
                  : "Not set"}
              </Box>
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";

export type StatusChipProps = {
  status?: string;
  isReady: boolean;
  isFailed: boolean;
  isLeft: boolean;
};

export function StatusChip({
  status,
  isReady,
  isFailed,
  isLeft,
}: StatusChipProps) {
  if (isFailed) {
    return (
      <Stack
        direction="row"
        spacing={0.4}
        alignItems="center"
        sx={{
          px: 1,
          py: 0.25,
          borderRadius: 999,
          bgcolor: isLeft ? "#fef2f2" : "rgba(255,100,100,0.18)",
          border: isLeft
            ? "1px solid rgba(239,68,68,0.2)"
            : "1px solid rgba(255,120,120,0.35)",
        }}
      >
        <ErrorOutlineRoundedIcon
          sx={{
            fontSize: 12,
            color: isLeft ? "#dc2626" : "#fca5a5",
          }}
        />

        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 700,
            color: isLeft ? "#b91c1c" : "#fca5a5",
            letterSpacing: "0.03em",
          }}
        >
          Failed
        </Typography>
      </Stack>
    );
  }

  if (isReady) {
    return (
      <Stack
        direction="row"
        spacing={0.4}
        alignItems="center"
        sx={{
          px: 1,
          py: 0.25,
          borderRadius: 999,
          bgcolor: isLeft ? "#f0fdf4" : "rgba(74,222,128,0.15)",
          border: isLeft
            ? "1px solid rgba(34,197,94,0.2)"
            : "1px solid rgba(74,222,128,0.3)",
        }}
      >
        <CheckCircleOutlineRoundedIcon
          sx={{
            fontSize: 12,
            color: isLeft ? "#22c55e" : "#86efac",
          }}
        />

        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 700,
            color: isLeft ? "#16a34a" : "#86efac",
            letterSpacing: "0.03em",
          }}
        >
          Ready
        </Typography>
      </Stack>
    );
  }

  const isUploading = status === "uploading" || status === "sending";

  return (
    <Stack
      direction="row"
      spacing={0.4}
      alignItems="center"
      sx={{
        px: 1,
        py: 0.25,
        borderRadius: 999,
        bgcolor: isLeft ? "#eef2ff" : "rgba(255,255,255,0.1)",
        border: isLeft
          ? "1px solid rgba(99,102,241,0.18)"
          : "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <ScheduleRoundedIcon
        sx={{
          fontSize: 12,
          color: isLeft ? "#4f46e5" : "rgba(255,255,255,0.7)",
        }}
      />

      <Typography
        sx={{
          fontSize: 10.5,
          fontWeight: 700,
          color: isLeft ? "#4338ca" : "rgba(255,255,255,0.7)",
          letterSpacing: "0.03em",
        }}
      >
        {isUploading ? "Uploading…" : "Pending"}
      </Typography>
    </Stack>
  );
}

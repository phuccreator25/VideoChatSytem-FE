import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const messageTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
});

const toDisplayTime = (createdAt?: string, time?: string) => {
  if (time) return time;
  if (!createdAt) return "--:--";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "--:--";

  return messageTimeFormatter.format(date);
};

export function ChatTime({
  createdAt,
  time,
  color = 'rgba(255,255,255,0.82)',
  dense = false,
}: {
  createdAt?: string | undefined;
  time?: string | undefined;
  color?: string | undefined;
  dense?: boolean | undefined;
}) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color, opacity: 0.95 }}>
      <AccessTimeOutlinedIcon sx={{ fontSize: dense ? 12 : 14 }} />
      <Typography sx={{ fontSize: dense ? 11 : 13, fontWeight: 500 }}>
        {toDisplayTime(createdAt, time)}
      </Typography>
    </Stack>
  );
}

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

export function ChatTime({
  time,
  color = 'rgba(255,255,255,0.82)',
}: {
  time: string;
  color?: string;
}) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color }}>
      <AccessTimeOutlinedIcon sx={{ fontSize: 15 }} />
      <Typography sx={{ fontSize: 14 }}>{time}</Typography>
    </Stack>
  );
}

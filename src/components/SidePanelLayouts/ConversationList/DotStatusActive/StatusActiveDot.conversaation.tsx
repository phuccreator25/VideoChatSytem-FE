import { Box } from "@mui/material";

export function StatusActive({ status = "offline" }: { status?: string }) {
  if (status === "offline") return null;

  return (
    <Box
      sx={{
        width: 11,
        height: 11,
        borderRadius: "50%",
        bgcolor: "#10B981",
        border: "2px solid #FFFFFF",
        boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)",
      }}
    />
  );
}
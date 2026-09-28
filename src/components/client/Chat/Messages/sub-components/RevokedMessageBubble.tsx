import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function RevokedMessageBubble() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "action.hover",
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 3,
        px: 2.2,
        py: 1.25,
        minWidth: 140,
        maxWidth: { xs: "90%", sm: "75%" },
      }}
    >
      <Typography
        sx={{
          fontSize: 14,
          color: "text.secondary",
          fontStyle: "italic",
          userSelect: "none",
        }}
      >
        This message has been revoked
      </Typography>
    </Box>
  );
}

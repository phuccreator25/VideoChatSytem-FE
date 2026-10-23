import { Box, Paper, Skeleton, Stack } from "@mui/material";

export default function MediaSkeletonGrid() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1.25,
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "relative",
            width: "100%",
            paddingTop: "100%",
          }}
        >
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              borderRadius: 3.5,
              bgcolor: "rgba(0, 0, 0, 0.04)",
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

function ItemSkeletonRow() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 4,
        border: "1px solid rgba(255, 255, 255, 0.5)",
        bgcolor: "rgba(255, 255, 255, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
        <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: "12px", flexShrink: 0 }} animation="wave" />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Skeleton variant="text" width="60%" height={18} sx={{ borderRadius: "4px" }} animation="wave" />
          <Skeleton variant="text" width="40%" height={14} sx={{ mt: 0.5, borderRadius: "4px" }} animation="wave" />
        </Box>
      </Stack>
      <Skeleton variant="circular" width={28} height={28} sx={{ flexShrink: 0 }} animation="wave" />
    </Paper>
  );
}

export function ListSkeletonStack() {
  return (
    <Stack spacing={1.25}>
      {Array.from({ length: 4 }).map((_, i) => (
        <ItemSkeletonRow key={i} />
      ))}
    </Stack>
  );
}
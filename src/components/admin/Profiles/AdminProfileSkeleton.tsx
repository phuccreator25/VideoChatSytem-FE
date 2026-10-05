import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export const AdminProfileSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3.5,
        pb: 4,
        maxWidth: 1100,
        mx: "auto",
        width: "100%",
        textAlign: "left",
      }}
    >
      {/* 1. Header Title & Subtitle Skeleton */}
      <Box>
        <Skeleton
          variant="text"
          width={220}
          height={36}
          animation="wave"
          sx={{ borderRadius: "6px" }}
        />
        <Skeleton
          variant="text"
          width={320}
          height={20}
          animation="wave"
          sx={{ mt: 0.5, borderRadius: "4px" }}
        />
      </Box>

      {/* 2. Top Banner: Digital Admin ID Card Skeleton */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #17183B 0%, #1e1b4b 60%, #19183D 100%)",
          borderRadius: "18px",
          p: { xs: 2.5, sm: 3.5 },
          boxShadow: "0 10px 30px -5px rgba(30, 27, 75, 0.35)",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle background glow */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Card Header Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Skeleton
              variant="rounded"
              width={28}
              height={28}
              animation="wave"
              sx={{ bgcolor: "rgba(99, 102, 241, 0.25)", borderRadius: "7px" }}
            />
            <Skeleton
              variant="text"
              width={140}
              height={20}
              animation="wave"
              sx={{ bgcolor: "rgba(224, 231, 255, 0.2)", borderRadius: "4px" }}
            />
          </Box>
          <Skeleton
            variant="rounded"
            width={110}
            height={26}
            animation="wave"
            sx={{ bgcolor: "rgba(99, 102, 241, 0.2)", borderRadius: "20px" }}
          />
        </Box>

        {/* Card Body: Avatar & Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 2.5, sm: 3.5 },
            flexDirection: { xs: "column", sm: "row" },
            textAlign: { xs: "center", sm: "left" },
            mb: 3,
          }}
        >
          {/* Avatar Skeleton */}
          <Skeleton
            variant="circular"
            width={76}
            height={76}
            animation="wave"
            sx={{
              bgcolor: "rgba(99, 102, 241, 0.25)",
              flexShrink: 0,
              boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.3)",
            }}
          />

          <Box sx={{ flex: 1, width: "100%" }}>
            {/* Fullname */}
            <Skeleton
              variant="text"
              width="45%"
              height={32}
              animation="wave"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "6px",
                mx: { xs: "auto", sm: 0 },
              }}
            />
            {/* Email */}
            <Skeleton
              variant="text"
              width="30%"
              height={20}
              animation="wave"
              sx={{
                bgcolor: "rgba(148, 163, 184, 0.2)",
                borderRadius: "4px",
                mt: 0.5,
                mb: 1.5,
                mx: { xs: "auto", sm: 0 },
              }}
            />

            {/* Badges row */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent={{ xs: "center", sm: "flex-start" }}
              flexWrap="wrap"
              useFlexGap
            >
              <Skeleton
                variant="rounded"
                width={85}
                height={24}
                animation="wave"
                sx={{ bgcolor: "rgba(124, 58, 237, 0.3)", borderRadius: "20px" }}
              />
              <Skeleton
                variant="rounded"
                width={70}
                height={24}
                animation="wave"
                sx={{ bgcolor: "rgba(16, 185, 129, 0.25)", borderRadius: "20px" }}
              />
              <Skeleton
                variant="rounded"
                width={75}
                height={24}
                animation="wave"
                sx={{ bgcolor: "rgba(148, 163, 184, 0.2)", borderRadius: "20px" }}
              />
            </Stack>
          </Box>
        </Box>

        {/* Card Footer: Metadata Strip */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            pt: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Skeleton
            variant="text"
            width={160}
            height={18}
            animation="wave"
            sx={{ bgcolor: "rgba(148, 163, 184, 0.18)", borderRadius: "4px" }}
          />
          <Skeleton
            variant="text"
            width={170}
            height={18}
            animation="wave"
            sx={{ bgcolor: "rgba(148, 163, 184, 0.18)", borderRadius: "4px" }}
          />
        </Box>
      </Box>

      {/* 3. Two Edit Columns Form Skeleton */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          maxWidth: 960,
          width: "100%",
          mx: "auto",
        }}
      >
        {/* Left Form Skeleton (Identity) */}
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            p: { xs: 2.5, sm: 3.5 },
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Skeleton variant="text" width={160} height={26} animation="wave" sx={{ borderRadius: "4px" }} />
          <Skeleton variant="text" width="85%" height={18} animation="wave" sx={{ mt: 0.5, mb: 3, borderRadius: "4px" }} />

          <Stack spacing={2.5} sx={{ flex: 1 }}>
            {[1, 2, 3].map((item) => (
              <Box key={item}>
                <Skeleton variant="text" width={100} height={16} animation="wave" sx={{ mb: 1, borderRadius: "4px" }} />
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={46}
                  animation="wave"
                  sx={{ borderRadius: "8px", bgcolor: "#F8FAFC" }}
                />
              </Box>
            ))}
          </Stack>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Skeleton
              variant="rounded"
              width={140}
              height={44}
              animation="wave"
              sx={{ borderRadius: "8px" }}
            />
          </Box>
        </Box>

        {/* Right Form Skeleton (Password) */}
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            p: { xs: 2.5, sm: 3.5 },
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Skeleton variant="text" width={200} height={26} animation="wave" sx={{ borderRadius: "4px" }} />
          <Skeleton variant="text" width="80%" height={18} animation="wave" sx={{ mt: 0.5, mb: 3, borderRadius: "4px" }} />

          <Stack spacing={2.5} sx={{ flex: 1 }}>
            {[1, 2, 3].map((item) => (
              <Box key={item}>
                <Skeleton variant="text" width={120} height={16} animation="wave" sx={{ mb: 1, borderRadius: "4px" }} />
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={46}
                  animation="wave"
                  sx={{ borderRadius: "8px", bgcolor: "#F8FAFC" }}
                />
              </Box>
            ))}
          </Stack>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Skeleton
              variant="rounded"
              width={160}
              height={44}
              animation="wave"
              sx={{ borderRadius: "8px" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminProfileSkeleton;

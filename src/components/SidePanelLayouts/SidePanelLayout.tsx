import { type ReactNode } from "react";
import { Box, Paper } from "@mui/material";

const COLORS = {
  pageBg: "#f5f5f7",
  border: "#e9e9ef",
  shadow: "0 10px 30px rgba(20, 20, 43, 0.08)",
};

type SidePanelLayoutProps = {
  header?: ReactNode;
  children: ReactNode;
};

export default function SidePanelLayout({
  header,
  children,
}: SidePanelLayoutProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        bgcolor: COLORS.pageBg,
        border: `1px solid ${COLORS.border}`,
        boxShadow: COLORS.shadow,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        textAlign: "left",
      }}
    >
      {header ? (
        <Box
          sx={{
            px: 2,
            pt: 1.5,
            pb: 1,
            flexShrink: 0,
          }}
        >
          {header}
        </Box>
      ) : null}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          px: 2,
          pb: 1.5,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}
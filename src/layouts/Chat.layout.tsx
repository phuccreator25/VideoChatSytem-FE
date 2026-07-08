import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import LeftRail from '../components/LeftRail';
import type { RailKey } from '../types/layout/layout.navigation.type';
import type { ReactNode } from 'react';
import useChatLayout from '../hooks/ChatLayout/chatlayout.hook';
import { RingingCallView } from '../components/VideoCall/ringingCall.chat';

const theme = createTheme({});
type ChatLayoutProps = {
  activeRail: RailKey;
  onRailChange: (key: RailKey) => void;
  middlePanel: ReactNode;
  content: ReactNode;
};

export default function ChatLayout({ middlePanel, activeRail, onRailChange, content }: ChatLayoutProps) {
  const { ui, handler } = useChatLayout(activeRail);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          height: '100dvh',
          overflow: 'hidden',
          bgcolor: '#f5f5f7',
        }}
      >
        <LeftRail activeRail={activeRail} onChange={onRailChange} />

        <Box
          sx={{
            ml: { xs: '76px', sm: '88px', md: '96px' },
            px: 3,
            py: 3,
            height: '100dvh',
            overflow: 'hidden',
            display: 'flex',
            gap: 3,
            alignItems: 'stretch',
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              width: { xs: 320, sm: 360, md: 400, lg: 420 },
              flexShrink: 0,
              minHeight: 0,
            }}
          >
            {middlePanel}
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
            }}
          >
            {content}
          </Box>
        </Box>
      </Box>

      <RingingCallView
        isOpen={ui.incomingCall.isOpen}
        userData={ui.incomingCall.userData}
        onDecline={() => handler.declineCall()}
        onAccept={() => handler.acceptCall()}
        callType={ui.incomingCall.type ?? "audio"}
      />
    </ThemeProvider>
  );
}

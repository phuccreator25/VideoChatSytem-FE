import { Box, CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import LeftRail from '../components/LeftRail';
import type { RailKey } from '../types/layout/layout.navigation.type';
import type { ReactNode } from 'react';
import useChatLayout from '../hooks/ChatLayout/chatlayout.hook';
import { RingingCallView } from '../components/VideoCall/ringingCall.chat';
import { VideoCallModal } from '../components/VideoCall/dialogVideoCall.chat';
import { useParams, useLocation } from 'react-router-dom';
import Chatbot from '../components/ChatBot/Chatbot';

const theme = createTheme({});
type ChatLayoutProps = {
  activeRail: RailKey;
  onRailChange: (key: RailKey) => void;
  middlePanel: ReactNode;
  content: ReactNode;
};

export default function ChatLayout({ middlePanel, activeRail, onRailChange, content }: ChatLayoutProps) {
  const { ui, handler } = useChatLayout(activeRail);
  const { conversationId } = useParams();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:600px)');

  const isChatActive = !!conversationId || location.pathname.includes('/invitation');

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
        {/* Chỉ hiển thị LeftRail trên mobile khi không mở chi tiết chat */}
        {(!isMobile || !isChatActive) && (
          <LeftRail activeRail={activeRail} onChange={onRailChange} />
        )}

        <Box
          sx={{
            ml: isMobile ? 0 : { sm: '88px', md: '96px' },
            px: isMobile ? 1.5 : 3,
            py: isMobile ? 1.5 : 3,
            pb: isMobile && !isChatActive ? '80px' : 0, // Chừa khoảng trống cho bottom rail khi ở danh sách chat
            height: '100dvh',
            overflow: 'hidden',
            display: 'flex',
            gap: isMobile ? 0 : 3,
            alignItems: 'stretch',
            boxSizing: 'border-box',
          }}
        >
          {/* Middle Panel Container */}
          {(!isMobile || !isChatActive) && (
            <Box
              sx={{
                width: isMobile ? '100%' : { sm: 360, md: 400, lg: 420 },
                flexShrink: 0,
                minHeight: 0,
              }}
            >
              {middlePanel}
            </Box>
          )}

          {/* Content Panel Container */}
          {(!isMobile || isChatActive) && (
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                minHeight: 0,
                width: isMobile ? '100%' : 'auto',
              }}
            >
              {content}
            </Box>
          )}
        </Box>
      </Box>

      <RingingCallView
        isOpen={ui.incomingCall.isOpen}
        userData={ui.incomingCall.userData}
        onDecline={() => handler.declineCall()}
        onAccept={() => handler.acceptCall()}
        callType={ui.incomingCall.type ?? "voice"}
      />

      <VideoCallModal
        isOpen={ui.isCallModalOpen.isOpen}
        type={ui.isCallModalOpen.type}
        handleClose={handler.closeCallModal}
        userData={ui.incomingCall.userData || ui.userData}
      />

      <Chatbot />
    </ThemeProvider>
  );
}

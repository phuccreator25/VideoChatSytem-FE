import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import LeftRail from '../components/LeftRail';
import type { RailKey } from '../types/data.type';
import { useEffect, type ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../redux/store';
import { SelectcurrentUser } from '../redux/auth.redux';
import { onGetCountReceivedInvitation } from '../redux/invitation.redux';
import { connectSocket } from '../socket/socket';
import { bindInvitationCancel, bindInvitationCreated, unbindInvitationCancel, unbindInvitationCreated } from '../socket/invitationSocket.socket';

const theme = createTheme({});
type ChatLayoutProps = {
  activeRail: RailKey;
  onRailChange: (key: RailKey) => void;
  middlePanel: ReactNode;
  content: ReactNode;
};

export default function ChatLayout({ middlePanel, activeRail, onRailChange, content }: ChatLayoutProps) {
  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector(SelectcurrentUser);

  useEffect(() => {
    if (!currentUser) return;

    connectSocket();
    
    dispatch(onGetCountReceivedInvitation());

    const handleInvitationCreated = async () => { //Nhận kết bạn
      await dispatch(onGetCountReceivedInvitation());
    };

    const handleInvitationCancel = async () => {
      await dispatch(onGetCountReceivedInvitation());
    };

    bindInvitationCreated(handleInvitationCreated);
    bindInvitationCancel(handleInvitationCancel);

    return () => {
      unbindInvitationCreated(handleInvitationCreated);
      unbindInvitationCancel(handleInvitationCancel);
    };
  }, [dispatch, currentUser]);
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
    </ThemeProvider>
  );
}
import { useEffect, useRef, useState } from 'react';
import ChatLayout from '../../layouts/Chat.layout';
import ChatFrame from '../../components/Chat/ChatFrame';
import ConversationList from '../../components/SidePanelLayouts/ConversationList/ConversationList';
import { Setting } from '../../components/SidePanelLayouts/Setting/Setting';
import { GroupsView } from '../../components/SidePanelLayouts/Group/Groups';
import { ContactsView } from '../../components/SidePanelLayouts/Contact/Contact';
import { MyProfile } from '../../components/SidePanelLayouts/Profile/Profile';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { connectSocket } from '../../socket/socket';
import { onGetConversations } from '../../redux/conversation.redux';
import type { RailKey } from '../../types/layout/layout.navigation.type';

export default function ChatPages() {
  const [activeRail, setActiveRail] = useState<RailKey>('messages');
  const dispatch = useDispatch<AppDispatch>();
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const renderMiddlePanel = () => {
    switch (activeRail) {
      case 'profile':
        return <MyProfile />;
      case 'messages':
        return <ConversationList />;
      case 'groups':
        return <GroupsView />;
      case 'contact':
        return <ContactsView />;
      case 'settings':
        return <Setting onRailChange={setActiveRail} />;
      default:
        return <ConversationList />;
    }
  };

  useEffect(() => {
    const socket = connectSocket();

    const syncConversations = () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }

      reconnectTimeout.current = setTimeout(() => {
        dispatch(onGetConversations());
        reconnectTimeout.current = null;
      }, 500);
    };

    socket.io.on("reconnect", syncConversations);

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }

      socket.io.off("reconnect", syncConversations);
    };
  }, [dispatch]);

  return (
    <ChatLayout
      activeRail={activeRail}
      onRailChange={setActiveRail}
      middlePanel={renderMiddlePanel()}
      content={<ChatFrame />}
    />
  );
}

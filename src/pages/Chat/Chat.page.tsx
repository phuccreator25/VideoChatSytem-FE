import { useEffect, useState } from 'react';
import ChatLayout from '../../layouts/Chat.layout';
import type { RailKey } from '../../components/LeftRail';
import ChatFrame from '../../components/Chat/ChatFrame';
import ConversationList from '../../components/SidePanelLayouts/ConversationList/ConversationList';
import { Setting } from '../../components/SidePanelLayouts/Setting/Setting';
import { GroupsView } from '../../components/SidePanelLayouts/Group/Groups';
import { ContactsView } from '../../components/SidePanelLayouts/Contact/Contact';
import { MyProfile } from '../../components/SidePanelLayouts/Profile/Profile';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { onGetCountReceivedInvitation } from '../../redux/invitation.redux';
import { bindOnlineUsers, connectSocket } from '../../socket/socket';
import { SelectcurrentUser } from '../../redux/auth.redux';

export default function ChatPages() {
  const [activeRail, setActiveRail] = useState<RailKey>('messages');

  const renderMiddlePanel = () => {
    switch (activeRail) {
      case 'profile':
        return <MyProfile />
      case 'messages':
        return <ConversationList />;
      case 'groups':
        return <GroupsView />
      case 'contact':
        return <ContactsView />
      case 'settings':
        return <Setting />;
      default:
        return <ConversationList />;
    }
  };

  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector(SelectcurrentUser);

  useEffect(() => {
    dispatch(onGetCountReceivedInvitation());

    if (currentUser) {
      connectSocket();

      bindOnlineUsers((userIds: string[]) => {
        console.log('Quay lại Tab ', userIds);
      });
    }
  }, [dispatch, currentUser]);

  return (
    <ChatLayout
      activeRail={activeRail}
      onRailChange={setActiveRail}
      middlePanel={renderMiddlePanel()}
      content={<ChatFrame />}
    />
  );
}
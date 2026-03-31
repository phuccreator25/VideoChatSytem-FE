import { useState } from 'react';
import ChatLayout from '../../layouts/Chat.layout';
import type { RailKey } from '../../components/LeftRail';
import ChatFrame from '../../components/Chat/ChatFrame';
import ConversationList from '../../components/SidePanelLayouts/ConversationList/ConversationList';
import { Setting } from '../../components/SidePanelLayouts/Setting/Setting';
import { GroupsView } from '../../components/SidePanelLayouts/Group/Groups';
import { ContactsView } from '../../components/SidePanelLayouts/Contact/Contact';
import { MyProfile } from '../../components/SidePanelLayouts/Profile/Profile';

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

  return (
    <ChatLayout
      activeRail={activeRail}
      onRailChange={setActiveRail}
      middlePanel={renderMiddlePanel()}
      content={<ChatFrame />}
    />
  );
}
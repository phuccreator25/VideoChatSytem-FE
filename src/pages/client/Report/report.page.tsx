import { useEffect, useState } from 'react';
import ChatLayout from '../../../layouts/client/Chat.layout';
import type { RailKey } from '../../../types/layout/layout.navigation.type';
import { ContactsView } from '../../../components/client/SidePanelLayouts/Contact/Contact';
import { MyProfile } from '../../../components/client/SidePanelLayouts/Profile/Profile';
import ConversationList from '../../../components/client/SidePanelLayouts/ConversationList/ConversationList';
import { GroupsView } from '../../../components/client/SidePanelLayouts/Group/Groups';
import { Setting } from '../../../components/client/SidePanelLayouts/Setting/Setting';
import { useNavigate } from 'react-router-dom';
import ReportFrame from '../../../components/client/SidePanelLayouts/Setting/ListReport';

export default function ReportPage() {
  const [activeRail, setActiveRail] = useState<RailKey>('settings');

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
          return <Setting onRailChange={setActiveRail} />;
        default:
          return <ConversationList />;
      }
    };

  const navigate = useNavigate();

  useEffect(() => {
    if (activeRail !== "settings") {
      navigate("/chat");
    }
  }, [activeRail, navigate]);

  return (
    <ChatLayout
      activeRail={activeRail}
      onRailChange={setActiveRail}
      middlePanel={renderMiddlePanel()}
      content={<ReportFrame />}
    />
  );
}

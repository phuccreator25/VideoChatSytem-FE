import { useEffect, useState } from 'react';
import ChatLayout from '../../layouts/Chat.layout';
import type { RailKey } from '../../components/LeftRail';
import { ContactsView } from '../../components/SidePanelLayouts/Contact/Contact';
import InvitationsFrame from '../../components/SidePanelLayouts/Contact/Invitation/InvitationsView';
import { MyProfile } from '../../components/SidePanelLayouts/Profile/Profile';
import ConversationList from '../../components/SidePanelLayouts/ConversationList/ConversationList';
import { GroupsView } from '../../components/SidePanelLayouts/Group/Groups';
import { Setting } from '../../components/SidePanelLayouts/Setting/Setting';
import { useNavigate } from 'react-router-dom';

export default function InvitationPages() {
  const [activeRail, setActiveRail] = useState<RailKey>('contact');

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

  const navigate = useNavigate();

  useEffect(() => {
    if (activeRail !== "contact") {
      navigate("/chat");
    }
  }, [activeRail, navigate]);

  return (
    <ChatLayout
      activeRail={activeRail}
      onRailChange={setActiveRail}
      middlePanel={renderMiddlePanel()}
      content={<InvitationsFrame />}
    />
  );
}
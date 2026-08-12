import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import type { RailKey } from "../../types/layout/layout.navigation.type";
import type { AppDispatch, RootState } from "../../redux/store";
import { connectSocket } from "../../socket/socket";
import { onGetCountReceivedInvitation } from "../../redux/invitation.redux";
import { onGetUserOnlines } from "../../redux/contact.redux";

import useCallSocketListener from "./listeners/useCallSocketListener";
import useMessageSocketListener from "./listeners/useMessageSocketListener";
import useInvitationSocketListener from "./listeners/useInvitationSocketListener";
import usePresenceSocketListener from "./listeners/usePresenceSocketListener";
import useContactSocketListener from "./listeners/useContactSocketListener";
import useAuthSocketListener from "./listeners/useAuthSocketListener";

export default function useChatLayout(activeRail: RailKey) {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { conversationId } = useParams();

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const currentUserId = currentUser?._id || "";

  const isFetchCountReceive = useSelector(
    (state: RootState) => state.invitation.isFetchCountReceive,
  );

  useEffect(() => {
    if (!currentUser) return;
    connectSocket();
  }, [currentUser?._id]);

  useEffect(() => {
    if (!currentUser) return;

    if (location.pathname !== "/invitation" && !isFetchCountReceive) {
      dispatch(onGetCountReceivedInvitation());
    }
  }, [currentUser?._id, dispatch, location.pathname, isFetchCountReceive]);

  useEffect(() => {
    if (!currentUser) return;

    if (activeRail === "messages") {
      dispatch(onGetUserOnlines());
    }
  }, [currentUser?._id, dispatch, activeRail]);

  useAuthSocketListener();

  const callState = useCallSocketListener(currentUserId);

  useMessageSocketListener({
    currentUserId,
    conversationId,
    currentUser: currentUser!,
  });

  useInvitationSocketListener({
    activeRail,
    currentUserId,
    conversationId,
    currentUser: currentUser!,
  });

  usePresenceSocketListener({
    currentUser: currentUser!,
    userData: callState.userData!,
  });

  useContactSocketListener({
    activeRail,
    currentUserId,
    conversationId,
    currentUser: currentUser!,
  });

  return {
    ui: {
      incomingCall: callState.incomingCall,
      isCallModalOpen: callState.isCallModalOpen,
      userData: callState.userData,
    },
    handler: callState.handlers,
  };
}

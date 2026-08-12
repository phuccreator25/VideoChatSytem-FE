import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import {
  setOnlineUsers,
  updateUserPresence,
} from "../../../redux/contact.redux";
import {
  updateStatusUser,
} from "../../../redux/chat.redux";
import {
  ConversationsPresence,
  updateStatusUsers,
} from "../../../redux/conversation.redux";
import {
  bindOnlineUsers,
  bindUserPresenceChanged,
  unbindOnlineUsers,
  unbindUserPresenceChanged,
  type OnlineUserSocket,
} from "../../../socket/authSocket.socket";
import type { ProfileData } from "../../../types/data.type";
import type { ConversationUserInfo } from "../../../types/chat.type";

type UsePresenceSocketListenerProps = {
  currentUser: ProfileData;
  userData: ConversationUserInfo;
};

export default function usePresenceSocketListener({
  currentUser,
  userData,
}: UsePresenceSocketListenerProps) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!currentUser) return;

    const handleOnlineUsers = (users: OnlineUserSocket[]) => {
      dispatch(setOnlineUsers(users));
      dispatch(ConversationsPresence(users));

      if (!userData?.userId) return;

      const isUserOnline = users.some((u) => u.userId === userData.userId);

      dispatch(
        updateStatusUser({
          userId: userData.userId,
          isOnline: isUserOnline,
        }),
      );
    };

    const handlePresenceChanged = (payload: {
      userId: string;
      isOnline: boolean;
      lastSeenAt?: string | null;
      name: string;
      avatar: string;
    }) => {
      // Update header chat
      dispatch(
        updateStatusUser({
          userId: payload.userId,
          isOnline: payload.isOnline,
          lastSeenAt: payload.lastSeenAt,
        }),
      );

      // recent chat
      dispatch(
        updateStatusUsers({
          userId: payload.userId,
          isOnline: payload.isOnline,
        }),
      );

      // online now
      dispatch(
        updateUserPresence({
          userId: payload.userId,
          name: payload.name,
          avatar: payload.avatar,
          isOnline: payload.isOnline,
        }),
      );
    };

    bindOnlineUsers(handleOnlineUsers);
    bindUserPresenceChanged(handlePresenceChanged);

    return () => {
      unbindOnlineUsers(handleOnlineUsers);
      unbindUserPresenceChanged(handlePresenceChanged);
    };
  }, [dispatch, currentUser, userData?.userId]);
}

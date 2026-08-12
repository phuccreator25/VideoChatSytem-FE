import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import type { RailKey } from "../../../types/layout/layout.navigation.type";
import useApplyRelationState from "../../../helpers/relationState.helper";
import type {
  ContactRemoveSocket,
  ContactUpdateNickNameSocket,
} from "../../../types/contact/contact.socket.type";
import { onGetDataContact } from "../../../redux/contact.redux";
import { updateNickNameUser } from "../../../redux/chat.redux";
import { updateNickNameConversation } from "../../../redux/conversation.redux";
import { removeUnblockIds, setBlockStatus, setUnblockedIds } from "../../../redux/block.redux";
import {
  bindContactRemove,
  bindContactUpdateNickName,
  unbindContactRemove,
  unbindContactUpdateNickName,
} from "../../../socket/contactSocket.socket";
import {
  bindBlockUser,
  bindUnblockUser,
  unbindBlockUser,
  unbindUnblockUser,
} from "../../../socket/blockSocket.socket";
import type { ProfileData } from "../../../types/data.type";

type UseContactSocketListenerProps = {
  activeRail: RailKey;
  currentUserId: string;
  conversationId?: string;
  currentUser: ProfileData;
};

export default function useContactSocketListener({
  activeRail,
  currentUserId,
  conversationId,
  currentUser,
}: UseContactSocketListenerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { applyRelationState } = useApplyRelationState();

  useEffect(() => {
    if (!currentUser) return;

    const handleContactRemoveEvent = async (payload: ContactRemoveSocket) => {
      await dispatch(onGetDataContact());

      if (!conversationId) return;

      const targetUserId =
        payload.senderId === currentUserId
          ? payload.receiverId
          : payload.senderId;

      if (!targetUserId) return;

      applyRelationState({
        relation: "add",
        invitationId: null,
        userId: targetUserId,
      });
    };

    const handleContactUpdateNickNameEvent = (
      payload: ContactUpdateNickNameSocket,
    ) => {
      if (activeRail !== "messages") {
        dispatch(onGetDataContact());
      }

      if (activeRail !== "messages") return;

      dispatch(
        updateNickNameUser({
          userId: payload.userId,
          nickname: payload.nickname,
        }),
      );

      dispatch(
        updateNickNameConversation({
          userId: payload.userId,
          nickname: payload.nickname,
        }),
      );
    };

    const handleBlock = (payload: {
      userId: string;
      isBlockedMe?: boolean;
      isBlockedByMe?: boolean;
    }) => {
      if (payload) {
        dispatch(
          setBlockStatus({
            userId: payload.userId,
            isBlockedMe: payload.isBlockedMe,
            isBlockedByMe: payload.isBlockedByMe,
          }),
        );

        //Handle Show List
        if (payload.isBlockedByMe === false) {
          dispatch(setUnblockedIds(payload.userId))
        }

        if (payload.isBlockedByMe === true) {
          dispatch(removeUnblockIds(payload.userId))
        }
      }
    };

    bindContactRemove(handleContactRemoveEvent);
    bindContactUpdateNickName(handleContactUpdateNickNameEvent);
    bindBlockUser(handleBlock);
    bindUnblockUser(handleBlock);

    return () => {
      unbindContactRemove(handleContactRemoveEvent);
      unbindContactUpdateNickName(handleContactUpdateNickNameEvent);
      unbindBlockUser(handleBlock);
      unbindUnblockUser(handleBlock);
    };
  }, [dispatch, currentUserId, conversationId, activeRail, applyRelationState, currentUser]);
}

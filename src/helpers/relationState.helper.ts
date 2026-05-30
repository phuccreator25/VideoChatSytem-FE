import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { updateContactRelation, updateInvitationId } from "../redux/chat.redux";
import { useCallback } from "react";

type ContactRelation = "add" | "received" | "sent" | "none";

type ApplyRelationStatePayload = {
  relation: ContactRelation;
  invitationId: string | null;
  userId: string;
};

export default function useApplyRelationState() {
  const dispatch = useDispatch<AppDispatch>();

  const applyRelationState = useCallback(
    ({ relation, invitationId, userId }: ApplyRelationStatePayload): void => {
      dispatch(
        updateContactRelation({
          userId,
          relation,
        }),
      );

      dispatch(
        updateInvitationId({
          userId,
          invitationId: invitationId ?? null,
        }),
      );
    },
    [dispatch],
  );

  return {
    applyRelationState,
  };
}

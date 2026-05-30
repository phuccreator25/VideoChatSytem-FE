import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { onGetConversations } from "../../redux/conversation.redux";

export function useConversation() {

  const dispatch = useDispatch<AppDispatch>()

  const conversations = useSelector(
    (state: RootState) => state.conversation.conversations
  );

  useEffect(() => {
    dispatch(onGetConversations());
  }, [dispatch]);

  return {
    data: {
      conversations,
    },
  };
}
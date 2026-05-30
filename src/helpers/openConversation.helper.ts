import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConversationsAPI from "../api/Conversation.api";

export default function useOpenConversation() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenConversation = useCallback(
    async (userId: string) => {
      try {
        setIsSubmitting(true);

        const res = await ConversationsAPI.getOrCreateConversation(userId);

        if (res.status === 200) {
          const conversationId = res.data.data._id;
          navigate(`/chat/${conversationId}`);
        }
      } catch (error) {
        console.error("Get or create conversation failed:", error);
      }finally{
        setIsSubmitting(false);
      }
    },
    [navigate],
  );

  return {
    handleOpenConversation,
    isSubmitting,
  };
}

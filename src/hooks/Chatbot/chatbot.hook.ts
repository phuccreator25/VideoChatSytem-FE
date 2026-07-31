import { useRef, useState } from "react";
import type { ChatBotData } from "../../types/Chatbot.type";
import callApi from "../../api/Call.api";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

export function useChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const currentUserId = useSelector((state: RootState) => state.user.currentUser?._id);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatBotData[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your AI Call Assistant. I can help you search past call records, summarize key meeting insights, or retrieve important notes and agreements.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Drag & Drop state UI
  const [topPos, setTopPos] = useState<number>(24); // Vị trí chiều dọc khi không kéo
  const [isDragging, setIsDragging] = useState<boolean>(false); // Trạng thái kéo
  const [hasMoved, setHasMoved] = useState<boolean>(false); // Trạng thái đã kéo
  const dragStartY = useRef<number>(0); // Vị trí bắt đầu kéo (y)
  const initialTopY = useRef<number>(0); // Vị trí ban đầu (y)

  const [isHidden, setIsHidden] = useState<boolean>(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Xử lý kéo vị trí
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setHasMoved(false);
    dragStartY.current = e.clientY;
    initialTopY.current = topPos;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - dragStartY.current;
      if (Math.abs(deltaY) > 4) {
        setHasMoved(true);
      }
      const newTop = Math.max(12, Math.min(window.innerHeight - 70, initialTopY.current + deltaY));
      setTopPos(newTop);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleFabClick = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.stopPropagation();
      return;
    }
    handleToggle();
  };

  const handleSend = async () => {
    const questionText = question.trim();
    if (!questionText || !currentUserId || isLoading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = Date.now().toString();
    const loadingMsgId = (Date.now() + 1).toString();

    // Tin nhắn của user & tin nhắn loading của AI
    const userMsg: ChatBotData = {
      id: userMsgId,
      sender: 'user',
      text: questionText,
      timestamp: currentTime,
    };

    const loadingAiMsg: ChatBotData = {
      id: loadingMsgId,
      sender: 'ai',
      text: 'Searching & analyzing call data...',
      timestamp: currentTime,
    };

    setMessages((prev) => [...prev, userMsg, loadingAiMsg]);
    setQuestion('');
    setIsLoading(true);

    try {
      const replyResult: any = await callApi.onChatBot({
        userId: currentUserId,
        question: questionText,
      });

      const responseText = replyResult?.data?.data || 'No relevant information found in the call records.';

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMsgId
            ? {
                ...msg,
                text: responseText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            : msg
        )
      );
    } catch (error: any) {
      console.error('Chatbot Query Error:', error?.response?.data?.message || error?.message || error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMsgId
            ? {
                ...msg,
                text: error?.response?.data?.message || 'Sorry, a connection issue occurred. Please try again shortly!',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (promptText: string) => {
    setQuestion(promptText);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: '1',
        sender: 'ai',
        text: 'Chat history cleared. How can I assist you with your call data?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return {
    ui: {
      isOpen,
      topPos,
      isDragging,
      hasMoved,
      isHidden,
      setIsHidden,
      isLoading,
    },
    data: {
      question,
      messages,
    },
    handlers: {
      setQuestion,
      setMessages,
      handleSend,
      handleChipClick,
      handleClearHistory,
      handlePointerDown,
      handleFabClick,
      handleToggle,
      handleClose,
    },
  };
}

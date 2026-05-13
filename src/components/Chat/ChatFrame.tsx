import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { customScrollbarSx } from "../../utils/CustomScroll";
import type { Message } from "../../types/data.type";
import { COLORS } from "../../utils/Colors";
import { Header } from "./Header/header.chat";
import { MessageItem } from "./Messages/MessgesItem.chat";
import { InputBar } from "./InputBar/InputBar.chat";
import type { ConversationUserInfo, MessageType } from "../../types/chat.type";
import ConversationsAPI from "../../api/conversation.api";
import { bindOnlineUsers, bindUserPresenceChanged, unbindOnlineUsers, unbindUserPresenceChanged } from "../../socket/authSocket.socket";

export default function ChatFrame() {
  const [messages, setMessages] = useState<MessageType[]>();
  const [input, setInput] = useState("");

  const { conversationId } = useParams();
  const [userData, setUserData] = useState<ConversationUserInfo>();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;

      const res = await ConversationsAPI.getConversationById(conversationId);
      setUserData(res.data.data.user);
      setMessages(res.data.data.messages || []);
    };

    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    const handleOnlineUsers = (userIds: string[]) => {
      if (!userData?.userId) return;

      const isUserOnline = userIds.includes(userData.userId);

      setUserData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          isOnline: isUserOnline ? 'online' : 'offline',
        };
      });
    };

    const handlePresenceChanged = (payload: {
      userId: string;
      isOnline: boolean;
      lastSeenAt?: string | null;
    }) => {
      setUserData((prev) => {
        if (!prev || prev.userId !== payload.userId) return prev;

        return {
          ...prev,
          isOnline: payload.isOnline ? 'online' : 'offline',
          lastSeenAt: payload.lastSeenAt ?? prev.lastSeenAt,
        };
      });
    };

    bindOnlineUsers(handleOnlineUsers);
    bindUserPresenceChanged(handlePresenceChanged);

    return () => {
      unbindOnlineUsers(handleOnlineUsers);
      unbindUserPresenceChanged(handlePresenceChanged);
    };
  }, [userData?.userId]);


  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const newMessage: Message = {
      id: Date.now(),
      type: "file",
      sender: "right",
      name: "Patricia Smith",
      avatar: 'rightAvatar',
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fileName: text,
      fileSize: "New message demo",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };



  if (!conversationId) {
    return (
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 4,
          bgcolor: COLORS.pageBg,
          border: "1px solid #e7e7ee",
          boxShadow: "0 10px 30px rgba(20, 20, 43, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{ fontSize: 22, fontWeight: 700, color: COLORS.title, mb: 1 }}
          >
            Chọn một cuộc trò chuyện
          </Typography>
          <Typography sx={{ fontSize: 15, color: COLORS.textMuted }}>
            Hãy chọn contact hoặc conversation để bắt đầu nhắn tin
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 4,
        overflow: "hidden",
        bgcolor: COLORS.pageBg,
        border: "1px solid #e7e7ee",
        boxShadow: "0 10px 30px rgba(20, 20, 43, 0.08)",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Header userData={userData} />
      <Divider sx={{ borderColor: COLORS.border }} />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: 4,
          py: 4,
          ...customScrollbarSx,
        }}
      >
        <Stack spacing={4}>
          {messages?.map((msg) => (
            <MessageItem key={msg.id} msg={msg} />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: COLORS.border }} />
      <InputBar value={input} onChange={setInput} onSend={handleSend} />
    </Paper>
  );
}
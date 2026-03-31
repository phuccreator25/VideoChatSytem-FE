import { useState } from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import { customScrollbarSx } from "../../utils/CustomScroll";
import type { Message } from "../../types/data.type";
import { COLORS } from "../../utils/Colors";
import { Header } from "./Header/header.chat";
import { MessageItem } from "./Messages/MessgesItem.chat";
import { InputBar } from "./InputBar/InputBar.chat";

const leftAvatar =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop";
const rightAvatar =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&auto=format&fit=crop";

const gallery1 =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&q=80&auto=format&fit=crop";
const gallery2 =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=80&auto=format&fit=crop";

const initialMessages: Message[] = [
  {
    id: 1,
    type: "gallery",
    sender: "left",
    name: "Doris Brown",
    avatar: leftAvatar,
    time: "10:30",
    images: [gallery1, gallery2],
  },
  {
    id: 2,
    type: "file",
    sender: "right",
    name: "Patricia Smith",
    avatar: rightAvatar,
    time: "01:30",
    fileName: "admin_v1.0.zip",
    fileSize: "12.5 MB",
  },
  {
    id: 3,
    type: "typing",
    sender: "left",
    name: "Doris Brown",
    avatar: leftAvatar,
  },
];

export default function ChatFrame() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const newMessage: Message = {
      id: Date.now(),
      type: "file",
      sender: "right",
      name: "Patricia Smith",
      avatar: rightAvatar,
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
      <Header />
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
          {messages.map((msg) => (
            <MessageItem key={msg.id} msg={msg} />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: COLORS.border }} />
      <InputBar value={input} onChange={setInput} onSend={handleSend} />
    </Paper>
  );
}

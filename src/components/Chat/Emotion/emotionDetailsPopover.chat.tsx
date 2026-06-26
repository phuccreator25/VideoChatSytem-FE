import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import { MESSAGE_EMOTION_UI } from "../../../data/messageReaction.data";
import type { MessageType, reactionMessage } from "../../../types/chat/chat.model.type";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

type EmotionKey = reactionMessage["emotion"];

type Props = {
  anchor: HTMLElement | null;
  reactions: reactionMessage[];
  onClose: () => void;
  msg: MessageType;
  onUnReact: (messageId: string) => void;
};

export function EmotionDetailPopover({ anchor, reactions, onClose, msg, onUnReact }: Props) {
  const [tab, setTab] = useState<"all" | EmotionKey>("all");

  // ✅ r.type → r.emotion
  const emotionCounts = reactions.reduce((acc, r) => {
    acc[r.emotion] = (acc[r.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ✅ r.type → r.emotion
  const filtered = tab === "all" ? reactions : reactions.filter(r => r.emotion === tab);
  const currentUserId = useSelector((state: RootState) => state.user.currentUser?._id);

  return (
    <Popover
      open={Boolean(anchor)}
      anchorEl={anchor}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        sx: {
          width: 300, borderRadius: 3,
          border: "0.5px solid", borderColor: "divider",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden",
        }
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: "0.5px solid", borderColor: "divider" }}>
        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Message emotions</Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          minHeight: 36, px: 1,
          borderBottom: "0.5px solid", borderColor: "divider",
          "& .MuiTab-root": { minHeight: 36, fontSize: 12, px: 1.25, py: 0.5, minWidth: 0 },
        }}
      >
        <Tab label={`${reactions.length} people`} value="all" />
        {(Object.entries(emotionCounts) as [EmotionKey, number][])
          .sort((a, b) => b[1] - a[1])
          .map(([emotion, count]) => (
            <Tab
              key={emotion}
              value={emotion}
              label={`${MESSAGE_EMOTION_UI[emotion].icon} ${count}`}
            />
          ))
        }
      </Tabs>

      {/* Danh sách */}
      <Box sx={{ maxHeight: 240, overflowY: "auto", p: 0.75 }}>
        {filtered.map((r) => (
          // ✅ key dùng userId + emotion, hiển thị r.name thay vì r.displayName
          <Box
            key={r.userId + r.emotion}
            sx={{
              display: "flex", alignItems: "center", gap: 1.25,
              px: 1, py: 0.875, borderRadius: 2,
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
            onClick={() => {
              if (!msg.id || currentUserId !== r.userId) return;
              onUnReact(msg.id)
            }}
          >
            <Avatar sx={{ width: 32, height: 32, fontSize: 12.5 }}>
              {r.name[0]}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography noWrap sx={{ fontSize: 13, fontWeight: 500 }}>{r.name}</Typography>
              {currentUserId === r.userId && <Typography noWrap sx={{ fontSize: 11, fontWeight: 400, color: "text.secondary" }}>Click to remove emotion</Typography>}
            </Box>
            <Box sx={{ fontSize: 18 }}>
              {MESSAGE_EMOTION_UI[r.emotion].icon}
            </Box>
          </Box>
        ))}
      </Box>
    </Popover >
  );
}
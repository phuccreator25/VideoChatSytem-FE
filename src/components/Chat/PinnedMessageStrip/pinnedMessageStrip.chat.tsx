import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useSelector } from "react-redux";
import type { ConversationUserInfo, pinMessages } from "../../../types/chat/chat.conversation.type";
import { SelectcurrentUser } from "../../../redux/auth.redux";
import { PinRow } from "./pinRow.chat";

export type PinnedMessageType = "text" | "gif" | "file";

export interface PinnedMessageStripProps {
    pinnedMessages: pinMessages[];
    otherUser: ConversationUserInfo | null;
    onUnpin: ( messageId: string,
        attachmentId: string | null) => void;
    unpinningIds?: string[];
}

export function PinnedMessageStrip({
    pinnedMessages,
    otherUser,
    onUnpin,
    unpinningIds = [],
}: PinnedMessageStripProps) {
    const currentUser = useSelector(SelectcurrentUser);
    const [expanded, setExpanded] = useState(false);

    if (pinnedMessages.length === 0) return null;

    const resolveSender = (pin: pinMessages) => {
        const isOther = pin.senderId === otherUser?.userId;
        return {
            avatar: isOther ? otherUser?.avatar : currentUser?.avatar,
            name: isOther
                ? (otherUser?.nickname ?? otherUser?.fullname ?? "")
                : (currentUser?.fullname ?? ""),
        };
    };

    // Tin nhắn ghim mới nhất — luôn hiển thị
    const latest = pinnedMessages[0];
    const latestSender = resolveSender(latest);

    // Các tin còn lại — chỉ show khi expanded
    const rest = pinnedMessages.slice(1);

    const stripBg = {
        bgcolor: "rgba(255,255,255,0.5)",
        borderBottom: "0.5px solid rgba(148,163,184,0.2)",
        backdropFilter: "blur(10px)",
    };

    return (
        <Box sx={stripBg}>
            {/* Row luôn hiển thị: pin mới nhất + toggle btn */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: "6px" }}>
                <PushPinOutlinedIcon sx={{ fontSize: 12, color: "text.disabled", flexShrink: 0 }} />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <PinRow
                        pin={latest}
                        avatar={latestSender.avatar}
                        name={latestSender.name}
                        isUnpinning={unpinningIds.includes(latest.id)}
                        onUnpin={onUnpin}
                    />
                </Box>

                {/* Chỉ show toggle khi có > 1 ghim */}
                {rest.length > 0 && (
                    <Tooltip title={expanded ? "Collapse" : `View ${rest.length} other messages`} placement="left" arrow>
                        <IconButton
                            size="small"
                            onClick={() => setExpanded((v) => !v)}
                            sx={{
                                width: 22,
                                height: 22,
                                flexShrink: 0,
                                color: "text.disabled",
                                bgcolor: expanded ? "rgba(0,0,0,0.06)" : "transparent",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.06)", color: "text.secondary" },
                                transition: "background 0.15s, color 0.15s",
                            }}
                        >
                            {expanded
                                ? <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
                                : <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                            }
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Phần mở rộng: các ghim còn lại */}
            {rest.length > 0 && (
                <Collapse in={expanded} timeout={180}>
                    <Box sx={{ px: 2, pb: "6px" }}>
                        {rest.map((pin, index) => {
                            const { avatar, name } = resolveSender(pin);
                            return (
                                <Box key={pin.id && pin.attachmentId}>
                                    <Divider sx={{ borderColor: "rgba(148,163,184,0.15)", mx: "32px" }} />
                                    <PinRow
                                        pin={pin}
                                        avatar={avatar}
                                        name={name}
                                        isUnpinning={unpinningIds.includes(pin.id)}
                                        onUnpin={onUnpin}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </Collapse>
            )}
        </Box>
    );
}
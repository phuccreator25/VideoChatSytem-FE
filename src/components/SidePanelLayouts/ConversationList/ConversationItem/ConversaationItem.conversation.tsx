import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { Conversation } from "../../../../types/data.type";
import { COLORS } from "../../../../utils/Colors";
import { StatusActive } from "../DotStatusActive/StatusActiveDot.conversaation";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { CountMessageUnread } from "../MessageUnread/CountMessageUnread.conversation";
import { useNavigate } from "react-router-dom";

export function ConversationItem({ item }: { item: Conversation }) {
    const truncateText = (text = "", maxLength = 30) => {
        if (text.length <= maxLength) return text;

        return `${text.slice(0, maxLength)}...`;
    };

    const navigate = useNavigate()
    const isActive = Boolean(item.active);
    
    console.log(item);
    

    return (
        <Box
            onClick={() => navigate(`/chat/${item.id}`)}
            sx={{
                position: 'relative',
                px: 1.5,
                py: 1.6,
                borderRadius: '18px',
                bgcolor: isActive ? 'rgba(84, 77, 161, 0.10)' : 'rgba(255,255,255,0.55)',
                border: isActive
                    ? '1px solid rgba(138, 132, 199, 0.36)'
                    : '1px solid rgba(148,163,184,0.18)',
                boxShadow: isActive
                    ? '0 8px 24px rgba(111,99,246,0.18), inset 0 1px 0 rgba(255,255,255,0.55)'
                    : '0 1px 0 rgba(255,255,255,0.65) inset',
                transition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 10,
                    bottom: 10,
                    width: 3,
                    borderRadius: '9999px',
                    boxShadow: isActive ? '0 0 14px rgba(111,99,246,0.45)' : 'none',
                    transition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                },
                '&:hover': {
                    transform: 'translateY(-1px)',
                    bgcolor: isActive ? 'rgba(111,99,246,0.2)' : 'rgba(255,255,255,0.75)',
                    borderColor: isActive ? 'rgba(111,99,246,0.44)' : 'rgba(111,99,246,0.24)',
                    boxShadow: isActive
                        ? '0 14px 28px rgba(111,99,246,0.2), inset 0 1px 0 rgba(255,255,255,0.6)'
                        : '0 8px 20px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
                },
            }}
        >
            <Stack direction="row" spacing={1.75} alignItems="center">
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={<StatusActive status={item.status} />}
                >
                    {item.avatar ? (
                        <Avatar
                            src={item.avatar}
                            sx={{
                                width: 42,
                                height: 42,
                                border: isActive
                                    ? '1.5px solid rgba(111,99,246,0.45)'
                                    : '1.5px solid rgba(148,163,184,0.24)',
                                boxShadow: isActive ? '0 0 18px rgba(111,99,246,0.2)' : 'none',
                            }}
                        />
                    ) : (
                        <Avatar
                            sx={{
                                width: 42,
                                height: 42,
                                bgcolor: isActive ? 'rgba(111,99,246,0.16)' : '#e6e2ff',
                                color: COLORS.primary,
                                fontWeight: 700,
                                border: isActive
                                    ? '1.5px solid rgba(111,99,246,0.45)'
                                    : '1.5px solid rgba(148,163,184,0.24)',
                            }}
                        >
                            {item.initials}
                        </Avatar>
                    )}
                </Badge>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1.5}
                    >
                        <Box sx={{ minWidth: 0, flex: 1, justifyItems: 'start' }}>
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: isActive ? 700 : 600,
                                    color: isActive ? '#1f2456' : COLORS.title,
                                    lineHeight: 1.2,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {item.name}
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={0.75}
                                alignItems="center"
                                sx={{ mt: 0.5 }}
                            >
                                {item.type === 'image' && (
                                    <ImageOutlinedIcon
                                        sx={{ fontSize: 16, color: COLORS.textMuted }}
                                    />
                                )}

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color:
                                            item.type === 'typing'
                                                ? COLORS.primary
                                                : isActive
                                                    ? 'rgba(37,50,74,0.92)'
                                                    : 'rgba(37,50,74,0.78)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        lineHeight: 1.2,
                                        fontWeight: item.unread ? 700 : 500,
                                    }}
                                >
                                    {truncateText(item.preview, 40)}
                                </Typography>
                            </Stack>
                        </Box>

                        <Stack alignItems="flex-end" spacing={1}>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: isActive ? 'rgba(58,72,109,0.9)' : COLORS.textMuted,
                                    whiteSpace: 'nowrap',
                                    lineHeight: 1.2,
                                    fontWeight: item.unread ? 600 : 500,
                                }}
                            >
                                {item.time}
                            </Typography>

                            {item.unread ? <CountMessageUnread count={item.unread} /> : <Box sx={{ height: 24 }} />}
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}

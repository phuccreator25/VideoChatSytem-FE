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

export function ConversationItem({ item }: { item: Conversation }) {
    return (
        <Box
            sx={{
                px: 1.5,
                py: 1.6,
                borderRadius: 2.5,
                bgcolor: item.active ? COLORS.itemActive : 'transparent',
                transition: 'background-color 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: item.active ? COLORS.itemActive : COLORS.itemHover,
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
                        <Avatar src={item.avatar} sx={{ width: 42, height: 42 }} />
                    ) : (
                        <Avatar
                            sx={{
                                width: 42,
                                height: 42,
                                bgcolor: '#e6e2ff',
                                color: COLORS.primary,
                                fontWeight: 700,
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
                                    fontWeight: 200,
                                    color: COLORS.title,
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
                                            item.type === 'typing' ? COLORS.primary : COLORS.textSoft,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {item.preview}
                                </Typography>
                            </Stack>
                        </Box>

                        <Stack alignItems="flex-end" spacing={1}>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: COLORS.textMuted,
                                    whiteSpace: 'nowrap',
                                    lineHeight: 1.2,
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
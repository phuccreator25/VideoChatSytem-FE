import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import type { QuickUser } from "../../../../types/conversation/conversation.preview.type";
import { StatusActive } from "../DotStatusActive/StatusActiveDot.conversaation";

export function ActiveList({ user, onClick }: { user: QuickUser; onClick: () => void }) {
    return (
        <Tooltip title={user.name} arrow placement="top">
            <Box
                sx={{
                    minWidth: 74,
                    maxWidth: 80,
                    px: 1.2,
                    py: 1.2,
                    borderRadius: "16px",
                    bgcolor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    willChange: "transform",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                    "&:hover": {
                        transform: "translateY(-3px)",
                        bgcolor: "#F8FAFC",
                        borderColor: "#CBD5E1",
                        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
                    },
                }}
                onClick={onClick}
            >
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={user.isOnline ? <StatusActive status="online" /> : null}
                >
                    <Box
                        sx={{
                            p: "2px",
                            borderRadius: "50%",
                            border: user.isOnline ? "2px solid #10B981" : "2px solid transparent",
                            transition: "border-color 0.2s ease",
                        }}
                    >
                        <Avatar
                            src={user.avatar}
                            alt={user.name}
                            sx={{
                                width: 42,
                                height: 42,
                                fontSize: 15,
                                fontWeight: 700,
                                bgcolor: "#6366F1",
                            }}
                        >
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </Avatar>
                    </Box>
                </Badge>

                <Typography
                    sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#334155",
                        lineHeight: 1.2,
                        textAlign: "center",
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        letterSpacing: "-0.1px",
                        fontFamily: "'Outfit', 'Inter', sans-serif",
                    }}
                >
                    {user.name}
                </Typography>
            </Box>
        </Tooltip>
    );
}

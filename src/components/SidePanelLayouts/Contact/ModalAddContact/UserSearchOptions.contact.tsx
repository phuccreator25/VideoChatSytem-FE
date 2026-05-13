import { Avatar, Box, Stack, Typography } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import type { InvitationQuickAction, UserOption } from "../../../../types/Invitation";
import QuickActionButton from "./QuickActionButton.contact";
type UserSearchOptionProps = {
    option: UserOption;
    isActionLoading: boolean;
    handleQuickAction: (
        event: React.SyntheticEvent,
        option: UserOption,
        action: InvitationQuickAction
    ) => void;
};

const UserSearchOptions = ({
    option,
    isActionLoading,
    handleQuickAction,
}: UserSearchOptionProps) => {
    return (
        <>
            <Avatar
                src={option.avatar}
                alt={option.fullname}
                sx={{ width: 38, height: 38, flexShrink: 0 }}
            >
                {option.fullname?.charAt(0)?.toUpperCase()}
            </Avatar>

            <Box sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                <Typography
                    sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "#1f2430",
                    }}
                >
                    {option.fullname}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 13,
                        color: "#6b7280",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {option.email}
                </Typography>
            </Box>

            {isActionLoading ? (
                <CircularProgress size={18} />
            ) : option.statusInvitation === "pending_received" ? (
                <Stack direction="row" spacing={0.5}>
                    <QuickActionButton
                        title="Accept"
                        action="accept"
                        option={option}
                        color="#16a34a"
                        bgcolor="rgba(34, 197, 94, 0.12)"
                        hoverBgcolor="rgba(34, 197, 94, 0.18)"
                        icon={<CheckRoundedIcon sx={{ fontSize: 18 }} />}
                        onAction={handleQuickAction}
                    />

                    <QuickActionButton
                        title="Decline"
                        action="decline"
                        option={option}
                        color="#dc2626"
                        bgcolor="rgba(239, 68, 68, 0.10)"
                        hoverBgcolor="rgba(239, 68, 68, 0.16)"
                        icon={<CloseRoundedIcon sx={{ fontSize: 18 }} />}
                        onAction={handleQuickAction}
                    />

                </Stack>
            ) : option.statusInvitation === "pending_sent" ? (
                <QuickActionButton
                    title="Cancel"
                    action="cancel"
                    option={option}
                    color="#d97706"
                    bgcolor="rgba(245, 158, 11, 0.12)"
                    hoverBgcolor="rgba(245, 158, 11, 0.18)"
                    icon={<CloseRoundedIcon sx={{ fontSize: 18 }} />}
                    onAction={handleQuickAction}
                />

            ) : option.statusInvitation === "accepted" ? (
                <Tooltip title="Already friends">
                    <Box
                        sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(34, 197, 94, 0.10)",
                            color: "#16a34a",
                            flexShrink: 0,
                        }}
                    >
                        <GroupRoundedIcon sx={{ fontSize: 18 }} />
                    </Box>
                </Tooltip>


            ) : null}
        </>
    )
}

export default UserSearchOptions
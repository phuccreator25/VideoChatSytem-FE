import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import type { QuickUser } from "../../../../types/data.type";
import { StatusActive } from "../DotStatusActive/StatusActiveDot.conversaation";
import { COLORS } from "../../../../utils/Colors";

export function ActiveList({ user }: { user: QuickUser }) {
    return (
        <Paper
            elevation={0}
            sx={{
                minWidth: 78,
                px: 1.5,
                py: 1.4,
                borderRadius: 5,
                bgcolor: '#e9edf5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
            }}
        >
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={user.online ? <StatusActive status="online" /> : null}
            >
                <Avatar src={user.avatar} sx={{ width: 42, height: 42 }} />
            </Badge>

            <Typography
                sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: COLORS.text,
                    lineHeight: 1,
                }}
            >
                {user.name}
            </Typography>
        </Paper>
    );
}
import { Box } from "@mui/material";
import { COLORS } from "../../../../utils/Colors";

export function StatusActive({ status = 'none' }: { status?: 'online' | 'away' | 'none' }) {
    if (status === 'none') return null;

    const bg = status === 'online' ? COLORS.online : COLORS.away;

    return (
        <Box
            sx={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                bgcolor: bg,
                border: '2px solid #fff',
            }}
        />
    );
}
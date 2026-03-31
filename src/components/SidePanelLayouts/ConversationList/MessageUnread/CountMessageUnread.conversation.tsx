import { Box } from "@mui/material";

export function CountMessageUnread({ count }: { count: number }) {
    return (
        <Box
            sx={{
                minWidth: 24,
                height: 24,
                px: 0.8,
                borderRadius: 999,
                bgcolor: '#ffd7e5',
                color: '#e85d8d',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
            }}
        >
            {String(count).padStart(2, '0')}
        </Box>
    );
}
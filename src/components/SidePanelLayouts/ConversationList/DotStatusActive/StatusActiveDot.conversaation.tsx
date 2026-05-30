import { Box } from "@mui/material";
import { COLORS } from "../../../../utils/Colors";

export function StatusActive({status = 'offline'}) {
    if (status === 'offline') return null;

    return (
        <Box
            sx={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                bgcolor: COLORS.online,
                border: '2px solid #fff',
            }}
        />
    );
}